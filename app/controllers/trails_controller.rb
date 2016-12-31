class TrailsController < ApplicationController

  def index
    campgrounds = Campground.within_bounding_box([params[:south].to_f, params[:west].to_f, params[:north].to_f, params[:east].to_f])

    trails = Trail.new().formatted_trails(Trail.within_bounding_box([params[:south].to_f, params[:west].to_f, params[:north].to_f, params[:east].to_f]))

    response = {
      "trails"=>trails,
      "campgrounds"=>campgrounds
    }
    render json: response
  end

  def show
    @trail = Trail.find(params[:id])
    intersections = Trail.new().formatted_trails(@trail.intersections)
    response = {
      trail: @trail.attributes,
      intersections: intersections,
      park: @trail.park
    }
    render json: response
  end
end
