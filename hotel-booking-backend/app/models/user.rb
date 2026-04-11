class User < ApplicationRecord
  has_secure_password

  has_many :bookings, dependent: :destroy
  has_many :reviews, dependent: :destroy

  has_one_attached :avatar

  enum :role, { user: 0, admin: 1 }
  enum :status, { active: 0, blocked: 1 }

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  before_create :set_default_balance

  def generate_verification_code
    self.verification_code = sprintf('%06d', rand(10**6))
    self.verification_code_sent_at = Time.current
    save(validate: false)
  end

  def avatar_url
    if avatar.attached?
      host = Rails.env.production? ? 'web-production-84a89.up.railway.app' : 'localhost:3000'
      protocol = Rails.env.production? ? 'https' : 'http'
      Rails.application.routes.url_helpers.rails_blob_url(avatar, host: host, protocol: protocol)
    else
      nil
    end
  end

  private

  def set_default_balance
    self.balance = 500000.0 if balance.blank? || balance.zero?
  end
end
