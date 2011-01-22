class FacebookRemotePhoto < RemotePhoto
  def initialize(photo)
    #Rails.logger.debug photo.inspect
    @id = photo['id']
    @title = photo['name']
    @source_url = photo['source']
    @source_created_at = photo['created_time']
    smallest_thumbnail = nil
    @thumbnails = photo['images'].collect do |image|
      t = FacebookRemoteThumbnail.new(image)
      smallest_thumbnail = t if smallest_thumbnail.nil? || t.width < smallest_thumbnail.width
      t
    end
    #Rails.logger.debug @thumbnails.inspect
    if smallest_thumbnail
      @thumbnail_url = smallest_thumbnail.url
    end
  end
end