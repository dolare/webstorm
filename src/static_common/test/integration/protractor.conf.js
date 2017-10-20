exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./*.spec.js'],
  multiCapabilities: [{
    browserName: 'chrome',
  }]
}


//fix the set up issues by upgrading the chrome version and NNS version 