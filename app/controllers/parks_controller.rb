class ParksController < ApplicationController
  def show
    park = Park.find(params["id"])
    render json: park
  end
end
