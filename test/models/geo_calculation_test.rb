require 'test_helper'

class GeoCalculationTest < ActiveSupport::TestCase

  test "can get length of a polyline" do
    polyline = [[ 38.7438255, -78.3145429],
    [ 38.7437070, -78.3147810],
    [ 38.7435540, -78.3149020],
    [ 38.7433595, -78.3149947],
    [ 38.7429406, -78.3153157],
    [ 38.7428280, -78.3154700],
    [ 38.7425417, -78.3157739],
    [ 38.7423113, -78.3160266],
    [ 38.7421430, -78.3164920],
    [ 38.7420442, -78.3166720]]
    geo_calc = GeoCalculation.new()
    assert_equal 0.1732217676078351, geo_calc.length_of_polyline(polyline)
  end
end
