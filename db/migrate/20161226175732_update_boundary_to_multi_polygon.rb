class UpdateBoundaryToMultiPolygon < ActiveRecord::Migration[5.0]
  def change
    remove_column :parks, :boundary
  end
end
