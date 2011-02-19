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
end