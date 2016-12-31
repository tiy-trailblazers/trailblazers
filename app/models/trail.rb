class Trail < ApplicationRecord
  has_and_belongs_to_many :trips
  has_and_belongs_to_many :intersections, class_name: "Trail", join_table: :intersections, foreign_key: :trail_id, association_foreign_key: :intersection_id
  belongs_to :park

  reverse_geocoded_by :latitude, :longitude

  def path_as_array
    path.points.map do |point|
      { lon: point.x,
        lat: point.y }
    end
  end

  def self.formatted_trails
    trails = []
    Trail.all.each do |trail|
      trails << trail.attributes.merge({
        line: trail.path_as_array
      })
    end
    trails
  end
end
