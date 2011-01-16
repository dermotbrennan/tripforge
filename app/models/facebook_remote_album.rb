class FacebookRemoteAlbum < RemoteAlbum
  def initialize(album_data)
    @id = album_data["id"]
    @thumbnail_url = "https://graph.facebook.com/#{@id}/picture?access_token=#{@@access_token}"
    @title = album_data['name']
    @num_photos = album_data['count']
  end

  def photos
    unless @photos
      @photos = self.class.client.get("/#{@id}/photos")['data']
      @photos = @photos.collect { |photo_data| FacebookRemotePhoto.new(photo_data) }
    end
    return @photos
  end

  class << self
    def all
      unless @@albums
        @@albums = client.get("/me/albums")["data"]
        @@albums = @@albums.collect{ |album_data| new(album_data) }
      end
      return @@albums
    end

    def find(album_id)
      album_data = client.get("/#{album_id}")
      return new(album_data)
    end

    def client
      unless @@client
        client_obj = OAuth2::Client.new(FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, :site => 'https://graph.facebook.com', :parse_json => true)
        @@access_token = @@user.credential_for(provider).access_token
        @@client = OAuth2::AccessToken.new(client_obj, @@access_token)
      end
      return @@client
    end
  end
end