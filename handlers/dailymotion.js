(function() {
DailyMotionVideo = function(domObject, watchUrl) {
  this.domObject = domObject;
  this.watchUrl = watchUrl;
};

DailyMotionVideo.tryHandling = function(node, url) {
  // we can handle Flash movies with URL dailymotion.com/swf/video/....
  if (/^http:\/\/(?:www\.)?dailymotion\.com\/swf\/video\/.+/.test(url)) {
    // simply remove /swf to get the URL of the watch page
    return new DailyMotionVideo(node, url.replace('/swf/', '/'));
  } else {
    return null;
  }
};

DailyMotionVideo.prototype.start = function() {
  var self = this;
  console.log(this.watchUrl);
  chrome.extension.sendRequest({action: 'ajax',
    args: {
      type: 'GET',
      url: this.watchUrl
  }}, function(response) {
    console.log(response.data.length);
    // look for URL escaped "hqURL":"<URL>" on the watch page
    var match = /%22hqURL%22%3A%22(.+?)%22/.exec(response.data);
    if (match) {
      // unescape the URL, and remove the backslashes in it (inserted
      // before slashes for some reason)
      VideoHandlers.replaceFlashObjectWithVideo(self.domObject,
        unescape(match[1]).replace(/\\/g, ''),
        { watchURL: self.watchUrl});
    }
  });
};

return DailyMotionVideo;
})

