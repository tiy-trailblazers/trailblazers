class LoadOsmXml
  def initialize()
  end

  def data
    @data ||= Nokogiri::XML(open("./rhode_island.osm"))
  end

  def ways
    @ways ||= data.search("tag[k=highway][v=footway]").map {|t| t.parent}
  end

  def nodes
    @nodes ||= data.search("node")
  end

  def nodes_for_way(way)
    way_nodes = way.search("nd").map do |nd|
      id = nd["ref"].to_i
      nodes.search("##{id}")
    end
    way_nodes
  end

  def path_for_way(way)
    lon_lats = nodes_for_way(way).map do |node|
      RGeo::Geographic.spherical_factory(srid: 4326).point(node["lon"].to_f, node["lat"].to_f)
    end
    RGeo::Geographic.spherical_factory(srid: 3785).line_string(lon_lats)
  end

  def trails
    trails = []
    ways.each do |way|
      path = path_for_way(way)
      binding.pry
      trails << {
        length: path.length,
        name: way["name"],
        path: path,
        bicycle: way["bicycle"]=="yes",
        foot: way["foot"]=="yes",
        startlonlat: path.first,
        latitude: nodes_for_way(way).first["lat"].to_f,
        longitude: nodes_for_way(way).first["lon"].to_f
      }
    end
  end

end
