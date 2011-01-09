function MapContainer(jquery_obj, map_mode) {
  this.element = jquery_obj;
  this.map_mode = map_mode;

  if (this.map_mode == MapMode.PLAY_TRIP) {
    $('body').prepend($("#map, .map_navigation, #event_info_container"));
    this.element.height($(document).height() - 64);
  }

  this.init_map = function() {
    trip_center = getUserLocation();
    myOptions = {
      zoom: 6,
      center: trip_center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.element[0], myOptions);
    overlay = new CustomOverlay(this.map);
    return this.map;
  }

  this.makeDroppable = function(trip) {
    map_el = this.element;
    map = this.map;
    map_el.droppable({
      scope: 'location',
      hoverClass: 'drophover',
      drop: function( e, ui ) {
        marker_id = ui.draggable[0].id;
        event_id = cleanEventId(marker_id);

        // get the correct x and y for the event
        var posx = 0;
        var posy = 0;
        if (e.pageX || e.pageY) 	{
          posx = e.pageX;
          posy = e.pageY;
        } else if (e.clientX || e.clientY) 	{
          posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        // get the position of the event relative to the map container element
        x = posx - map_el.offset().left;
        y = posy - map_el.offset().top;
        point = new google.maps.Point(x, y);

        // convert pixel point into latlng point
        projection = overlay.getProjection();
        latlng = projection.fromContainerPixelToLatLng(point, true);

        // check the point is in the bounds of the map
        bounds = map.getBounds();
        if (bounds.contains(latlng)) {
          marker_el = $("#marker_for_event-"+event_id);

          // add the marker to map
          transport_mode_id = marker_el.data('transport_mode_id');
          //google.maps.event.trigger(map, 'addmarker', latlng, event_id, transport_mode_id);
          trip.addMarker(latlng, false, event_id, transport_mode_id);
          trip.addRoute();

          // remove the old marker
          marker_el.hide();
          $("#event-"+event_id).removeClass('positionless');
          
          // find event and update with new position
          event = new Event(event_id);
          event.setAttributes({latitude: latlng.lat(), longitude: latlng.lng()})
          event.update({success: function(){ 
              debug.log('successfully updated event');
              marker_el.remove();
            }, error: function() {
              debug.log('failed to up update event');
              marker_el.show().css({top: 0, left: 0});
              $("#event-"+event_id).addClass('positionless');
              trip.removeEvent(event_id);
            }
          });
        }
      }
    });
    //google.maps.event.addListener(this.map, 'addmarker', function(position, event_id, transport_mode_id) {
      
    //});
  }

  function getUserLocation() {
    var initialLocation;

    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      }, function() {
        // couldnt determine current position 
      });
    // Try Google Gears Geolocation
    } else if (google.gears) {
      var geo = google.gears.factory.create('beta.geolocation');
      geo.getCurrentPosition(function(position) {
        initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
      }, function() { // couldnt determine current position
      });
    } else {
      // Browser doesn't support Geolocation
    }

    dublin = new google.maps.LatLng(53.344104,-6.267494);
    defaultLocation = dublin;

    return (initialLocation || defaultLocation);
  }

  return this;
}