require 'openid/store/filesystem'

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, 'dIujBU2uKd9YOWqivLO0g', 'azYT8fsFbciTqSnjDsR05CjTvIdvdi2DUqe1AwI0s'
  provider :facebook, '116648498404012', '87cab6ae92cd735d1357428ea974e857'
  provider :google_apps, OpenID::Store::Filesystem.new('/tmp')
  provider :open_id, OpenID::Store::Filesystem.new('/tmp')
end
