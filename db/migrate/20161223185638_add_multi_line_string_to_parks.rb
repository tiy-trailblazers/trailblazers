class AddMultiLineStringToParks < ActiveRecord::Migration[5.0]
  def change
    add_column :parks, :multi_line_boundary, :multi_line_string, geographic: true
  end
end
