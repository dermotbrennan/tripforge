class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.integer :event_id, :null => false
      t.string :type
      t.string :author
      t.string :title
      t.text :content
      t.integer :rating
      t.decimal :longitude
      t.decimal :latitude
      t.string :device
      t.string :source
      t.string :source_id
      t.string :source_url
      t.datetime :source_created_at
      t.timestamps
    end

    [:event_id, :type, :source_id, :source, :source_created_at, :rating, :created_at].each do |col|
      add_index :items, col
    end
  end

  def self.down
    drop_table :items
  end
end
