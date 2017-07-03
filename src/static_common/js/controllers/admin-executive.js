
// ********************************Executive********************************

angular.module('myApp').controller('ExecutiveController', ['$sce', '$q', '$http', '$scope', '$localStorage', '$window', 'authenticationSvc', 'updateService',
  function($sce, $q, $http, $scope, $localStorage, $window, authenticationSvc, updateService) {
    
   
    var token = authenticationSvc.getUserInfo().accessToken;

   $http({
          url: '/api/upgrid/non_degree/schools',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

        $scope.non_degree_schools = response.data.results

       console.log("return data"+ JSON.stringify(response.data));
       
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });



  }
]);