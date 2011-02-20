class TransportMode < ActiveRecord::Base
  has_many :events, :dependent => :nullify
end
