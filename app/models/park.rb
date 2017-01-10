require './lib/nps_load'

class Park < ApplicationRecord
  has_many :trails
  has_many :campgrounds
  has_and_belongs_to_many :trips

  def clean_name
    name.gsub("'", "")
  end


  def union_boundary
    self \
      .class
      .where(id: id)
      .group(:id)
      .select("ST_Union((multi_line_boundary::geometry)) as calc_boundary")
  end

  def poly_boundary
    self.class.select("ST_Polygonize(calc_boundary)::geography as boundary").from(union_boundary)[0].boundary
  end

  def alerts
    data = NpsLoad.new().get_one_park_alerts(park_code)
    data["data"].first["title"] + ". " + data["data"].first["description"] + ". To learn more please visit: " + data["data"].first["url"]
  end

  def self.jsonify(parks_array)
    parks_array.map do |park|
      park.attributes.merge({
        trails: Trail.formatted_trails(park.trails),
        campgrounds: park.campgrounds.attributes
      })
    end
  end
end
