
angular.module('myApp').
controller('ShareEnhancementController',
    function($timeout, $stateParams, $scope, $location, $window, $http, $state) {
        
        angular.element(document.getElementsByTagName("body")).addClass('frame');

        $scope.date = new Date();
        //$scope.univeristy_name = List.profile.university;
        //$scope.school_name = List.profile.school;
        console.log("param1 is " + $stateParams.param1);
      
  
      
      App.blocks('#enhancement_loading', 'state_loading');
      

        //ewr
         $http({
                url: '/api/upgrid/reports/shared/'+$stateParams.param1+'/'+$stateParams.param2+'/',
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                },
                
          }).then(function (response) {

            
             
             console.log("raw enhancement"+ JSON.stringify(response));

             var enhancement_final_release_time = response.data[1].enhancement[0].enhancement_final_release_time;
             var report_last_edit_time = response.data[1].enhancement[0].report_last_edit_time;

             //$scope.e_raw = response.data[1].enhancement[0];
             $scope.e_raw = response.data[1].enhancement[0].program.concat(response.data[1].enhancement[0].competing_programs);

             $scope.report = {};
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
             var e_array_11 = [];

             // for(i=0; i<$scope.e_raw.length; i++)
             // {
             //   e_array_1.push($scope.e_raw['p'+(i===0?'':i+1)]);
             //   e_array_2.push($scope.e_raw['c'+(i===0?'':i+1)]);
             //   e_array_3.push($scope.e_raw['t'+(i===0?'':i+1)]);
             //   e_array_4.push($scope.e_raw['d'+(i===0?'':i+1)]);
             //   e_array_5.push($scope.e_raw['r'+(i===0?'':i+1)]);
             //   e_array_6.push($scope.e_raw['ex'+(i===0?'':i+1)]);
             //   e_array_7.push($scope.e_raw['Intl_transcript'+(i===0?'':i+1)]);
             //   e_array_8.push($scope.e_raw['Intl_eng_test'+(i===0?'':i+1)]);
             //   e_array_9.push($scope.e_raw['s'+(i===0?'':i+1)]);
             //   e_array_10.push($scope.e_raw['dura'+(i===0?'':i+1)]);

             // }

             for(i=0; i<$scope.e_raw.length; i++){

                 e_array_1.push($scope.e_raw[i]['program_detail']);
                 e_array_2.push($scope.e_raw[i]['curriculum']);
                 e_array_3.push($scope.e_raw[i]['tuition']);
                 e_array_4.push($scope.e_raw[i]['deadline']);
                 e_array_5.push($scope.e_raw[i]['requirement']);
                 e_array_6.push($scope.e_raw[i]['required_exam']);
                 e_array_7.push($scope.e_raw[i]['intl_transcript']);
                 e_array_8.push($scope.e_raw[i]['intl_eng_test']);
                 e_array_9.push($scope.e_raw[i]['scholarship']);
                 e_array_10.push($scope.e_raw[i]['duration']);

             }


             e_array_11.push(
             {
              
              "e_release_time": enhancement_final_release_time,
              "e_update_time": report_last_edit_time

             })

             $scope.report.e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10, e_array_11];
             App.blocks('#enhancement_loading', 'state_normal');

          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });





    });
