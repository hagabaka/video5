(function() {

JWPlayerVideo = function(domObject, url) {
  this.domObject = domObject;
  this.url = url;

  this.getFlashVars();
};

JWPlayerVideo.prototype.getFlashVars = function() {
  var flashvars = this.domObject.attr("flashvars")
               || this.domObject.children().filter("param[name=flashvars]").attr("value");

  if (flashvars) {
    var assignments = flashvars.split("&");
    this.image = JWPlayerVideo.flashVar(assignments, "image");
    this.file = JWPlayerVideo.flashVar(assignments, "file");
  }
}

JWPlayerVideo.prototype.canHandle = function() {
  return this.file && true;
};

JWPlayerVideo.prototype.start = function() {
  if(this.file && /\.(?:mp4|m4v|f4v|ogg|ogv)$/.test(this.file)) {
    VideoHandlers.replaceFlashObjectWithVideo(this.domObject, this.file,
                                              {downloadURL: this.file});
  }
};

JWPlayerVideo.flashVar = function(assignments, name) {
  var result = null;
  assignments.some(function(item, index, all) {
    match = new RegExp(name + "=(.+)").exec(item);
    if(match) {
      result = match[1];
      return true;
    } else {
      return false;
    }
  });
  return result;
};

return JWPlayerVideo;

})
