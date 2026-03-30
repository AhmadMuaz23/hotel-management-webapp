class CreateBookings < ActiveRecord::Migration[8.1]
  def change
    create_table :bookings do |t|
      t.references :user, null: false, foreign_key: true
      t.references :room, null: false, foreign_key: true
      t.date :check_in
      t.date :check_out
      t.integer :guests
      t.decimal :total_price, precision: 10, scale: 2
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
