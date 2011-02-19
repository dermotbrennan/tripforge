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
      var target_event = $(e.target);
      var provider_id = ui.draggable.find('.provider_id').text();
      var album_id = ui.draggable.find('.album_id').text();
      var source_id = ui.draggable.attr('id').replace(/photo_/, '');
      var source_url = ui.draggable.find('.source_url').text();
      var source_created_at = ui.draggable.find('.source_created_at').text();
      var title = ui.draggable.find('.title').text();
      var event_id = cleanEventId(target_event.attr('id'));
      var thumbnails = ui.draggable.find('.thumbnail');
      var photo_urls = [];
      thumbnails.each(function(i, thumb) {
        thumb = $(thumb);
        photo_urls.push({url: thumb.find('.thumb_url').text(),
          width: thumb.find('.thumb_width').text(),
          height: thumb.find('.thumb_height').text()
        });
      });

      item_el_id = 'item_'+source_id;
      item_in_event_el = target_event.find('#'+item_el_id);

      // check if item_id already in the list of items
      if (item_in_event_el.length > 0) {
        // if it is then highlight item
        item_in_event_el.effect("highlight", {}, 1000);
      } else {
        // if it is not then add it to the end of the list
        items_list = target_event.find('.items ul');
        
        // if the ul doesnt exist create it
        if (items_list.length == 0) {
          target_event.find('.items').append('<ul></ul>');
          items_list = target_event.find('.items ul'); // find the ul that we just created
        }

        items_list.append("<li id='" + item_el_id + "' class='photo_item ajax_loading'></li>");
        item_in_event_el = target_event.find('#'+item_el_id); // find the li that we just created

        // create a new item in the db
        item = new Item();
        item.setAttributes({event_id: event_id, type: 'Photo', title: title, provider_id: provider_id, source_id: source_id,
          album_id: album_id, source_url: source_url, source_created_at: source_created_at, photo_urls: photo_urls});

        item.save({success: function(objResponse) {
            debug.log(objResponse, item_in_event_el.length);
            item_in_event_el.replaceWith(objResponse);
            applyFancyBox();
          },
          error: function( objRequest ){
            alert('error');
          },
          complete: function( objRequest ){
          }}
        );
      }
      // TODO handle multiple drags*/
    }
  });

  // remove an item from an event
  event.find('a.remove_item_from_event').live('click', function() {
    item_el = $(this).parents('li.item');
    item_id = item_el.find('.item_id').text();
    item_el.hide();
    item = new Item(item_id);
    item.destroy({
      success: function(objResponse) { item_el.remove(); },
      error: function(objResponse) { item_el.show(); }
    });
    return false;
  });
}