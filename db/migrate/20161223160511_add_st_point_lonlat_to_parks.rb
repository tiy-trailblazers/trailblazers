class AddStPointLonlatToParks < ActiveRecord::Migration[5.0]
  def change
    add_column :parks, :lonlat, :st_point, geographic: true
  end
end
