angular.module('myApp').controller('AdminReaderController', ['authenticationSvc', '$http', '$scope', '$state', '$stateParams', '$localStorage', '$window',
  function(authenticationSvc, $http, $scope, $state, $stateParams, $localStorage, $window) {

    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.type = $stateParams.type;
    $scope.client_id = $stateParams.client_id;
    $scope.object_id = $stateParams.object_id;
    $scope.university = $stateParams.university;
    $scope.school = $stateParams.school;
    $scope.program = $stateParams.program;
    $scope.degree = $stateParams.degree;

    console.log($scope.type + ' ' + $scope.client_id  + ' ' + $scope.object_id)

    App.blocks('#enhancement_loading', 'state_loading');
    //for whoops report
    if($scope.type === 'whoops'){

          $scope.date = new Date();
          $http({
              url: '/api/upgrid/wwr/'+$scope.object_id + '/',
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
        }).then(function (response) {

            console.log("wwr"+JSON.stringify(response.data));
            $scope.w_raw = response.data;
            
            console.log("$scope.w_raw"+JSON.stringify($scope.w_raw));
            $scope.report = {};
             var w_array_1 = [];
             var w_array_2 = [];
             var w_array_3 = [];
             var w_array_4 = [];
             var w_array_5 = [];
             var w_array_6 = [];
             var w_array_7 = [];
             var w_array_8 = [];
             var w_array_9 = [];
             var w_array_10 = [];
             

                for(var i=0; i<$scope.w_raw.dead_link.length; i++){
                  w_array_1.push($scope.w_raw.dead_link[i]);
                 }

                 for(var i=0; i<$scope.w_raw.typo.length; i++){
                  w_array_2.push($scope.w_raw.typo[i]);
                 }

                 for(var i=0; i<$scope.w_raw.outdated_information.length; i++){
                  w_array_3.push($scope.w_raw.outdated_information[i]);
                 }

                 for(var i=0; i<$scope.w_raw.data_discrepancy.length; i++){
                  w_array_4.push($scope.w_raw.data_discrepancy[i]);
                 }

                 for(var i=0; i<$scope.w_raw.sidebars.length; i++){
                  w_array_5.push($scope.w_raw.sidebars[i]);
                 }

                 for(var i=0; i<$scope.w_raw.infinite_loop.length; i++){
                  w_array_6.push($scope.w_raw.infinite_loop[i]);
                 }

                 for(var i=0; i<$scope.w_raw.floating_page.length; i++){
                  w_array_7.push($scope.w_raw.floating_page[i]);
                 }

                 for(var i=0; i<$scope.w_raw.confusing.length; i++){
                  w_array_8.push($scope.w_raw.confusing[i]);
                 }

                 for(var i=0; i<$scope.w_raw.other_expert_note.length; i++){
                  w_array_9.push($scope.w_raw.other_expert_note[i]);
                 }

                 w_array_10.push(
                 {
                  "university": $scope.university,
                  "school": $scope.school,
                  "program": $scope.program,
                  "degree": $scope.degree,

                 })

            $scope.report.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];
            App.blocks('#enhancement_loading', 'state_normal');
            console.log('w_array_1='+JSON.stringify($scope.report.w_array_final));



          }).
         catch(function(error){
            App.blocks('#enhancement_loading', 'state_normal');
            console.log('an error occurred...'+JSON.stringify(error));

         });

    

    }

    if($scope.type === 'enhancement'){


      $scope.date = new Date();
      
        //ewr
         $http({
                url: '/api/upgrid/ewr/'+$scope.object_id + '/',
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {

            

             console.log("released report whoops"+ JSON.stringify(response.data));
             $scope.e_raw = response.data;
             
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

             $scope.report.e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10];
             
             App.blocks('#enhancement_loading', 'state_normal');
             console.log('e_array_1='+JSON.stringify($scope.e_array_final));

              
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));
              App.blocks('#enhancement_loading', 'state_normal');

           });

    
      
    }

  }
]);
