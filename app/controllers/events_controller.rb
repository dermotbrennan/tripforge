class EventsController < ApplicationController
  respond_to :html, :json
  before_filter :authenticate_user!

  def update
    @event = Event.find(params[:id])
    authorize! :update, @event
    @event.attributes = params[:event]
    if @event.save
      if request.xhr?
        respond_with(@event) do |format|
          format.json { render :json => {'success' => true} }
          format.html { render :partial => 'events/summary', :locals => {:event => @event}}
        end
      else
        redirect_to trip_path(@event.trip), :success => "Event updated successfully"
      end
    else
      if request.xhr?
        Rails.logger.error @event.errors.inspect
        render :text => "Uh oh! Saving failed! Please try again!", :status => :bad_request
      else
        render :action => :edit
      end
    end
  end

  def reorder
    @event = Event.find(params[:id])
    authorize! :update, @event
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

  def create
    @event = Event.new(params[:event])
    authorize! :create, @event
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

  def destroy
    @event = Event.find(params[:id])
    authorize! :destroy, @event
    @trip = @event.trip
    if @event.destroy
      request.xhr? ? head(:ok) : redirect_to(@trip, :success => "Event deleted")
    else
      request.xhr? ? head(:bad_request) : redirect_to(@trip, :success => "Event not deleted")
    end
  end
end
