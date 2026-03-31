module Api
  module V1
    class AdminController < ApplicationController
      skip_before_action :authenticate_request, only: [:login]
      before_action :authorize_admin, except: [:login]

      # POST /api/v1/admin/login
      def login
        user = User.find_by(email: params[:email])

        if user&.authenticate(params[:password])
          unless user.admin?
            render json: { errors: 'Access denied. Admin credentials required.' }, status: :forbidden
            return
          end

          if user.status == 'blocked'
            render json: { errors: 'Your admin account has been suspended.' }, status: :forbidden
            return
          end

          token = JsonWebToken.encode_with_role(user)
          render json: {
            user: user.as_json(except: [:password_digest, :created_at, :updated_at, :verification_code]),
            token: token
          }, status: :ok
        else
          render json: { errors: 'Invalid email or password' }, status: :unauthorized
        end
      end

      # GET /api/v1/admin/dashboard
      def dashboard
        total_users = User.count
        total_rooms = Room.count
        active_bookings = Booking.where(status: 'approved').count
        pending_reviews = Review.count
        
        revenue = Booking.where(status: 'approved').sum(:total_price)
        
        recent_bookings = Booking.includes(:user, :room).order(created_at: :desc).limit(5)
        recent_users = User.order(created_at: :desc).limit(5)

        render json: {
          stats: {
            total_users: total_users,
            total_rooms: total_rooms,
            active_bookings: active_bookings,
            pending_reviews: pending_reviews,
            total_revenue: revenue
          },
          recent_bookings: recent_bookings.as_json(include: [:user, :room]),
          recent_users: recent_users.as_json(except: [:password_digest])
        }
      end
    end
  end
end
