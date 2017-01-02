require 'overpass_api_ruby'

class OverpassArea
  attr_reader :north, :east, :south, :west

  def initialize(south, west, north, east)
    @north = north
    @east = east
    @south = south
    @west = west
    @all_trails = nil
    @all_nodes = nil
  end

  def query_string
    "(way[highway=footway](#{south}, #{west}, #{north}, #{east}); way[highway=path](#{south}, #{west}, #{north}, #{east}); way[name~'trail', i][highway!=residential](#{south}, #{west}, #{north}, #{east}););(._;>;);out;"
  end

  def options
    {
      timeout: 9000,
      element_limit: 1073741824,
      dont_use_cache: true
    }
  end

  def list_of_trails
    overpass = ::OverpassAPI.new(options)
    @list_of_trails ||= overpass.raw_query(query_string)
  end

  def all_nodes
    @all_nodes ||= list_of_trails.select {|object| object[:type] == "node"}
  end

  def all_trails
    @all_trails ||= list_of_trails.select {|object| object[:type] == "way"}
  end

  def members_as_nodes(trail)
    line = []
    nodes = all_nodes
    trail[:members].each do |nd|
      nodes.each do |node|
        line << { lat: node[:lat], lon: node[:lon] } if node[:id] == nd[:ref]
      end
    end
    return line
  end

  def start_lonlat(trail)
    if trail[:members]
      RGeo::Geographic.spherical_factory(srid: 4326).point(members_as_nodes(trail).first[:lon].to_f, members_as_nodes(trail).first[:lat].to_f)
    end
  end

  def linestring(trail)
    array_of_points = []
    members_as_nodes(trail).each do |node|
      array_of_points << RGeo::Geographic.spherical_factory(srid: 4326).point(node[:lon].to_f, node[:lat].to_f)
    end
    RGeo::Geographic.spherical_factory(srid: 3785).line_string(array_of_points)
  end

  def length_of_trail(trail)
    trail_nodes = members_as_nodes(trail)
    polyline = trail_nodes.map do |node|
      [node[:lat], node[:lon]]
    end
    geo_calc = GeoCalculation.new()
    geo_calc.length_of_polyline(polyline)
  end

  def trails_nested
    all_trails.each do |trail|
      trail[:length] = length_of_trail(trail)
      line = members_as_nodes(trail)
      trail[:head_lat] = line.first[:lat]
      trail[:head_lon] = line.first[:lon]
      trail[:name] = trail[:tags]["name"]
      trail[:line] = line
      trail.delete(:members)
    end
  end

  def filtered_trails
    trails_nested.select do |trail|
      length_of_trail(trail) > 0.1
    end
  end
end
