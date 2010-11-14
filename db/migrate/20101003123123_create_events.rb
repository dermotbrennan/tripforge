class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table :events do |t|
      t.integer :trip_id
      t.string :event_type
      t.string :name
      t.text :description
      t.string :location
      t.integer :previous_event_id
      t.integer :next_event_id
      t.integer :transport_mode_id
      t.decimal :longitude
      t.decimal :latitude
      t.datetime :started_at
      t.datetime :ended_at
      t.integer :rating

      t.timestamps
    end

    [:trip_id, :event_type, :name, :started_at, :ended_at, :rating].each do |col|
      add_index :events, col
    end
  end

  def self.down
    drop_table :events
  end
end
