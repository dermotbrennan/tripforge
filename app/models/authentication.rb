class Authentication < ActiveRecord::Base
  belongs_to :user
  belongs_to :provider
end
