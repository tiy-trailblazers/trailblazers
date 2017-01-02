require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  test "can log in" do
    post session_path, params: { email: "test@gmail.com", password: "password" }
    assert_response :ok
    assert_equal "Allie", response.parsed_body["first_name"]
  end

  test "logging in with wrong password sends back error" do
    post session_path, params: { email: "test@gmail.com", password: "sldkf" }
    assert_equal "Incorrect email/password combination", response.parsed_body["error"]
  end

  test "can log out" do
    delete session_path
    assert_response :ok
    refute session["current_user_id"]
  end
end
