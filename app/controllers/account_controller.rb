class AccountController < ApplicationController
  before_filter :require_user, :only => [:show, :edit, :update, :destroy]

  def index
    #redirect_to :controller => 'admin/cms'
  end

  def show
    #redirect_to :controller => 'admin/cms'
  end

  def new
    require_admin_signups
    @user = User.new
  end

  def create
    require_admin_signups
    current_user_session.try(:destroy)
    @user = User.new(params[:user])
    if @user.save
      flash[:success] = 'Account registered!'
      redirect_back_or_default account_path; return
    else
      render :action => :new; return
    end
  end

  def edit
    @user = @current_user
  end

  def update
    @user = @current_user # makes our views 'cleaner' and more consistent
    if @user.update_attributes(params[:user])
      flash[:success] = 'Your account has been updated'
      redirect_to account_path; return
    else
      render :action => :edit; return
    end
  end

  def destroy
    @user = @current_user
    @user.destroy
    
    flash[:notice] = 'Your account has been deleted!'
    redirect_to :root; return
  end

private
  def require_admin_signups
    if !is_admin? && User.count > 0
      flash[:notice] = 'You must be logged in as an admin for signups'
      redirect_to login_path; return
    end
  end

end
