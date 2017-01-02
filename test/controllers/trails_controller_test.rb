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
end
