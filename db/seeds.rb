# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

def truncate_table(model)
  model.connection.execute("DELETE FROM #{model.table_name}")
end

truncate_table(Provider)
[
  {:code => 'twitter', :name => "Twitter", :has_auth => true},
  {:code => 'facebook', :name => "Facebook", :has_auth => true, :has_photos => true},
  {:code => 'google_apps', :name => "Google", :has_auth => true},
  {:code => 'open_id', :name => "OpenID", :has_auth => true},
  {:code => 'picasa_web', :name => "Picasa Web Albums", :has_photos => true}
].each do |provider_data|
  Provider.create!(provider_data)
end

truncate_table(TransportMode)
["Walking", "Driving", "Airplane"].each do |provider_data|
  TransportMode.create!(name)
end