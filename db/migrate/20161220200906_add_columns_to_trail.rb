class AddColumnsToTrail < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :source, :json
    add_column :trails, :park_id, :integer
    add_column :trails, :elevation_gain_in_feet, :integer
    add_column :trails, :difficulty, :string
    add_column :trails, :camping, :boolean
    add_column :trails, :loop, :boolean
    add_column :trails, :map_pdf, :string
  end
end
