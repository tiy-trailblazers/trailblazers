require 'test_helper'

class TrailsControllerTest < ActionDispatch::IntegrationTest

  def setup
    stub_request(
      :get,
      "http://overpass-api.de/api/interpreter?data=(way%5Bhighway=footway%5D(38.71632,%20-78.3789,%2038.716607,%20-78.256251)%3B%20way%5Bhighway=path%5D(38.71632,%20-78.3789,%2038.716607,%20-78.256251)%3B%20way%5Bname~'trail',%20i%5D(38.71632,%20-78.3789,%2038.716607,%20-78.256251)%3B)%3B(._%3B%3E%3B)%3Bout%3B"
    ).to_return(
      :status => 200,
      :body => File.read("test/helpers/response.txt"),
      :headers => { 'Content-Type' => 'application/json' }
    )
  end

  test "can get all trails" do
    get trails_path, params: { south: 38.71632, west: -78.3789, north: 38.716607, east: -78.256251 }
    assert_response :ok
  end
end
