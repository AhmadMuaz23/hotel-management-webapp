module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_request, only: [:register, :login, :verify_email, :resend_code]

      # POST /api/v1/auth/register
      def register
        user = User.new(user_params)
        user.role = 0 # default to user
        user.status = 0 # default to active
        user.verified = false

        if user.save
          user.generate_verification_code
          UserMailer.account_verification(user).deliver_now
          render json: { message: 'Registration successful. please verify your email.', user: user_data(user) }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/auth/verify_email
      def verify_email
        user = User.find_by(email: params[:email])

        if user && user.verification_code == params[:code]
          user.update(verified: true, verification_code: nil)
          token = JsonWebToken.encode(user_id: user.id)
          render json: { message: 'Email verified successfully', user: user_data(user), token: token }, status: :ok
        else
          render json: { errors: 'Invalid or expired verification code' }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/auth/resend_code
      def resend_code
        user = User.find_by(email: params[:email])
        if user
          user.generate_verification_code
          UserMailer.account_verification(user).deliver_now
          render json: { message: 'verification code resent' }, status: :ok
        else
          render json: { errors: 'User not found' }, status: :not_found
        end
      end

      # POST /api/v1/auth/login
      def login
        user = User.find_by(email: params[:email])

        if user&.authenticate(params[:password])
          if user.status == 'blocked'
            render json: { errors: 'Your account has been blocked.' }, status: :forbidden
            return
          end

          unless user.verified
            render json: { errors: 'Please verify your email address.', unverified: true, email: user.email }, status: :forbidden
            return
          end
          
          token = JsonWebToken.encode(user_id: user.id)
          render json: { user: user_data(user), token: token }, status: :ok
        else
          render json: { errors: 'Invalid email or password' }, status: :unauthorized
        end
      end

      # GET /api/v1/auth/me
      def me
        render json: { user: user_data(@current_user) }, status: :ok
      end

      private

      def user_params
        params.permit(:name, :email, :password, :password_confirmation)
      end

      def user_data(user)
        user.as_json(except: [:password_digest, :created_at, :updated_at, :verification_code])
      end
    end
  end
end
