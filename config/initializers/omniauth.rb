require 'openid/store/filesystem'

TWITTER_APP_ID = 'dIujBU2uKd9YOWqivLO0g'
TWITTER_APP_SECRET = 'azYT8fsFbciTqSnjDsR05CjTvIdvdi2DUqe1AwI0s'
FACEBOOK_APP_ID = '116648498404012'
FACEBOOK_APP_SECRET = '87cab6ae92cd735d1357428ea974e857'
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, TWITTER_APP_ID, TWITTER_APP_SECRET
  provider :facebook, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET
  provider :google_apps, OpenID::Store::Filesystem.new('/tmp')
  provider :open_id, OpenID::Store::Filesystem.new('/tmp')
end
