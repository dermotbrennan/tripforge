class Item < ActiveRecord::Base
  belongs_to :event
  validates :source_id, :uniqueness => {:scope => :source}, :allow_nil => true
end
