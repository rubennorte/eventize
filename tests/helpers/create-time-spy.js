
'use strict';

/**
 * Creates a jasmine spy that stores in an own "lastCallTime" property
 * the last time it was called.
 * It can be used to check if a spy was called before or after another spy
 * @param  {string} name
 * @return {Function}
 */
module.exports = function createTimeSpy(name) {
  var spy = jasmine.createSpy(name).and.callFake(function() {
    var time = process.hrtime();
    spy.lastCallTime = time[0] * 1e9 + time[1];
  });
  return spy;
};
