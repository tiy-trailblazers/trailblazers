class Campground < ApplicationRecord
  reverse_geocoded_by :latitude, :longitude
  has_and_belongs_to_many :trips
  belongs_to :park

  def set_park
    cg_point = RGeo::Geographic.spherical_factory(srid: 4326).point(longitude, latitude)
    Park.all.each do |park|
      if park.boundary
        self.update(park: park) if (park.boundary.contains?(cg_point))
      end
    end
    self.park
  end

end
