Tripmap::Application.routes.draw do

  resources :transport_modes

  resources :providers do
    member do
      get 'connect'
      get 'connect_callback'
    end
  end

  resources :items
  resources :events
  resources :trips do
    member do
      get :play
    end
    resources :events do
      member do
        post :reorder
      end
      resources :items do
        collection do
          get 'import'
          post 'import'

          match 'from/:id' => 'items#import', :as => :import_from_provider
        end
      end
    end
  end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => "welcome#index"

  post '/signup' => 'account#create', :as => :signup
  get '/signup' => 'account#new', :as => :signup
  match '/account' => 'account#show', :as => :account
  match '/account/edit' => 'account#edit', :as => :edit_account
  post '/login' => 'user_sessions#create', :as => :login
  get '/login' => 'user_sessions#new', :as => :login
  match '/logout' => 'user_sessions#destroy', :as => :logout
  match '/forgot_password' => 'password_resets#new', :as => :forgot_password
  match '/reset_password/:id' => 'password_resets#edit', :as => :reset_password
  resources :password_resets

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  match ':controller(/:action(/:id(.:format)))'
end
