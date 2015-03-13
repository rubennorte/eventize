
'use strict';

var EventEmitter = require('events').EventEmitter;

/**
 * Converts the given target into an event emitter
 * @param  {Object} target
 * @return {Object} the original target, modified
 */
function convertIntoEventEmitter(target) {
  var EventEmitterProto = EventEmitter.prototype;

  for (var method in EventEmitterProto) {
    target[method] = EventEmitterProto[method];
  }
  EventEmitter.call(target);
}

/**
 * If the given property of the given target is a function,
 * it modifies it to emit events before and after calling it.
 * @param  {Object} target
 * @param  {string} methodName
 */
function eventizeMethod(target, methodName) {
  if (typeof target[methodName] !== 'function') {
    return;
  }

  var originalMethod = target[methodName];
  var beforeEventName = methodName + ':before';
  var afterEventName = methodName + ':after';

  target[methodName] = function() {
    target.emit(beforeEventName, arguments);
    target.emit(methodName, arguments);
    var returnValue = originalMethod.apply(this, arguments);
    target.emit(afterEventName, arguments, returnValue);
    return returnValue;
  };
}

/**
 * Converts the given object into an event emitter,
 * emitting events before and after calling the specified functions
 * @param  {Object} target
 * @param  {string[]} methods
 * @return {Object} The original object, modified
 */
function eventize(target, methods) {
  var targetType = typeof target;
  if (!target || (targetType !== 'object' && targetType !== 'function')) {
    throw new TypeError('the target must be an object or a function');
  }

  convertIntoEventEmitter(target);

  if (methods) {
    methods.forEach(eventizeMethod.bind(null, target));
  }

  return target;
}

module.exports = eventize;
