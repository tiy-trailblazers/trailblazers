require 'test_helper'

class ParkTest < ActiveSupport::TestCase
  setup do
    Capybara.current_driver = Capybara.javascript_driver # :selenium by default
    WebMock.allow_net_connect!
  end

  test "can log in" do
    visit("/")
    click_link('Sign In')
    fill_in("email", with: "test@gmail.com")
    fill_in("password", with: "password")
    find_button('Sign In').click
    find('nav.profile-nav')
  end

end
