require './lib/load_campground_data'

namespace :campgrounds do
  desc "TODO"
  task create: :environment do
    cg_data = ::LoadCampgroundData.new()
    p cg_data.campgrounds
  end

  desc "TODO"
  task delete: :environment do
  end

end
