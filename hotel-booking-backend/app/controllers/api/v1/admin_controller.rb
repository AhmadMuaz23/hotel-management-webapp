module Api
  module V1
    class AdminController < ApplicationController
      before_action :authorize_admin

      # GET /api/v1/admin/dashboard
      def dashboard
        total_users = User.count
        total_rooms = Room.count
        active_bookings = Booking.where(status: 'approved').count
        pending_reviews = Review.count # simplistic dummy logic for the UI stats
        
        # Calculate revenue (approved bookings)
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
