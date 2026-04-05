Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Auth
      post '/auth/register', to: 'auth#register'
      post '/auth/login',    to: 'auth#login'
      get  '/auth/me',       to: 'auth#me'
      post '/auth/verify_email', to: 'auth#verify_email'
      post '/auth/resend_code',  to: 'auth#resend_code'
      
      # Password Recovery
      post '/passwords/forgot', to: 'passwords#forgot'
      post '/passwords/reset',  to: 'passwords#reset'
      
      
      # Rooms & Reviews
      resources :rooms do
        resources :reviews, only: [:index, :create]
      end
      get '/reviews/me', to: 'reviews#my_reviews'
      resources :reviews, only: [:update, :destroy]
      
      # Bookings
      resources :bookings, only: [:index, :show, :create, :destroy] do
        member do
          put :approve
          put :cancel
        end
      end
      
      # Admin actions structure
      resources :users, only: [:index, :update, :destroy] do
        member do
          put :block
          put :unblock
        end
      end
      
      # Contact Inquiries
      resources :contact_messages, only: [:index, :create, :destroy]
      
      post '/admin/login',     to: 'admin#login'
      get  '/admin/dashboard', to: 'admin#dashboard'
      get  '/admin/reviews',   to: 'admin#reviews'
      delete '/admin/reviews/:id', to: 'admin#delete_review'
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
