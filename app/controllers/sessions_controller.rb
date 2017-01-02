class SessionsController < ApplicationController
  def new
  end

  def create
    @user = User.find_by(email: params[:email])
    if @user && @user.authenticate(params[:password])
      session[:current_user_id] = @user.id
      render json: @user
    else
      render json: @user.errors
    end
  end

  def destroy
    session.delete(:current_user_id)
    render json: current_user
  end
end
