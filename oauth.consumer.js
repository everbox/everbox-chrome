// OAuth.Consumer.js
//
// This library attempts to mimic the Ruby OAuth library's
// functionality in Javascript, making it easy for Ruby 
// developers to use native JS OAuth. It requires jQuery.
OAuth.Consumer = function(consumer_key, consumer_secret, options) {
	this.consumer_key = consumer_key;
	this.consumer_secret = consumer_secret;
	
	this.scheme = options.scheme || "HMAC-SHA1";
	
	this.site = options.site;
	
	this.accessor = function(token) {
		var acc = {
			consumerKey:this.consumer_key,
			consumerSecret:this.consumer_secret,
		}
		
		if (token) {
			acc.token = token.token;
			acc.tokenSecret = token.secret;
		}
		
		return acc;
	}
	
	jQuery.each(['request_token', 'access_token', 'authorize'], function() {
		if (options[this + '_path'])
			options[this + '_url'] = options.site + options[this + '_path'];
	});
	
	this.request_token_url = options.request_token_url || options.site + '/oauth/request_token';
	this.access_token_url = options.request_token_url || options.site + '/oauth/access_token';
	this.authorize_url = options.request_token_url || options.site + '/oauth/authorize'
	
	this.get_request_token = function(options, callback) {
		this.request('GET', this.request_token_url, null, {data:options}, function(response) {
			var token = response.match(/oauth_token=([^&]+)/i)[1];
			var secret = response.match(/oauth_token_secret=([^&]+)/i)[1];
			var t = new OAuth.RequestToken(this, token, secret);
			callback.call(this, t, response);
		});
	}
	
	this.request = function(method, path, token, options, callback) {
		if (!callback) { var callback = options; options = null; }
		
		if (path.indexOf('http') != 0)
			path = this.site + path;
		
		var params = [];

		if (options && options.data) {
			for(var key in options.data) {
			  if(options.data.hasOwnProperty(key))
			    params.push([key, options.data[key]]);
			}
		}
		
		var message = {
			method:method,
			action:path,
			parameters:params
		}
		
		OAuth.completeRequest(message, this.accessor(token));
		this.send_request(message, callback);
	}
	
	this.send_request = function(message, callback, opts) {
		//console.log(message);
		var options = jQuery.extend({}, {
			url:message.action,
			type:message.method,
			data:OAuth.formEncode(message.parameters),
			context:this,
			success:callback,
			complete:function(request){ "AJAX Request Completed." },
			error:function(request) { console.log(request); alert(request.status.toString()); }
		}, opts);
		
		jQuery.ajax(options);
	}
}

OAuth.RequestToken = function(consumer, token, secret) {
	this.consumer = consumer;
	this.token = token;
	this.secret = secret;
	
	this.authorize_url = function() {
		return (this.consumer.authorize_url + '?' + jQuery.param({oauth_token:this.token}));
	}
	
	this.get_access_token = function(options, callback) {
		this.consumer.request('POST', this.consumer.access_token_url, this, {data:jQuery.extend({}, options, {oauth_token:this.token})}, function(response) {
			tokenMatch = response.match(/oauth_token=([^&]+)/i);
			secretMatch = response.match(/oauth_token_secret=([^&]+)/i);
			
			if (!tokenMatch || !secretMatch) {
				return false;
			}
			
			var token = tokenMatch[1];
			var secret = secretMatch[1];
			
			var t = new OAuth.AccessToken(this, token, secret);
			callback.call(this, t, response);
		});
	}
}

OAuth.AccessToken = function(consumer, token, secret) {
	this.consumer = consumer;
	this.token = token;
	this.secret = secret;
	
	this.request = function(method, path, options, callback) {
		if (!callback) { callback = options; options = null; }
		this.consumer.request(method, path, this, options, callback);
	};
		
	this.get = function(path, options, callback) {
		this.request('GET', path, null, options, callback);
	};
	
	this.del = function(path, options, callback) {
		this.request('DELETE', path, null, options, callback);
	};
	
	this.post = function(path, options, callback) {
		this.request('POST', path, body, options, callback);
	};
	
	this.put = function(path, options, callback) {
		this.request('PUT', path, body, options, callback);
	};
}