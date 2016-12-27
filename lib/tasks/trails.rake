namespace :trails do
  desc "TODO"
  task create: :environment do
    area = OverpassArea.new(39.51171626483699, -80.94757256017974, 47.77930077991624, -66.64785461472162)
    trails_list = area.all_trails
    p area.query_string
    p trails_list.size

    trails_list.each do |trail|
      my_trail = Trail.create!({
        osm_id: trail[:id],
        startlonlat: area.start_lonlat(trail),
        length: area.length_of_trail(trail),
        name: trail[:tags]["name"],
        bicycle: trail[:tags]["bicyle"]=="yes",
        foot: trail[:tags]["foot"]=="yes",
        path: area.linestring(trail)
      })
      trail.delete(:members)
      my_trail.update!(source: trail)
    end

  end

  desc "TODO"
  task destroy: :environment do
    Trail.delete_all
  end

end
