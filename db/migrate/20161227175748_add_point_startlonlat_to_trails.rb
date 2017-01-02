class AddPointStartlonlatToTrails < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :startlonlat, :st_point, geographic: true
    remove_column :trails, :start_lat
    remove_column :trails, :start_lon
  end
end
