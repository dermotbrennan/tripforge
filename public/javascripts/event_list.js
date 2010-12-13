jQuery.fn.event_listify = function(t) {
  var trip = t;
  this.sortable({
    axis: 'y',
    handle: '.handle',
    update: function(e, ui) {
      // get an array of the new event order
      sortable_array = $(this).sortable("toArray");
      event_ids = [];
      $.each(sortable_array, function(i, event_el_id) {
        event_ids.push(cleanEventId(event_el_id));
      });

      // figure out what is now before and after the event that was moved
      dragged_event_id = cleanEventId(ui.item.attr('id'));
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

      // update the db with the event changes
      trip_id = $('input#event_trip_id').val();
      $.post('/trips/'+trip_id+'/events/'+dragged_event_id+'/reorder', {
        next_event_id: next_event_id,
        previous_event_id: previous_event_id
      }, function(data, textStatus) {
        if (textStatus == 'success') { // update to db was successful
          event_el_id = '#event-'+dragged_event_id;
          $(event_el_id).replaceWith(data); // update the li with the new details
          $(event_el_id).find('.event_form').hide(); // we have to re-find the element after it was replaced

          // update the route map with the new order
          trip.reorderMarkers(event_ids);
          trip.addRoute();
        } else {
          debug.log(textStatus);
        }
      });
    }
  });

  this.find('li.event').event_list_itemify(trip);

  return this;
}
