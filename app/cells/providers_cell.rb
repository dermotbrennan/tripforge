class ProvidersCell < Cell::Rails
  include Devise::Controllers::Helpers
  helper_method :current_user

  def list
    if (@authentications = @opts[:only_authentications]).present?
      @providers = @authentications.collect(&:provider).compact
    else
      @providers = @opts[:photos].present? ? Provider.with_photos : Provider.with_auths
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
    render :view => "#{@provider.code}/albums"
  end

  def album
    raise "no provider" unless @provider = @opts[:provider]
    raise "no album id" unless album_id = @opts[:album_id]
    send(@provider.code+"_album", album_id)
    render :view => "#{@provider.code}/album"
  end

  private
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
    @albums = feed.elements
  end

  def picasa_web_album(album_id)
    client = picasa_web_client
    logger.debug "http://picasaweb.google.com/data/feed/api/user/default/albumid/#{album_id}"
    feed = client.get("http://picasaweb.google.com/data/feed/api/user/default/albumid/#{album_id}").to_xml
    #logger.debug feed.to_s.inspect
    @album_title = feed.elements['title'].text
    @photos = feed.elements
#    if request.post? && params[:gphoto_ids] && !params[:gphoto_ids].empty?
#      @imported_gphoto_ids = Photo.from_gphoto_feed(@photos, @event, params[:gphoto_ids])
#    end
  end

end
