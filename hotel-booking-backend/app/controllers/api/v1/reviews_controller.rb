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

      # GET /api/v1/reviews/me
      def my_reviews
        reviews = @current_user.reviews.as_json(include: { room: { only: [:id, :name] } })
        render json: reviews
      end

      # PATCH/PUT /api/v1/reviews/:id
      def update
        review = @current_user.reviews.find(params[:id])
        if review.update(review_params)
          render json: review
        else
          render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/reviews/:id
      def destroy
        review = @current_user.reviews.find(params[:id])
        review.destroy
        head :no_content
      end

      private

      def review_params
        params.permit(:rating, :comment)
      end
    end
  end
end
