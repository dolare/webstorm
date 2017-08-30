//avatar service

angular.module('myApp').factory("avatarService",
    function($http, $q, $window, $cookies) {
        
        var clientId = "";
        

        function register(id) {
            
            clientId = id;

            $cookies.put('upgrid_clientId', JSON.stringify(clientId));
        }


        function getReportType(id, token) {

            var promise =  $http({

              url: '/api/upgrid/accountmanager/is_manager/?client_id='+id,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function (response) {

               console.log("report_type="+ JSON.stringify(response.data));
                
               return response.data;

             }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });
            return promise;



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
            getClientId: getClientId,
            getReportType: getReportType,
        };
    });
