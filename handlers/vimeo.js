(function() {
VimeoVideo = function(domObject, url) {
  this.domObject = domObject;
  this.url = url;
};

VimeoVideo.vimeoRegEx = new RegExp('^http://(?:www\\.)?vimeo\\.com/.+clip_id=(\\d+)');
VimeoVideo.prototype.canHandle = function() {
  console.log('url: ' + this.url);
  console.log('result: ' + VimeoVideo.vimeoRegEx.test(this.url));
  return VimeoVideo.vimeoRegEx.test(this.url);
};

VimeoVideo.prototype.start = function() {
  var match = VimeoVideo.vimeoRegEx.exec(this.url);
  if (match) {
    this.clipId = match[1];
    this.watchUrl = 'http://vimeo.com/' + this.clipId;
    
    var videoUrl = 'http://vimeo.com/play_redirect?clip_id=' + this.clipId;

    VideoHandlers.replaceFlashObjectWithVideo(this.domObject,
      videoUrl,
      { watchURL: this.watchUrl });
  }
};

return VimeoVideo;
})
