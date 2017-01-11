class Trail < ApplicationRecord
  has_and_belongs_to_many :trips
  has_and_belongs_to_many :intersections, class_name: "Trail", join_table: :intersections, foreign_key: :trail_id, association_foreign_key: :intersection_id
  belongs_to :park

  reverse_geocoded_by :latitude, :longitude

  FACTORY = RGeo::Geographic.spherical_factory(srid: 4326)
  LINE_FACTORY = RGeo::Geographic.spherical_factory(srid: 3785)

  def path_as_array
    if path
      path.points.map do |point|
        {
          lon: point.x,
          lat: point.y
        }
      end
    end
  end

  def southmost
    path.points.min_by { |point| point.y }
  end

  def westmost
    path.points.min_by { |point| point.x }
  end

  def northmost
    path.points.max_by { |point| point.y }
  end

  def eastmost
    path.points.max_by { |point| point.x }
  end

  def intersections
    Trail.within_bounding_box([southmost.y, westmost.x, northmost.y, eastmost.x]).select do |trail|
      trail.path.intersects?(self.path) && trail.id != self.id
    end
  end

  def endlonlat
    path.points.last
  end

  def find_park
    trail_park = nil
    Park.all.each do |park|
      if park.boundary
        trail_park = park if (park.boundary.contains?(startlonlat) || park.boundary.contains?(endlonlat))
      end
    end
    trail_park
  end

  def update_trail_head!
    trail_head = path.start_point
    self.update(
      startlonlat: FACTORY.point(trail_head.x, trail_head.y),
      latitude: trail_head.y,
      longitude: trail_head.x
    )
    self.save
  end

  def update_length!
    self.update(length: trail_length)
  end

  def trail_length
    trail_nodes = path.coordinates
    polyline = trail_nodes.map do |node|
      [node[1], node[0]]
    end
    geo_calc = GeoCalculation.new()
    geo_calc.length_of_polyline(polyline)
  end

  def connects_to?(other)
    Trail.combine_two_lines(self.path, other.path).class != Array
  end

  def start_end_points
    if path
      [path.start_point, path.end_point]
    else
      []
    end
  end

  def within_box?(nsew_box_array)
    start_end_points.select { |point| Trail.point_within_box(point, nsew_box_array) }.size > 0
  end

  def self.formatted_trails(trails_array)
    trails = []
    if trails_array.size > 0
      trails_array.each do |trail|
        trail.description = trail.park.description if trail.park
        trails << trail.attributes.merge(
          {
            line: trail.path_as_array,
            head_lat: (trail.startlonlat.y if trail.startlonlat),
            head_lon: (trail.startlonlat.x if trail.startlonlat),
            park: (trail.park.attributes if trail.park)
          }
        )
      end
    end
    trails
  end


  def self.join_multi_line_string(mls)
    until mls.class == RGeo::Geographic::SphericalLineStringImpl
      all_points = mls.map { |ls| [ls.start_point, ls.end_point ]}
      line_points_to_be_made = closest_two_points(all_points.first, all_points)
      if distance_of_point_tuple(line_points_to_be_made) > 400
        raise DistanceTooGreat.new()
      end
      line = LINE_FACTORY.line_string(line_points_to_be_made)
      first_line = mls.first
      new_line = combine_two_lines(first_line, line)
      mls = replace_first_el(mls, new_line)
      new_first_line = combine_two_lines(mls[0], mls[1])
      mls = replace_first_two_els(mls, new_first_line)
    end
    mls
  end

  def self.replace_first_el(mls, new_line)
    array_of_lines = mls.map { |line| line }
    array_of_lines.shift
    new_line_array = array_of_lines.insert(0, new_line)
    LINE_FACTORY.multi_line_string(new_line_array)
  end

  def self.replace_first_two_els(mls, new_line)
    array_of_lines = mls.map { |line| line }
    lines_without_first_two = array_of_lines[2..-1]
    line_array_with_new = lines_without_first_two.insert(0, new_line)
    if line_array_with_new.size == 1
      line_array_with_new[0]
    else
      LINE_FACTORY.multi_line_string(line_array_with_new)
    end
  end

  def self.combine_two_lines(first_line, second_line)
    if equal_points(first_line.start_point, second_line.start_point)
      LINE_FACTORY.line_string(second_line.points.reverse + first_line.points)
    elsif equal_points(first_line.end_point, second_line.end_point)
      LINE_FACTORY.line_string(first_line.points.reverse + second_line.points)
    elsif equal_points(first_line.start_point, second_line.end_point)
      LINE_FACTORY.line_string(second_line.points + first_line.points)
    elsif equal_points(first_line.end_point, second_line.start_point)
      LINE_FACTORY.line_string(first_line.points + second_line.points)
    else
      [first_line, second_line]
    end
  end

  def self.equal_points(point1, point2)
    point1.x == point2.x && point1.y == point2.y
  end

  def self.closest_two_points(points, all_points)
    all_other_points = all_points.dup
    all_other_points.delete(points)

    candidate_points = all_other_points.map do |tuple|
      points.map do |point|
        [point, tuple.min_by {|other_point| point.distance(other_point)}]
      end
    end

    candidate_points\
      .map { |line_points| line_points.min_by {|tuple| distance_of_point_tuple(tuple)  }}
      .min_by {|tuple| distance_of_point_tuple(tuple)  }
  end

  def self.distance_of_point_tuple(tuple)
    pt1 = FACTORY.point(tuple.first.x, tuple.first.y)
    pt2 = FACTORY.point(tuple.last.x, tuple.last.y)
    pt1.distance(pt2)
  end

  def self.distance_between_two_paths(path1, path2)
    path1_pts = [FACTORY.point(path1.start_point.x, path1.start_point.y), FACTORY.point(path1.end_point.x, path1.end_point.y)]
    path2_pts = [FACTORY.point(path2.start_point.x, path2.start_point.y), FACTORY.point(path2.end_point.x, path2.end_point.y)]

    path1_pts.map do |p1point|
      p1point.distance(
      path2_pts.min_by do |p2point|
        p1point.distance(p2point)
      end)
    end.min
  end

  # filters an array of trails and returns array of groups of connected trails
  def self.cluster_trails(trail_array)
    cluster_array = []
    trail_array.each do |trail|
      next if cluster_array.flatten.include?(trail)
      cluster = [trail]
      other_trails = trail_array - cluster
      cluster << other_trails.select do |other_trail|
        trail.connects_to?(other_trail)
      end
      cluster_array << cluster.flatten
    end
    cluster_array.select { |array| array.size > 1 }
  end

  # returns the first trail object of the array with its path updated to the combined path of all trails in the original array. Other trails get deleted
  def self.merge_connected_trails!(trail_array, trails_to_delete = [])
    if trail_array.size > 1
      trail_to_merge = trail_array.first
      other_trails = trail_array - [trail_to_merge]
      other_trails.each_with_index do |trail, i|
        if trail_to_merge.connects_to?(trail)
          new_path = Trail.combine_two_lines(trail_to_merge.path, trail.path)
          trail_to_merge.name = trail.name if trail_to_merge.name == nil
          trail_to_merge.path = new_path
          trails_to_delete << trail_array[i + 1]
          trail_array.delete_at(i + 1)
          trail_array.shift
          trail_array.insert(0, trail_to_merge)
          Trail.merge_connected_trails!(trail_array, trails_to_delete)
        end
      end
    else
      trail_array.first.save!
      trail_array.first.update_trail_head!
      trail_array.first.update_length!
      trails_to_delete.each { |trail| trail.delete if trail }
      trail_array.first
    end
  end

  def self.combined_path(trail_name, state)
    clean_name = trail_name.gsub("'", "''")
    Trail.select("name, ST_Linemerge(ST_Union(path)) as path, count(*)").where("name = '#{clean_name}' and state = '#{state}'").group("name").to_a.first.path
  end

  def self.combined_path_with_env(trail_name, state, envelope)
    clean_name = clean_name = trail_name.gsub("'", "''")
    Trail.select("name, ST_Linemerge(ST_Union(path)) as path, count(*)").where("name = '#{clean_name}' and state = '#{state}' and path && ST_MakeEnvelope(#{envelope[0]}, #{envelope[1]}, #{envelope[2]}, #{envelope[3]}, 3785)").group("name").to_a.first.path
  end

  def self.duplicate_trail_names
    Trail.select("name, count(*)").where("name is not null").group("name").having("count(*) > 1").to_a.map {|el| el.name}
  end
end
