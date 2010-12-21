// convert "event-123" to 123
function cleanEventId(event_el_id) {
  return parseInt(event_el_id.replace(/\D+/g, ''));
}

function isDefined(variable) {
  return (!!variable && typeof(variable) != 'undefined');
}

function orDefault(variable, default_value) {
  return isDefined(variable) ? variable : default_value;
}

function presence(variable) {
  return orDefault(variable, false);
}

//Object.prototype.clone = function() {
//  var newObj = (this instanceof Array) ? [] : {};
//  for (i in this) {
//    if (i == 'clone') continue;
//    if (this[i] && typeof this[i] == "object") {
//      newObj[i] = this[i].clone();
//    } else newObj[i] = this[i]
//  } return newObj;
//};