class CreateCampsites < ActiveRecord::Migration[5.0]
  def change
    create_table :campsites do |t|
      t.decimal :latitude
      t.decimal :longitude
      t.string :name
      t.integer :park_id
      t.text :description
      t.string :url

      t.timestamps
    end
  end
end
