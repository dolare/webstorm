//authentication 

angular.module('myApp').factory("authenticationSvc",
    function($http, $q, $window, $cookies) {
        var userInfo;
        // Create Base64 Object
        var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


        function login(username, password, rememberMe) {
            //use deferred promise
            var deferred = $q.defer();
            var token;

            console.log("auth start");

            $http({

                    //original - /api-token-auth/
                    // url: '/api-token-auth/',
                    url: '/api/upgrid/access_token/',
                    method: 'POST',
                    data: {
                        email: username,
                        password: Base64.encode(password)
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }

                })
                .then(function(result) {
                    //console.log(result);
                    //make a user object
                    token = result.data.token;

                    return $http({
                              url: '/api/upgrid/accountmanager/is_manager/',
                              method: 'GET',
                              
                              headers: {
                                'Authorization': 'JWT ' + token
                              }
                            });

                 }).then(function(response) {

                    

                    if(rememberMe){

                        userInfo = {
                            //accessToken: result.data.access_token,
                            //retrieved data from server
                            accessToken: token,

                            //later get the user school name from DB
                            username: username,
                            password: Base64.encode(password),
                            admin: response.data
                        };

                    } else {

                        userInfo = {
                            //accessToken: result.data.access_token,
                            //retrieved data from server
                            accessToken: token,

                            //later get the user school name from DB
                            username: username,

                            admin: response.data
                        };

                    }


                    console.log("$USERINFO= "+JSON.stringify(userInfo));
                    //make desicion after $HTTP success
                    //two ways of storing user data
                    if (rememberMe) {
                        $cookies.put('upgrid_userInfo', JSON.stringify(userInfo));
                    } else {
                        
                        $cookies.put('upgrid_userInfo', JSON.stringify(userInfo));
                        //$window.sessionStorage["userInfo"] = JSON.stringify(userInfo);

                    }

                    deferred.resolve(userInfo);

                   

                }, function(error) {
                    deferred.reject(error);
                });
            //console.log("promise is: "+deferred.promise);

            return deferred.promise;

        }

        function logout() {

            userInfo = (function () { return; })();
            //$window.sessionStorage["userInfo"] = null;

            $window.sessionStorage.removeItem("upgrid_userInfo");
            $cookies.remove("upgrid_userInfo");
            //delete $window.sessionStorage["userInfo"];
            //$cookies.put('userInfo', null);
            

            return userInfo;
        }

        function getUserInfo() {

            return userInfo;
        }

        //wouldn't lose logged state by refresh
        function init() {
            console.log("in cookie = "+$cookies.get('upgrid_userInfo'));
            console.log("in session = "+$window.sessionStorage["upgrid_userInfo"]);


            // if($window.sessionStorage["userInfo"]===null){
            //     console.log("session === null")
            // } else if ($window.sessionStorage["userInfo"]==="null")
            // {
            //     console.log("session === 'null'")

            // } else if ($window.sessionStorage["userInfo"]===undefined) {
            //     console.log("session === undefined")

            // }

            //$window.sessionStorage.removeItem("userInfo");

            

        
            if ($window.sessionStorage["upgrid_userInfo"]) {
                userInfo = JSON.parse($window.sessionStorage["upgrid_userInfo"]);
                console.log("^^^^^^^^^^^^^^^^^^");

            } else if ($cookies.get('upgrid_userInfo')) {
                console.log("$$$$$$$$$$$$$$$$$$$");
                userInfo = JSON.parse($cookies.get('upgrid_userInfo'));
                console.log("$$$Init userInfo="+JSON.stringify(userInfo));
            }
        }
        init();

        return {
            login: login,
            logout: logout,
            getUserInfo: getUserInfo
        };
    });
