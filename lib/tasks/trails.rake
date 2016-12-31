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

    (1..10).to_a.each do |x|
      (0..10).to_a.each do |y|
        p "(#{x}, #{y})"
        area = OverpassArea.new(usa[:south] + y * box_height, usa[:west] + x * box_width, usa[:south] + (y + 1) * box_height, usa[:west] + (x + 1) * box_width)

        p area.query_string

        trails_list = area.all_trails.select do |trail|
          area.length_of_trail(trail) > 0.2
        end

        p trails_list.size

        trails_list.each do |trail|
          my_trail = Trail.create!({
            osm_id: trail[:id],
            startlonlat: area.start_lonlat(trail),
            length: area.length_of_trail(trail),
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
  task destroy: :environment do
    p Trail.all.size
    Trail.delete_all
    p " trails deleted"
  end

end
