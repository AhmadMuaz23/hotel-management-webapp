module Api
  module V1
    class BookingsController < ApplicationController
      before_action :set_booking, only: [:show, :approve, :cancel, :destroy]
      before_action :authorize_admin, only: [:approve]

      # GET /api/v1/bookings
      # Admin sees all, users see their own
      def index
        Booking.sync_all_statuses!
        if @current_user.admin?
          bookings = Booking.all.order(created_at: :desc)
        else
          bookings = @current_user.bookings.order(created_at: :desc)
        end
        render json: bookings.as_json(include: :room)
      end

      # GET /api/v1/bookings/1
      def show
        @booking.sync_status!
        if @current_user.admin? || @booking.user_id == @current_user.id
          render json: @booking.as_json(include: :room)
        else
          render json: { error: 'Forbidden' }, status: :forbidden
        end
      end

      # POST /api/v1/bookings
      def create
        if params[:check_in].blank? || params[:check_out].blank?
          render json: { errors: ['Check-in and check-out dates are required'] }, status: :unprocessable_entity and return
        end

        begin
          check_in = Date.parse(params[:check_in])
          check_out = Date.parse(params[:check_out])
        rescue ArgumentError => e
          render json: { errors: ['Invalid date format'] }, status: :unprocessable_entity and return
        end

        room = Room.find(params[:room_id])

        # Calculate nights and price
        nights = (check_out - check_in).to_i

        if nights <= 0
          render json: { errors: ['Check-out date must be at least one day after check-in'] }, status: :unprocessable_entity and return
        end

        total_price = nights * room.price_per_night

        if @current_user.balance < total_price
          render json: { errors: ["Insufficient balance. Current balance: Rs.#{@current_user.balance}"] }, status: :payment_required and return
        end

        booking = @current_user.bookings.build(
          room_id: room.id,
          check_in: check_in,
          check_out: check_out,
          guests: params[:guests],
          total_price: total_price,
          status: :pending
        )

        if booking.save
          @current_user.update!(balance: @current_user.balance - total_price)
          render json: booking, status: :created
        else
          render json: { errors: booking.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { errors: ['Room not found'] }, status: :not_found
      rescue StandardError => e
        render json: { errors: [e.message] }, status: :internal_server_error
      end

      # PATCH/PUT /api/v1/bookings/1/approve
      def approve
        if @booking.update(status: 'approved')
          @booking.room.sync_status!
          render json: @booking
        else
          render json: { errors: @booking.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/bookings/1/cancel
      def cancel
        if @current_user.admin? || @booking.user_id == @current_user.id
          old_status = @booking.status
          if @booking.update(status: 'cancelled')
            # Refund if it was pending or approved
            if old_status == 'pending' || old_status == 'approved'
              @booking.user.update!(balance: @booking.user.balance + @booking.total_price)
            end
            @booking.room.sync_status!
            render json: @booking
          else
            render json: { errors: @booking.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Forbidden' }, status: :forbidden
        end
      end

      # DELETE /api/v1/bookings/1
      def destroy
        if @current_user.admin?
          @booking.destroy
          head :no_content
        else
          render json: { error: 'Forbidden' }, status: :forbidden
        end
      end

      private

      def set_booking
        @booking = Booking.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Booking not found' }, status: :not_found
      end
    end
  end
end
