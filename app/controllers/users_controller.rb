class UsersController < ApplicationController

  def create
    user = User.new(user_params)
    token = ""
    not_found = false
    until not_found
      token = SecureRandom.hex
      not_found = true if !User.find_by(token: token)
    end
    user.token = token
    if user.save
      render json: user
    else
      render json: user.errors
    end
  end

  def update
    user = User.find(params["id"])
    if current_user == user && user.update(user_params)
      render json: user
    else
      render json: user.errors
    end
  end

  def show
    user = User.find(params["id"])
    render json: user
  end

  private

  def user_params
    params.require(:user).permit(:email, :first_name, :last_name, :password, :password_confirmation)
  end
end
