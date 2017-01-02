class TripsController < ApplicationController

  def create
    if current_user
      user = User.find(session["current_user_id"])
      trip = Trip.new(trip_params)
      trip.trails << trip_trails
      trip.campgrounds << trip_campgrounds
      trip.parks << trip_parks
      if trip.save
        user.trips << trip
        if user.save
          trails = trip.trails
          render json: {trip: trip.as_json(include: [:campgrounds, :parks, :users]), trails: Trail.new.formatted_trails(trails)}
        else
          render json: user.errors
        end
      else
        render json: trip.errors
      end
    else
      render json: {errors: "User must be logged in to create a trip"}
    end
  end

  def update
    trip = Trip.find(params[:id])
    if current_user && trip.belongs_to?(current_user)
      trip.trails << trip_trails
      trip.campgrounds << trip_campgrounds
      trip.parks << trip_parks
      if trip.save && trip.update(trip_params)
        trails = trip.trails
        render json: {trip: trip.as_json(include: [:campgrounds, :parks, :users]), trails: Trail.new.formatted_trails(trails)}
      else
        render json: trip.errors
      end
    else
      render json: { errors: "User must be the owner of a trip to update it" }
    end
  end

  def destroy
    trip = Trip.find(params[:id])
    if current_user && trip.belongs_to?(current_user)
      trip.destroy
      render json: trip
    else
      render json: { errors: "User must be the owner of a trip to delete it"}
    end
  end

  def show
    trip = Trip.find(params[:id])
    if current_user && trip.belongs_to?(current_user)
      trails = trip.trails
      render json: {trip: trip.as_json(include: [:campgrounds, :parks, :users]), trails: Trail.new.formatted_trails(trails)}
    else
      render json: { errors: "User must be the owner of a trip to see it" }
    end
  end

  private

  def trip_params
    params.require(:trip).permit(:start_date, :end_date, :trip_type, :camping_type)
  end

  def trip_trails
    trails = []
      if params[:trip][:trails]
        params[:trip][:trails].each do |id|
          trails << Trail.find(id) if Trail.find_by(id: id)
        end
      end
    trails
  end

  def trip_campgrounds
    campgrounds = []
      if params[:trip][:campgrounds]
        params[:trip][:campgrounds].each do |id|
          campgrounds << Campground.find(id) if Campground.find_by(id: id)
        end
      end
    campgrounds
  end

  def trip_parks
    parks = []
      if params[:trip][:parks]
        params[:trip][:parks].each do |id|
          parks << Park.find(id) if Park.find_by(id: id)
        end
      end
    parks
  end
end
