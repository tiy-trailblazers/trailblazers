require 'overpass_api_ruby'

class OverpassParks

  attr_reader :name

  def initialize(name)
    @name = name
  end

  def query_string
    "relation[boundary=national_park][name=#{name}];(._;>;);out;"
  end

  def options
    {
      timeout: 900,
      element_limit: 1073741824,
      dont_use_cache: true
    }
  end

  def data
    overpass = ::OverpassAPI.new(options)
    @data ||= overpass.raw_query(query_string)
  end

  def all_nodes
    @all_nodes ||= data.select { |obj| obj[:type] == "node" }
  end

  def all_ways
    @all_ways ||= data.select { |obj| obj[:type] == "way" }
  end

  def relation
    data.select { |obj| obj[:type] == "relation" }
  end

  def get_nodes_for_way(way)
    way_nodes = []

    way[:members].each do |nd|
      node_obj = all_nodes.select { |node| node[:id] == nd[:ref] }.first
      node_obj.delete(:type)
      way_nodes << node_obj
    end
    way_nodes
  end

  def line_string_for(way)
    array_of_coords = []
    way.each do |node|
      point =  RGeo::Geographic.spherical_factory(srid: 4326).point(node[:lon].to_f, node[:lat].to_f)
      array_of_coords << point
    end
    RGeo::Geographic.spherical_factory(srid: 4326).line_string(array_of_coords)
  end

  def get_way_for_rel_member(member)
    matched = {}
    all_ways.each do |way|
      matched = way if way[:id] == member[:ref]
    end
    matched
  end

  def multi_line_string_boundary(relation)
    ways_array = []
    relation[:members].each do |way|
      next if get_way_for_rel_member(way) == {}
      ways_array << line_string_for(get_nodes_for_way(get_way_for_rel_member(way)))
    end
    RGeo::Geographic.spherical_factory(srid: 4326).multi_line_string(ways_array)
  end

end
