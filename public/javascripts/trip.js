function Trip(map) {
  this.red_marker_icon = "http://labs.google.com/ridefinder/images/mm_20_red.png";
  this.green_marker_icon = "http://labs.google.com/ridefinder/images/mm_20_green.png";
  this.current_marker_icon = this.green_marker_icon;

  this.map = map;
  
  this.getBounds = function() {
    bounds = new google.maps.LatLngBounds();
    $.each(this.markers, function(i, marker) {
      bounds.extend(marker.position);
    });
    return bounds;
  };

  this.fitBounds = function() {
    this.map.fitBounds(this.getBounds());
  }

  this.buildMarker = function(point) {
    lat = $(point).find('.lat').text();
    lng = $(point).find('.lng').text();
    position = new google.maps.LatLng(lat, lng);
    event_id = $(point).find('.id').text();
    is_current = $(point).hasClass('current') ? true : false;
    icon_url = is_current ? this.current_marker_icon : this.red_marker_icon;
    
    marker = new google.maps.Marker({map: this.map, position: position,
      icon: new google.maps.MarkerImage(icon_url),
      event_id: event_id,
      is_current: is_current});
    /*marker.infoWindowContent = $('#event-' + i).html();
      google.maps.event.addListener(marker, 'click', function(e) {
        infowindow.content = this.infoWindowContent;
        infowindow.open(map, this);
      });*/
    
    return marker;
  }

  this.addMarkers = function() {
    this.markers = [];
    trip = this;
    jQuery.each($('#event_points .point'), function(i, point) {
      trip.markers.push(trip.buildMarker(point));
    });
  };

  this.addMarker = function(position, is_current) {
    if (typeof(is_current) == 'undefined' && is_current == null) is_current = false
    marker = new google.maps.Marker({map: this.map, position: position, icon_url: this.current_marker_icon,
      is_current: is_current});
    this.markers.push(marker);
  }

  this.addRoute = function() {
    marker_positions = [];
    $.each(this.markers, function(i, point) {
      marker_positions.push(point.position);
    });
    if (typeof(this.path) != 'undefined') this.path.setMap(null);
    this.path = new google.maps.Polyline({
      path: marker_positions,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.path.setMap(this.map);
  }

  this.moveTravelMarker = function(latlng, panMap) {
    var travelMarker;

    if (typeof(travelMarker) == 'undefined') {
      plane_image = new google.maps.MarkerImage("/images/plane_icon.png",
      new google.maps.Size(50, 37),
      new google.maps.Point(0, 0),
      new google.maps.Point(25, 19));
      travelMarker = new google.maps.Marker({map: map, position: latlng, icon: plane_image});
    } else {
      travelMarker.setPosition(latlng);
    }

    if (typeof(panMap) != 'undefined' && panMap == true) {
      map.panTo(latlng);
    }
  }

  this.moveMarker = function(target_marker, new_position) {
    $.each(markers, function(i, marker) {
      if (marker.position == target_marker.position) {
        this.markers[i].setPosition(new_position);
      }
    });
  }

  this.panToMarker = function(marker) {
    if (marker == null) return false;
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

  this.addPlaceableMarkerListener = function() {
    google.maps.event.addListener(this.map, 'click', function(e) {
      position = e.latLng;
      if (this.getCurrent == null) {
        addEventMarker(position, is_current = true);
      } else {
        moveEventMarker(this.getCurrent(), position);
      }

      this.addRoute();
      this.updateLatLngFields();
    });
  }

  this.updateLatLngFields = function(new_position) {
    $('#event_latitude').val(new_position.lat());
    $('#event_longitude').val(new_position.lng());
  }

  function animateToNextEvent(e) {
    try {
      this_marker = markers[parseInt($(this).attr('href').replace(/#/, ''))-1];

      next_marker = markers[parseInt($(this).attr('href').replace(/#/, ''))];

      start_point = this_marker.getPosition();
      console.log(start_point);
      end_point = next_marker.getPosition();
      console.log(end_point);
      num_stops = 100;
      stops = [start_point];
      for(var i = 1; i < num_stops; i++) {
        console.log(i);
        stops[i] = new google.maps.LatLng(
            start_point.lat() + (((end_point.lat() - start_point.lat())*parseFloat(i))/parseFloat(num_stops)),
            start_point.lng() + (((end_point.lng() - start_point.lng())*parseFloat(i))/parseFloat(num_stops))
          );
      }
      stops[num_stops] = end_point;
      console.log(stops);

      frame_rate = 15;
      $.each(stops, function(i, stop) {
        setTimeout(moveTravelMarker, frame_rate*i, stop, true);
      });

      function openWindow(marker) {
        infowindow.content = marker.infoWindowContent;
        infowindow.open(map, marker);
      }
      setTimeout(openWindow, frame_rate*num_stops, next_marker);

    } catch(e) {
      console.log(e);
    }
    return false;
  }
}
