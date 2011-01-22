class PicasaWebRemoteAlbum < RemoteAlbum
  def initialize(album_data)
    @album_data = album_data
    @id = album_data.elements['gphoto:id'].text

    # the position of the thumbnail url depends on whether this
    # data from from a feed of a list of albums or just one album
    @thumbnail_url = 
      if album_data.elements['media:group/media:thumbnail']
        album_data.elements['media:group/media:thumbnail'].attribute('url').value
      else
        album_data.elements['icon'].text
      end

    @title = album_data.elements['title'].text
    @num_photos = album_data.elements['gphoto:numphotos'].text
  end

  def photos
    unless @photos
      @photos = @album_data.elements.to_a('entry').collect { |photo_data| PicasaWebRemotePhoto.new(photo_data) }
    end
    return @photos
  end

  class << self
    def all
      unless @albums
        feed = client.get('http://picasaweb.google.com/data/feed/api/user/default').to_xml
        #logger.debug feed.to_s.inspect
        @albums = feed.elements.to_a("entry")
        @albums = @albums.collect{ |album_data| new(album_data) }
      end
      return @albums
    end

    def find(album_id)
      feed = client.get("http://picasaweb.google.com/data/feed/api/user/default/albumid/#{album_id}").to_xml

      album = new(feed)
      return album
    end
    
    def client
      unless @client
        #logger.debug @provider
        @client = GData::Client::Photos.new
        @client.authsub_token = @@user.credential_for(self.provider).access_token
      end
      return @client
    end
  end
end