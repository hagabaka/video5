VimeoVideo = function(domObject, url, callback) {
  this.domObject = domObject;
  this.url = url;
  this.callback = callback;

  this.clipId = /^http:\/\/(?:www.)?vimeo.com\/.+clip_id=(\d+)/.exec(this.url)[1];

  if (this.clipId)
    this.watchUrl = 'http://vimeo.com/' + this.clipId;
};

VimeoVideo.prototype.canHandle = function() {
  return this.clipId && true;
};

VimeoVideo.prototype.start = function() {
  var videoUrl = 'http://vimeo.com/play_redirect?clip_id=' + this.clipId;
  this.callback({videoUrl: videoUrl, watchUrl: this.watchUrl, downloadUrl: videoUrl});
};

