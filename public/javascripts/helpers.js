// convert "event-123" to 123
function cleanEventId(event_el_id) {
  return parseInt(event_el_id.replace(/event-/, ''));
}