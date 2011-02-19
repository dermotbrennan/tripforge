function activatePhotoAlbums() {
  $('.photo_albums a').live('click', function() {
    link = $(this);
    debug.log(link.attr('href'));
    album_id = link.attr('href').replace(/#/, '');
    if (album_id.length > 0) {
      all_albums = $(link.parents('ul.photo_albums')[0]);
      provider_code = all_albums.attr('id').replace(/#/, '').replace(/_albums/, '');
      album_el_id = provider_code+'_album_'+album_id;
      album = $('#'+album_el_id);
      if (album.length > 0) {
        album.show();
        all_albums.hide();
      } else {
        all_albums.hide();
        all_albums.after("<div id='"+album_el_id+"' class='"+provider_code+"_album album ajax_loading'></div>")
        album = $('#'+album_el_id);
        album.load('/providers/'+provider_code+'/album/'+album_id, function(data) {
          album.show();
          album.removeClass('ajax_loading');
          //album.find('ul.photos').selectable(); // make selectable so that user can choose which to import
          album.find('li.photo').draggable({
            scope: 'photos',
            revert: 'invalid',
            helper: 'clone',
            appendTo: '#main-content',
            start: function(e, ui) {
              ui.helper.prevObject.css({visibility: 'hidden'});
            },
            stop: function(e, ui) {
              ui.helper.prevObject.css({visibility: 'visible'});
            }
          });
        });
      }
    } else {
      debug.log('invalid album id');
    }
    return false;
  });

  $('.album a.back_to_all_albums').live('click', function() {
    provider_code = $(this).attr('href').replace(/#/, '').replace(/all_albums_/, '');
    $('.'+provider_code+'_album').hide();
    $('#'+provider_code+'_albums').show();
    return false;
  });
}