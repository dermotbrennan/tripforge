class ItemsController < ApplicationController
  before_filter :require_user
  
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

  def import
    @event = Event.find(params[:event_id])
    
    if (@provider = find_provider) && current_user.has_credential_for?(@provider)
      import_action = "import_#{@provider_code}"
      if self.respond_to?(import_action, include_private = true)
        self.send(import_action)
      end
    else
      @providers = Provider.all
    end
  end

  private
  def import_picasaweb
    client = GData::Client::Photos.new
    client.authsub_token = current_user.credential_for(@provider).access_token

    if (@album_id = params[:album_id])
      feed = client.get("http://picasaweb.google.com/data/feed/api/user/default/albumid/#{@album_id}").to_xml
      #logger.debug feed.to_s.inspect

      @album_title = feed.elements['title'].text

      @photos = feed.elements
      if request.post? && params[:gphoto_ids] && !params[:gphoto_ids].empty?
        @imported_gphoto_ids = Photo.from_gphoto_feed(@photos, @event, params[:gphoto_ids])
      end

      render :action => 'import_picasaweb_photos'
    else
      feed = client.get('http://picasaweb.google.com/data/feed/api/user/default').to_xml
      @albums = feed.elements
      render :action => 'import_picasaweb'
    end
  end
end