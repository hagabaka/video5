function YouTubeReplacer(videoID, videoHash, domObject) {
  this.videoID = videoID;
  this.videoHash = videoHash;
  this.domObject = domObject;
}

YouTubeReplacer.prototype.watchURL = function() {
  return "http://www.youtube.com/watch?v=" + this.videoID;
};

YouTubeReplacer.prototype.videoSDURL = function() {
  return "http://www.youtube.com/get_video?fmt=18&video_id=" + this.videoID + "&t=" + this.videoHash;
};

YouTubeReplacer.prototype.videoHDURL = function() {
  return "http://www.youtube.com/get_video?fmt=22&video_id=" + this.videoID + "&t=" + this.videoHash;
};

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
      VideoHandlers.replaceFlashObjectWithVideo(
        self.domObject,
        url,
        {watchURL: self.watchURL(), downloadURL: url}
      );
    } else {
      self.tryURLs(urls);
    }
  });
}

YouTubeReplacer.prototype.replaceWithBestSource = function() {
  this.tryURLs([this.videoHDURL(), this.videoSDURL()])
};

