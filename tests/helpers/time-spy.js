'use strict';

var globalTime = 0;

/**
 * Creates a jasmine spy that stores in an own "lastCallTime" property
 * the last time it was called.
 * It can be used to check if a spy was called before or after another spy
 * @param  {string} name
 * @return {Function}
 */
function createTimeSpy(name) {
  var spy = jasmine.createSpy(name).and.callFake(function() {
    spy.lastCallTime = ++globalTime;
  });
  return spy;
}

/**
 * Returns a custom Jasmine matcher that determines if a time-aware spy have been
 * called before or after another time-aware spy
 * @return {{compare: Function}} The custom Jasmine matcher
 */
function toHaveBeenCalledInOrder(when) {
  return {
    compare: function(actual, expected) {
      var result = {
        pass: false
      };

      if (!actual || !actual.lastCallTime) {
        result.message = 'Expected ' + actual + ' to be a time-aware spy';
        return result;
      }

      if (!expected || !expected.lastCallTime) {
        result.message = 'Expected ' + expected + ' to be a time-aware spy';
        return result;
      }

      if (when === 'before') {
        result.pass = actual.lastCallTime < expected.lastCallTime;
      } else {
        result.pass = actual.lastCallTime > expected.lastCallTime;
      }

      if (!result.pass) {
        result.message = 'Expected spy ' + actual.and.identity() +
          ' to have been called ' + when + ' spy ' + expected.and.identity();
      }

      return result;
    }
  };
}

/**
 * Returns a custom Jasmine matcher that determines if a time-aware spy have been
 * called before another time-aware spy
 * @return {{compare: Function}} The custom Jasmine matcher
 */
function toHaveBeenCalledBefore() {
  return toHaveBeenCalledInOrder('before');
}

/**
 * Returns a custom Jasmine matcher that determines if a time-aware spy have been
 * called after another time-aware spy
 * @return {{compare: Function}} The custom Jasmine matcher
 */
function toHaveBeenCalledAfter() {
  return toHaveBeenCalledInOrder('after');
}

module.exports = {
  create: createTimeSpy,
  matchers: {
    toHaveBeenCalledBefore: toHaveBeenCalledBefore,
    toHaveBeenCalledAfter: toHaveBeenCalledAfter
  }
};
