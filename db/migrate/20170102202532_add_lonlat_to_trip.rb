class AddLonlatToTrip < ActiveRecord::Migration[5.0]
  def change
    add_column :trips, :start_lonlat, :st_point, geographic: true
  end
end
