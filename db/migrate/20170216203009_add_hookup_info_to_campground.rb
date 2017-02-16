class AddHookupInfoToCampground < ActiveRecord::Migration[5.0]
  def change
    add_column :campgrounds, :water_hookup, :boolean, default: false
    add_column :campgrounds, :sewer_hookup, :boolean, default: false
    add_column :campgrounds, :electric_hookup, :boolean, default: false
  end
end
