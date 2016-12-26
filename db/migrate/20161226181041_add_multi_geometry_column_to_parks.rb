class AddMultiGeometryColumnToParks < ActiveRecord::Migration[5.0]
  def change
    add_column :parks, :boundary, :geometry_collection
  end
end
