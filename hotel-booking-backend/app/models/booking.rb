class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :room

  enum :status, { pending: 0, approved: 1, cancelled: 2, completed: 3 }

  validates :check_in, :check_out, presence: true
  validates :guests, presence: true, numericality: { greater_than: 0 }
  validates :total_price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  
  validate :check_out_after_check_in
  validate :no_overlapping_bookings, on: :create

  def self.sync_all_statuses!
    where(status: :approved).find_each(&:sync_status!)
  end

  def sync_status!
    return unless approved?
    
    if Date.current >= check_out
      update_column(:status, :completed)
      room.sync_status! # Room should also be synced when booking completes
    end
  end

  private

  def check_out_after_check_in
    return if check_out.blank? || check_in.blank?

    if check_out <= check_in
      errors.add(:check_out, "must be after the check-in date")
    end
  end

  def no_overlapping_bookings
    return if check_in.blank? || check_out.blank? || room_id.blank?

    overlapping_bookings = Booking.where(room_id: room_id)
                                  .where.not(id: id)
                                  .where.not(status: :cancelled)
                                  .where('check_in < ? AND check_out > ?', check_out, check_in)

    if overlapping_bookings.exists?
      errors.add(:base, "This room is already booked for the selected dates")
    end
  end
end
