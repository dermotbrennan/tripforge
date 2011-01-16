class FacebookRemotePhoto < RemotePhoto
  def initialize(photo)
    @id = photo['id']
    @title = photo['name']
    @source_url = photo['source']
    @source_created_at = photo['created_time']
    thumbnail = photo['images'].find { |image| image['width'] == 75 }
    @thumbnail_url = thumbnail['source']
  end
end