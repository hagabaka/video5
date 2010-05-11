Video5
======

Extension for Google Chrome to replace video providers embedded Flash players with 
standard HTML5 video tags.

Extending
---------

To add support for a new embed player,

1. Create a new .js file, modeled after youtube.js or jwplayer.js.  Specifically,
   say you are supporting "FooVideo"::

     // The constructor is passed the DOM object for the Flash plugin, the url
     // of the player, and a callback which will build the video element and
     // replace the Flash plugin with it.
     FooVideo = function(domObject, url, callback) {
       this.domObject = domObject;
       this.url = url;
       this.callback = callback;
     };

     // Define canHandleURL() to filter the player URL you support
     // This might not make much sense for players which webmasters install to
     // their sites and can name arbitrarily. More advanced filtering mechanism
     // might be needed in the future.
     FooVideo.canHandleURL = function(url) {
       return url.match(/foo/)
     };

     // Define start() to determine the video URL and other information, and
     // call the callback
     FooVideo.prototype.start = function() {
       // ... determine videoUrl
       this.callback({videoUrl: videoUrl});
     }

2. Modify manifest.json to include your new .js file::
   
     "js": ["jquery.js", "youtube.js", "jwplayer.js", "foo.js", "video5.js"],
                                                      ^^^^^^^^^^

2. Modify video5.js to include your new class::
   
     var VideoHandlers = [YouTubeVideo, JWPlayerVideo, FooVideo];
                                                     ^^^^^^^^^^

Authors
-------

Daniel Rodríguez Troitiño (drodriguez)
  Original implementation including Youtube support

Yaohan Chen (hagabaka)
  JWPlayer support

