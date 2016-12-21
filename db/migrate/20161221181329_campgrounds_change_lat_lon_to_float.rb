class CampgroundsChangeLatLonToFloat < ActiveRecord::Migration[5.0]
  def change
    change_column :campgrounds, :latitude, :float
    change_column :campgrounds, :longitude, :float
  end
end
