require './lib/nps_load'
require './lib/overpass_parks'
require 'activerecord-postgis-adapter'

namespace :parks do
  desc "TODO"
  task create: :environment do
    data = NpsLoad.new()
    data.format_data.each do |park|
      Park.create!(park)
    end
  end

  desc "TODO"
  task add_boundaries: :environment do
    Park.where("multi_line_boundary is null").each do |park|
      data = OverpassParks.new("\'#{park.clean_name}\'")
      p data.query_string
      matched_park = data.relation[0]
      if matched_park
        p park.name + " FOUND A MATCH"
        park.update(multi_line_boundary: data.multi_line_string_boundary(matched_park))
      else
        p park.clean_name + " had no match from overpass"
      end

    end
  end

  desc "TODO"
  task add_boundaries_with_multiple: :environment do
    Park.where(name: ['Appalachian National Scenic Trail', 'Glacier National Park', 'Great Smoky Mountains National Park', 'Kings Canyon National Park', 'Olympic National Park']).each do |park|
      data = OverpassParks.new("\'#{park.clean_name}\'")
      p data.query_string
      matched_park = data.relation[1]
      if matched_park
        p park.name + " FOUND A MATCH"
        park.update(multi_line_boundary: park.multi_line_boundary + data.multi_line_string_boundary(matched_park))
      else
        p park.clean_name + " had no match from overpass"
      end

    end
  end

  desc "TODO"
  task add_multipoly: :environment do
    Park.where("multi_line_boundary is not null").each do |park|
      park.update!(boundary: park.poly_boundary)
    end
  end

  desc "TODO"
  task add_lonlat: :environment do
    Park.all.each do |park|
      park.lonlat = RGeo::Geographic.spherical_factory(srid: 4326).point(park.longitude, park.latitude)
      park.save
    end
  end

  desc "TODO"
  task delete: :environment do
    Park.delete_all
  end

end
