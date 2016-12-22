require './lib/nps_load'
require './lib/overpass_parks'

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
    acadia = OverpassParks.new("'Acadia National Park'")
    p acadia.get_nodes_for_relation(acadia.relation)
  end

  desc "TODO"
  task delete: :environment do
    Park.delete_all
  end

end
