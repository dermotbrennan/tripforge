// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function activateNavForEvent(event_id) {
  $('.map_navigation').removeClass('active');
  $('#map-navigation-'+event_id).addClass('active');
}


$(document).ready(function() {
  if ($('#map').length > 0) {
    map_mode = $('#map_mode').text();
    if (map_mode == 'play_trip') {
      $('body').prepend($("#map, .map_navigation"));
      $("#map").height($(document).height() - 64);
    }

    /*event_points = getEventPoints();
    current_event_point = getCurrentEventPoint(event_points);
    trip_bounds = getTripBounds(event_points);
    trip_center = trip_bounds.getCenter();*/

    var myOptions = {
      zoom: 6,
      //center: trip_center,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map($("#map")[0], myOptions);

    trip = new Trip(map);
    trip.addMarkers();
    trip.addRoute();
    trip.fitBounds();

    if (map_mode == 'edit_event_location') {
      trip.addPlaceableMarkerListener();
    }

    // map navigation
    if (map_mode == 'play_trip') {
      $('.map_navigation .current_event a').click(function() {
        event_id = $('.map_navigation.active .current_event .current_event_id').text();
        trip.panToMarker(trip.findMarkerByEventId(event_id));
      });

      $('.map_navigation .event_nav_button a').click(function() {
        event_id = $(this).parents('.event_nav_button').find('.event_id').text();
        marker = trip.findMarkerByEventId(event_id);
        if (marker != null) {
          trip.animateBetweenMarkers(trip.getCurrent(), marker);
          var intervalIdent = setInterval((function() {
            if (typeof(trip.travelMarker) != 'undefined' && !trip.travelMarker.is_moving) {
              clearInterval(intervalIdent);
              trip.setCurrent(marker);
              activateNavForEvent(event_id);
              return;
            }
          }), 50);
          
          
        }
      });
    }
  }
});
