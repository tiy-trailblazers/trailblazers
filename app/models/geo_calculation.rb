class GeoCalculation

  def initialize()
  end

  def length_of_polyline(polyline)
    total_distance = 0.0
    polyline.length.times do |i|
      next if i == 0
      total_distance += Geocoder::Calculations.distance_between([polyline[i][0].to_f, polyline[i][1].to_f], [polyline[i-1][0].to_f, polyline[i-1][1].to_f])
    end
    return total_distance
  end
end
