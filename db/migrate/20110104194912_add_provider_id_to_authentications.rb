class AddProviderIdToAuthentications < ActiveRecord::Migration
  def self.up
    add_column :authentications, :provider_id, :integer
    remove_column :authentications, :provider

    add_index :authentications, :provider_id
  end

  def self.down
    remove_column :authentications, :provider_id
    add_column :authentications, :provider
  end
end
