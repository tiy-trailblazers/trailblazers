require 'overpass_api_ruby'
class OverpassArea
  attr_reader :north, :east, :south, :west

  def initialize(south, west, north, east)
    @north = north
    @east = east
    @south = south
    @west = west
  end

  def query_string
    "(way[highway=footway](#{south}, #{west}, #{north}, #{east}); way[highway=path](#{south}, #{west}, #{north}, #{east}); way[name~'trail', i](#{south}, #{west}, #{north}, #{east}););(._;>;);out;"
  end

  def options
    {
      timeout: 900,
      element_limit: 1073741824,
      cache_expiration_time: 10
    }
  end

  def list_of_trails
    overpass = ::OverpassAPI.new(options)
    overpass.raw_query(query_string)
  end
end
