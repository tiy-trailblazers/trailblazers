class Trail < ApplicationRecord
  has_and_belongs_to_many :trips
  has_and_belongs_to_many :intersections, class_name: "Trail", join_table: :intersections, foreign_key: :trail_id, association_foreign_key: :intersection_id
  belongs_to :park

  reverse_geocoded_by :latitude, :longitude

  def path_as_array
    path.points.map do |point|
      [point.x, point.y]
    end
  end
end
