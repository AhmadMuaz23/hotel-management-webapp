class AddRejectionReasonToBookings < ActiveRecord::Migration[8.1]
  def change
    add_column :bookings, :rejection_reason, :string
  end
end
