MASHAPE_KEY = "uHQav6y9lUmshb1Sz5WPD7WDvYvUp1FTYlbjsnpuNK7ygOdrNo"
BASE_URL = "https://trailapi-trailapi.p.mashape.com/"

class TrailAPI

  def initialize()
  end

  def get_by_lat_lon(lat, lon, radius)
    query = {
      "lat" => lat,
      "lon" => lon,
      "q[activities_activity_type_name_eq]" => "hiking",
      "radius" => radius
    }
    headers = {
      "X-Mashape-Key" => MASHAPE_KEY,
      "Accept" => "text/plain"
    }
    HTTParty.get(BASE_URL, query: query, headers: headers).parsed_response
  end

  def get_by_name(name)
    query = {
      "q[activities_activity_name_cont]" => name
    }
    headers = {
      "X-Mashape-Key" => MASHAPE_KEY,
      "Accept" => "text/plain"
    }
    HTTParty.get(BASE_URL, query: query, headers: headers).parsed_response
  end

end
