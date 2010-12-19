function Event(id) {
  this.id = id;
  this.date_fields = ['started_at', 'ended_at'];
  this.fields = ['trip_id', 'name', 'description', 'latitude', 'longitude', 'transport_mode_id'].concat(this.date_fields);
  this.errors = [];

  this.setAttributes = function(attributes) {
    this.attributes = attributes;
    this.data = '';
    var event = this;
    $.each(this.fields, function(i, field) {
      if (typeof(attributes[field]) != 'undefined' && (""+attributes[field]).length > 0) {
        if (event.data.length > 0) {
          event.data += '&';
        }
        event.data += 'event['+field+']='+attributes[field];
      }
    });
    this.cleanDateAttributes();
  }

  this.setDataAndAttributes = function(data_obj, attrs) {
    attributes = {};
    $.each(attrs, function(i, hsh) {
      if (hsh.name.match(/event/)) {
        attributes[hsh.name.replace(/(event\[)|\]/g, '')] = hsh.value;
      } else {}
    });
    this.attributes = attributes;
    this.cleanDateAttributes();
    this.data = data_obj;
    return true;
  }
  
  // convert dates
  this.cleanDateAttributes = function() {
    var event = this;
    $.each(this.date_fields, function(i, field) {
      if (typeof(event.attributes[field]) != 'undefined' && event.attributes[field].length > 0) {
        event.attributes[field] = cleanDate(event.attributes[field]);
      }
    });
  }

  function cleanDate(date) {
    date = date.split(' ');
    if (date.length == 3) {
      date = date[1] + " " + date[2] + " " + date[0];
    }
    return Date.parse(date);
  }

  this.isValid = function() {
    this.isPresent('trip_id');
    this.isPresent('name');
    this.occursAfter('started_at', 'ended_at');
    return (this.errors.length == 0);
  };

  this.update = function(options) {
    datatype = orDefault(options.datatype, 'json');
    $.ajax({type: 'PUT',
      url: '/events/' + this.id, data: this.data, dataType: datatype,
      success: options.success,
      error: options.error,
      complete: options.complete
    });
  };

  this.save = function(options) {
    trip_id = this.attributes.trip_id;
    $.ajax({type: 'POST',
      url: '/trips/'+trip_id+'/events', data: this.data, dataType: "html",
      success: options.success,
      error: options.error,
      complete: options.complete
    });
  };

  this.isPresent = function(attr_name) {
    if (typeof(this.attributes[attr_name]) == "string" &&
        this.attributes[attr_name] != '') {
      return true;
    } else {
      this.errors.push([attr_name, 'cannot be blank'])
      return false;
    }
  };

  this.occursAfter = function(started_at_attr_name, ended_at_attr_name) {
    started_at = this.attributes[started_at_attr_name],
    ended_at = this.attributes[ended_at_attr_name];
    if (typeof(started_at) != "string" && typeof(ended_at) != "string" && ended_at >= started_at) {
      return true;
    } else {
      this.errors.push(['dates_error', "event can't end before it starts"]);
      return false;
    }
  };

  return this;
}