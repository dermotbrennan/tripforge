class ProvidersController < ApplicationController
  before_filter :find_provider, :only => [:connect, :connect_callback]

  def connect
    connect_action = :"connect_#{@provider_code}"
    if self.respond_to?(connect_action, include_private=true)
      self.send(connect_action)
    else
      redirect_to :root
    end
  end

  def connect_callback
    connect_callback_action = :"connect_callback_#{@provider_code}"
    if self.respond_to?(connect_callback_action, include_private=true)
      if self.send(connect_callback_action)
        redirect_to import_from_provider_story_scene_items_path(@provider)
      else
        render(:template => 'providers/could_not_authorize')
      end
    else
      redirect_to :root
    end
  end

  private
  def connect_picasaweb
    client = GData::Client::Photos.new
    next_url = url_for(:action => "connect_callback", :id => @provider, :only_path => false)
    Rails.logger.debug next_url
    secure = false  # set secure = true for signed AuthSub requests
    sess = true
    authsub_link = client.authsub_url(next_url, secure, sess)
    redirect_to authsub_link
  end

  def connect_callback_picasaweb
    begin
      client = GData::Client::Photos.new
      client.authsub_token = params[:token]

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