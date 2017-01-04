Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :trails, only: [:index, :show]
  resources :users, except: [:index, :new, :edit]
  resource :session, only: [:create, :destroy]
  resources :trips, only: [:create, :update, :destroy, :show]
  resources :campgrounds, only: [:show]
  resources :parks, only: [:show]
  post "/map_items/search", controller: :map_items, action: :search, as: :search_map_items
end
