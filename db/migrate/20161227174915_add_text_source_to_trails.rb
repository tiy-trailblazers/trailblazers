class AddTextSourceToTrails < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :source, :text
  end
end
