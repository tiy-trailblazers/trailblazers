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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161221181622) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "campgrounds", force: :cascade do |t|
    t.string   "name"
    t.string   "campground_type"
    t.string   "drinking_water"
    t.string   "waste"
    t.string   "toilets"
    t.integer  "num_sites"
    t.string   "directions"
    t.float    "latitude"
    t.float    "longitude"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.text     "source"
  end

  create_table "campsites", force: :cascade do |t|
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.string   "name"
    t.integer  "park_id"
    t.text     "description"
    t.string   "url"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "nodes", force: :cascade do |t|
    t.integer  "trail_id"
    t.decimal  "lat"
    t.decimal  "lon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "parks", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "trails", force: :cascade do |t|
    t.float    "length"
    t.decimal  "start_lat"
    t.decimal  "start_lon"
    t.string   "park"
    t.string   "state"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "name"
    t.string   "url"
    t.text     "description"
    t.json     "source"
    t.integer  "park_id"
    t.integer  "elevation_gain_in_feet"
    t.string   "difficulty"
    t.boolean  "camping"
    t.boolean  "loop"
    t.string   "map_pdf"
  end

  create_table "trails_trips", id: false, force: :cascade do |t|
    t.integer "trip_id"
    t.integer "trail_id"
  end

  create_table "trips", force: :cascade do |t|
    t.date     "start_date"
    t.date     "end_date"
    t.string   "trip_type"
    t.string   "camping_type"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "trips_users", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "trip_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "password_digest"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

end
