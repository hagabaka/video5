(function() {

JWPlayerVideo = function(domObject, url) {
  this.domObject = domObject;
  this.url = url;

  var flashVarsParser = new FlashVarsParser(this.domObject);
  this.file = flashVarsParser.valueFor("file");
};

JWPlayerVideo.prototype.canHandle = function() {
  return this.file && true;
};

JWPlayerVideo.prototype.start = function() {
  if(this.file && /\.(?:mp4|m4v|f4v|ogg|ogv)$/.test(this.file)) {
    VideoHandlers.replaceFlashObjectWithVideo(this.domObject, this.file,
                                              {downloadURL: this.file});
  }
};

return JWPlayerVideo;

})
