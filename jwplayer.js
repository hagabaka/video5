JWPlayerVideo = function(domObject, url, callback) {
  this.domObject = domObject;
  this.url = url;
  this.callback = callback;
};

JWPlayerVideo.canHandleURL = function(url) {
  // JWPlayer can be installed with any name by the webmaster; usually it would
  // probably match "jwplayer", but a certain site uses "player.swf", and there
  // are probably other variants not matched here...
  return url.match(/jwplayer|player\.swf/)
};

JWPlayerVideo.prototype.start = function() {
  var flashvars = this.domObject.attr("flashvars");
  if (!flashvars) {
    param = this.domObject.children().filter("param[name=flashvars]");
    if (param) {
      flashvars = param.attr("value");
    } else {
      return;
    }
  }

  var assignments = flashvars.split("&");
  var image = JWPlayerVideo.flashVar(assignments, "image"),
      file = JWPlayerVideo.flashVar(assignments, "file");

  if(file && /\.(?:mp4|m4v|f4v|ogg|ogv)$/.test(file)) {
    this.callback({videoUrl: file, downloadUrl: file});
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
