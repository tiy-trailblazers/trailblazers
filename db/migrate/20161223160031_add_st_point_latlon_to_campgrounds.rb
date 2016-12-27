class AddStPointLatlonToCampgrounds < ActiveRecord::Migration[5.0]
  def change
    add_column :campgrounds, :lonlat, :st_point, geographic: true
  end
end
