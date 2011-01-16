class AddProviderIdToItems < ActiveRecord::Migration
  def self.up
    add_column :items, :provider_id, :integer, :default => 0, :null => false
    add_index :items, :provider_id

    remove_column :items, :source
  end

  def self.down
    remove_column :items, :provider_id
  end
end
