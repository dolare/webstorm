angular.module('myApp').controller('AdminBackdoorReaderController', ['$timeout', 'authenticationSvc', '$http', '$scope', '$state', '$stateParams', '$localStorage', '$window','avatarService',
  function($timeout, authenticationSvc, $http, $scope, $state, $stateParams, $localStorage, $window, avatarService) {

    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.type = $stateParams.type;
  
    $scope.object_id = $stateParams.object_id;

    $scope.show_code = false
    

    if($scope.type === 'whoops'){

    $http({
          url: '/api/upgrid/history/whoops_report/' + $scope.object_id + '/', 
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       $scope.report_details = response.data;

       console.log("return data"+ JSON.stringify(response.data, null, 4));
       
        // Prism.highlightAll(); // Only this that you need do!
        
        $timeout( function(){
            hljs.initHighlighting();
            $scope.show_code = true
        }, 100 );

        
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });


    } else if($scope.type === 'enhancement') {
    	$http({
          url: '/api/upgrid/history/enhancement_report/' + $scope.object_id + '/', 
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       $scope.report_details = response.data;

        // Prism.highlightAll(); // Only this that you need do!

       //console.log("return data"+ JSON.stringify(response.data));
       $timeout( function(){
            hljs.initHighlighting();
            $scope.show_code = true
        }, 100 );
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });


    }




  }
]);
