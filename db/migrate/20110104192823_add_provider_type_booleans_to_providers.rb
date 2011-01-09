class AddProviderTypeBooleansToProviders < ActiveRecord::Migration
  def self.up
    add_column :providers, :has_auth, :boolean, :default => false, :null => false
    add_column :providers, :has_photos, :boolean, :default => false, :null => false

    add_index :providers, :has_auth
    add_index :providers, :has_photos
  end

  def self.down
    remove_column :providers, :has_auth
    remove_column :providers, :has_photos
  end
end
