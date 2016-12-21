class Campground < ApplicationRecord
  reverse_geocoded_by :latitude, :longitude
end
