class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, :alert => exception.message
  end

  private
  def find_provider
    return false unless @provider_code = params[:id]
    unless ( @provider = Provider.find_by_code(@provider_code))
      Rails.logger.error("No such provider with code: #{@provider_code}")
      redirect_to :root
    end
    @provider
  end
end
