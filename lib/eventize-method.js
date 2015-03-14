
'use strict';

/**
 * If the given property of the given object is a function,
 * it modifies it to emit events before and after calling it
 * (events "{method}:before" and "{method}")
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

  object[methodName] = function() {
    var args = arguments;
    object.emit(beforeEventName, args, methodName, object);
    var returnValue = originalMethod.apply(this, args);
    object.emit(methodName, args, returnValue, methodName, object);
    return returnValue;
  };
  object[methodName]._original = originalMethod;
}

module.exports = {
  method: eventizeMethod
};
