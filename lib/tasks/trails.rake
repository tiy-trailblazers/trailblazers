namespace :trails do

  desc "TODO"
  task create: :environment do
    bounding_box = { south: 47.183150925877044, west: -124.80914762375481, north: 48.3301196276428, east: -122.55153714060215 }

    height = bounding_box[:north] - bounding_box[:south]

    width = bounding_box[:east] - bounding_box[:west]

    box_height = height / 5
    box_width = width / 5

    [5].each do |x|
      (0..5).to_a.each do |y|
        p "(#{x}, #{y})"
        OverpassArea.new(bounding_box[:south] + y * box_height, bounding_box[:west] + x * box_width, bounding_box[:south] + (y + 1) * box_height, bounding_box[:west] + (x + 1) * box_width).create_trails
      end
    end
  end

  desc "TODO"
  task add_parks: :environment do
    Trail.where("park_id is null and state = 'VA'").each do |trail|
      park = trail.find_park
      if park
        trail.update!(park: trail.find_park)
      else
        trail.update!(park_id: 0)
      end
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
    Trail.duplicate_trail_names.each do |name|
      clean_name = name.gsub("'", "''")
      trails = Trail.where("name = '#{clean_name}'").to_a
      Trail.cluster_trails(trails).each do |trail_cluster|
        Trail.merge_connected_trails!(trail_cluster)
      end
    end
  end
end
