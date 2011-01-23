class TripsController < ApplicationController
  before_filter :authenticate_user!
  load_and_authorize_resource :only => [:index]
  
  def new
    @trip = Trip.new
  end

  def index
  end

  def edit
    @trip = Trip.find(params[:id])
    authorize! :update, @trip
  end

  def update
    @trip = Trip.find(params[:id])
    authorize! :update, @trip
    @trip.update_attributes(params[:trip])
    @trip.user = current_user unless current_user.is_admin?
    if @trip.save
      redirect_to @trip
    else
      render :action => :new
    end
  end

  def create
    @trip = Trip.new(params[:trip])
    @trip.user = current_user
    if @trip.save
      redirect_to @trip
    else
      render :action => :new
    end
  end

  def show
    @trip = Trip.find(params[:id])
    authorize! :show, @trip
    @providers = Provider.with_photos
    @providers = @providers.partition { |p| current_user.has_credential_for?(p) }.flatten
    @selected_provider = @providers.first
  end

  def play
    @trip = Trip.find(params[:id])
    authorize! :show, @trip
  end

  def destroy
    @trip = Trip.find(params[:id])
    authorize! :destroy, @trip
    @trip.destroy
    redirect_to :trips, :notice => "Trip '#{@trip.name}' deleted"
  end
end
