function TransportMode(transport_mode_id) {
  return TransportMode.DATA[parseInt(transport_mode_id)];
}

TransportMode.angled_icon = function(name, angle) {
  width = height = 48;
  size = new google.maps.Size(width, height);
  angle = angle%(2*Math.PI)
  if (angle < 0) angle = (2*Math.PI) + angle // have to be able to handle negative angles

  num_angles = 36;
  angle_interval = (2*Math.PI)/num_angles; // each image in the sprite is adjusted by this angle in radians
  origin_x = width*(Math.floor(angle/angle_interval));
  //debug.log(angle, angle_interval, origin_x);

  origin = new google.maps.Point(origin_x, 0)
  anchor = new google.maps.Point(width/2, height/2)
  return new google.maps.MarkerImage("/images/transport_modes/" + name + ".png",
    size, origin, anchor);
}

TransportMode.ICONS = {
  airplane: function(angle) {
    return TransportMode.angled_icon('airplane', angle);
  },
  walking: function(angle) {
  return new google.maps.MarkerImage("/images/transport_modes/walking.png",
      new google.maps.Size(49, 52),
      new google.maps.Point(0, 0),
      new google.maps.Point(25, 26));
  },
  driving: function(angle) {
    return TransportMode.angled_icon('driving', angle);
  }
}

TransportMode.DATA = [
  null,
  {id: 1, name: "Walking", code: "walking", uppercase_code: "WALKING", color: "#00FC00", icon: TransportMode.ICONS['walking']},
  {id: 2, name: "Driving", code: "driving", uppercase_code: "DRIVING", color: "#0000FC", icon: TransportMode.ICONS['driving']},
  {id: 3, name: "Airplane", code: "airplane", uppercase_code: "AIRPLANE", color: "#FC0000", icon: TransportMode.ICONS['airplane']}
];

