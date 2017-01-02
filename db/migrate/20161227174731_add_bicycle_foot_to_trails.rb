class AddBicycleFootToTrails < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :bicycle, :boolean
    add_column :trails, :foot, :boolean
  end
end
