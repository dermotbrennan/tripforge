jQuery.fn.event_list_itemify = function(trip_obj) {
  event = $(this);
  var trip = trip_obj;
  
  function find_event(el) {
    return $($(el).parents('li.event')[0]);
  }

  event.live('hover', function() {
    //alert('test');
    event_id = cleanEventId($(this).attr('id'));
    if (typeof(trip) != 'undefined') {
      trip.setCurrentByEventId(event_id);
    }
  });

  event_form = event.find('.event_form');
  event_form.event_formify().hide();

  // make action buttons do something
  // edit
  edit_event_buttons = event.find('a.edit_event_button');
  edit_event_buttons.live('click', function() {
    //alert('test');
    event = find_event(this);
    //alert(event);
    event.find('form.event_form').event_formify().initForm().show();
    event.find('.event_summary').hide();
    return false;
  });

  // delete event button
  delete_event_button = event.find('.delete_event_button');
  delete_event_button.live('ajax:success', function() {
    find_event(this).remove();
  });
}