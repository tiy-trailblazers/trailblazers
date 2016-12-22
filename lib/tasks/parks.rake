require './lib/nps_load'

namespace :parks do
  desc "TODO"
  task create: :environment do
    data = NpsLoad.new()
    data.format_data.each do |park|
      Park.create!(park)
    end
  end

  desc "TODO"
  task delete: :environment do
    Park.delete_all
  end

end
