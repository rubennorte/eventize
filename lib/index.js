
'use strict';

var eventizeObject = require('./eventize-object');
var eventizeMethod = require('./eventize-method');
var eventizeMethods = require('./eventize-methods');

function extend(object, other) {
  Object.keys(other).forEach(function(key) {
    object[key] = other[key];
  });
}

var eventize = {};
extend(eventize, eventizeObject);
extend(eventize, eventizeMethod);
extend(eventize, eventizeMethods);

module.exports = eventize;
