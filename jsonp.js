(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('jsonp', [], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.jsonp = factory();
  }
}(this, function () {
  var jsonp = {};

  var getKeys = function(obj) {
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) keys.push(key);
    }
    return keys;
  };

  jsonp.req = function (url, data, method, callback) {
    var options;
    if (typeof url === 'object') {
      options = url;
    } else if (typeof data === 'function') {
      options = {
        url: url,
        callback: data,
        method: 'callback',
        data: {}
      };
    } else if (typeof method === 'function'){
      options = {
        url: url,
        callback: method,
        method: 'callback',
        data: {}
      };
    } else {
      options = {
        url: url,
        data: data || {},
        callback: callback,
        method: method
      };
    }

    var query = '';
    if (options.data) {
      var keys = getKeys(options.data);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = options.data[key];
        query += encodeURIComponent(key) + '=' + encodeURIComponent(value);
        if (i !== keys.length-1) {
          query += '&';
        }
      }
    }
    var callbackName;
    if (options.callback) {
      if(!Date.now){
        Date.now = function() { return new Date().getTime(); };
      }
      var timestamp = Date.now();
      callbackName = 'jsonp' + Math.round(timestamp+Math.random()*1000001);
      window[callbackName] = function(json){
        options.callback(json);
        delete window[callbackName];
      };
    }
    if (query) {
      options.url += '?' + query;
    }
    if (callbackName) {
      options.url += query ? '&' : '?' +
        encodeURIComponent(options.method) + '=' + callbackName;
    }
    jsonp.loadScript(options.url, options.onload, options.onerror);
  };

  jsonp.loadScript = function(url, onload, onerror) {
    var script = document.createElement('script');
    script.src = url;
    var done = false;
    script.onload = script.onreadystatechange = function (ev) {
      if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        done = true;
        if (onload) {
          onload(ev);
        }
        script.onload = script.onreadystatechange = null;
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }
    };
    if (onerror) {
      script.onerror = onerror;
    }
    var head = document.head;
    if (!head) {
      head = document.getElementsByTagName('head')[0];
    }
    head.appendChild(script);
  };

  return jsonp;
}));
