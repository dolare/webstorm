describe('Auth Service', function() {
  var authService;


  // Load our api.users module
  beforeEach(angular.mock.module('myApp'));

  // Set our injected Users factory (_Users_) to our local Users variable
  // Inject service into the authService variable 
  beforeEach(function(){
      inject(function($injector){
        authService = $injector.get('authenticationSvc');
      })
  });

  // A simple test to verify the Users service exists
  it('should exist', function() {
    expect(authService).toBeDefined();
  });

  describe("Log In method",function(){

    var login,httpBackend;
    //inject login method into a variable before each test
    beforeEach(function($httpBackend){
      login = authService.login;
      httpBackend = $httpBackend;
    });


      // Test login method is defined or not
     it('should exist',function(){
      expect(login).toBeDefined();
     }); 

     //  
  })

});