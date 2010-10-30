class TripsController < ApplicationController
  def new
    @trip = Trip.new
  end

  def index
    @trips = Trip.all
  end

  def edit
    @trip = Trip.find(params[:id])
  end

  def update
    @trip = Trip.find(params[:id])
    @trip.update_attributes(params[:trip])
    if @trip.save
      redirect_to @trip
    else
      render :action => :new
    end
  end

  def create
    @trip = Trip.new(params[:trip])
    if @trip.save
      redirect_to @trip
    else
      render :action => :new
    end
  end

  def show
    @trip = Trip.find(params[:id])
  end

  def play
    @trip = Trip.find(params[:id])
  end
end