(function($){
  /* ebce: EverBox Chrome Extension */
  $.ebce = $.ebce || {};
  _ = $.ebce;
  $.e = $.everbox;

  _.start = function() {
    if(! _.ping()) {
      _.login();
    }
  };

  _.login = function() {
    $.e.get_request_token(function(request_token) {
                            $("#alert").text(request_token.token);
                          });
  };

  _.ping = function() {
    if($.cookie("everbox_token") === null || $.cookie("everbox_secret") === null) {
      return false;
    }
    return true;
  };
})(jQuery);
