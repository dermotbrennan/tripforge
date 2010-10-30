// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

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

function getEventPoints() {
  points = [];
  jQuery.each($('#event_points .point'), function(i, point) {
    lat = $(point).find('.lat').text(); 
    lng = $(point).find('.lng').text();
    points.push({
      position: new google.maps.LatLng(lat, lng),
      event_id: $(point).find('.id').text(),
      is_current: ($(point).hasClass('current') ? true : false)
    });
  });
  return points;
}

function getCurrentEventPoint(event_points) {
  current = null;
  $.each(event_points, function(i, point) {
    if (point.is_current) current = point;
  });
  return current;
}

function addEventMarkers(map, event_points) {
  markers = [];
  $.each(event_points, function(i, marker) {
    position = marker.position;
    scene_id = marker.event_id;
    marker = new google.maps.Marker({map: map, position: position});
    marker.infoWindowContent = $('#event-' + i).html();
    google.maps.event.addListener(marker, 'click', function(e) {
      infowindow.content = this.infoWindowContent;
      infowindow.open(map, this);
    });

    markers.push(marker)
  });
  return markers;
}

function addEventMarker(map, markers, event_points, position) {
  markers = [];
  event_point = {position: position}
  
  marker = new google.maps.Marker({map: map, position: position});
//  marker.infoWindowContent = $('#event-' + event_points.length+1).html();
//  google.maps.event.addListener(marker, 'click', function(e) {
//    infowindow.content = this.infoWindowContent;
//    infowindow.open(map, this);
//  });
  event_points.push(event_point);
  markers.push(marker);
  return [event_point, markers, event_points];
}

function addRoute(map, path, event_points) {
  marker_positions = [];
  $.each(event_points, function(i, point) {
    marker_positions.push(point.position);
  });
  path = new google.maps.Polyline({
    path: marker_positions,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  path.setMap(map);
}

function moveTravelMarker(latlng, panMap) {
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

function moveEventMarker(map, markers, point, new_position) {
  point.latitude = new_position.latitude;
  point.longitude = new_position.longitude;
}

function updateLatLngFields(new_position) {
  $('#event_latitude').val(new_position.latitude);
  $('#event_longitude').val(new_position.longitude);
}

$(document).ready(function() {
  if ($('#map').length > 0) {
    var myLatlng = new google.maps.LatLng(53.344104,-6.267494);
    var myOptions = {
      zoom: 6,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map($("#map")[0], myOptions);
    var path;

    event_points = getEventPoints();
    current_event_point = getCurrentEventPoint(event_points);
    markers = addEventMarkers(map, event_points);
    addRoute(map, path, event_points);

    google.maps.event.addListener(map, 'click', function(e) {
      position = e.latLng;
      if (current_event_point == null) {
        markers_and_event_points = addEventMarker(map, markers, event_points, position);
        current_event_point = markers_and_event_points[0];
        markers = markers_and_event_points[1];
        event_points = markers_and_event_points[2];
      } else {
        moveEventMarker(map, markers, current_event_point, position);
      }

      addRoute(map, path, event_points);

      updateLatLngFields(position);
    });
  }
});
