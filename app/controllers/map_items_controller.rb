class MapItemsController < ApplicationController

  def search
    if params[:trip_type] == "day-hike"
      trails = Trail.new().formatted_trails(trail_query)
      render json: trails.as_json(include: :parks)
    elsif params[:trip_type] == "overnight"
      campgrounds = Campground.within_bounding_box([params[:south].to_f, params[:west].to_f, params[:north].to_f, params[:east].to_f])
      response = {
        trails: Trail.new().formatted_trails(trail_query),
        campgrounds: campgrounds
      }
      render json: response
    elsif params[:name]
      campgrounds = Campground.where("name like ?", "%#{params[:name].titleize}%")
      response = {
        trails: Trail.new().formatted_trails(trail_query),
        campgrounds: campgrounds
      }
      render json: response
    end
  end

  private

  def trail_query

    if params[:max_daily_length]
      Trail.where("path && ST_MakeEnvelope (#{params[:west]}, #{params[:south]}, #{params[:east]}, #{params[:north]}, 3785)").where("length <= #{max_trail_length}").order(length: :desc).limit(params[:limit]).offset(params[:offset])
    elsif params[:name]
      Trail.where("name like ?", "%#{params[:name].titleize}%").order(length: :desc).limit(params[:limit]).offset(params[:offset])
    else
      Trail.where("path && ST_MakeEnvelope (#{params[:west]}, #{params[:south]}, #{params[:east]}, #{params[:north]}, 3785)").order(length: :desc).limit(params[:limit]).offset(params[:offset])
    end
  end

  def max_trail_length
    params[:max_daily_length].to_f * num_trip_days
  end

  def num_trip_days
    if params[:start_date] == params[:end_date]
      1
    else
      ((params[:start_date].to_date - params[:end_date].to_date) + 1).to_i
    end
  end

end
