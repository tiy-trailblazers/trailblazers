class TrailsController < ApplicationController

  def index
    area = OverpassArea.new(params[:south], params[:west], params[:north], params[:east])
    render json: area.trails_nested
  end
end
