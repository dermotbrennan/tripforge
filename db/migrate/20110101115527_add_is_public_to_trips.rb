class AddIsPublicToTrips < ActiveRecord::Migration
  def self.up
    add_column :trips, :is_public, :boolean

    add_index :trips, :is_public, :null => false, :default => false
  end

  def self.down
    remove_column :trips, :is_public
  end
end
