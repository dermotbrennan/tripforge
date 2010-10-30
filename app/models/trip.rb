class Trip < ActiveRecord::Base
  belongs_to :user
  has_many :events

  validates :name, :presence => true
  validates :description, :presence => true
end
