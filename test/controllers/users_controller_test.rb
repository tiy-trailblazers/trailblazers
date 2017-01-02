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

  test "can update a user" do
    my_user = User.find(users(:allie).id)
    patch user_path(my_user.id), params: { user: { last_name: "Another" } }
    assert_response :ok
    assert_equal "Another", User.find(my_user.id).last_name
  end

  test "sends back error on update if any" do
    my_user = User.find(users(:allie).id)
    patch user_path(my_user.id), params: { user: { password: "password", password_confirmation: "asdlkfj" } }
    assert_equal ["doesn't match Password"], response.parsed_body["password_confirmation"]
  end

  test "can read one user" do
    my_user = User.find(users(:allie).id)
    get user_path(my_user.id)
    assert_response :ok
    assert_equal "Rowan", response.parsed_body["last_name"]
  end
end
