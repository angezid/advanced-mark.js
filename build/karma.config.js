'use strict';
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = config => {
  config.set({
    basePath: '../',
    frameworks: ['jasmine-jquery', 'jasmine'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'dist/!(*.es6|*.umd|*.min|regexpcreator).js',
      'test/specs/configuration.js',
      'test/specs/**/*.js',
      {
        pattern: 'test/fixtures/**/*.html',
        included: false,
        served: true
      }
    ],
    exclude: [
      //'test/specs/!(across-elements)/**/*.js',
      //'test/specs/!(basic)/*.js',
      //'test/specs/basic/*.js',
      //'test/specs/across-elements/**/*.js'
    ],
    reporters: ['spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    failOnEmptyTestSuite: false,
    plugins: [
      'karma-jasmine',
      '@metahub/karma-jasmine-jquery',
      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-coverage'
    ],
    //browsers: ['ChromeHeadless'],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    captureTimeout: 30000,
    browserNoActivityTimeout: 60000, // 60 sec
    singleRun: true,
    preprocessors: {
      'dist/mark.js': ['coverage']
    },
    coverageReporter: {
      dir: './build/coverage/',
      reporters: [{
        type: 'html'
      }, {
        type: 'text'
      }]
    }
  });
};
