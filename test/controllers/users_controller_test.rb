require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end

  test "can post a new user" do
    post users_path, params: { user: { first_name: "Allie", last_name: "Rowan", email: "arowan@wesleyan.edu", password: "password", password_confirmation: "password" } }
    assert_equal "Allie", User.last.first_name
  end

  test "sends back errors if any" do
    post users_path, params: { user: { last_name: "Rowan", email: "arowan@wesleyan.edu", password: "password", password_confirmation: "password" } }
    assert_equal ["can't be blank"], response.parsed_body["first_name"]
  end

  test "sends error if password different from confirmation" do
    post users_path, params: { user: { last_name: "Rowan", email: "arowan@wesleyan.edu", password: "passwasdfsdord", password_confirmation: "password" } }
    assert_equal ["doesn't match Password"], response.parsed_body["password_confirmation"]
  end
end
