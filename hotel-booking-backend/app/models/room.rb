class Room < ApplicationRecord
  has_many :bookings, dependent: :destroy
  has_many :reviews, dependent: :destroy

  enum :category, { single_room: 0, couple_room: 1, family_room: 2, presidential_suite: 3 }
  enum :status, { available: 0, unavailable: 1, booked: 2 }

  validates :name, presence: true
  validates :capacity, presence: true, numericality: { greater_than: 0 }
  validates :price_per_night, presence: true, numericality: { greater_than: 0 }

  def average_rating
    reviews.average(:rating).to_f.round(1)
  end
  
  def self.sync_all_statuses!
    where.not(status: :unavailable).find_each(&:sync_status!)
  end
  
  def sync_status!
    return if unavailable?
    
    today = Date.current
    active_booking = bookings.where(status: :approved)
                             .where('check_in <= ? AND check_out > ?', today, today)
                             .exists?
    
    new_status = active_booking ? :booked : :available
    update_column(:status, new_status) if status.to_sym != new_status
  end
end
