require 'test_helper'

class MapItemsControllerTest < ActionDispatch::IntegrationTest
  def setup

    stub_request(
      :get,
      "http://developer.nps.gov/api/v0/alerts?limit=600&parkCode=fr-ca/sacr"
    ).to_return(
      :status => 200,
      :body => File.read("test/helpers/alert.txt"),
      :headers => { 'Content-Type' => 'application/json' }
    )
  end

  test "can search for day hikes with max length" do
    post search_map_items_path, params: { trip_type: "day-hike", max_daily_length: 2.8, south: 36.70632, west: -80.3789, north: 40.796607, east: -76.206251 }
    assert_equal 3, response.parsed_body.size
    assert_equal "The River Park", response.parsed_body[0]["park"]["name"]
  end

  test "can search for overnight type and get back campgrounds and trails" do
    post search_map_items_path, params: { trip_type: "overnight", start_date: Date.today, end_date: Date.today + 3, max_daily_length: 2.8, south: 36.70632, west: -80.3789, north: 40.796607, east: -76.206251 }
    assert response.parsed_body["campgrounds"]
  end

  test "can search for trails and campgrounds by name" do
    post search_map_items_path, params: { name: "river" }
    assert_equal 1, response.parsed_body["campgrounds"].size
    assert_equal 2, response.parsed_body["trails"].size
  end

  test "can search for parks by name" do
    post search_map_items_path, params: { park_name: "river" }
    assert_equal 1, response.parsed_body.length
    assert_equal 2, response.parsed_body.first["trails"].size
  end

end
