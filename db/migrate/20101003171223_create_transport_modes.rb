class CreateTransportModes < ActiveRecord::Migration
  def self.up
    create_table :transport_modes do |t|
      t.string :name
    end

    add_index :transport_modes, :name
  end

  def self.down
    drop_table :transport_modes
  end
end
