class PicasaWebRemotePhoto < RemotePhoto
  def initialize(photo)
    @id = photo.elements['gphoto:id'].text
    @title = photo.elements['title'].text
    @source_url = photo.elements['content'].attribute('src').value
    @source_created_at = Time.at(photo.elements['gphoto:timestamp'].text.to_i/1000)
    @thumbnail_url = photo.elements['media:group/media:thumbnail'].attribute('url').value
  end
end