class ChangeSrcToJson < ActiveRecord::Migration[5.0]
  def change
    remove_column :trails, :source
  end
end
