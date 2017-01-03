require 'test_helper'

class TrailsControllerTest < ActionDispatch::IntegrationTest

  test "can get all trails and campgrounds" do
    get trails_path, params: { south: 38.70632, west: -78.3789, north: 38.796607, east: -78.206251 }
    assert_response :ok
    assert response.parsed_body["campgrounds"]
  end

  test "can get one trail and its intersections" do
    get trail_path(11596)
    assert_response :ok
    assert response.parsed_body["intersections"]
    assert response.parsed_body["trail"]
    assert response.parsed_body["park"]
  end

  test "can request trails with limit and offset" do
    get trails_path, params: { south: 36.70632, west: -80.3789, north: 40.796607, east: -76.206251, limit: 1, offset: 1 }
    assert_response :ok
    assert_equal 1, response.parsed_body["trails"].size
    assert_equal "Sam's River Loop Trail", response.parsed_body["trails"].first["name"]
  end

  test "can request trails with min and max length" do
    get trails_path, params: { south: 36.70632, west: -80.3789, north: 40.796607, east: -76.206251, min_length: 1.2, max_length: 2.6 }
    assert_response :ok
    assert_equal 2, response.parsed_body["trails"].size
    assert_equal "Sam's River Loop Trail", response.parsed_body["trails"].first["name"]
  end
end
