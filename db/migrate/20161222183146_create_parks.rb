class CreateParks < ActiveRecord::Migration[5.0]
  def change
    create_table :parks do |t|
      t.string   "name"
      t.text     "description"
      t.decimal  "latitude"
      t.decimal  "longitude"
      t.string   "states"
      t.string   "nps_id"
      t.text     "directions"
      t.string   "url"
      t.text     "weather_info"
      t.string   "park_code"
      t.timestamps
    end
  end
end
