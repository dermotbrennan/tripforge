class Provider < ActiveRecord::Base
  has_many :credentials, :dependent => :destroy

  scope :with_auth, where(:has_auth => true)
  scope :with_photos, where(:has_photos => true)

  def to_param
    self.code
  end
end
