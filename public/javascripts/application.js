// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function activateNavForEvent(event_id) {
  $('.map_navigation').removeClass('active');
  $('#map-navigation-'+event_id).addClass('active');
  $('#event_info_window').show();
  $('#event_info_window').html($('#event-point-'+event_id+' .info').html());
}


$(document).ready(function() {
  if ($('#map').length > 0) {
    map_mode = $('#map_mode').text();
    if (map_mode == 'play_trip') {
      $('body').prepend($("#map, .map_navigation, #event_info_window"));
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

  // event list editing
  var event_list = $('ul#events');
  if (event_list.length > 0) {
    event_list.sortable({ axis: 'y', handle: '.handle',
      update: function(event, ui) {
        sortable_array = $(this).sortable("toArray");
        event_ids = [];
        $.each(sortable_array, function(i, event_el_id) {
          event_ids.push(parseInt(event_el_id.replace(/event-/, '')));
        });

        dragged_event_id = parseInt(ui.item.attr('id').replace(/event-/, ''));
        found_dragged_event_in_array = false;
        next_event_id = null;
        previous_event_id = null;
        i = 0;
        while(!found_dragged_event_in_array && i < event_ids.length) {
          if (event_ids[i] == dragged_event_id) {
            previous_event_id = event_ids[i-1];
            next_event_id = event_ids[i+1];
            found_dragged_event_in_array = true;
          } else {
            i++;
          }
        }

        trip_id = $('input#event_trip_id').val();
        $.post('/trips/'+trip_id+'/events/'+dragged_event_id+'/reorder', {next_event_id: next_event_id, previous_event_id: previous_event_id}, function(data, textStatus) {
          if (textStatus == 'success') {
            event_el_id = '#event-'+dragged_event_id;
            $(event_el_id).replaceWith(data);
            $(event_el_id).find('.event_form, .form_buttons').hide(); // we have to re-find the element after it was replaced
          } else {
            debug.log(textStatus);
          }
        });
      }
    });
    
    event_list.find('.event_form, .form_buttons').hide();

    // edit
    edit_event_buttons = event_list.find('a.edit_event_button');
    cancel_edit_event_buttons = event_list.find('a.cancel_edit_event_button');
    save_event_buttons = event_list.find('a.save_event_button');

    form_buttons = event_list.find('.form_buttons');
    edit_event_buttons.live('click', function() {
      event = $(this).parents('ul#events>li');
      event.find('.event_form, .form_buttons').show();
      event.find('.event_summary').hide();

      // time picker
      event.find('input.datetime_picker').AnyTime_noPicker();
      event.find('input.datetime_picker').AnyTime_picker(
        { format: "%H:%i %a %d/%b/%Y"} );

      return false;
    });

    // cancel edit
    cancel_edit_event_buttons.live('click', function() {
      event = $(this).parents('ul#events>li');
      event.find('.event_form, .form_buttons').hide();
      event.find('.event_summary').show();
      event.find('input.datetime_picker').AnyTime_noPicker();
      return false;
    });

    // saving
    save_event_buttons.live('click', function() {
      var event = $(this).parents('ul#events>li');
      event.find('.event_form, .form_buttons').hide();
      var event_summary = event.find('.event_summary');
      event_summary.css('visibility', 'hidden');
      event_summary.show();
      event.addClass('reloading');

      event_id = event.find('.event_id').text();
      event_form = event.find('form');
      trip_id = event_form.find('input#event_trip_id').val();
      form_data = event_form.serialize();
      $.post('/trips/'+trip_id+'/events/'+event_id, form_data, function(data) {
        event.removeClass('reloading');
        event_summary.css('visibility', 'visible');
        event_summary.html(data);
      });

      event.find('input.datetime_picker').AnyTime_noPicker();
      return false;
    });
  }
});