class CreateTrips < ActiveRecord::Migration[5.0]
  def change
    create_table :trips do |t|
      t.date :start_date
      t.date :end_date
      t.string :trip_type
      t.string :camping_type

      t.timestamps
    end
  end
end
