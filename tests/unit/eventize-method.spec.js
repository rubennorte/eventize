
'use strict';

var EventEmitter = require('events').EventEmitter;

var createTimeSpy = require('../helpers/create-time-spy');
var eventize = require('../../lib/eventize-method');

describe('eventize.method()', function() {

  it('should be a function', function() {
    expect(eventize.method).toEqual(jasmine.any(Function));
  });

  describe('when calling it with the name of an existing "someMethod" function', function() {

    var target, originalSomeMethod, originalSomeOtherMethod;

    beforeEach(function() {
      originalSomeMethod = createTimeSpy('someMethod');
      originalSomeOtherMethod = function() {};

      target = new EventEmitter();
      target.someMethod = originalSomeMethod;
      target.someOtherMethod = originalSomeOtherMethod;

      eventize.method(target, 'someMethod');
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

    describe('when the method has already been eventized', function() {

      it('should leave the method unmodified', function() {
        var eventizedMethod = target.someMethod;
        eventize.method(target, 'someMethod');
        expect(target.someMethod).toBe(eventizedMethod);
      });

    });

  });

  describe('when calling it with a non-function property name', function() {

    it('should leave it unmodified without throwing errors', function() {
      var target = new EventEmitter();
      target.numberProperty = 1;
      target.stringProperty = 'string';
      target.nullProperty = null;

      eventize.method(target, 'numberProperty');
      eventize.method(target, 'stringProperty');
      eventize.method(target, 'nullProperty');
      eventize.method(target, 'undefinedProperty');

      expect(target).toEqual(jasmine.objectContaining({
        numberProperty: 1,
        stringProperty: 'string',
        nullProperty: null
      }));
    });

  });

});
