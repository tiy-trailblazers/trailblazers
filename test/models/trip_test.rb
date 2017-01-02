require 'test_helper'

class TripTest < ActiveSupport::TestCase
  test "trip can have many trails" do
    trip = Trip.create(start_date: Date.today, end_date: Date.today, trip_type: "day-hike", camping_type: "none")
    trip.trails << [Trail.find(trails(:loop).id), Trail.find(trails(:one).id)]
    trip.save
    assert_equal 2, trip.trails.size
  end

  test "can use method belongs_to to test if a user is associated with a trip" do
    trip = Trip.find(trips(:day).id)
    assert trip.belongs_to?(User.find(users(:allie).id))
  end
end
