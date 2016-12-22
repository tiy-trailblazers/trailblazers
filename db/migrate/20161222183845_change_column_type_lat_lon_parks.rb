class ChangeColumnTypeLatLonParks < ActiveRecord::Migration[5.0]
  def change
    change_column :parks, :latitude, :float
    change_column :parks, :longitude, :float
  end
end
