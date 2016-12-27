class AddParkIdToTrail < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :park_id, :integer
  end
end
