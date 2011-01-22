class FacebookRemoteThumbnail < RemoteThumbnail
  def initialize(attributes)
    @url = attributes['source']
    @width = attributes['width'].to_i
    @height = attributes['height'].to_i
  end
end