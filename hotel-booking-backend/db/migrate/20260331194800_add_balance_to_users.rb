class AddBalanceToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :balance, :decimal, precision: 10, scale: 2, default: 500000.0
  end
end
