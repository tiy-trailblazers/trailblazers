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
    user.avatar = params[:user][:avatar]

    if user.save
      render json: user.as_json(include: [:trips])
    else
      render json: user.errors
    end
  end

  def update
    user = User.find(params["id"])
    if current_user == user && user.update(user_params)
      render json: user.as_json(include: [:trips])
    else
      render json: user.errors
    end
  end

  def show
    user = User.find(params["id"])
    render json: user.as_json(include: [:trips])
  end

  private

  def user_params
    params.require(:user).permit(:email, :first_name, :last_name, :profile_image, :password, :password_confirmation, :street, :city, :state, :zip, :file)
  end
end
