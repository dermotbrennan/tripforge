class EventsController < ApplicationController
  def new
    trip = Trip.find(params[:trip_id])
    time = trip.events.last.try(:ended_at) || Time.now
    @event = Event.new(:trip => trip, :started_at => time, :ended_at => time)
  end

  def edit
    @event = Event.find(params[:id])
  end

  def update
    @event = Event.find(params[:id])
    @event.attributes = params[:event]
    if @event.save
      if request.xhr?
        render :partial => 'events/summary', :locals => {:event => @event}
      else
        redirect_to trip_path(@event.trip), :success => "Event updated successfully"
      end
    else
      if request.xhr?
        render :text => "Uh oh! Saving failed! Please try again!", :status => :bad_request
      else
        render :action => :edit
      end
    end
  end

  def reorder
    @event = Event.find(params[:id])
    if @event.reorder(params[:previous_event_id], params[:next_event_id])
      if request.xhr?
        render :partial => 'events/event', :locals => {:event => @event}
      else
        redirect_to(@event)
      end
    else
      request.xhr? ? head(:bad_request) : render(:action => :new)
    end
  end

  def index
    @events = Event.all
  end

  def create
    @event = Event.new(params[:event])
    if @event.save
      if request.xhr?
        render :partial => 'events/event', :locals => {:event => @event}
      else
        redirect_to trip_path(@event.trip), :success => "Event created successfully"
      end
    else
      request.xhr? ? head(:bad_request) : render(:action => :new)
    end
  end

  def show
    @event = Event.find(params[:id])
  end

  def destroy
    @event = Event.find(params[:id])
    @trip = @event.trip
    if @event.destroy
      request.xhr? ? head(:ok) : redirect_to(@trip, :success => "Event deleted")
    else
      request.xhr? ? head(:bad_request) : redirect_to(@trip, :success => "Event not deleted")
    end
  end
end
