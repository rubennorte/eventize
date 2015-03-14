
'use strict';

var eventizeMethod = require('./eventize-method');
var events = require('./events');

/**
 * Converts the given object into an event emitter,
 * emitting events before and after calling the specified functions
 * @param  {Object} target
 * @param  {string[]} methods
 * @return {Object} The original object, modified
 */
function eventizeObject(target, methods) {
  var targetType = typeof target;
  if (!target || (targetType !== 'object' && targetType !== 'function')) {
    throw new TypeError('the target must be an object or a function');
  }

  if (!events.isEventEmitter(target)) {
    events.makeEventEmitter(target);
  }

  if (methods) {
    [].forEach.call(methods, eventizeMethod.bind(null, target));
  }

  return target;
}

module.exports = eventizeObject;
