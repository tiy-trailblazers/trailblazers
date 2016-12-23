module ToGeoJson

  def export(feature)
    RGeo::GeoJSON.encode(feature).to_json
  end

  def export_to_desktop(feature)
    File.write(File.expand_path("~/Desktop/feature.geojson"), RGeo::GeoJSON.encode(feature).to_json)
  end

  extend self
end
