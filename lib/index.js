
'use strict';

var eventizeObject = require('./eventize-object');
var eventizeMethod = require('./eventize-method');

var eventize = eventizeObject;
eventize.object = eventizeObject;
eventizeObject.method = eventizeMethod;

module.exports = eventize;
