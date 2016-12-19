class CreateTrails < ActiveRecord::Migration[5.0]
  def change
    create_table :trails do |t|
      t.float :length
      t.decimal :start_lat
      t.decimal :start_lon
      t.string :park
      t.string :state

      t.timestamps
    end
  end
end
