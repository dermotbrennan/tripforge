module AuthenticatedSystem
  
  def self.included(base)
    # make available as ActionView helper methods.
    base.send(:helper_method, :current_user_session, :current_user, :logged_in?, :is_admin?)
  end
  
private
  def logged_in?
    !!current_user
  end

  def is_admin?
    logged_in? && current_user.is_admin?
  end

  def is_superadmin?
    logged_in? && current_user.is_superadmin?
  end

  def current_user_session
    @current_user_session ||= UserSession.find
  end

  def current_user
    @current_user ||= current_user_session && current_user_session.user
  end

  def require_user
    return if logged_in?
    store_location
    flash[:notice] = 'You must be logged in to access this page'
    redirect_to login_url; return false
  end

  def require_no_user
    return unless logged_in?
    store_location
    flash[:notice] = 'You must be logged out to access this page'
    redirect_to account_url; return false
  end

  def require_admin
    return if is_admin?
    store_location
    flash[:notice] = 'You must be logged in as an admin to access this page'
    redirect_to (logged_in? ? account_url : login_url); return false
  end

  def require_superadmin
    return if is_superadmin?
    store_location
    flash[:notice] = 'You must be logged in as an superadmin to access this page'
    redirect_to (logged_in? ? account_url : login_url); return false
  end

  def store_location
    session[:return_to] = request.request_uri
  end

  def redirect_back_or_default(default)
    redirect_to(session[:return_to] || default)
    session[:return_to] = nil
  end
    
end
