class TripCampgroundsJoinTable < ActiveRecord::Migration[5.0]
  def change
    create_join_table :trips, :campgrounds do |t|
      t.integer :trip_id
      t.integer :campground_id
    end
  end
end
