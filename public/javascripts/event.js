function Event(data_obj, attrs) {
  attributes = {};
  $.each(attrs, function(i, hsh) {
    if (hsh.name.match(/event/)) {
      attributes[hsh.name.replace(/(event\[)|\]/g, '')] = hsh.value;
    } else {}
  });
  this.attributes = attributes;
  this.data = data_obj;
  
  // convert dates
  function cleanDate(date) {
    date = date.split(' ');
    if (date.length == 3) {
      date = date[1] + " " + date[2] + " " + date[0];
    }
    return Date.parse(date);
  }
  this.attributes['started_at'] = cleanDate(this.attributes['started_at']);
  this.attributes['ended_at'] = cleanDate(this.attributes['ended_at']);

  this.errors = [];

  this.isValid = function() {
    this.isPresent('trip_id');
    this.isPresent('name');
    this.occursAfter('started_at', 'ended_at');
    return (this.errors.length == 0);
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
    if (ended_at > started_at) {
      return true;
    } else {
      this.errors.push(['dates_error', "event can't end before it starts"]);
      return false;
    }
  };

  return this;
}