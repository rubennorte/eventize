
'use strict';

var EventEmitter = require('events').EventEmitter;

var timeSpy = require('../helpers/time-spy');
var eventize = require('../../lib/eventize-method');

describe('eventize.method()', function() {

  it('should be a function', function() {
    expect(eventize.method).toEqual(jasmine.any(Function));
  });

  describe('when calling it with the name of an existing "someMethod" function', function() {

    var target, originalSomeMethod, originalSomeOtherMethod;

    beforeEach(function() {
      jasmine.addMatchers(timeSpy.matchers);

      originalSomeMethod = timeSpy.create('someMethod');
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

      expect(originalSomeMethod).toHaveBeenCalledWith(dummyParam1, dummyParam2);
      expect(result).toBe(originalSomeMethod.calls.first().returnValue);
    });

    it('should emit "someMethod:before" BEFORE calling the original method, with its arguments', function() {
      var eventSpy = timeSpy.create('eventSpy');
      var dummyParam1 = {};
      var dummyParam2 = {};

      target.on('someMethod:before', eventSpy);
      target.someMethod(dummyParam1, dummyParam2);

      var args = [dummyParam1, dummyParam2];
      expect(eventSpy).toHaveBeenCalledWith(args, 'someMethod', target);
      expect(eventSpy).toHaveBeenCalledBefore(originalSomeMethod);
    });

    it('should emit "someMethod" AFTER calling the original method, with the proper arguments', function() {
      var eventSpy = timeSpy.create('eventSpy');
      var dummyParam1 = {};
      var dummyParam2 = {};

      target.on('someMethod', eventSpy);
      target.someMethod(dummyParam1, dummyParam2);

      var args = [dummyParam1, dummyParam2];
      var returnValue = originalSomeMethod.calls.first().returnValue;
      expect(eventSpy).toHaveBeenCalledWith(args, returnValue, 'someMethod', target);
      expect(eventSpy).toHaveBeenCalledAfter(originalSomeMethod);
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
