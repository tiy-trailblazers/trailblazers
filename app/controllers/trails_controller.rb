class TrailsController < ApplicationController

  def index
    campgrounds = Campground.within_bounding_box([params[:south].to_f, params[:west].to_f, params[:north].to_f, params[:east].to_f])

    trails = Trail.new().formatted_trails(query)
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

  private

  def query
    base_query = Trail.where("path && ST_MakeEnvelope (#{params[:west]}, #{params[:south]}, #{params[:east]}, #{params[:north]}, 3785)")

    if params[:max_length] && params[:min_length]
      base_query.where("length <= #{params[:max_length]} and length >= #{params[:min_length]}").order(length: :desc).limit(params[:limit]).offset(params[:offset])
    elsif params[:max_length]
      base_query.where("length <= #{params[:max_length]}").order(length: :desc).limit(params[:limit]).offset(params[:offset])
    elsif params[:min_length]
      base_query.where("length >= #{params[:min_length]}").order(length: :desc).limit(params[:limit]).offset(params[:offset])
    else
      base_query.order(length: :desc).limit(params[:limit]).offset(params[:offset])
    end
  end
end
