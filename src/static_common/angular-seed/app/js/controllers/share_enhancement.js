
angular.module('myApp.ShareEnhancement', []).
controller('ShareEnhancementController',
    function(List, $timeout, $stateParams, $scope, $location, $window, $http, authenticationSvc, $cookies, $state) {
        
        var token = authenticationSvc.getUserInfo().accessToken;
        $scope.date = new Date();
        $scope.univeristy_name = List.profile.university;
        $scope.school_name = List.profile.school;
        console.log("param1 is " + $stateParams.param1);
      
        
       $scope.date = new Date();
      App.blocks('#enhancement_loading', 'state_loading');
      
      $scope.enhancement_report_program = $stateParams.param2;
      $scope.enhancement_report_degree = $stateParams.param3;
        //ewr
         $http({
                url: '/api/upgrid/ewr/'+$stateParams.param1,
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {

            

             console.log("released report whoops"+ JSON.stringify(response.data));
             $scope.e_raw = response.data;
             $scope.e_array_final = [];
             var e_array_1 = [];
             var e_array_2 = [];
             var e_array_3 = [];
             var e_array_4 = [];
             var e_array_5 = [];
             var e_array_6 = [];
             var e_array_7 = [];
             var e_array_8 = [];
             var e_array_9 = [];
             var e_array_10 = [];

             for(i=0; i<$scope.e_raw.length; i++)
             {
               e_array_1.push($scope.e_raw['p'+(i===0?'':i+1)]);
               e_array_2.push($scope.e_raw['c'+(i===0?'':i+1)]);
               e_array_3.push($scope.e_raw['t'+(i===0?'':i+1)]);
               e_array_4.push($scope.e_raw['d'+(i===0?'':i+1)]);
               e_array_5.push($scope.e_raw['r'+(i===0?'':i+1)]);
               e_array_6.push($scope.e_raw['ex'+(i===0?'':i+1)]);
               e_array_7.push($scope.e_raw['Intl_transcript'+(i===0?'':i+1)]);
               e_array_8.push($scope.e_raw['Intl_eng_test'+(i===0?'':i+1)]);
               e_array_9.push($scope.e_raw['s'+(i===0?'':i+1)]);
               e_array_10.push($scope.e_raw['dura'+(i===0?'':i+1)]);

             }

             $scope.e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10];
             App.blocks('#enhancement_loading', 'state_normal');

             console.log('e_array_1='+JSON.stringify($scope.e_array_final));

              
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });





    });