function Trip(map, map_mode) {
  this.red_marker_icon = "http://labs.google.com/ridefinder/images/mm_20_red.png";
  this.green_marker_icon = "http://labs.google.com/ridefinder/images/mm_20_green.png";
  this.current_marker_icon = this.green_marker_icon;

  this.map = map;
  this.map_mode = map_mode;

  if (this.map_mode == MapMode.EDIT_EVENT_LOCATION) {
    this.addPlaceableMarkerListener();
  }
  
  this.getBounds = function() {
    bounds = new google.maps.LatLngBounds();
    $.each(this.markers, function(i, marker) {
      bounds.extend(marker.position);
    });
    return bounds;
  };

  this.fitBounds = function(bounds) {
    if (typeof(bounds) == 'undefined') bounds = this.getBounds();
    if (bounds.length > 0) this.map.fitBounds(bounds);
  }

  this.buildMarker = function(point) {
    lat = $(point).find('.lat').text();
    lng = $(point).find('.lng').text();
    position = new google.maps.LatLng(lat, lng);
    event_id = $(point).find('.id').text();
    transport_mode = new TransportMode($(point).find('.transport_mode_id').text());
    is_current = $(point).hasClass('current') ? true : false;
    icon_url = is_current ? this.current_marker_icon : this.red_marker_icon;
    
    marker = new google.maps.Marker({map: this.map, position: position,
      icon: new google.maps.MarkerImage(icon_url), event_id: event_id,
      transport_mode: transport_mode, is_current: is_current,
      trip: this
    });

    marker = this.addMarkerEventListeners(marker);

    return marker;
  }

  this.addMarkers = function() {
    this.markers = [];
    trip = this;
    jQuery.each($('#event_points .point'), function(i, point) {
      trip.markers.push(trip.buildMarker(point));
    });
  };

  this.addMarker = function(position, is_current, event_id, transport_mode_id) {
    if (typeof(is_current) == 'undefined' && is_current == null) is_current = false;
    icon_url = is_current ? this.current_marker_icon : this.red_marker_icon;
    transport_mode = new TransportMode(transport_mode_id);
    trip = this;
    map = this.map;
    marker = new google.maps.Marker({map: map, position: position, icon_url: icon_url,
      event_id: event_id, transport_mode: transport_mode,
      trip: trip, is_current: is_current});
    marker = this.addMarkerEventListeners(marker);
    this.markers.push(marker);
  }

  this.addRouteCallback = function(path_points, destination_marker, origin_position, destination_position, path_color) {
    // add the start and end positions if theyre not already there
    if (path_points[0] != origin_position) path_points.unshift(origin_position);
    if (path_points[path_points.length-1] != destination_position) path_points.push(destination_position);

    // draw path
    path = new google.maps.Polyline({
      path: path_points,
      strokeColor: path_color,
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
    path.setMap(this.map);
    destination_marker.path_points = path_points;
    desired_journey_time = 5000;
    destination_marker.frame_rate = desired_journey_time / path_points.length;
    //debug.log(path);

    this.paths.push(path);
  }

  this.addRoute = function() {
    // clear paths
    if (typeof(this.paths) != 'undefined' && this.paths.length > 0) {
      $.each(this.paths, function(i, path) {
        if (typeof(path) != 'undefined') {
          path.setMap(null);
        }
      });
    }
    this.paths = [];

    trip = this;
    $.each(this.markers, function(i, origin_marker) {
      var destination_marker = trip.markers[i+1];
      if (typeof(destination_marker) == 'undefined') return null;

      var path_color = destination_marker.transport_mode.color;
      var origin_position = origin_marker.getPosition();
      var destination_position = destination_marker.getPosition();
      var path_points = new Array();

      if (destination_marker.transport_mode.code.match(/walking|driving/)) {
        direction_service = new google.maps.DirectionsService();
        direction_request = {
          origin: origin_position, destination: destination_position,
          travelMode: destination_marker.transport_mode.uppercase_code,
          provideRouteAlternatives: false
        };
        
        direction_service.route(direction_request, function(directions_result, directions_status) {
          if (directions_status == 'OK') {
            //debug.log(directions_result);
            //debug.log(directions_result.routes);
            path_points = directions_result.routes[0].overview_path
            trip.addRouteCallback(path_points, destination_marker, origin_position, destination_position, path_color);
            // add on the start and end points if the directions werent able to include those.
          } else {
            //debug.log("direction status" + directions_status);
          }
        })
      } else {      
        // path is a straight line but lets create loads of points along the way. will be needed for animation
        num_points = 200;
        path_points[0] = origin_position;
        for(i = 1; i < num_points; i++) {
          path_points[i] = new google.maps.LatLng(
            origin_position.lat() + (((destination_position.lat() - origin_position.lat())*parseFloat(i))/parseFloat(num_points)),
            origin_position.lng() + (((destination_position.lng() - origin_position.lng())*parseFloat(i))/parseFloat(num_points))
          );
        }
        trip.addRouteCallback(path_points, destination_marker, origin_position, destination_position, path_color);
      }
     
      return true;
    });
    //debug.log(this.paths);
  }

  this.moveMarker = function(target_marker, new_position) {
    $.each(markers, function(i, marker) {
      if (marker.position == target_marker.position) {
        this.markers[i].setPosition(new_position);
      }
    });
  }

  this.panToMarker = function(marker) {
    if (marker == null || marker == false) return false;
    this.map.panTo(marker.position);
    return true;
  }
  
  this.findMarkerByEventId = function(event_id) {
    marker = null;
    i = 0;
    while(marker == null && i < this.markers.length) {
      m = this.markers[i];
      (m.event_id == event_id) ? marker = m : i+=1;
    }
    return marker;
  }

  // reorder the markers based on the order of the event_ids array
  this.reorderMarkers = function(event_ids) {
    new_markers = [];
    trip = this;
    jQuery.each(this.markers, function(i, marker) {
      event_id = event_ids[i];
      if (marker.event_id != event_id) {
        new_markers.push(trip.findMarkerByEventId(event_id));
      } else {
        new_markers.push(marker);
      }
    });
    this.markers = new_markers;
  }

  this.updateEvent = function(event_id, event_attributes) {
    if (!isDefined(event_id) || !isDefined(event_attributes)) {
      debug.log("Invalid arguments for update event", event_id, event_attributes);
      return false;
    }

    var marker = trip.findMarkerByEventId(event_id);
    if (isDefined(marker)) {
      if (isDefined(event_attributes.latitude) && isDefined(event_attributes.longitude)) {
        new_position = new google.maps.LatLng(event_attributes['latitude'], event_attributes['longitude']);
        if (marker.position != new_position) {
          marker.position = new_position;
          this.addRoute();
        }
      }
      if (isDefined(event_attributes['transport_mode_id'])) {
        new_transport_mode = new TransportMode(event_attributes['transport_mode_id']);
        debug.log(marker);
        if (!isDefined(marker.transport_mode) || marker.transport_mode.id != new_transport_mode.id) {
          marker.transport_mode = new_transport_mode;
          this.addRoute();
        }
      }
    }
    
    return null;
  }

  this.removeEvent = function(event_id) {
    if (!isDefined(event_id)) return false;
    not_finished = true, i = 0;
    while(not_finished && i < this.markers.length) {
      if (this.markers[i].event_id == event_id) {
        this.markers[i].setMap(null);
        this.markers.splice(i,1);
        not_finished = false;
      } else {
        i++;
      }
    }
    this.addRoute();
    return null;
  }

  this.panAndZoomToEvent = function(event_id) {
    return (this.panToMarker(this.findMarkerByEventId(event_id)) && this.map.setZoom(18));
  }

  this.getCurrent = function() {
    current = null;
    i = 0;
    while(current == null && i < this.markers.length) {
      m = this.markers[i];
      m.is_current ? current = m : i+=1;
    }
    return current;
  }

  this.setCurrent = function(marker) {
    current = null;
    i = 0;
    while(i < this.markers.length) {
      if (this.markers[i] == marker) {
        this.markers[i].is_current = true;
        this.markers[i].setIcon(new google.maps.MarkerImage(this.current_marker_icon));
        current = this.markers[i];
      } else {
        this.markers[i].is_current = false;
        this.markers[i].setIcon(new google.maps.MarkerImage(this.red_marker_icon));
      }
      i += 1;
    }
    return current;
  }

  this.setCurrentByEventId = function(event_id) {
    current = null;
    i = 0;
    while(i < this.markers.length) {
      if (this.markers[i].event_id == event_id) {
        this.markers[i].is_current = true;
        this.markers[i].setIcon(new google.maps.MarkerImage(this.current_marker_icon));
        current = this.markers[i];
      } else {
        this.markers[i].is_current = false;
        this.markers[i].setIcon(new google.maps.MarkerImage(this.red_marker_icon));
      }
      i += 1;
    }
    return current;
  }

  this.addMarkerEventListeners = function(marker) {
    google.maps.event.addListener(marker, 'click', function() {
      if (typeof(this.trip.map_navigation) != 'undefined') {
        this.trip.map_navigation.showEvent(this.event_id);
      }
      if (typeof(this.trip.event_info_container) != 'undefined') {
        this.trip.event_info_container.showEvent(this.event_id);
      }
      this.trip.setCurrent(this);

      // scroll window to event list item if no on screen
      if (this.trip.map_mode == MapMode.TRIP_OVERVIEW) {
        event_list_item = EventListItem(this.event_id);
        event_list_item.isVisible() ? event_list_item.highlight() : event_list_item.scrollTo();
      }
    });

    if (this.map_mode == MapMode.TRIP_OVERVIEW) {
      marker = this.addDraggableMarkerWithPositionUpdateListener(marker);
    }

    return marker;
  }

  this.addPlaceableMarkerListener = function() {
    google.maps.event.addListener(this.map, 'click', function(e) {
      position = e.latLng;
      if (this.getCurrent == null) {
        this.addMarker(position, is_current = true);
      } else {
        this.moveMarker(this.getCurrent(), position);
      }

      this.addRoute();
      this.updateLatLngFields();
    });
  }

  this.updateLatLngFields = function(new_position) {
    $('#event_latitude').val(new_position.lat());
    $('#event_longitude').val(new_position.lng());
  }

  this.addDraggableMarkerWithPositionUpdateListener = function(marker) {
    trip = this;
    marker.setDraggable(true);
    google.maps.event.addListener(marker, 'dragend', function(e) {
      position = e.latLng;
      event = Event(this.event_id);
      event.setAttributes({latitude: position.lat(), longitude: position.lng()});
      event.update({
        success: function( objResponse ){
          trip.addRoute();
        },
        error: function( objRequest ){
          alert('error');
        },
        complete: function( objRequest ){
        }
      });
    });
    return marker;
  }

  this.addDraggableMarkersWithPositionUpdateListener = function() {
    jQuery.each(this.markers, function(i, marker) {
      this.markers[i] = this.addDraggableMarkerWithPositionUpdateListener(marker);
    });
  }

  this.animateBetweenMarkers = function(start_marker, end_marker) {
    start_point = start_marker.getPosition();
    end_point = end_marker.getPosition();
    
    icon = end_marker.transport_mode.icon;
    this.travelMarker = new google.maps.Marker({map: this.map, position: start_point, icon: icon});
    this.travelMarker.stops = end_marker.path_points;
    this.travelMarker.frame_rate = end_marker.frame_rate;
    this.travelMarker.is_moving = true;
    this.travelMarker.current_stop_index = 0;

    setTimeout(function(thisObj) {thisObj.moveTravelMarkerThroughStops()}, this.travelMarker.frame_rate, this);
    //this.travelMarker.refitBoundsInterval = setInterval(function(thisObj) { thisObj.fitBoundsToTravelMarker() }, 50, this);

    return false;
  }


  this.moveTravelMarkerThroughStops = function(current_stop_index) {
    //debug.log(current_stop_index);
    current_stop_index = this.travelMarker.current_stop_index;
    stop = this.travelMarker.stops[current_stop_index];
    //debug.log(typeof(stop));

    if (typeof(stop) == 'undefined') {
      this.travelMarker.setMap(null);
      this.travelMarker.is_moving = false;
      //debug.log('finished');
      return false;
    }

    this.fitBoundsToTravelMarker();

    this.travelMarker.setPosition(stop);
    this.travelMarker.current_stop_index++;

    setTimeout(function(thisObj) {thisObj.moveTravelMarkerThroughStops()}, this.travelMarker.frame_rate, this);
    
    return true;
  }

  this.fitBoundsToTravelMarker = function() {
    // create new bounds for map
    // adjust the viewport of map so that we can see
    // the current stop, the previous and next 1% of stops
    current_stop_index = this.travelMarker.current_stop_index;
    stops = this.travelMarker.stops;
    prev_stop_percentage = Math.round(stops.length * 0.05);
    stop_percentage = Math.round(stops.length * 0.40);
    if (current_stop_index%5 == 0) {
      previous_stops_index = Math.max(current_stop_index - prev_stop_percentage, 0);
      previous_stops = this.travelMarker.stops.slice(previous_stops_index, current_stop_index);

      next_stops_index = Math.min(current_stop_index + stop_percentage, stops.length -1);
      next_stops = this.travelMarker.stops.slice(current_stop_index, next_stops_index);

      bound_stops = [stop].concat(previous_stops).concat(next_stops);
      bound_stops = [stop].concat(next_stops);

      bounds = new google.maps.LatLngBounds();
      $.each(bound_stops, function(i, pos) {
        if (typeof(pos) != 'undefined' && typeof(pos.lat) == 'function') {
          bounds.extend(pos);
        }
      });
      this.fitBounds(bounds);
    }
  }


  this.moveTravelMarkerThroughStops = function(current_stop_index) {
    //console.log(current_stop_index);
    current_stop_index = this.travelMarker.current_stop_index;
    stop = this.travelMarker.stops[current_stop_index];
    //console.log(typeof(stop));

    if (typeof(stop) == 'undefined') {
      this.travelMarker.setMap(null);
      this.travelMarker.is_moving = false;
      console.log('finished');
      return false;
    }

    this.fitBoundsToTravelMarker();

    this.travelMarker.setPosition(stop);
    this.travelMarker.current_stop_index++;

    setTimeout(function(thisObj) {thisObj.moveTravelMarkerThroughStops()}, this.travelMarker.frame_rate, this);
    
    return true;
  }

  this.fitBoundsToTravelMarker = function() {
    // create new bounds for map
    // adjust the viewport of map so that we can see
    // the current stop, the previous and next 1% of stops
    current_stop_index = this.travelMarker.current_stop_index;
    stops = this.travelMarker.stops;
    prev_stop_percentage = Math.round(stops.length * 0.05);
    stop_percentage = Math.round(stops.length * 0.40);
    if (current_stop_index%5 == 0) {
      previous_stops_index = Math.max(current_stop_index - prev_stop_percentage, 0);
      previous_stops = this.travelMarker.stops.slice(previous_stops_index, current_stop_index);

      next_stops_index = Math.min(current_stop_index + stop_percentage, stops.length -1);
      next_stops = this.travelMarker.stops.slice(current_stop_index, next_stops_index);

      bound_stops = [stop].concat(previous_stops).concat(next_stops);
      bound_stops = [stop].concat(next_stops);

      bounds = new google.maps.LatLngBounds();
      $.each(bound_stops, function(i, pos) {
        if (typeof(pos) != 'undefined' && typeof(pos.lat) == 'function') {
          bounds.extend(pos);
        }
      });
      this.fitBounds(bounds);
    }
  }
}
