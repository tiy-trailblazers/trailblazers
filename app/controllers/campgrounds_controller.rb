class CampgroundsController < ApplicationController
  def show
    campground = Campground.find(params[:id])
    render json: campground
  end
end
