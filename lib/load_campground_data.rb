require 'nokogiri'

class LoadCampgroundData

  TYPES = {
    "NF" => "National Forest",
    "CP" => "City/County/Regional",
    "SP" => "State Park",
    "COE" => "Army Engineers",
    "OS" => "Other State (Forest/Wildlife)",
    "OF" => "Other Federal (Reclamation, TVA, Military)",
    "NP" => "National Park (Monument, Rec Area)",
    "OT" => "Other (Authority, Utility, Reservation)"
  }

  AMENITIES = {
    "DP" => "Sanitary Dump",
    "ND" => "No Sanitary Dump",

    "FT" => "Flush toilets",
    "VT" => "Vault toilets",
    "FTVT" => "Some flush toilets, some vault toilets",
    "PT" => "Pit toilet",
    "NT" => "No toilets",

    "DW" => "Drinking water at campground",
    "NW" => "No drinking water (bring your own)",

    "SH" => "Showers",
    "NS" => "No showers",

    "RS" => "Accepts reservations",
    "NR" => "Does not accept reservations",

    "PA" => "Pets allowed",
    "NP" => "No pets allowed",

    "NH" => "No RV hookup",
    "W" => "Water hookup for RV",
    "WE" => "Water and electric hookup for RV",
    "E" => "Electric hookup for RB",
    "WES" => "Water, electric, and sewer hookups for RV",
    "S" => "Sewer hookup for RV",

    "L$" => "Free or under $12 fee"
  }

  def initialize()
  end

  def midwest
    Nokogiri::XML(open("./MidwestCamp.gpx"))
  end

  def canada
    Nokogiri::XML(open("./CanadaCamp.gpx"))
  end

  def northeast
    Nokogiri::XML(open("./NortheastCamp.gpx"))
  end

  def south
    Nokogiri::XML(open("./SouthCamp.gpx"))
  end

  def southwest
    Nokogiri::XML(open("./SouthwestCamp.gpx"))
  end

  def west
    Nokogiri::XML(open("./WestCamp.gpx"))
  end

  def data
    @data ||= combined_data
  end

  def combined_data
    new_doc = midwest
    new_doc.root << canada.root.children
    new_doc.root << northeast.root.children
    new_doc.root << south.root.children
    new_doc.root << southwest.root.children
    new_doc.root << west.root.children
  end

  def waypoints
    data.search("wpt")
  end

  def name(waypoint)
    info_string = waypoint.search("desc").text
    info_string.split("/")[1].split("  ")[0]
  end

  def campground_type(waypoint)
    info_string = waypoint.search("desc").text
    TYPES[info_string.split("  ")[1].split(" ")[0]]
  end

  def num_sites(waypoint)
    info_string = waypoint.search("desc").text
    info_string[info_string.index("SITES") + 6, 2] if info_string.index("SITES")
  end

  def drinking_water(waypoint)
    info_string = waypoint.search("desc").text
    if info_string.index("DW")
      AMENITIES["DW"]
    elsif info_string.index("NW")
      AMENITIES["NW"]
    end
  end

  def dump(waypoint)
    info_string = waypoint.search("desc").text
    if info_string.index("DP")
      AMENITIES["DP"]
    elsif info_string.index("ND")
      AMENITIES["ND"]
    end
  end

  def toilets(waypoint)
    info_string = waypoint.search("desc").text
    if info_string.index("FT")
      AMENITIES["FT"]
    elsif info_string.index("VT")
      AMENITIES["VT"]
    elsif info_string.index("FTVT")
      AMENITIES["VT"]
    elsif info_string.index("PT")
      AMENITIES["PT"]
    elsif info_string.index("NT")
      AMENITIES["NT"]
    end
  end

  def fee(waypoint)
    info_string = waypoint.search("desc").text
    AMENITIES["L$"] if info_string.index("L$")
  end

  def directions(waypoint)
    info_string = waypoint.search("desc").text
    info_string[info_string.index("approx")..-1] if info_string.index("approx")
  end

  def campground_info(waypoint)
    {
      name: name(waypoint),
      campground_type: campground_type(waypoint),
      drinking_water: drinking_water(waypoint),
      waste: dump(waypoint),
      toilets: toilets(waypoint),
      num_sites: num_sites(waypoint),
      directions: directions(waypoint),
      latitude: waypoint.attr("lat"),
      longitude: waypoint.attr("lon")
    }
  end

  def campgrounds
    @campgrounds ||= waypoints.map do |waypoint|
      campground_info(waypoint)
    end
  end

end
