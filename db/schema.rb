# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110104194912) do

  create_table "authentications", :force => true do |t|
    t.integer  "user_id"
    t.string   "uid"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "access_token"
    t.integer  "provider_id"
  end

  add_index "authentications", ["provider_id"], :name => "index_authentications_on_provider_id"
  add_index "authentications", ["uid"], :name => "index_authentications_on_uid"
  add_index "authentications", ["user_id"], :name => "index_authentications_on_user_id"

  create_table "credentials", :force => true do |t|
    t.integer  "provider_id"
    t.integer  "user_id"
    t.string   "access_token"
    t.string   "access_secret"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "credentials", ["provider_id"], :name => "index_credentials_on_provider_id"
  add_index "credentials", ["user_id"], :name => "index_credentials_on_user_id"

  create_table "events", :force => true do |t|
    t.integer  "trip_id"
    t.string   "event_type"
    t.string   "name"
    t.text     "description"
    t.integer  "transport_mode_id"
    t.decimal  "longitude"
    t.decimal  "latitude"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.integer  "rating"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "histories", :force => true do |t|
    t.string   "message"
    t.string   "username"
    t.integer  "item"
    t.string   "table"
    t.integer  "month",      :limit => 2
    t.integer  "year",       :limit => 5
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "histories", ["item", "table", "month", "year"], :name => "index_histories_on_item_and_table_and_month_and_year"

  create_table "items", :force => true do |t|
    t.integer  "event_id",          :null => false
    t.string   "type"
    t.string   "author"
    t.string   "title"
    t.text     "content"
    t.integer  "rating"
    t.decimal  "longitude"
    t.decimal  "latitude"
    t.string   "device"
    t.string   "source"
    t.string   "source_id"
    t.string   "source_url"
    t.datetime "source_created_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "items", ["created_at"], :name => "index_items_on_created_at"
  add_index "items", ["event_id"], :name => "index_items_on_event_id"
  add_index "items", ["rating"], :name => "index_items_on_rating"
  add_index "items", ["source"], :name => "index_items_on_source"
  add_index "items", ["source_created_at"], :name => "index_items_on_source_created_at"
  add_index "items", ["source_id"], :name => "index_items_on_source_id"
  add_index "items", ["type"], :name => "index_items_on_type"

  create_table "photo_urls", :force => true do |t|
    t.integer  "photo_id",   :null => false
    t.string   "url",        :null => false
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "photo_urls", ["height"], :name => "index_photo_urls_on_height"
  add_index "photo_urls", ["photo_id"], :name => "index_photo_urls_on_photo_id"
  add_index "photo_urls", ["width"], :name => "index_photo_urls_on_width"

  create_table "providers", :force => true do |t|
    t.string  "name"
    t.string  "code"
    t.string  "consumer_token"
    t.string  "consumer_secret"
    t.boolean "has_auth",        :default => false, :null => false
    t.boolean "has_photos",      :default => false, :null => false
  end

  add_index "providers", ["has_auth"], :name => "index_providers_on_has_auth"
  add_index "providers", ["has_photos"], :name => "index_providers_on_has_photos"

  create_table "transport_modes", :force => true do |t|
    t.string "name"
  end

  add_index "transport_modes", ["name"], :name => "index_transport_modes_on_name"

  create_table "trips", :force => true do |t|
    t.integer  "user_id"
    t.string   "name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_public"
  end

  add_index "trips", ["created_at"], :name => "index_trips_on_created_at"
  add_index "trips", ["is_public"], :name => "index_trips_on_is_public"
  add_index "trips", ["name"], :name => "index_trips_on_name"
  add_index "trips", ["updated_at"], :name => "index_trips_on_updated_at"
  add_index "trips", ["user_id"], :name => "index_trips_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "email",                               :default => "",     :null => false
    t.string   "encrypted_password",   :limit => 128, :default => "",     :null => false
    t.string   "password_salt",                       :default => "",     :null => false
    t.string   "reset_password_token"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "role",                                :default => "user", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "first_name"
    t.string   "last_name"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["role"], :name => "index_users_on_role"

end
