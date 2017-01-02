namespace :trails do
  desc "TODO"
  task create: :environment do
    usa = {south: 39.65595370968461, west:
-80.92333972682997, north:
45.24056948593636, east: -69.83544072361961}

    height = usa[:north] - usa[:south]

    width = usa[:east] - usa[:west]

    box_height = height / 10
    box_width = width / 10

    (8..10).to_a.each do |x|
      (4..10).to_a.each do |y|
        p "(#{x}, #{y})"
        area = OverpassArea.new(usa[:south] + y * box_height, usa[:west] + x * box_width, usa[:south] + (y + 1) * box_height, usa[:west] + (x + 1) * box_width)

        p area.query_string

        p area.all_trails.size

        area.all_trails[13000,16000].each do |trail|
          length = area.length_of_trail(trail)
          next if length > 0.2
          my_trail = Trail.create!({
            osm_id: trail[:id],
            startlonlat: area.start_lonlat(trail),
            length: length,
            name: trail[:tags]["name"],
            bicycle: trail[:tags]["bicyle"]=="yes",
            foot: trail[:tags]["foot"]=="yes",
            path: area.linestring(trail),
            latitude: area.members_as_nodes(trail).first[:lat],
            longitude: area.members_as_nodes(trail).first[:lon]
          })
          trail.delete(:members)
          my_trail.update!(source: trail)
          print "."
        end
      end
    end

  end

  desc "TODO"
  task add_parks: :environment do
    Trail.where("park_id is null").each do |trail|
      trail.update(park: trail.find_park)
    end
  end

  desc "TODO"
  task destroy: :environment do
    p Trail.all.size
    Trail.delete_all
    p " trails deleted"
  end

  desc "TODO"
  task dedupe: :environment do
    sql = "select id, osm_id, count(*) from trails group by osm_id having count(*) > 1"
    dupes = ActiveRecord::Base.connection.execute(sql).to_a
    dupes.each do |dupe|
      dupe.find_by(osm_id: dupe["osm_id"]).destroy
    end
  end

end
