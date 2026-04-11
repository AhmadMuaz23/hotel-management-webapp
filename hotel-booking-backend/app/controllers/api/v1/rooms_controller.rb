module Api
  module V1
    class RoomsController < ApplicationController
      skip_before_action :authenticate_request, only: [:index, :show, :seed_database]
      before_action :authorize_admin, except: [:index, :show, :seed_database]
      before_action :set_room, only: [:show, :update, :destroy]

      def seed_database
        Rails.application.load_seed
        render json: { message: "Haven Hotels Built!" }
      rescue => e
        render json: { error: e.message }, status: :internal_server_error
      end

      # GET /api/v1/rooms
      def index
        rooms = Room.all
        rooms = rooms.where(category: params[:category]) if params[:category].present?
        rooms = rooms.where('price_per_night <= ?', params[:max_price]) if params[:max_price].present?
        rooms = rooms.where('capacity >= ?', params[:guests]) if params[:guests].present?
        
        render json: rooms
      end

      # GET /api/v1/rooms/1
      def show
        render json: @room.as_json(methods: :average_rating, include: { reviews: { include: { user: { only: :name } } } })
      end

      # POST /api/v1/rooms
      def create
        room = Room.new(room_params)
        
        if room.save
          render json: room, status: :created
        else
          render json: { errors: room.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/rooms/1
      def update
        if @room.update(room_params)
          render json: @room
        else
          render json: { errors: @room.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/rooms/1
      def destroy
        @room.destroy
        head :no_content
      end

      private

      def set_room
        @room = Room.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Room not found' }, status: :not_found
      end

      def room_params
        params.permit(:name, :description, :category, :status, :capacity, :price_per_night, :is_featured)
      end
    end
  end
end
