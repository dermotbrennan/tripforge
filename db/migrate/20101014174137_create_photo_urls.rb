class CreatePhotoUrls < ActiveRecord::Migration
  def self.up
    create_table :photo_urls do |t|
      t.integer :photo_id, :null => false
      t.string :url, :null => false
      t.integer :width
      t.integer :height

      t.timestamps
    end

    add_index :photo_urls, :photo_id
    add_index :photo_urls, :width
    add_index :photo_urls, :height
  end

  def self.down
    drop_table :photo_urls
  end
end
