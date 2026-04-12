class ContactMessage < ApplicationRecord
  validates :name, :email, :subject, :message, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }

  enum :status, { unread: 0, read: 1, resolved: 2 }
end
