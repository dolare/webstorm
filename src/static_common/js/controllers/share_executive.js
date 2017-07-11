
angular.module('myApp').
controller('ShareExecutiveController',
    function($timeout, $stateParams, $scope, $location, $window, $http, $state) {
        
        angular.element(document.getElementsByTagName("body")).addClass('frame');

        $scope.date = new Date();
        
        //App.blocks('#whoops_loading', 'state_loading');
        
        console.log("share executive= "+$stateParams.param1+'/'+$stateParams.param2+'/');


      $http({
          url: '/api/upgrid/non_degree/shared_reports/'+$stateParams.param1+'/'+$stateParams.param2,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
    }).then(function (response) {

        console.log("shared executive = "+JSON.stringify(response.data.reports))

        App.blocks('#whoops_loading', 'state_normal');

        //console.log('w_array_1='+JSON.stringify($scope.w_array_final));



      }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });


           


    });
