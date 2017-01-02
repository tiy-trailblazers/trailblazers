class CreateTrailsIntersectionsTable < ActiveRecord::Migration[5.0]
  def change
    create_join_table :trails, :trails, table_name: :intersections do |t|
      t.integer :trail_id
      t.integer :intersection_id
    end
  end
end
