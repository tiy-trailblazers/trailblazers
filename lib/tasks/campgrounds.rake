require './lib/load_campground_data'

namespace :campgrounds do
  desc "Create all campgrounds and load them into the db"
  task create: :environment do
    cg_data = ::LoadCampgroundData.new()
    cg_data.campgrounds.each do |campground|
      Campground.create!(campground)
    end
  end

  desc "Add lat/lon to the campgrounds"
  task add_lonlat: :environment do
    Campground.all.each do |campground|
      campground.lonlat = RGeo::Geographic.spherical_factory(srid: 4326).point(campground.longitude, campground.latitude)
      campground.save!
    end
  end

  desc "Delete all campgrounds"
  task delete: :environment do
    Campground.delete_all
  end

  desc "Add parks to the campgrounds"
  task add_parks: :environment do
    Campground.where("park_id is null").each do |cg|
      cg.park_id = 0 unless cg.set_park
      cg.save
      print "."
    end
  end

  desc "Add hookup info to the campgrounds"
  task add_hookup: :environment do
    Campground.all.each do |campground|
      source_string = campground.source
      amen_string = source_string.match(/(AMEN:)\S{1,3}/)[0]
      hookup_codes = amen_string.split(":")[1]
      campground.water_hookup = true if hookup_codes.chars.include?("W")
      campground.sewer_hookup = true if hookup_codes.chars.include?("S")
      campground.electric_hookup = true if hookup_codes.chars.include?("E")
      campground.save!
    end
  end

  desc "Add shower info to campgrounds"
  task add_shower: :environment do
    Campground.all.each do |campground|
      source_string = campground.source
      codes = source_string.split(" ")
      campground.showers = true if codes.include?("SH") || codes.include?("AMEN:SH")
      campground.save!
    end
  end

end
