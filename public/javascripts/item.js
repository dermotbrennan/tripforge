function Item(id) {
  this.id = id;
  this.fields = ['event_id', 'title', 'type', 'author', 'content', 'rating',
    'latitude', 'longitude', 'device', 'source_id', 'source_url',
    'source_created_at', 'provider_id', 'album_id'
  ];

  this.setAttributes = function(attributes) {
    this.attributes = attributes;
    this.data = '';
    var item = this;
    $.each(this.fields, function(i, field) {
      if (typeof(attributes[field]) != 'undefined' && (""+attributes[field]).length > 0) {
        if (item.data.length > 0) {
          item.data += '&';
        }
        item.data += 'item['+field+']='+attributes[field];
      }
    });
  }

  this.update = function(options) {
    datatype = orDefault(options.datatype, 'json');
    $.ajax({type: 'PUT',
      url: '/items/' + this.id, data: this.data, dataType: datatype,
      success: options.success,
      error: options.error,
      complete: options.complete
    });
  };

  this.save = function(options) {
    //debug.log(options);
    datatype = orDefault(options.datatype, 'html');
    $.ajax({type: 'POST',
      url: '/items', data: this.data, dataType: datatype,
      success: options.success,
      error: options.error,
      complete: options.complete
    });
  }

  this.destroy = function(options) {
    //debug.log(options);
    datatype = orDefault(options.datatype, 'html');
    this.data = {'_method': 'DELETE'};
    $.ajax({type: 'POST',
      url: '/items/'+this.id, data: this.data, dataType: datatype,
      success: options.success,
      error: options.error,
      complete: options.complete
    });
  }

  return this;
}