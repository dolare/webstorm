describe('Auth Service', function() {
  var userinfo;
  var injector;

  // Load our api.users module
  beforeEach(angular.mock.module('myApp'));

  // Set our injected Users factory (_Users_) to our local Users variable
  beforeEach(function(){
      inject(function($injector){
        injector = $injector;
      })
  });

  // A simple test to verify the Users service exists
  it('should exist', function() {
    //userinfo = injector.get('$factory')('authenticationSvc');
    userinfo = injector.get('authenticationSvc');
    expect(userinfo).toBeDefined();
  });

});