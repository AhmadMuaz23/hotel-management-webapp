class AddVerificationFieldsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :verification_code, :string
    add_column :users, :verification_code_sent_at, :datetime
  end
end
