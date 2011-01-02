class AddFirstNameLastNameToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :first_name, :string, :null => true
    add_column :users, :last_name, :string, :null => true
  end

  def self.down
    remove_column :users, :last_name
    remove_column :users, :first_name
  end
end
