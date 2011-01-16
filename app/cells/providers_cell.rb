class ProvidersCell < Cell::Rails
  include Devise::Controllers::Helpers
  helper_method :current_user

  def list
    if (@authentications = @opts[:only_authentications]).present?
      @providers = @authentications.collect(&:provider).compact
    else
      @providers = @opts[:photos].present? ? Provider.with_photos : Provider.with_auth
      if (@authentications = @opts[:except_authentications]).present?
        @providers -= @authentications.collect(&:provider).compact
      end
    end
    @image_size = 64
    render
  end

  def albums
    raise "no provider" unless @provider = @opts[:provider]
    send(@provider.code+"_albums")
    render
  end

  def album
    raise "no provider" unless @provider = @opts[:provider]
    raise "no album id" unless album_id = @opts[:album_id]
    send(@provider.code+"_album", album_id)
    render :view => "#{@provider.code}/album"
  end

  private
  def facebook_client
    client_obj = OAuth2::Client.new(FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, :site => 'https://graph.facebook.com', :parse_json => true)
    @access_token = current_user.credential_for(@provider).access_token
    client = OAuth2::AccessToken.new(client_obj, @access_token)
    return client
  end

  def facebook_albums
    client = facebook_client
    @albums = client.get("/me/albums")["data"]
  end

  def facebook_album(album_id)
    client = facebook_client
    @album = client.get("/#{album_id}")
    @photos = client.get("/#{album_id}/photos")['data']
    @album_title = @album['name']
  end

  def picasa_web_client
    #logger.debug @provider
    client = GData::Client::Photos.new
    client.authsub_token = current_user.credential_for(@provider).access_token
    return client
  end

  def picasa_web_albums
    client = picasa_web_client
    feed = client.get('http://picasaweb.google.com/data/feed/api/user/default').to_xml
    #logger.debug feed.to_s.inspect
    @albums = feed.elements.to_a("entry")
  end

  def picasa_web_album(album_id)
    client = picasa_web_client
    #logger.debug "http://picasaweb.google.com/data/feed/api/user/default/albumid/#{album_id}"
    feed = client.get("http://picasaweb.google.com/data/feed/api/user/default/albumid/#{album_id}").to_xml
    #logger.debug feed.to_s.inspect
    @album_title = feed.elements['title'].text
    @photos = feed.elements.to_a('entry')
#    if request.post? && params[:gphoto_ids] && !params[:gphoto_ids].empty?
#      @imported_gphoto_ids = Photo.from_gphoto_feed(@photos, @event, params[:gphoto_ids])
#    end
  end

end
