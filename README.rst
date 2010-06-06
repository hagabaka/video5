Video5
======

Extension for Google Chrome to replace video providers embedded Flash
players with standard HTML5 video tags.


Supported
---------

* Youtube

  Flash videos on youtube.com pages include user pages are
  replaced. (Currently the video element may not fit well in the page
  layout, and you may need to use the context menu to control it if
  the control bar is obscured.) You should also try `Youtube HTML5 Beta
  <http://www.youtube.com/html5>`_; videos in Youtube's HTML5 player are
  not modified. Youtube videos embedded on other web pages are also supported.

* JWPlayer

  JWPlayer embedding MP4 and OGV files are supported.

* Vimeo

  Vimeo.com pages are not modified. You should try `Vimeo HTML5 Beta
  <http://vimeo.com/blog:268>`_ (click on the "Switch to HTML5 Player" link
  below any video). Vimeo videos embedded on other web pages are supported.


Extending
---------

To add support for a new video player provider,

1. Create a new .js file inside the handlers subdirectory, modeled after
   youtube.js or any other file in that directory.  Specifically, say you are
   supporting "FooVideo" in foo.js::

     // Your file MUST be wrapped in a function, and you MUST return your
     // handler object at the end of your function.
     (function() {
     
     // The constructor is passed the DOM object for the Flash plugin, the url
     // of the player.
     FooVideo = function(domObject, url) {
       this.domObject = domObject;
       this.url = url;
     };

     // Define canHandle() to filter Flash plugins you support
     FooVideo.prototype.canHandle = function() {
       return this.url.match(/foo/);
     };

     // This is the “entry point” for your handler, from this point you can
     // do whatever your handler need to do to get the video final URL.
     FooVideo.prototype.start = function() {
       // ...
       // You can send a request to the background page in case you need to
       // fetch external resources using XHR.
       chrome.extension.sendRequest({action: 'ajax',
         args: {
           type: 'GET',
           url: myUrl
       }}, function(response) {
         /* do something with response.data and response.textStatus */
       });
       // ...
       // Invoke VideoHandlers.replaceFlashObjectWithVideo providing the
       // DOM object to substitute and the video URL to use. You can also
       // provide a watchURL and a downloadURL that will create links in the
       // interface for those actions.
       VideoHandlers.replaceFlashObjectWithVideo(this.domObject,
         videoURL,
         { watchURL: watchURL, downloadURL: downloadURL });
     }
     
     // This is the end, so return your handler object
     return FooVideo;
     })

2. Modify video5.js to include your new handler::
   
     VideoHandlers.register('youtube', 'foo');
                                       ^^^^^


Authors
-------

Daniel Rodríguez Troitiño (drodriguez)
  Original implementation including support for Youtube videos embedded on
  other websites.

Yaohan Chen (hagabaka)
  Ideas and supporting code about the splitting the handlers code. Support
  for JWPlayer, Vimeo, and Flash videos on Youtube.com.

