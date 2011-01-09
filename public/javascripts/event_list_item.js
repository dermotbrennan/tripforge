function EventListItem(event_id) {
  var event_list_item_el = $('#events #event-'+event_id);

  this.isVisible = function() {
    el_top = $(event_list_item_el).offset().top;
    el_bottom = $(event_list_item_el).offset().top + $(event_list_item_el).height();
    window_top = $(document).scrollTop();
    window_bottom = $(document).scrollTop() + $(window).height();
    return (window_top < el_top && el_bottom < window_bottom);
  }

  this.highlight = function() {
    event_list_item_el.effect("highlight", {}, 800);
  }

  this.scrollTo = function() {
    event_list_item = this;
    $.scrollTo(event_list_item_el.selector, {easing: 'linear', duration: 500, offset: {top: -172},
      onAfter: function() {
        event_list_item.highlight();
      }
    });
  }

  return this;
}

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

  // zoom
  zoom_event_buttons = event.find('a.zoom_event_button');
  zoom_event_buttons.live('click', function() {
    event = find_event(this);
    event_id = cleanEventId($(event).attr('id'));
    if (typeof(trip) != 'undefined') {
      trip.panAndZoomToEvent(event_id);
      trip.setCurrentByEventId(event_id);
    }
    return false;
  });

  // delete event button
  delete_event_button = event.find('.delete_event_button');
  delete_event_button.live('ajax:success', function() {
    event = find_event(this);
    event_id = cleanEventId($(event).attr('id'));
    event.remove();
    if (typeof(trip) != 'undefined') {
      trip.removeEvent(event_id);
    }
  });

  // position marker
  event.find('.marker').draggable({
    scope: 'location',
    revert: 'invalid',
    start: function(e, ui) {
      // modify map to make it take a new marker
      event_id = cleanEventId($(e.target).parent().parent().attr('id'));
    }, 
    stop: function(e, ui) {
      //if (typeof(ui.map_drag_listener) != 'undefined')
      //  google.maps.event.removeListener(ui.map_drag_listener);
    }
  });

  // make it so that you can drop items onto the event
  event.droppable({
    scope: 'photos',
    hoverClass: 'drophover',
    drop: function( e, ui ) {
      item_id = ui.draggable[0].id.replace(/photo_/, '');



      event_id = cleanEventId($(e.target).parent().parent().attr('id'));

      // check if item_id already in the list of items
      // if it is then highlight item
      // if it is not then add it to the end of the list
      // create a new item in the db
      // TODO handle multiple drags
    }
  });
}