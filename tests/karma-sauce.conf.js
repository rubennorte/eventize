/**
 * Karma configuration for SauceLabs
 */

// Browsers to run on Sauce Labs platforms
var sauceBrowsers = [
  ['firefox', '35'],
  ['firefox', '20'],
  ['firefox', '11'],
  ['firefox', '4'],

  ['chrome', '40'],
  ['chrome', '35'],

  ['internet explorer', '11', 'Windows 8.1'],
  ['internet explorer', '10', 'Windows 8'],
  ['internet explorer', '9', 'Windows 7'],
  ['internet explorer', '8'],

  ['android', '4.3'],
  ['android', '4.0']
].reduce(function(memo, platform) {
  var label = (platform[0] + '_v' + platform[1]).replace(' ', '_').toUpperCase();
  var browserConfig = {
    base: 'SauceLabs',
    browserName: platform[0],
    version: platform[1]
  };
  if (platform[2]) browserConfig['platform'] = platform[2];
  memo[label] = browserConfig;
  return memo;
}, {});

module.exports = function(config) {

  if ( !process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY ) {
    console.log('Sauce environments not set --- Skipping');
    return process.exit(0);
  }

  require('./karma.conf')(config);

  config.set({

    singleRun: true,

    reporters: ['dots', 'saucelabs'],

    port: 9876,

    sauceLabs: {
      build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
      recordScreenshots: false,
      recordVideo: false,
      'public': 'public',
      startConnect: true,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
    },

    transports: ['xhr-polling'],
    captureTimeout: 120000,
    customLaunchers: sauceBrowsers,
    browsers: undefined

  });

};
