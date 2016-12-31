namespace :osm_files do
  desc "TODO"
  task load_trails: :environment do
    xml = LoadOsmXml.new()
    xml.trails
  end

end
