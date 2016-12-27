class Trail < ApplicationRecord
  has_and_belongs_to_many :trips
  has_and_belongs_to_many :intersections, class_name: "Trail", join_table: :intersections, foreign_key: :trail_id, association_foreign_key: :intersection_id
  belongs_to :park
end
