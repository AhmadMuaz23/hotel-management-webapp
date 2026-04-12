module Api
  module V1
    class ContactMessagesController < ApplicationController
      skip_before_action :authenticate_request, only: [:create]
      before_action :authorize_admin!, only: [:index, :destroy]

      # POST /api/v1/contact_messages
      def create
        message = ContactMessage.new(message_params)
        if message.save
          render json: { message: 'Your message has been sent successfully. We will get back to you soon!' }, status: :created
        else
          render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/contact_messages
      def index
        messages = ContactMessage.order(created_at: :desc)
        messages = messages.where(status: params[:status]) if params[:status].present?
        render json: messages, status: :ok
      end

      # PUT /api/v1/contact_messages/:id/resolve
      def resolve
        message = ContactMessage.find(params[:id])
        if message.update(status: 'resolved')
          render json: message
        else
          render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/contact_messages/:id
      def destroy
        message = ContactMessage.find(params[:id])
        message.destroy
        head :no_content
      end

      private

      def message_params
        params.permit(:name, :email, :subject, :message)
      end

      def authorize_admin!
        render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user&.admin?
      end
    end
  end
end
