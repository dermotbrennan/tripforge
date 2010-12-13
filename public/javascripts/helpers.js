// convert "event-123" to 123
function cleanEventId(event_el_id) {
  return parseInt(event_el_id.replace(/\D+/g, ''));
}

function isDefined(variable) {
  return (typeof(variable) != 'undefined');
}

function orDefault(variable, default_value) {
  return isDefined(variable) ? variable : default_value;
}

function presence(variable) {
  return orDefault(variable, false);
}
