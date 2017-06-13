
angular.module('myApp').
controller('VerifyController',
    function($timeout, $stateParams, $scope, $location, $window, $http, authenticationSvc, $state) {
        console.log("reset password entered");
        
        console.log("param1 is " + $stateParams.param1);

            
            $scope.success = false;
            // Create Base64 Object
            var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

            $http({
                  url: '/api/upgrid/user/verify/',
                  method: 'PUT',
                  headers: {
                    'Authorization': 'JWT ' + $stateParams.param1
                  }
            }).then(function (response) {

                $scope.success = true;
                $scope.msg = "Your email has been verified.";
               console.log("return data"+ JSON.stringify(response.data));
               $scope.counter = 10;
                var stopped;
                $scope.countdown();
               
            }).
             catch(function(error){
                if(error.status === 400){
                    $scope.success = false;
                    $scope.msg = "Your email has alrady been verified.";
                }
                console.log('an error occurred...'+JSON.stringify(error));

             });

            

            $scope.countdown = function() {
                stopped = $timeout(function() {
                   console.log($scope.counter);
                 $scope.counter--;   
                 $scope.countdown();   
                }, 1000);
                if($scope.counter===0){
                    // alert("times up")
                    $state.go('reset', {param2: $stateParams.param1});
                }
              };



             


              $scope.goReset = function() {
                $state.go('reset', {param2: $stateParams.param1});
              }



    });
