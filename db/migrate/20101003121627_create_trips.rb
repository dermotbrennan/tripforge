class CreateTrips < ActiveRecord::Migration
  def self.up
    create_table :trips do |t|
      t.integer :user_id
      t.string :name
      t.text :description

      t.timestamps
    end

    add_index :trips, :user_id
    add_index :trips, :name
    add_index :trips, :updated_at
    add_index :trips, :created_at
  end

  def self.down
    drop_table :trips
  end
end
