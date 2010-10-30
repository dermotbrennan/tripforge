class EventsController < ApplicationController
  def new
    trip = Trip.find(params[:trip_id])
    @event = Event.new(:trip => trip, :started_at => Time.now)
  end

  def edit
    @event = Event.find(params[:id])
  end

  def update
    @event = Event.find(params[:id])
    @event.attributes = params[:event]
    if @event.save
      redirect_to trip_path(@event.trip), :success => "Event updated successfully"
    else
      render :action => :edit
    end
  end

  def index
    @events = Event.all
  end

  def create
    @event = Event.new(params[:event])
    if @event.save
      redirect_to trip_scene_path(@event, :trip => @event.trip.id), :success => "Event created successfully"
    else
      render :action => :new
    end
  end

  def show
    @event = Event.find(params[:id])
  end

  def destroy
    @event = Event.find(params[:id])
    redirect_to @event.trip, :success => "Event deleted"
    @event.destroy
  end
end
