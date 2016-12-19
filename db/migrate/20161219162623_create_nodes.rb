class CreateNodes < ActiveRecord::Migration[5.0]
  def change
    create_table :nodes do |t|
      t.integer :trail_id
      t.decimal :lat
      t.decimal :lon

      t.timestamps
    end
  end
end
