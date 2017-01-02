require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  test "can log in" do
    post session_path, params: { email: "test@gmail.com", password: "password" }
    assert_response :ok
    assert_equal "Allie", response.parsed_body["first_name"]
  end
end
