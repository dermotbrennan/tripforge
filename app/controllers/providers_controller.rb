class ProvidersController < ApplicationController
  before_filter :find_provider, :only => [:connect, :connect_callback, :album, :albums]

  def connect
    connect_action = :"connect_#{@provider_code}"
    if self.respond_to?(connect_action, include_private=true)
      self.send(connect_action)
    else
      Rails.logger.error("Connection action for provider not found")
      redirect_to :root
    end
  end

  def connect_callback
    connect_callback_action = :"connect_callback_#{@provider_code}"
    if self.respond_to?(connect_callback_action, include_private=true)
      if self.send(connect_callback_action)
        render :layout => false
      else
        render(:template => 'providers/could_not_authorize')
      end
    else
      redirect_to :root
    end
  end

  def albums
    raise "no provider" unless @provider = Provider.find_by_code(params[:id])
    @albums = RemoteAlbum.subclass_for(@provider, current_user).all
    render :layout => false
  end

  def album
    raise "no provider" unless @provider = Provider.find_by_code(params[:id])
    raise "no album id" unless album_id = params[:album_id]
    @album = RemoteAlbum.subclass_for(@provider, current_user).find(album_id)
    render :layout => false
  end

  private
  def connect_facebook
    client = OAuth2::Client.new(FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, :site => 'https://graph.facebook.com')
    next_url = url_for(:action => "connect_callback", :id => @provider, :only_path => false)

    redirect_to client.web_server.authorize_url(
        :redirect_uri => next_url,
        :scope => 'email,offline_access,user_photos,user_videos,publish_stream'
      )
  end

  def connect_callback_facebook
    begin
      client = OAuth2::Client.new(FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, :site => 'https://graph.facebook.com')
      next_url = url_for(:action => "connect_callback", :id => @provider, :only_path => false)
      access_token = client.web_server.get_access_token(params[:code], :redirect_uri => next_url)
      #user = JSON.parse(access_token.get('/me'))
      unless (credential = current_user.credential_for(@provider))
        credential = current_user.credentials.build(:provider_id => @provider.id, :access_token => access_token.token)
        credential.save
      else
        credential.update_attribute(:access_token, access_token)
      end
    rescue
      logger.debug $!
      return false
    end
  end

  def connect_picasa_web
    client = GData::Client::Photos.new
    next_url = url_for(:action => "connect_callback", :id => @provider, :only_path => false)
    Rails.logger.debug next_url
    secure = false  # set secure = true for signed AuthSub requests
    sess = true
    authsub_link = client.authsub_url(next_url, secure, sess)
    redirect_to authsub_link
  end

  def connect_callback_picasa_web
    begin
      client = GData::Client::Photos.new
      client.authsub_token = params.delete(:token)

      access_token = client.auth_handler.upgrade()
      unless (credential = current_user.credential_for(@provider))
        credential = current_user.credentials.build(:provider_id => @provider.id, :access_token => access_token)
        credential.save
      else
        credential.update_attribute(:access_token, access_token)
      end
    rescue GData::Client::AuthorizationError
      return false
    end
  end


end