(function() {
var YouTubeVideo = function(domObject, url) {
  this.domObject = domObject;
  this.url = url;
};

YouTubeVideo.youTubeRegEx = new RegExp('^http://www\.youtube\.com/v/');
YouTubeVideo.prototype.canHandle = function() {
  return YouTubeVideo.youTubeRegEx.test(this.url);
};

YouTubeVideo.prototype.videoIDRegEx = new RegExp('/([-_A-Z0-9]+)(&|$)', 'i');

YouTubeVideo.oldSwfVarsSplitter = function(flashVarsRaw) {
  var flashVars = {};
  flashVarsRaw = flashVarsRaw.split(', ');
  for (var idx = 0; idx < flashVarsRaw.length; idx++) {
    var keyValues = flashVarsRaw[idx].split(': '),
        key = keyValues.shift(),
        val = keyValues.join(': ');
    
    if (key.charAt(0) == '"') {
      key = key.substring(1, key.length - 1);
    }
    
    if (val.charAt(0) == '"') {
      val = val.substring(1, val.length - 1);
    }
    
    flashVars[key] = val;
  }
  
  return flashVars;
};

YouTubeVideo.newFlashvarsSplitter = function(flashVarsRaw) {
  var flashVars = {};
  flashVarsRaw = flashVarsRaw.split('&');
  for (var idx = 0; idx < flashVarsRaw.length; idx++) {
    var keyValues = flashVarsRaw[idx].split('='),
        key = keyValues.shift(),
        val = keyValues.join('=');
    
    flashVars[key] = val;
  }
  
  return flashVars;
};

YouTubeVideo.prototype.swfVarsRegEx = [
  [new RegExp('<param name=\\\\"flashvars\\\\" value=\\\\"(.*?)\\\\">'), YouTubeVideo.newFlashvarsSplitter],
  [new RegExp("var swfConfig = \\{(.*?)\\}"), YouTubeVideo.oldSwfVarsSplitter],
  [new RegExp("'SWF_ARGS': \\{(.*?)\\}"), YouTubeVideo.oldSwfVarsSplitter]
];

YouTubeVideo.prototype.start = function() {
  this.videoID = this.videoIDRegEx.exec(this.url);
  
  if (this.videoID) {
    this.videoID = this.videoID[1];
    
    var self = this;
    chrome.extension.sendRequest({action: 'ajax',
      args: {
        type: 'GET',
        url: YouTubeReplacer.prototype.watchURL.call(this)
    }}, function() { return self.parseSwfVars.apply(self, arguments); });
  }
};

YouTubeVideo.prototype.parseSwfVars = function(response) {
  if (response.textStatus != 'success') {
    return;
  }
  
  var flashVarsRaw = null,
      idx = 0;
  for (idx = 0; flashVarsRaw == null && idx < this.swfVarsRegEx.length; idx++) {
    flashVarsRaw = this.swfVarsRegEx[idx][0].exec(response.data);
  }
  
  if (flashVarsRaw == null) {
    return; // we haven't found the flashVars
  }
  idx -= 1; // idx gets increased before exiting the loop
  
  this.flashVars = this.swfVarsRegEx[idx][1](flashVarsRaw[1]);
  this.videoHash = this.flashVars['t'];
 
  var replacer = new YouTubeReplacer(this.videoID, this.videoHash,
                                     this.domObject);
  replacer.replaceWithBestSource();
};

return YouTubeVideo;
})
