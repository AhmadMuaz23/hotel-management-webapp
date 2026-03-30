module Api
  module V1
    class UsersController < ApplicationController
      before_action :authorize_admin, except: [:show, :update]
      before_action :set_user, only: [:show, :update, :block, :unblock, :change_role]

      # GET /api/v1/users
      def index
        users = User.all.order(created_at: :desc)
        render json: users.as_json(except: [:password_digest])
      end

      # PUT/PATCH /api/v1/users/1
      def update
        if @current_user.admin? || @user.id == @current_user.id
          if @user.update(user_params)
            render json: @user.as_json(except: [:password_digest])
          else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Forbidden' }, status: :forbidden
        end
      end

      # PUT /api/v1/users/1/block
      def block
        if @user.update(status: 'blocked')
          render json: { message: 'User blocked successfully' }
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/users/1/unblock
      def unblock
        if @user.update(status: 'active')
          render json: { message: 'User unblocked successfully' }
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_user
        @user = User.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
      end

      def user_params
        params.permit(:name, :email, :password, :password_confirmation)
      end
    end
  end
end
