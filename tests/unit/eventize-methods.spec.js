
'use strict';

var eventize = require('../../lib/eventize-methods');
var eventizeMethod = require('../../lib/eventize-method');

describe('eventize.methods()', function() {

  it('should be a function', function() {
    expect(eventize.methods).toEqual(jasmine.any(Function));
  });

  it('should return the given target', function() {
    var target = {};
    expect(eventize.methods(target)).toBe(target);
  });

  it('should throw an error if the target is not an object or a function', function() {
    var eventizeObj = function() {
      eventize.methods({});
    };
    var eventizeFunction = function() {
      eventize.methods(function() {});
    };
    var eventizeNull = function() {
      eventize.methods(null);
    };
    var eventizeUndefined = function() {
      eventize.methods();
    };
    var eventizeNumber = function() {
      eventize.methods(1);
    };
    var eventizeString = function() {
      eventize.methods('target');
    };

    expect(eventizeObj).not.toThrow();
    expect(eventizeFunction).not.toThrow();
    expect(eventizeNull).toThrow(jasmine.any(TypeError));
    expect(eventizeUndefined).toThrow(jasmine.any(TypeError));
    expect(eventizeNumber).toThrow(jasmine.any(TypeError));
    expect(eventizeString).toThrow(jasmine.any(TypeError));
  });

  it('should call eventize.method() for each specified method', function() {
    var target = {};
    var methods = ['someMethod', 'otherMethod'];
    spyOn(eventizeMethod, 'method');

    eventize.methods(target, methods);

    expect(eventizeMethod.method.calls.count()).toBe(2);
    expect(eventizeMethod.method).toHaveBeenCalledWith(target, 'someMethod');
    expect(eventizeMethod.method).toHaveBeenCalledWith(target, 'otherMethod');
  });

  it('should work with an array-like list of methods', function() {
    var target = {};
    var methods = {
      0: 'someMethod',
      1: 'otherMethod',
      length: 2
    };
    spyOn(eventizeMethod, 'method');

    eventize.methods(target, methods);

    expect(eventizeMethod.method.calls.count()).toBe(2);
    expect(eventizeMethod.method).toHaveBeenCalledWith(target, 'someMethod');
    expect(eventizeMethod.method).toHaveBeenCalledWith(target, 'otherMethod');
  });

});
