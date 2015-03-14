
var eventize = require('../../lib/index');
var eventizeObject = require('../../lib/eventize-object');
var eventizeMethods = require('../../lib/eventize-methods');
var eventizeMethod = require('../../lib/eventize-method');

describe('eventize', function() {

  it('should be a reference to eventize.object() with the proper API', function() {
    expect(eventize).toBe(eventizeObject.object);
    expect(eventize.object).toBe(eventizeObject.object);
    expect(eventize.methods).toBe(eventizeMethods.methods);
    expect(eventize.method).toBe(eventizeMethod.method);
  });

});
