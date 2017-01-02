class SessionsController < ApplicationController

  def create
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      render json: user
    else
      render json: {error: "Incorrect email/password combination"}
    end
  end

  def destroy
    render json: current_user
  end
end
