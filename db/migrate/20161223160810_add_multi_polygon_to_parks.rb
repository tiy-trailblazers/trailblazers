class AddMultiPolygonToParks < ActiveRecord::Migration[5.0]
  def change
    add_column :parks, :boundary, :multi_polygon
  end
end
