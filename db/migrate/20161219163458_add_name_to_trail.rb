class AddNameToTrail < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :name, :string
  end
end
