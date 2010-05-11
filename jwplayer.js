JWPlayerVideo = function(domObject, url, callback) {
  this.domObject = domObject;
  this.url = url;
  this.callback = callback;
};

JWPlayerVideo.canHandleURL = function(url) {
  return url.match(/jwplayer/)
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

  if(file) {
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
