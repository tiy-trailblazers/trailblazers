class AddLatitudeLongitudeToTrails < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :latitude, :float
    add_column :trails, :longitude, :float
  end
end
