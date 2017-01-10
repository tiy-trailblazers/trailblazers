require './lib/load_campground_data'

namespace :campgrounds do
  desc "TODO"
  task create: :environment do
    cg_data = ::LoadCampgroundData.new()
    cg_data.campgrounds.each do |campground|
      Campground.create!(campground)
    end
  end

  desc "TODO"
  task add_lonlat: :environment do
    Campground.all.each do |campground|
      campground.lonlat = RGeo::Geographic.spherical_factory(srid: 4326).point(campground.longitude, campground.latitude)
      campground.save!
    end
  end

  desc "TODO"
  task delete: :environment do
    Campground.delete_all
  end

  desc "TODO"
  task add_parks: :environment do
    Campground.where("park_id is null").each do |cg|
      cg.park_id = 0 unless cg.set_park
      cg.save
      print "."
    end
  end

end
