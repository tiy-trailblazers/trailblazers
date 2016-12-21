class AddSourceToCampgrounds < ActiveRecord::Migration[5.0]
  def change
    add_column :campgrounds, :source, :text
  end
end
