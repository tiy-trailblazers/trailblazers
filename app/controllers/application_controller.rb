class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  helper_method :current_user
  def current_user
    User.find_by(token: request.headers["HTTP_AUTHORIZATION"]) if request.headers["HTTP_AUTHORIZATION"]
  end
end
