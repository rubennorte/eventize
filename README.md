[![npm](https://img.shields.io/npm/v/eventize.svg)](https://npmjs.org/package/eventize)
[![npm](https://img.shields.io/npm/l/eventize.svg)](https://npmjs.org/package/eventize)
[![Build Status](https://travis-ci.org/rubennorte/eventize.svg?branch=master)](https://travis-ci.org/rubennorte/eventize)
[![Coverage Status](https://coveralls.io/repos/rubennorte/eventize/badge.svg)](https://coveralls.io/r/rubennorte/eventize)
[![Code Climate](https://codeclimate.com/github/rubennorte/eventize/badges/gpa.svg)](https://codeclimate.com/github/rubennorte/eventize)  
[![Dependency Status](https://david-dm.org/rubennorte/eventize.svg?theme=shields.io&style=flat)](https://david-dm.org/rubennorte/eventize)
[![devDependency Status](https://david-dm.org/rubennorte/eventize/dev-status.svg?theme=shields.io&style=flat)](https://david-dm.org/rubennorte/eventize#info=devDependencies)

# eventize

Convert objects into event emitters, that emit events before and after calling the specified methods.

## Installation

Dependencies:

* node >= 0.10
* npm >= 2.0.0

```bash
npm install eventize
```

## Usage

```javascript
var eventize = require('eventize');

var myObject = {
  name: 'John',
  getName: function() {
    return name;
  },
  setName: function(name) {
    this.name = name;
    return name;
  }
};

eventize(myObject, ['setName', 'getName']);

myObject.on('setName:before', function(args) {
  console.log('Current name:', myObject.name, ', new name:', args[0]);
  //> Current name: John, new name: Jack
});

myObject.on('setName', function(args) {
  console.log('Current name:', myObject.name, ', new name:', args[0]);
  //> Current name: John, new name: Jack
});

myObject.on('setName:after', function(args, returnValue) {
  console.log('Current name:', myObject.name, ', new name:', args[0],
    ', return value:', returnValue);
  //> Current name: Jack, new name: Jack, return value: Jack
});

myObject.setName('Jack');
```

## Tests

To run the tests with Jasmine:

```bash
npm install
npm test
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Check the build: `npm run build`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

The MIT License (MIT)

Copyright (c) 2015 Rubén Norte

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
