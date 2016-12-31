class UsersController < ApplicationController

  def create
    @user = User.new(user_params)

    if @user.save
      session[:current_user_id] = @user.id
      render json: @user
    else
      render json: @user.errors
    end
  end

  def update
    @user = User.find(params["id"])
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors
    end
  end

  def user_params
    params.require(:user).permit(:email, :first_name, :last_name, :password, :password_confirmation)
  end
end
