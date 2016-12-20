class TripTrailJoinTable < ActiveRecord::Migration[5.0]
  def change
    create_join_table :trips, :trails do |t|
      t.integer :trip_id
      t.integer :trail_id
    end
  end
end
