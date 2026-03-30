module Api
  module V1
    class RoomsController < ApplicationController
      skip_before_action :authenticate_request, only: [:index, :show]
      before_action :authorize_admin, except: [:index, :show]
      before_action :set_room, only: [:show, :update, :destroy]

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
        File.open("c:/Users/hp/Desktop/Hotel-Management/hotel-booking-backend/debug.log", "a") { |f| f.puts "[#{Time.now}] GET /rooms/#{params[:id]}" }
        render json: @room.as_json(include: :reviews)
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
