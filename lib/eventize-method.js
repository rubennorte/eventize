
'use strict';

/**
 * If the given property of the given object is a function,
 * it modifies it to emit events before and after calling it.
 * @param  {Object} object
 * @param  {string} methodName
 */
function eventizeMethod(object, methodName) {
  if (typeof object[methodName] !== 'function') {
    return;
  }

  // Check if the method has already been eventized
  if (typeof object[methodName]._original === 'function') {
    return;
  }

  var originalMethod = object[methodName];
  var beforeEventName = methodName + ':before';
  var afterEventName = methodName + ':after';

  object[methodName] = function() {
    object.emit(beforeEventName, arguments, methodName, object);
    object.emit(methodName, arguments, methodName, object);
    var returnValue = originalMethod.apply(this, arguments);
    object.emit(afterEventName, arguments, returnValue, methodName, object);
    return returnValue;
  };
  object[methodName]._original = originalMethod;
}

module.exports = {
  method: eventizeMethod
};
