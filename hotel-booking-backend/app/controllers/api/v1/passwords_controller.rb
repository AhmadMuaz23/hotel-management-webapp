module Api
  module V1
    class PasswordsController < ApplicationController
      skip_before_action :authenticate_request, only: [:forgot, :reset]

      # POST /api/v1/passwords/forgot
      def forgot
        if params[:email].blank?
          return render json: { errors: ['Email address is required'] }, status: :unprocessable_entity
        end

        user = User.find_by(email: params[:email])

        if user
          # Generate token
          token = SecureRandom.urlsafe_base64(32)
          user.update!(
            reset_password_token: token,
            reset_password_sent_at: Time.current
          )
          
          # In a real app, send email here.
          # For development, we return token in response so user can test.
          render json: { 
            message: 'If the email exists, a reset link will be sent.',
            debug_token: token # REMOVE IN PRODUCTION
          }, status: :ok
        else
          # Still return OK for security (prevent email discovery)
          render json: { message: 'If the email exists, a reset link will be sent.' }, status: :ok
        end
      end

      # POST /api/v1/passwords/reset
      def reset
        token = params[:token].to_s
        user = User.find_by(reset_password_token: token)

        if user && user.reset_password_sent_at > 2.hours.ago
          if user.update(password: params[:password], reset_password_token: nil, reset_password_sent_at: nil)
            render json: { message: 'Password recovery successful. Access granted.' }, status: :ok
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { errors: ['Recovery token is invalid or has expired.'] }, status: :unauthorized
        end
      end
    end
  end
end
