class ApplicationController < ActionController::API
  before_action :authenticate_request

  private

  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      decoded = JsonWebToken.decode(header)
      @current_user = User.find(decoded[:user_id]) if decoded
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      render json: { errors: ['Unauthorized access'] }, status: :unauthorized and return
    end

    render json: { errors: ['Unauthorized access'] }, status: :unauthorized and return unless @current_user
  end

  def authorize_admin
    render json: { errors: 'Forbidden - Admin access required' }, status: :forbidden unless @current_user&.admin?
  end
end
