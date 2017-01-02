Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :trails, only: [:index, :show]
  resources :users, except: [:index, :new, :edit]
  resource :session, only: [:create, :destroy]
end
