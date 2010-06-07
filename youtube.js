function YouTubeReplacer(videoID, videoHash, domObject) {
  this.videoID = videoID;
  this.videoHash = videoHash;
  this.domObject = domObject;
}

YouTubeReplacer.prototype.watchURL = function() {
  return "http://www.youtube.com/watch?v=" + this.videoID;
};

// Based on http://userscripts.org/scripts/review/62634
//
// WebM or MP4 first? Users may be using low versions of Chrome which do not
// support WebM. On the other hand, some setups of Chromium support WebM but
// not MP4.
//
// TODO We may want to use the <source> element to provide alternatives
YouTubeReplacer.formats = [
  22, // 'MP4  720p'
  18, // 'MP4  (SD)'
  45, // 'WebM 720p'
  43  // 'WebM 360p'
]

YouTubeReplacer.prototype.videoURLs = function(fmts) {
  var idAndHash = "&video_id=" + this.videoID + "&t=" + this.videoHash;
  return fmts.map(function(fmt) {
    return "http://www.youtube.com/get_video?fmt=" + fmt + idAndHash;
  });
}

// Try requesting HEAD of the given URLs. If a URL succeeds, call this.replace
// with the URL and ignore the subsequent URLs; otherwise try the next URL
// recursively.
YouTubeReplacer.prototype.tryURLs = function(urls) {
  if (urls.length == 0) {
    return;
  }
  var url = urls.shift();

  var self = this;

  chrome.extension.sendRequest({
    action: 'ajax',
    args: {
      type: 'HEAD',
      url: url
    }
  }, function(result) {
    if (result.textStatus == 'success') {
      if (!self.doReplacement(self.domObject, url)) {
        // On youtube.com pages, the embed element seems to always lose its
        // parent node, and a different embed element object is found in the
        // document afterwards. So we have to use the following hack. 
        // FIXME if this situation happens on a different site, and there are
        // multiple embed elements, the result might be ugly. youtube.com pages
        // currently contain only one embed each.
        var interval = window.setInterval(function() {
          if(self.doReplacement(jQuery('embed'), url)) {
            window.clearInterval(interval);
          }
        }, 500);
      }
    } else {
      self.tryURLs(urls);
    }
  });
}

YouTubeReplacer.prototype.doReplacement = function(domObject, url) {
  if (domObject.parent().length > 0) {
    VideoHandlers.replaceFlashObjectWithVideo(domObject, url,
      { watchURL: this.watchURL(), downloadURL: url }
    );
    return true;
  } else {
    return false;
  }
}

YouTubeReplacer.prototype.replaceWithBestSource = function() {
  this.tryURLs(this.videoURLs(YouTubeReplacer.formats));
};

