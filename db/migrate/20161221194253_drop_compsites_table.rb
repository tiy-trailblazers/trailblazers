class DropCompsitesTable < ActiveRecord::Migration[5.0]
  def change
    drop_table :campsites
  end
end
