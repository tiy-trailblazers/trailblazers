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
  task delete: :environment do
    Campground.delete_all
  end

end
