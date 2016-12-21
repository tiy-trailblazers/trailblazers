class CreateCampgrounds < ActiveRecord::Migration[5.0]
  def change
    create_table :campgrounds do |t|
      t.string :name
      t.string :campground_type
      t.string :drinking_water
      t.string :waste
      t.string :toilets
      t.integer :num_sites
      t.string :directions
      t.decimal :latitude
      t.decimal :longitude

      t.timestamps
    end
  end
end
