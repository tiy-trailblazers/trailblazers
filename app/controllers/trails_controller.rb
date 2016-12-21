class TrailsController < ApplicationController

  def index
    area = OverpassArea.new(params[:south], params[:west], params[:north], params[:east])
    trails = area.trails_nested
    campgrounds = Campground.within_bounding_box([params[:south].to_f, params[:west].to_f, params[:north].to_f, params[:east].to_f])
    response = {
      "trails"=>trails,
      "campgrounds"=>campgrounds
    }
    render json: response
  end
end
