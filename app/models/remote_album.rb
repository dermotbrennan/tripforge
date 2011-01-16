class RemoteAlbum
  cattr_accessor :provider, :client, :user, :albums, :access_token
  attr_accessor :id, :title, :thumbnail_url, :num_photos, :photos
  
  class << self
    def subclass_for(provider, user)
      album_class = "#{provider.code}_remote_album".classify.constantize
      album_class.user = user
      album_class.provider = provider
      return album_class
    end
  end
end