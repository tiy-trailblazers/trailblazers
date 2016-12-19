class UserTripJoinTable < ActiveRecord::Migration[5.0]
  def change
    create_join_table :users, :trips do |t|
      t.integer :user_id
      t.integer :trip_id
    end
  end
end
