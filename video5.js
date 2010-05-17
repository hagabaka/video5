var VideoHandlers = [YouTubeVideo, JWPlayerVideo];

jQuery(window).bind('DOMNodeInserted', function(e) {
  jQuery('object, embed', e.target).each(function() {
    lookForFlashVideos(this);
  });
});

jQuery(function() {
  jQuery('object, embed').each(function() {
    lookForFlashVideos(this);
  });
});

function lookForFlashVideos(elem) {
  // We handle three situations:
  // - <embed> alone (as used for example in Google Reader):
  //   <embed src="http://www.youtube.com/v/32vpgNiAH60&amp;hl=en_US&amp;fs=1&amp;" allowscriptaccess="never" allowfullscreen="true" width="480" height="295" wmode="transparent" type="application/x-shockwave-flash">
  //   * type should be application/x-shockwave-flash
  //   * src should be present
  //   * no <object> tag as (direct) parent
  // - Using only <object>, as explained in <http://www.bernzilla.com/item.php?id=681>:
  //   <object type="application/x-shockwave-flash" style="width:425px; height:350px;" data="http://www.youtube.com/v/7_6B6vwE83U">
  //     <param name="movie" value="http://www.youtube.com/v/7_6B6vwE83U" />
  //   </object>
  //   * type should be "applicaiton/x-shockwave-flash"
  //   * data should be present
  //   * no embed inside
  // - YouTube provided code:
  //   <object width="480" height="385">
  //     <param name="movie" value="http://www.youtube.com/v/jwMj3PJDxuo&hl=es_ES&fs=1&"></param>
  //     <param name="allowFullScreen" value="true"></param>
  //     <param name="allowscriptaccess" value="always"></param>
  //     <embed src="http://www.youtube.com/v/jwMj3PJDxuo&hl=es_ES&fs=1&" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="480" height="385"></embed>
  //   </object>
  //   * object with no type or data
  //   * embed with type "application/x-shockwave-flash"
  //   * embed with src
  //   * We also have to handle the cases where embed is found before/after
  //     object, but we have already handled object as a whole.
  
  var obj = jQuery(elem);
  if (elem.tagName == 'EMBED') {
    // First look for the parent.
    var parent = obj.parent();
    if (parent[0].tagName == 'OBJECT') {
      handleObjectTag(parent);
    } else {
      handleEmbedTag(obj);
    }
  } else if (elem.tagName == 'OBJECT') {
    handleObjectTag(obj);
  }
}

function handleEmbedTag(obj) {
  if (obj.attr('src') !== undefined &&
      obj.attr('type') == 'application/x-shockwave-flash') {
    handleTagAndURL(obj, obj.attr('src'));
  }
}

function handleObjectTag(obj) {
  if (obj.attr('data-video5-visited') != 'yes') {
    if (obj.attr('data') !== undefined &&
        obj.attr('type') == 'application/x-shockwave-flash') {
      obj.attr('data-video5-visited', 'yes');
      handleTagAndURL(obj, obj.attr('data'));
    } else {
      var children = obj.children('embed');
      if (children.length > 0 &&
          children.attr('src') !== undefined &&
          children.attr('type') == 'application/x-shockwave-flash') {
        obj.attr('data-video5-visited', 'yes');
        handleTagAndURL(obj, children.attr('src'));
      }
    }
  }
}

function handleTagAndURL(obj, url) {
  for (var idx = 0; idx < VideoHandlers.length; idx++) {
    var videoHandler = VideoHandlers[idx];
    
    if (videoHandler.canHandleURL(url)) {
      var vh = new videoHandler(obj, url, function(params) {
        replaceFlashObjectWithVideo(obj, params);
      });
      vh.start();
      break;
    }
  }
}

function replaceFlashObjectWithVideo(obj, params) {
  var videoTag = jQuery('<video controls="controls" width="100%">').attr(
                        'src', params.videoUrl),
      wrapper  = jQuery('<div class="v5-wrapper">'),
      controls = jQuery('<div class="v5-controls">');

  wrapper.append(videoTag);
  obj.replaceWith(wrapper);

  wrapper.css({
    'width': videoTag.width(),
    'height': videoTag.height()
  });
  
  videoTag.bind('loadedmetadata', function(e) {
    wrapper.css({
      'width': videoTag.width(),
      'height': videoTag.height()
    });
  });

  if (params.watchUrl) {
    controls.append(jQuery('<a class="v5-goto" href="' + params.watchUrl + '">'));
  }
  if (params.downloadUrl) {
    controls.append(jQuery('<a class="v5-download" href="' + params.downloadUrl + '">'));
  }
  wrapper.append(controls);
}

