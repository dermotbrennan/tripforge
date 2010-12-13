function CustomOverlay(map) {
  this.setMap(map);
  var div = this.div_= document.createElement('div');
  div.className = "overlay";
}

// CustomOverlay is derived from google.maps.OverlayView
CustomOverlay.prototype = new google.maps.OverlayView;

CustomOverlay.prototype.onAdd = function() {
  var pane = this.getPanes().overlayLayer;
  pane.appendChild(this.div_);
}

CustomOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
}

CustomOverlay.prototype.draw = function() {
  var projection = this.projection = this.getProjection();
  var position = projection.fromLatLngToDivPixel(this.getMap().getCenter());

  var div = this.div_;
  div.style.left = position.x + 'px';
  div.style.top = position.y + 'px';
  div.style.display = 'block';
};