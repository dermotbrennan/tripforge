class ItemsController < ApplicationController
  before_filter :authenticate_user!
  
  def new
    @event = Event.find(params[:event_id])
    @item = Item.new(:event => @event)
  end

  def index
    @items = Item.all
  end

  def create
    @item = Item.new(params[:item])
    if @item.save
      redirect_to event_item_path(@item, :event_id => @item.event.id), :success => "Item created successfully"
    else
      render :action => :new
    end
  end

  def show
    @item = Item.find(params[:id])
  end

  def destroy
    @item = Item.find(params[:id])
    redirect_to @item.story, :success => "Item deleted"
    @item.destroy
  end
end