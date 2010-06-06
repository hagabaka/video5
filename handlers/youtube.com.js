(function() {
  function YouTubeComVideo(domObject, url) {
    this.domObject = domObject;
    this.url = url;
  };

  YouTubeComVideo.urlRegExp = new RegExp('^http://s.ytimg.com/yt/swf/watch');
  YouTubeComVideo.prototype.canHandle = function() {
    return this.url.match(YouTubeComVideo.urlRegExp);
  };

  YouTubeComVideo.prototype.start = function() {
    var flashVarsParser = new FlashVarsParser(this.domObject);
    var videoID = flashVarsParser.valueFor('video_id'),
        videoHash = flashVarsParser.valueFor('t') ||
                    flashVarsParser.valueFor('token');
    if (videoID && videoHash) {
      var youTubeReplacer = new YouTubeReplacer(videoID, videoHash,
                                                this.domObject);
      youTubeReplacer.replaceWithBestSource();
    }
  };

  return YouTubeComVideo;
})

