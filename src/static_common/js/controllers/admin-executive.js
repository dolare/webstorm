
// ********************************Executive********************************

angular.module('myApp').controller('ExecutiveController', ['$sce', '$q', '$http', '$scope', '$localStorage', '$window', 'authenticationSvc', 'updateService',
  function($sce, $q, $http, $scope, $localStorage, $window, authenticationSvc, updateService) {
    
   
    var token = authenticationSvc.getUserInfo().accessToken;

   // $http({
   //        url: '/api/upgrid/whoops_reports/shared/'+'a37a52bf-e713-48aa-b171-12187466ad44/3de6274e-98ae-4080-b287-e7b41ebe8101',
   //        method: 'GET',
   //        headers: {
   //          'Authorization': 'JWT ' + token
   //        }
   //  }).then(function (response) {

   //     $scope.details = response.data;

   //     console.log("return data"+ JSON.stringify(response.data));
       
   //  }).
   //   catch(function(error){
   //      console.log('an error occurred...'+JSON.stringify(error));

   //   });



  }
]);