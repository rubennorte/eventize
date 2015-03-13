
'use strict';

var createTimeSpy = require('../helpers/create-time-spy');

var eventize = require('../../lib/index');

describe('eventize', function() {

  it('should be a function', function() {
    expect(eventize).toEqual(jasmine.any(Function));
  });

  it('should return the given target', function() {
    var target = {};
    expect(eventize(target)).toBe(target);
  });

  it('should throw an error if the target is not an object or a function', function() {
    var eventizeObject = function() {
      eventize({});
    };
    var eventizeFunction = function() {
      eventize(function() {});
    };
    var eventizeNull = function() {
      eventize(null);
    };
    var eventizeUndefined = function() {
      eventize();
    };
    var eventizeNumber = function() {
      eventize(1);
    };
    var eventizeString = function() {
      eventize('target');
    };

    expect(eventizeObject).not.toThrow();
    expect(eventizeFunction).not.toThrow();
    expect(eventizeNull).toThrow();
    expect(eventizeUndefined).toThrow();
    expect(eventizeNumber).toThrow();
    expect(eventizeString).toThrow();
  });

  it('should convert the target into an event emitter', function() {
    var target = {};
    var eventSpy = jasmine.createSpy();
    var eventOptions = {};

    eventize(target);

    target.on('someEvent', eventSpy);
    target.emit('someEvent', eventOptions);

    expect(eventSpy).toHaveBeenCalledWith(eventOptions);
  });

  describe('when calling it with the name of an existing "someMethod" function', function() {

    var target, originalSomeMethod, originalSomeOtherMethod;

    beforeEach(function() {
      originalSomeMethod = createTimeSpy('someMethod');
      originalSomeOtherMethod = function() {};
      target = {
        someMethod: originalSomeMethod,
        someOtherMethod: originalSomeOtherMethod
      };

      eventize(target, ['someMethod']);
    });

    it('should modify the function preserving its original behavior', function() {
      var dummyParam1 = {};
      var dummyParam2 = {};

      var result = target.someMethod(dummyParam1, dummyParam2);

      var forwardedArgs = originalSomeMethod.calls.argsFor(0);
      expect(forwardedArgs.length).toBe(2);
      expect(forwardedArgs[0]).toBe(dummyParam1);
      expect(forwardedArgs[1]).toBe(dummyParam2);
      expect(result).toBe(originalSomeMethod.calls.first().returnValue);
    });

    it('should emit "someMethod:before" BEFORE calling the original method, with its arguments', function() {
      var eventSpy = createTimeSpy('eventSpy');
      var dummyParam1 = {};
      var dummyParam2 = {};

      target.on('someMethod:before', eventSpy);
      target.someMethod(dummyParam1, dummyParam2);

      var eventArgs = eventSpy.calls.argsFor(0);
      expect(eventArgs.length).toBe(1);
      expect(eventArgs[0].length).toBe(2);
      expect(eventArgs[0][0]).toBe(dummyParam1);
      expect(eventArgs[0][1]).toBe(dummyParam2);
      // Equivalent to a hypothetical "expect(eventSpy).toHaveBeenCalledBefore(originalSomeMethod);"
      expect(eventSpy.lastCallTime).toBeLessThan(originalSomeMethod.lastCallTime);
    });

    it('should emit "someMethod" BEFORE calling the original method, with its arguments', function() {
      var eventSpy = createTimeSpy('eventSpy');
      var dummyParam1 = {};
      var dummyParam2 = {};

      target.on('someMethod', eventSpy);
      target.someMethod(dummyParam1, dummyParam2);

      var eventArgs = eventSpy.calls.argsFor(0);
      expect(eventArgs.length).toBe(1);
      expect(eventArgs[0].length).toBe(2);
      expect(eventArgs[0][0]).toBe(dummyParam1);
      expect(eventArgs[0][1]).toBe(dummyParam2);
      // Equivalent to a hypothetical "expect(eventSpy).toHaveBeenCalledBefore(originalSomeMethod);"
      expect(eventSpy.lastCallTime).toBeLessThan(originalSomeMethod.lastCallTime);
    });

    it('should emit "someMethod:after" AFTER calling the original method, with its arguments and return value', function() {
      var eventSpy = createTimeSpy('eventSpy');
      var dummyParam1 = {};
      var dummyParam2 = {};

      target.on('someMethod:after', eventSpy);
      target.someMethod(dummyParam1, dummyParam2);

      var eventArgs = eventSpy.calls.argsFor(0);
      expect(eventArgs.length).toBe(2);
      expect(eventArgs[0].length).toBe(2);
      expect(eventArgs[0][0]).toBe(dummyParam1);
      expect(eventArgs[0][1]).toBe(dummyParam2);
      expect(eventArgs[1]).toBe(originalSomeMethod.calls.first().returnValue);
      // Equivalent to a hypothetical "expect(eventSpy).toHaveBeenCalledBefore(originalSomeMethod);"
      expect(eventSpy.lastCallTime).toBeGreaterThan(originalSomeMethod.lastCallTime);
    });

    it('should not modify other methods', function() {
      expect(target.someOtherMethod).toBe(originalSomeOtherMethod);
    });

  });

  describe('when calling it with non-function property names', function() {

    it('should leave them unmodified without throwing errors', function() {
      var target = {
        numberProperty: 1,
        stringProperty: 'string',
        nullProperty: null
      };
      eventize(target, ['numberProperty', 'stringProperty', 'nullProperty', 'undefinedProperty']);
      expect(target).toEqual(jasmine.objectContaining({
        numberProperty: 1,
        stringProperty: 'string',
        nullProperty: null
      }));
    });

  });

});
