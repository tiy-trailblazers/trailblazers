class Campground < ApplicationRecord
  reverse_geocoded_by :latitude, :longitude
  has_and_belongs_to_many :trips
end
