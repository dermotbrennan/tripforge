$(document).ready(function() {
  tool_tabs = $('#tool_tabs');
  if (tool_tabs.length > 0) {
    tool_tabs.tabs();
    $('#photos_tool').tabs();
  }
  
  map_el = $('#map');
  if (map_el.length > 0) {
    map_mode = $('#map_mode').text();
    map_container = new MapContainer(map_el, map_mode);
    map = map_container.init_map();

    trip = new Trip(map, map_mode);
    trip.addMarkers();
    trip.addRoute();
    trip.fitBounds();

    if (map_mode == MapMode.TRIP_OVERVIEW) {
      map_container.makeDroppable(trip);
    } else if (map_mode == MapMode.PLAY_TRIP) {
      map_nav = new MapNavigation('.map_navigation', trip);
      event_info = new EventInfoContainer('#event_info_container', trip);
    }
  }

  // event list editing
  var event_list = $('ul#events');
  if (event_list.length > 0) {
    event_list.event_listify(trip);
  }
    
  // new event button
  new_event_wrapper = $("#new_event_wrapper");
  if (new_event_wrapper.length > 0) {
    new_event_wrapper_form = new_event_wrapper.find('form');
    new_event_wrapper_form.event_formify();
    new_event_wrapper_form.initForm();
  }

  $('#tool_tabs').scrollFollow( {
      speed: 800,
      offset: 60,
      container: 'main-content-inner'
    });
});
