class ItemsController < ApplicationController
  before_filter :authenticate_user!
  
  def create
    type = params[:item].delete(:type) if params[:item] && params[:item][:type]
    @item = Item.new(params[:item])
    @item.type = type
    authorize! :create, @item
    if @item.save
      if request.xhr?
        if @item.type == 'Photo'
          photo = Photo.find(@item.id)
          render :partial => 'items/mini_item', :locals => {:mini_item => photo}
        end
      else
        redirect_to item_path(@item), :success => "Item created successfully"
      end
    else
      if request.xhr?
        head :bad_request
      else
        render :action => :new
      end
    end
  end

  def destroy
    @item = Item.find(params[:id])
    authorize! :destroy, @item
    if @item.destroy
      if request.xhr?
        head :ok
      else
        redirect_to @item.event.trip, :success => "Item deleted"
      end
    else
      if request.xhr?
        head :bad_request
      end
    end
  end
end