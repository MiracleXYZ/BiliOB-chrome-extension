'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var console = (function (Cons) {
    return {
        log: function (text) {
            Cons.log(text);
        },
        info: function (text) {
            Cons.info(text);
        },
        warn: function (text) {
            Cons.warn(text);
        },
        error: function (text) {
            Cons.error(text);
            // Send errors to a server for easier debugging later
        }
    };
  }(window.console));
  (function () {
    console.info(`BiliOB: Initializing on ${window.location.hostname}`);
    if (window.location.host === 'www.bilibili.com') {
      console.log('...');
    }
  })();
})