function MapNavigation(selector, trip) {
  this.nav_el = $(selector);
  if (this.nav_el.length == 0) debug.log('No valid navigation element!');
  
  this.nav_el.find('.current_event a').click(function() {
    event_id = this.nav_el.filter('.active').
      find('.current_event .current_event_id').text();
    trip.panToMarker(trip.findMarkerByEventId(event_id));
  });

  this.nav_el.find('.event_nav_button a').click(function() {
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

  trip.map_navigation = this;

  return this;
}

MapNavigation.prototype.showEvent = function(event_id) {
  this.nav_el.removeClass('active').
    filter('#map-navigation-'+event_id).addClass('active');
}