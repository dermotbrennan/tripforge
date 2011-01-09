class CreateCredentials < ActiveRecord::Migration
  def self.up
    create_table :credentials do |t|
      t.integer :provider_id
      t.integer :user_id
      t.string :access_token
      t.string :access_secret

      t.timestamps
    end

    add_index :credentials, :provider_id
    add_index :credentials, :user_id
  end

  def self.down
    drop_table :credentials
  end
end
