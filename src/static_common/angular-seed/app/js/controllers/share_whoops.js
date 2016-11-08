
angular.module('myApp.ShareWhoops', []).
controller('ShareWhoopsController',
    function(authenticationSvc, List, $timeout, $stateParams, $scope, $location, $window, $http, $cookies, $state) {
        
        var token = authenticationSvc.getUserInfo().accessToken;
        $scope.date = new Date();
        $scope.univeristy_name = List.profile.university;
        $scope.school_name = List.profile.school;
        console.log("param1 is " + $stateParams.param1);
        console.log("param2 is " + $stateParams.param2);
        console.log("param3 is " + $stateParams.param3);
        
        App.blocks('#whoops_loading', 'state_loading');
        $scope.whoops_report_program = $stateParams.param2;
      $scope.whoops_report_degree = $stateParams.param3;
      $scope.date = new Date();
      $http({
          url: '/api/upgrid/wwr/'+$stateParams.param1,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

        console.log("wwr"+JSON.stringify(response.data));
        $scope.w_raw = response.data;
        $scope.w_array_final = [];
         var w_array_1 = [];
         var w_array_2 = [];
         var w_array_3 = [];
         var w_array_4 = [];
         var w_array_5 = [];
         var w_array_6 = [];
         var w_array_7 = [];
         var w_array_8 = [];
         var w_array_9 = [];
         

        for(i=0; i<$scope.w_raw.length; i++){
          if($scope.w_raw[i].additional_note_type === "dead_link")
          {

            w_array_1.push($scope.w_raw[i])

          }

          if($scope.w_raw[i].additional_note_type === "typo")
          {
            w_array_2.push($scope.w_raw[i])

          }

          if($scope.w_raw[i].additional_note_type === "outdated_information")
          {
            w_array_3.push($scope.w_raw[i])

          }

          if($scope.w_raw[i].additional_note_type === "data_discrepancy")
          {
            w_array_4.push($scope.w_raw[i])

          }

          if($scope.w_raw[i].additional_note_type === "sidebars")
          {

            w_array_5.push($scope.w_raw[i])
          }

          if($scope.w_raw[i].additional_note_type === "infinite_loop")
          {
            w_array_6.push($scope.w_raw[i])

          }

          if($scope.w_raw[i].additional_note_type === "floating_page")
          {
            w_array_7.push($scope.w_raw[i])

          }

          if($scope.w_raw[i].additional_note_type === "confusing")
          {
            w_array_8.push($scope.w_raw[i])

          }

          if($scope.w_raw[i].additional_note_type === "other_expert_note")
          {

            w_array_9.push($scope.w_raw[i])
          }

          
        }

        $scope.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9];
        App.blocks('#whoops_loading', 'state_normal');

        console.log('w_array_1='+JSON.stringify($scope.w_array_final));



      }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });


           


    });