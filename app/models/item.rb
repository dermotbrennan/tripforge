class Item < ActiveRecord::Base
  belongs_to :event
  validates :source_id, :uniqueness => {:scope => [:provider_id, :event_id]}, :allow_nil => true

  attr_accessor :album_id
end
