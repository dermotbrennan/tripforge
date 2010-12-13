function TransportMode(transport_mode_id) {
  return TransportMode.DATA[parseInt(transport_mode_id)];
}

TransportMode.ICONS = {
  airplane: function() {
    return new google.maps.MarkerImage("/images/airplane_icon.png",
        new google.maps.Size(50, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(25, 19));
  },
  walking: function() {
  return new google.maps.MarkerImage("/images/walking_icon.png",
      new google.maps.Size(49, 52),
      new google.maps.Point(0, 0),
      new google.maps.Point(25, 26));
  },
  driving: function() {
    return new google.maps.MarkerImage("/images/driving_icon.png",
      new google.maps.Size(24, 50),
      new google.maps.Point(0, 0),
      new google.maps.Point(12, 25));
  }
}

TransportMode.DATA = [
  null,
  {id: 1, name: "Walking", code: "walking", uppercase_code: "WALKING", color: "#00FC00", icon: TransportMode.ICONS['walking']},
  {id: 2, name: "Driving", code: "driving", uppercase_code: "DRIVING", color: "#0000FC", icon: TransportMode.ICONS['driving']},
  {id: 3, name: "Airplane", code: "airplane", uppercase_code: "AIRPLANE", color: "#FC0000", icon: TransportMode.ICONS['airplane']}
];

