// Karma configuration
// Generated on Thu Sep 28 2017 11:07:19 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.3/angular.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.18/angular-ui-router.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.3/angular-route.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.3/angular-cookies.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/ngStorage/0.3.11/ngStorage.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.3/angular-animate.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.1.0/bootstrap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/oclazyload/1.0.9/ocLazyLoad.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.1.4/ui-bootstrap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.1.4/ui-bootstrap-tpls.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.3/angular-messages.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
      'https:////ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular-sanitize.js',
      './node_modules/angular-mocks/angular-mocks.js',      
      './test/**/*.js',
      './test/**/**/*.js',
      './js/app.js',
      './js/controller/admin.js',
      './js/services/authService.js',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress','kjhtml'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
