//avatar service

angular.module('myApp').factory("avatarService",
    function($http, $q, $window, $cookies) {
        
        var clientId = "";
        

        function register(id) {
            
            clientId = id;

            $cookies.put('upgrid_clientId', JSON.stringify(clientId));
        }

        function signout() {

            clientId = "";
            
            $cookies.remove("upgrid_clientId");
            
            
            console.log("removed");
            return clientId;
        }

        function getClientId() {

            if(clientId){
                return clientId;
            } else {
                return "";
            }
            
        }

        //wouldn't lose logged state by refresh
        function init() {
            console.log("in cookie = "+$cookies.get('upgrid_clientId'));
        
            if ($cookies.get('upgrid_clientId')) {
                clientId = JSON.parse($cookies.get('upgrid_clientId'));
                console.log("$$$Init userInfo="+JSON.stringify(clientId));
            } else {
                clientId = "";
            }
        }
        init();

        return {
            register: register,
            signout: signout,
            getClientId: getClientId
        };
    });
