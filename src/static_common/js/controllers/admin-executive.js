
// ********************************Executive********************************

angular.module('myApp').controller('ExecutiveController', ['$sce', '$q', '$http', '$scope', '$localStorage', '$window', 'authenticationSvc', 'updateService',
  function($sce, $q, $http, $scope, $localStorage, $window, authenticationSvc, updateService) {
    
   var token = authenticationSvc.getUserInfo().accessToken;
    $scope.emptyExecutiveLabel = "Currently there is no update of the reports."
   $http({
          url: '/api/upgrid/non_degree/schools?is_non_degree=True',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

      $scope.non_degree_schools = response.data.results;

       console.log("return data"+ JSON.stringify(response.data.results));
       
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });



     $scope.releaseSchool = function(Id) {
      console.log("Id= "+Id);
         $http({
          url: '/api/upgrid/non_degree/reports',
          method: 'POST',
          data: {
            school: Id
          },
          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function (response) {

            

           console.log("return data"+ JSON.stringify(response.data));
           
        }).
         catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));

         });



     }


  }
]);