namespace :trails do
  desc "TODO"
  task create: :environment do
    usa = {south: 24.763833517291758, west: -125.538477, north: 49.416259497340604, east: -66.41909480287364}

    height = usa[:north] - usa[:south]

    width = usa[:east] - usa[:west]

    box_height = height / 30
    box_width = width / 30

    (0..10).to_a.each do |x|
      (6..30).to_a.each do |y|
        p "(#{x}, #{y})"
        area = OverpassArea.new(usa[:south] + y * box_height, usa[:west] + x * box_width, usa[:south] + (y + 1) * box_height, usa[:west] + (x + 1) * box_width)

        p area.query_string

        trails_list = area.all_trails

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
