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
    @albums = RemoteAlbum.subclass_for(@provider, current_user).all
    render
  end

  def album
    raise "no provider" unless @provider = @opts[:provider]
    raise "no album id" unless album_id = @opts[:album_id]
    @album = RemoteAlbum.subclass_for(@provider, current_user).find(album_id)
    render
  end

end
