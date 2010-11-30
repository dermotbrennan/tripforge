jQuery.fn.event_formify = function() {
  var event_list = $('ul#events');
  var event_form = this;
  var event_list_item = event_form.parent();
  var event_summary = event_list_item.find('.event_summary');

  this.initForm = function() {
    // time picker
    this.find('input.datetime_picker').AnyTime_noPicker();
    this.find('input.datetime_picker').AnyTime_picker({format: "%H:%i %a %d/%b/%Y"});
    return this;
  }

  this.hideForm = function() {
    this.hide();
    this.find('input.datetime_picker').AnyTime_noPicker();
    return this;
  }

  // cancel edit
  cancel_edit_event_buttons = this.find('a.cancel_edit_event_button');
  cancel_edit_event_buttons.live('click', function() {
    event_form.hideForm();
    event_summary.show();
    return false;
  });

  // saving
  save_event_buttons = this.find('a.save_event_button');
  save_event_buttons.live('click', function() {
    event_form.hideForm();
    event_summary.css('visibility', 'hidden');
    event_summary.show();
    event_list_item.addClass('reloading');

    event_id = event_list_item.find('.event_id').text();
    trip_id = event_form.find('input#event_trip_id').val();
    form_data = event_form.serialize();
    $.post('/trips/'+trip_id+'/events/'+event_id, form_data, function(data) {
      event_list_item.removeClass('reloading');
      event_summary.css('visibility', 'visible');
      event_summary.html(data);
    });

    return false;
  });

  // creating
  create_event_button = event_form.find('#create_event_button');
  create_event_button.click(function() {
    trip_id = event_form.find('input#event_trip_id').val();
    event_form.addClass('reloading');
    form_data = event_form.serialize();
    form_attributes = event_form.serializeArray();
    debug.log(form_data);
    event = new Event(form_data, form_attributes);
    if (event.isValid()) {
      event.save({success: function( objResponse ){
          event_form[0].reset(); // reset new event form
          event_form.find('.error').remove(); // remove any error messages
          event_list.append(objResponse); // place new event in list
          event_list.event_listify(); // re-add the jquery magic to make new list sortable and stuff
        },
        error: function( objRequest ){
          event_form.prepend("<div class='errors'>Errors</div>");
        },
        complete: function( objRequest ){
          event_form.removeClass('reloading');
        }}
      );
    } else {
      event_form.displayFormValidationErrors(event.errors);
    }
    return false;
  });

  this.displayFormValidationErrors = function(errors) {
    debug.log(errors);
    event_form.find('.error').remove();
    $.each(errors, function(i, error) {
      attr_name = error[0];
      error_msg = error[1];
      if (attr_name == 'dates_error') {
        error_li = event_form.find('li#event_ended_at_input');
        error_li.after("<li class='error'>" + error_msg + "!</li>");
      } else {
        error_attr = event_form.find(':input[name=event[' + attr_name + ']]');
        error_attr.after("<p class='error'>" + attr_name + " " + error_msg + "!</p>");
      }
    });
  }

  return this;
};