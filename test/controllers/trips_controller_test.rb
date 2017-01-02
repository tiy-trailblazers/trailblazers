require 'test_helper'

class TripsControllerTest < ActionDispatch::IntegrationTest
  test "can create a new trip that has trails and campgrounds and parks" do
    post session_path, params: { email: "test@gmail.com", password: "password" }
    current_user = User.find(users(:allie).id)
    trail = Trail.find(trails(:loop).id)
    park = Park.find(parks(:park).id)
    post trips_path, params: { trip: { start_date: Date.today, end_date: Date.today, trip_type: "day-hike", camping_type: "none", trails: [trail.id], campgrounds: [], parks: [park.id] } }
    assert_response :ok
    assert_equal "Sam's River Loop Trail", User.find(current_user.id).trips.last.trails.first.name
  end

  test "can't create new trip if not logged in" do
    trail = Trail.find(trails(:loop).id)
    park = Park.find(parks(:park).id)
    post trips_path, params: { trip: { start_date: Date.today, end_date: Date.today, trip_type: "day-hike", camping_type: "none", trails: [trail.id], campgrounds: [], parks: [park.id] } }
    assert_equal "User must be logged in to create a trip", response.parsed_body["errors"]
  end

  test "get error back if can't save" do
    post session_path, params: { email: "test@gmail.com", password: "password" }
    trail = Trail.find(trails(:loop).id)
    post trips_path, params: { trip: { end_date: Date.today, trip_type: "day-hike", camping_type: "none", trails: [trail.id], campgrounds: [], parks: [1] } }
    assert_equal "can't be blank", response.parsed_body["start_date"].first
  end

  test "can update a trip" do
    post session_path, params: { email: "test@gmail.com", password: "password" }
    trip = Trip.find(trips(:day).id)
    campground = Campground.find(campgrounds(:camp).id)
    patch trip_path(trip.id), params: { trip: { trip_type: "overnight", campgrounds: [campground.id] } }
    assert_response :ok
    assert response.parsed_body.include?("trails")
    assert_equal "Mathews Arm - Shenandoah National Park", trip.campgrounds.first.name
  end
end
