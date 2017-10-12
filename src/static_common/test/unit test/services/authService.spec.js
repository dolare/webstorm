describe('Auth Service', function() {
  var authService,
      $httpBackend,
      $http;
  var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

  var mock_data ={
    username:'zmai@gride.com',
    password: Base64.encode('123321'),
    rememberMe: true,
    accessToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MDc4Mzk3OTUsImVtYWlsIjoiem1haUBncmlkZXQuY29tIiwidXNlcm5hbWUiOiJ6bWgiLCJvcmlnX2lhdCI6MTUwNzc1MzM5NSwidXNlcl9pZCI6IjdkMWY4MTBiLTIxZGQtNDQ3Mi1hNDU3LTdhNTliMDhlNGM4MSJ9.U0R1u0ZviW4g_y2PWMdRLyHPfpOZp9rLbplmkizQxk8"
  }

  // Load our api.users module
  beforeEach(angular.mock.module('myApp'));

  // Set our injected Users factory (_Users_) to our local Users variable
  // Inject service into the authService variable 


  beforeEach(inject(function(_authenticationSvc_, _$httpBackend_, _$http_, _$rootScope_, _$cookies_){
    authService = _authenticationSvc_;
    $httpBackend = _$httpBackend_;
    $http = _$http_;
    scope = _$rootScope_.$new();
    $cookies = _$cookies_;
  }));


  // A simple test to verify the Users service exists
  it('should exist', function() {
    expect(authService).toBeDefined();
  });

  // test cases for log in method in auth service 
  describe('log in method',function(){

    //log in method should exist
    it('should exist',function(){
      expect(authService.login).toBeDefined();
    });

    //simple test for log in method and return correct value
    it('should resolve the promise when pass the mock_data and put the upgrid_userInfo cookies',function(){
      authService.login(mock_data.username, mock_data.password, mock_data.rememberMe)
      .then(res=>{
        expect(res).toBeDefined();
      });

      expect($cookies.get('upgrid_userInfo')).not.toBeNull();

    })

    // mock http post request 
    it('should invoke http post request with right parameters',function(){

      // set up mock http request back end and return specific detail
      $httpBackend.expect('POST','/api/upgrid/access_token/',{
        "email":mock_data.username,
        "password":mock_data.password
      },function(headers){
        return {
          'Content-Type': 'application/json'
        }
      }).respond(200);


      // set up the pending request
      $http({

        url: '/api/upgrid/access_token/',
        method: 'POST',
        data: {
            email: mock_data.username,
            password: mock_data.password
        },
        headers: {
            'Content-Type': 'application/json'
        }

    });

      //flush the pending request
      $httpBackend.flush();
    });


    // a simple test for the get requst in log in method
    it('should invoke http get request with token return true',function(){

      // set up the mock http back end and return specific detail
      $httpBackend.expect('GET','/api/upgrid/accountmanager/is_manager/',function(headers){
        return {
          "Authorization" :'JWT' + mock_data.accessToken
        }
      }).respond('True');


      // set up the pending request
      $http({
              url: '/api/upgrid/accountmanager/is_manager/',
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + mock_data.accessToken
              }
            }).then(function(data){
              expect(data.data).toEqual('True');
              
            });
      // flush the pending request.      
      $httpBackend.flush();
    })

  });

  // test cases for log out method in auth service
  describe('log out method',function(){

    var userInfo;

    beforeEach(function(){
      authService.login(mock_data.username, mock_data.password, mock_data.rememberMe)
      .then(res=>{
        userInfo = res;
      });
      userInfo = authService.logout();
    })

    it('should return null value',function(){
      expect(userInfo).not.toBeNull();
    });

    it('upgrid_userInfo in cookies should be undefined',function(){
      expect($cookies.get('upgrid_userInfo')).not.toBeDefined();
    });
  });

  // test cases for getUserInfo method in auth service
  describe('get user info',function(){

    it('should return the information of userInfo',function(){

      var info,userIn;

      authService.login(mock_data.username, mock_data.password, mock_data.rememberMe).then(res=>{
        info = res;
      });

      userIn = authService.getUserInfo();

      expect(userIn).toEqual(info);
    });
  });

  

});