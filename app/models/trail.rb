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
    Park.all.each do |park|
      if park.boundary
        return park if (park.boundary.contains?(startlonlat) || park.boundary.contains?(endlonlat))
      end
    end
  end

  def formatted_trails(trails_array)
    trails = []
    if trails_array.size > 0
      trails_array.each do |trail|
        trails << trail.attributes.merge({
          line: trail.path_as_array,
          head_lat: (trail.startlonlat.y if trail.startlonlat),
          head_lon: (trail.startlonlat.x if trail.startlonlat)
        })
      end
    end
    trails
  end


  def self.join_multi_line_string(mls)
     all_points = mls \
      .map { |ls| [ls.start_point, ls.end_point ]}

      line_points_to_be_made = closest_two_points all_points.first, all_points
      line = RGeo::Geographic.spherical_factory(srid: 4326).line_string(line_points_to_be_made)

      binding.pry
      # .map { |e| RGeo::Geographic.spherical_factory(srid: 4326).line_string(e)}

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
    tuple.first.distance(tuple.last)
  end
end
