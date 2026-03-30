class CreateRooms < ActiveRecord::Migration[8.1]
  def change
    create_table :rooms do |t|
      t.string :name
      t.text :description
      t.integer :category, default: 0
      t.integer :status, default: 0
      t.integer :capacity
      t.decimal :price_per_night, precision: 10, scale: 2
      t.boolean :is_featured, default: false

      t.timestamps
    end
  end
end
