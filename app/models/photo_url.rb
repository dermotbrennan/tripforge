class PhotoUrl < ActiveRecord::Base
  validates :url, :presence => true, :uniqueness => {:scope => :photo_id}

  validates :width, :numericality => {:greater_than => 0}
  validates :height, :numericality => {:greater_than => 0}
end
