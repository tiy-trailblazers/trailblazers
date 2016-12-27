class AddLineStringToTrails < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :path, :line_string, srid: 3785
  end
end
