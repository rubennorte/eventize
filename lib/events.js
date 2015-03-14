
'use strict';

var EventEmitter = require('events').EventEmitter;

/**
 * Determines if the given object implement the EventEmitter interface
 * It ensures that the emit function is present
 * @param  {Object} target
 * @return {boolean}
 */
function isEventEmitter(target) {
  return typeof target.emit === 'function' && typeof target.on === 'function';
}

/**
 * Converts the given target into an event emitter
 * @param  {Object} target
 * @return {Object} the original target, modified
 */
function makeEventEmitter(target) {
  var EventEmitterProto = EventEmitter.prototype;

  for (var method in EventEmitterProto) {
    target[method] = EventEmitterProto[method];
  }

  EventEmitter.call(target);
}

module.exports = {
  EventEmitter: EventEmitter,
  isEventEmitter: isEventEmitter,
  makeEventEmitter: makeEventEmitter
};
