class TripParksJoinTable < ActiveRecord::Migration[5.0]
  def change
    create_join_table :trips, :parks do |t|
      t.integer :trip_id
      t.integer :park_id
    end
  end
end
