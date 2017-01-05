class NpsLoad

  BASE_URI = "http://developer.nps.gov/api/v0/parks"
  ALERT_URI = "http://developer.nps.gov/api/v0/alerts"

  def get_all_parks
    headers = {
      "authorization" => ENV["NPS_KEY"],
      "cache-control" => "no-cache",
      "user-agent" => "Trailblazers",
      "accept" => "*/*"
    }
    query = {
      "limit" => 600
    }
    @data ||= HTTParty.get(BASE_URI, headers: headers, query: query)
  end

  def get_one_park_alerts(park_code)
    headers = {
      "authorization" => ENV["NPS_KEY"],
      "cache-control" => "no-cache",
      "user-agent" => "Trailblazers",
      "accept" => "*/*"
    }
    query = {
      "limit" => 600,
      "parkCode" => park_code
    }
    HTTParty.get(ALERT_URI, headers: headers, query: query)
  end

  def lat_long_formatted(latLong)
    if latLong && latLong.length > 0
      array = latLong.split(", ")
      latitude = array[0][4..-1]
      longitude = array[1][5..-1]
      {
        latitude: latitude,
        longitude: longitude
      }
    else
      {
        latitude: nil,
        longitude: nil
      }
    end
  end

  def format_data
    data_array = get_all_parks["data"].map do |park|
      {
        name: park["fullName"],
        description: park["description"],
        latitude: lat_long_formatted(park["latLong"])[:latitude],
        longitude: lat_long_formatted(park["latLong"])[:longitude],
        park_code: park["parkCode"],
        weather_info: park["weatherInfo"],
        url: park["url"],
        directions: park["directionsInfo"],
        nps_id: park["id"],
        states: park["states"]
      }
    end
    data_array
  end

end
