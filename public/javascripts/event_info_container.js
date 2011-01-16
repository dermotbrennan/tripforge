function EventInfoContainer(selector, trip) {
  this.el = $(selector);
  if (this.el.length == 0) debug.log('No valid event info container element!');

  // make it draggable
  this.el.draggable({handle: 'h2'});

  trip.event_info_container = this;

  return this;
}

EventInfoContainer.prototype.showEvent = function(event_id) {
  this.el.show().html($('#event-point-'+event_id+' .info').html());
}
