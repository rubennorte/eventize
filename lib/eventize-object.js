
'use strict';

var eventize = require('./eventize-methods');
var events = require('./events');

/**
 * Converts the given object into an event emitter,
 * emitting events before and after calling the specified functions
 * @param  {Object} target
 * @param  {string[]} methods
 * @return {Object} The original object, modified
 */
function eventizeObject(target, methods) {
  eventize.methods(target, methods);

  if (!events.isEventEmitter(target)) {
    events.makeEventEmitter(target);
  }

  return target;
}

module.exports = {
  object: eventizeObject
};
