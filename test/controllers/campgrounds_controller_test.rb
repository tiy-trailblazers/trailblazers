require 'test_helper'

class CampgroundsControllerTest < ActionDispatch::IntegrationTest

  test "can get details for campground" do
    get campground_path(campgrounds(:camp).id)
    assert_response :ok
    assert_equal "National Park (Monument, Rec Area)", response.parsed_body["campground_type"]
  end
end
