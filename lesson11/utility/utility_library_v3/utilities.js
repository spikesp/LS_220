function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

(function() {
  var _ = function(element) {
    u = {
      first: function() {
        return element[0];
      },
      last: function() {
        return element[element.length - 1];
      },
      without: function() {
        var argumentsArray = [].slice.call(arguments);

        return element.filter(function(item) {
          return argumentsArray.indexOf(item) === -1;
        });
      },
      lastIndexOf: function(value) {
        for (var i = element.length - 1; i >= 0; i--) {
          if (element[i] === value) return i;
        }
        return -1;
      },
      sample: function(sampleLength) {
        if (sampleLength) {
          var result = [];

          for (var i = 0; i < sampleLength; i++) {
            var item = element[getRandomInt(0, element.length)];
            while (result.indexOf(item) !== -1) {
              item = element[getRandomInt(0, element.length)];
            }
            result.push(item);
          }
        } else {
          var result = element[getRandomInt(0, element.length)];
        }

        return result;
      },

      findWhere: function(search) {
        var match;
        var keys = Object.keys(search);

        element.some(function(object) {
          var all_match = keys.every(function(key) {
            return (object.hasOwnProperty(key) &&
                    object[key] === search[key]);
          });

          if (all_match) {
            match = object;
            return true;
          }
        });

        return match;
      },
      where: function(search) {
        return element.filter(function(object) {
          return Object.keys(search).every(function(key) {
            return (object.hasOwnProperty(key) &&
                    object[key] === search[key]);
          });
        });
      },
      pluck: function(key) {
        var values = [];

        element.forEach(function(object) {
          if (object.hasOwnProperty(key)) {
            values.push(object[key]);
          }
        });

        return values;
      },
      keys: function() {
        var result = [];

        for (key in element) {
          if (element.hasOwnProperty(key)) {
            result.push(key);
          }
        }

        return result;
      },
      values: function() {
        var result = [];

        for (key in element) {
          if (element.hasOwnProperty(key)) {
            result.push(element[key]);
          }
        }

        return result;
      },

      pick: function() {
        var keys = [].slice.call(arguments);
        var result = {};

        keys.forEach(function(key) {
          if (element.hasOwnProperty(key)) {
            result[key] = element[key];
          }
        });

        return result;
      },
      omit: function(keyToOmit) {
        var result = {};
        var keys = Object.keys(element);

        keys.forEach(function(key) {
          if (key !== keyToOmit) {
            result[key] = element[key];
          }
        });

        return result;
      },
      has: function(key) {
        return {}.hasOwnProperty.call(element, key);
      },
    };

    (['isElement', 'isArray', 'isObject', 'isFunction', 'isBoolean',
     'isString', 'isNumber']).forEach(function(method) {
      u[method] = function() { return _[method].call(u, element); };
    });

    return u;
  };

  _.range = function(first, second) {
    var result = [];
    var start = second ? first : 0;
    var end = second ? second : first;

    for (var i = start; i < end; i++) {
      result.push(i);
    }

    return result;
  };

  _.extend = function(destination) {
    var sources = [].slice.call(arguments, 1);

    sources.forEach(function(source) {
      Object.keys(source).forEach(function(key) {
        destination[key] = source[key];
      });
    });


    return destination;
  }

  _.isElement = function(e) {
    return e.tagName && e.nodeName;
  };

  _.isArray = function(e) {
    return e.constructor === Array;
  };

  _.isObject = function(e) {
    return e.constructor === Function ||
           e.constructor === Object ||
           e.constructor === Array;
  };

  _.isFunction = function(e) {
    return e.constructor === Function;
  };

  ['Boolean', 'String', 'Number'].forEach(function(method) {
    _['is' + method] = function(e) {
      return toString.call(e) === '[object ' + method + ']';
    };
  });

  window._ = _;
})();
