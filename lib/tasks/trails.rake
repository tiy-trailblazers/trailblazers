namespace :trails do
  desc "TODO"
  task create: :environment do
    usa = {south: 36.56845660148896, west:
-81.52469239955084, north:
37.772723556626474, east: -78.03284022920927}

    height = usa[:north] - usa[:south]

    width = usa[:east] - usa[:west]

    box_height = height / 5
    box_width = width / 5

    (0..5).to_a.each do |x|
      (0..5).to_a.each do |y|
        p "(#{x}, #{y})"
        area = OverpassArea.new(usa[:south] + y * box_height, usa[:west] + x * box_width, usa[:south] + (y + 1) * box_height, usa[:west] + (x + 1) * box_width)

        p area.query_string
        p area.all_trails.size

        area.all_trails.each do |trail|
          next if Trail.find_by(osm_id: trail[:id])
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
  task add_parks: :environment do
    Trail.where("park_id is null").each do |trail|
      trail.update(park: trail.find_park)
      print "."
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
    sql = "select osm_id, count(*) from trails group by osm_id having count(*) > 1"
    dupes = ActiveRecord::Base.connection.execute(sql).to_a
    dupes.each do |dupe|
      Trail.find_by(osm_id: dupe["osm_id"]).destroy
    end
  end

  desc "TODO"
  task merge_trails: :environment do
    Trail.select("name, count(*)").where("state = 'VA' and name is not null").group("name").having("count(*)>1").each do |group|

      clean_name = group.name.gsub("'", "''")

      line_merge_array = Trail.select("name, ST_Linemerge(ST_Union(path)) as path, count(*)").where("name = '#{clean_name}' and state = 'VA'").group("name").to_a

      line_merge = line_merge_array.first

      begin
        trail_path = Trail.join_multi_line_string(line_merge.path)
      rescue
        next
      end

      trail_head = trail_path.start_point
      clean_name = line_merge.name.gsub("'", "''")
      same_name_trails = Trail.where("name = '#{clean_name}'")

      first_trail = same_name_trails.to_a.shift
      first_trail.update!(
        {
          length: trail_path.length,
          path: trail_path,
          startlonlat: RGeo::Geographic.spherical_factory(srid: 4326).point(trail_head.y, trail_head.x),
          latitude: trail_head.x,
          longitude: trail_head.y
        }
      )
      same_name_trails.delete_all

    end
  end

end
