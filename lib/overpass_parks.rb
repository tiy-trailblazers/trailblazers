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
    data.select { |obj| obj[:type] == "relation" }.first
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

  def get_way_for_rel_member(member)
    all_ways.each do |way|
      return way if way[:id] == member[:ref]
    end
  end

  def get_nodes_for_relation(relation)
    nodes_array = []
    relation[:members].each do |way|
      nodes_array << get_nodes_for_way(get_way_for_rel_member(way))
    end
    nodes_array
  end

end
