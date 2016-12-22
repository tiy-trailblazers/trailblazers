class AddStateStringToCampgrounds < ActiveRecord::Migration[5.0]
  def change
    add_column :campgrounds, :state, :string
  end
end
