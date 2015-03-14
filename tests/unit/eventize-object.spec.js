
'use strict';

var EventEmitter = require('events').EventEmitter;

var eventize = require('../../lib/eventize-object');
var eventizeMethods = require('../../lib/eventize-methods');
var events = require('../../lib/events');

describe('eventize.object()', function() {

  it('should be a function', function() {
    expect(eventize.object).toEqual(jasmine.any(Function));
  });

  it('should return the given target', function() {
    var target = {};
    expect(eventize.object(target)).toBe(target);
  });

  it('should convert the target into an event emitter if it was not', function() {
    var target = {};
    spyOn(events, 'makeEventEmitter');

    eventize.object(target);

    expect(events.makeEventEmitter).toHaveBeenCalledWith(target);
  });

  it('should not convert the target into an event emitter if it already was', function() {
    var target = new EventEmitter();
    spyOn(events, 'makeEventEmitter');

    eventize.object(target);

    expect(events.makeEventEmitter).not.toHaveBeenCalled();
  });

  it('should call eventize.methods() with the specified target and methods', function() {
    var target = {};
    var methodList = ['someMethod'];
    spyOn(eventizeMethods, 'methods');

    eventize.object(target, methodList);

    expect(eventizeMethods.methods).toHaveBeenCalledWith(target, methodList);
  });

});
