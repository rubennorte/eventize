
'use strict';

var events = require('../../lib/events');

describe('events', function() {

  describe('isEventEmitter', function() {

    it('should be a function', function() {
      expect(events.isEventEmitter).toEqual(jasmine.any(Function));
    });

    it('should return true if the given object has methods emit and on', function() {
      var eventEmitter = {
        emit: function() {},
        on: function() {}
      };

      expect(events.isEventEmitter(eventEmitter)).toBe(true);
    });

    it('should return false if the given object does not have emit or on as methods', function() {
      var plainObject = {};
      var partialEmitter = {
        emit: function() {}
      };

      expect(events.isEventEmitter(plainObject)).toBe(false);
      expect(events.isEventEmitter(partialEmitter)).toBe(false);
    });

  });

  describe('makeEventEmitter', function() {

    it('should convert the given object into an event emitter', function() {
      var object = {};
      var eventSpy = jasmine.createSpy();
      var eventOptions = {};

      events.makeEventEmitter(object);

      object.on('someEvent', eventSpy);
      object.emit('someEvent', eventOptions);

      expect(eventSpy).toHaveBeenCalledWith(eventOptions);
    });

  });

});
