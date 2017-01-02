require 'test_helper'

class ParksControllerTest < ActionDispatch::IntegrationTest

  test "can see info for a specific park" do
    get park_path(parks(:park).id)
    assert_response :ok
    assert_equal "ME", response.parsed_body["states"]
  end
end
