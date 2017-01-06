class AddNameToTrips < ActiveRecord::Migration[5.0]
  def change
    add_column :trips, :name, :string
  end
end
