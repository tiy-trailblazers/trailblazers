class AddBooleanShowersToCampgrounds < ActiveRecord::Migration[5.0]
  def change
    add_column :campgrounds, :showers, :boolean, default: false
  end
end
