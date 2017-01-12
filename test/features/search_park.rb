require 'test_helper'

class ParkTest < ActiveSupport::TestCase
  setup do
    Capybara.current_driver = Capybara.javascript_driver # :selenium by default
    WebMock.allow_net_connect!
  end

  test "can search for a park" do
    visit("/")
    fill_in("Park Name", with: "river")
    find_button('Search').click
    find('section#map-item-list')
    assert_match(/Trail Two/, page.body)
  end

end
