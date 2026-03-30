module Api
  module V1
    class ReviewsController < ApplicationController
      skip_before_action :authenticate_request, only: [:index]

      # GET /api/v1/rooms/:room_id/reviews
      def index
        reviews = Review.where(room_id: params[:room_id])
        render json: reviews.as_json(include: { user: { only: [:name, :id] } })
      end

      # POST /api/v1/rooms/:room_id/reviews
      def create
        review = @current_user.reviews.build(
          room_id: params[:room_id],
          rating: params[:rating],
          comment: params[:comment]
        )

        if review.save
          render json: review, status: :created
        else
          render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end
