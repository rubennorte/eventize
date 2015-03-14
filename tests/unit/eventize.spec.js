
var eventize = require('../../lib/index');
var eventizeObject = require('../../lib/eventize-object');
var eventizeMethods = require('../../lib/eventize-methods');
var eventizeMethod = require('../../lib/eventize-method');

describe('eventize', function() {

  it('should be an object with the proper API', function() {
    expect(eventize).toEqual({
      object: eventizeObject.object,
      methods: eventizeMethods.methods,
      method: eventizeMethod.method
    });
  });

});
