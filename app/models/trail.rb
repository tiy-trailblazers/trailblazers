class Trail < ApplicationRecord
  has_and_belongs_to_many :trips
  has_and_belongs_to_many :intersections, class_name: "Trail", join_table: :intersections, foreign_key: :trail_id, association_foreign_key: :intersection_id
  belongs_to :park

  reverse_geocoded_by :latitude, :longitude

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
      trail.path.intersects?(self.path)
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

  def self.formatted_trails(trails_array)
    trails = []
    if trails_array.size > 0
      trails_array.each do |trail|
        trail.description = trail.park.description if trail.park
        trails << trail.attributes.merge({
          line: trail.path_as_array,
          head_lat: (trail.startlonlat.y if trail.startlonlat),
          head_lon: (trail.startlonlat.x if trail.startlonlat),
          park: (trail.park.attributes if trail.park)
        })
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
      line = RGeo::Geographic.spherical_factory(srid: 3785).line_string(line_points_to_be_made)
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
    RGeo::Geographic.spherical_factory(srid: 3785).multi_line_string(new_line_array)
  end

  def self.replace_first_two_els(mls, new_line)
    array_of_lines = mls.map { |line| line }
    lines_without_first_two = array_of_lines[2..-1]
    line_array_with_new = lines_without_first_two.insert(0, new_line)
    if line_array_with_new.size == 1
      line_array_with_new[0]
    else
      RGeo::Geographic.spherical_factory(srid: 3785).multi_line_string(line_array_with_new)
    end
  end

  def self.combine_two_lines(first_line, second_line)
    if equal_points(first_line.start_point, second_line.start_point)
      RGeo::Geographic.spherical_factory(srid: 3785).line_string(second_line.points.reverse + first_line.points)
    elsif equal_points(first_line.end_point, second_line.end_point)
      RGeo::Geographic.spherical_factory(srid: 3785).line_string(first_line.points.reverse + second_line.points)
    elsif equal_points(first_line.start_point, second_line.end_point)
      RGeo::Geographic.spherical_factory(srid: 3785).line_string(second_line.points + first_line.points)
    elsif equal_points(first_line.end_point, second_line.start_point)
      RGeo::Geographic.spherical_factory(srid: 3785).line_string(first_line.points + second_line.points)
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
    pt1 = RGeo::Geographic.spherical_factory(srid: 4326).point(tuple.first.x, tuple.first.y)
    pt2 = RGeo::Geographic.spherical_factory(srid: 4326).point(tuple.last.x, tuple.last.y)
    pt1.distance(pt2)
  end

  def self.distance_between_two_paths(path1, path2)
    path1_pts = [RGeo::Geographic.spherical_factory(srid: 4326).point(path1.start_point.x, path1.start_point.y), RGeo::Geographic.spherical_factory(srid: 4326).point(path1.end_point.x, path1.end_point.y)]
    path2_pts = [RGeo::Geographic.spherical_factory(srid: 4326).point(path2.start_point.x, path2.start_point.y), RGeo::Geographic.spherical_factory(srid: 4326).point(path2.end_point.x, path2.end_point.y)]

    path1_pts.map do |p1point|
      p1point.distance(
      path2_pts.min_by do |p2point|
        p1point.distance(p2point)
      end)
    end.min

  end
end
