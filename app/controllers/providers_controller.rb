class ProvidersController < ApplicationController
  before_filter :find_provider, :only => [:connect, :connect_callback, :album]

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

  def album
    @album_id = params[:album_id]
    render :layout => false
  end

  private
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