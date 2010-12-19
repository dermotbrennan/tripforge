class AccountController < ApplicationController
  before_filter :require_user, :only => [:show, :edit, :update, :destroy]

  def index
    #redirect_to :controller => 'admin/cms'
  end

  def show
    #redirect_to :controller => 'admin/cms'
  end

  def new
    @user = User.new
  end

  def create
    current_user_session.try(:destroy)
    @user = User.new(params[:user])
    if @user.save
      flash[:success] = 'Account registered!'
      redirect_back_or_default trips_path; return
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
      redirect_to trips_path; return
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
end
