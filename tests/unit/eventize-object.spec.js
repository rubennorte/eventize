
'use strict';

var EventEmitter = require('events').EventEmitter;

var eventizeObject = require('../../lib/eventize-object');
var events = require('../../lib/events');

describe('eventizeObject', function() {

  it('should be a function', function() {
    expect(eventizeObject).toEqual(jasmine.any(Function));
  });

  it('should return the given target', function() {
    var target = {};
    expect(eventizeObject(target)).toBe(target);
  });

  it('should throw an error if the target is not an object or a function', function() {
    var eventizeObj = function() {
      eventizeObject({});
    };
    var eventizeFunction = function() {
      eventizeObject(function() {});
    };
    var eventizeNull = function() {
      eventizeObject(null);
    };
    var eventizeUndefined = function() {
      eventizeObject();
    };
    var eventizeNumber = function() {
      eventizeObject(1);
    };
    var eventizeString = function() {
      eventizeObject('target');
    };

    expect(eventizeObj).not.toThrow();
    expect(eventizeFunction).not.toThrow();
    expect(eventizeNull).toThrow(jasmine.any(TypeError));
    expect(eventizeUndefined).toThrow(jasmine.any(TypeError));
    expect(eventizeNumber).toThrow(jasmine.any(TypeError));
    expect(eventizeString).toThrow(jasmine.any(TypeError));
  });

  it('should convert the target into an event emitter if it was not', function() {
    var target = {};
    spyOn(events, 'makeEventEmitter');

    eventizeObject(target);

    expect(events.makeEventEmitter).toHaveBeenCalledWith(target);
  });

  it('should not convert the target into an event emitter if it already was', function() {
    var target = new EventEmitter();
    spyOn(events, 'makeEventEmitter');

    eventizeObject(target);

    expect(events.makeEventEmitter).not.toHaveBeenCalled();
  });

  it('should eventize all specified methods', function() {
    var originalSomeMethod = function() {};
    var originalOtherMethod = function() {};
    var target = {
      someMethod: originalSomeMethod,
      otherMethod: originalOtherMethod
    };

    eventizeObject(target, ['someMethod']);

    expect(target.someMethod).toEqual(jasmine.any(Function));
    expect(target.someMethod).not.toBe(originalSomeMethod);
    expect(target.otherMethod).toBe(originalOtherMethod);
  });

  it('should work with an array-like list of methods', function() {
    var originalSomeMethod = function() {};
    var originalOtherMethod = function() {};
    var target = {
      someMethod: originalSomeMethod,
      otherMethod: originalOtherMethod
    };

    var methods = {
      0: 'someMethod',
      length: 1
    };

    eventizeObject(target, methods);

    expect(target.someMethod).toEqual(jasmine.any(Function));
    expect(target.someMethod).not.toBe(originalSomeMethod);
    expect(target.otherMethod).toBe(originalOtherMethod);

  });

});
