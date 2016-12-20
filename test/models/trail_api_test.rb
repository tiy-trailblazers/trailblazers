require 'test_helper'

class TrailAPITest < ActiveSupport::TestCase

  def setup
    stub_request(
      :get,
      "https://trailapi-trailapi.p.mashape.com/?lat=38.7137996&lon=-78.2781265&q%5Bactivities_activity_type_name_eq%5D=hiking&radius=10"
    ).to_return(
      :status => 200,
      :body => File.read("test/helpers/trail_response.txt"),
      :headers => { 'Content-Type' => 'application/json' }
    )
  end

  test "can hit trail api" do
    api = TrailAPI.new()
    response = api.get_by_lat_lon(38.7137996, -78.2781265, 10)
    assert_equal 5, response["places"].size
  end

end
