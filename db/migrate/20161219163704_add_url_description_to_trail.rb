class AddUrlDescriptionToTrail < ActiveRecord::Migration[5.0]
  def change
    add_column :trails, :url, :string
    add_column :trails, :description, :text
  end
end
