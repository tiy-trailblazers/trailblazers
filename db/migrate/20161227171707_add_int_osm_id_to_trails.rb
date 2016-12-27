class AddIntOsmIdToTrails < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :osm_id, :integer
  end
end
