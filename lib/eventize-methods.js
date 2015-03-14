
var eventize = require('./eventize-method');

/**
 * Transforms every specified method to emit events
 * before and after being called
 * @param  {Object} target
 * @param  {string[]} methods
 * @return {Object} The target itself
 */
function eventizeMethods(target, methods) {
  var targetType = typeof target;
  if (!target || (targetType !== 'object' && targetType !== 'function')) {
    throw new TypeError('the target must be an object or a function');
  }

  if (methods) {
    [].forEach.call(methods, function(method) {
      eventize.method(target, method);
    });
  }

  return target;
}

module.exports = {
  methods: eventizeMethods
};
