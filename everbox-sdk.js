/*
 * require:
 *
 * sha1.js:
 * oauth.js:
 * jquery.js:
 * oauth.consumer.js:
 */
(function($){
 $.everbox = $.everbox || {};
 $.e = $.everbox;

 $.e.consumer_key = 'no2egSIZiGwj19DlasKb9UWwKcRxOOq50XuE0gey';
 $.e.consumer_secret = 'RfJhWjSv3T7bWXXKzeTIkw326CD7KluyRkx38BDo';
 $.e.consumer = function(opts) {
  opts = opts || {};
  var consumer_key = opts.consumer_key || $.e.consumer_key;
  var consumer_secret = opts.consumer_secret || $.e.consumer_secret;
  return new OAuth.Consumer(consumer_key, consumer_secret, {site: "https://account.everbox.com"});
  };

  $.e.get_request_token = function(callback) {
    $.e.consumer().get_request_token({}, callback);
  }
  
 })(jQuery);

