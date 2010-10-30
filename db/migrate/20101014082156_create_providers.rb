class CreateProviders < ActiveRecord::Migration
  def self.up
    create_table :providers do |t|
      t.string :name
      t.string :code
      t.string :consumer_token
      t.string :consumer_secret
    end
  end

  def self.down
    drop_table :providers
  end
end
