class Provider < ActiveRecord::Base
  has_many :credentials

  def to_param
    self.code
  end
end
