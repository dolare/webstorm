
angular.module('myApp').
controller('ShareExecutiveController',
    function($timeout, $stateParams, $scope, $location, $window, $http, $state) {
        
        angular.element(document.getElementsByTagName("body")).addClass('frame');

        $scope.date = new Date();
        
        //App.blocks('#whoops_loading', 'state_loading');
        
        console.log("share executive= "+$stateParams.param1+'/'+$stateParams.param2+'/');


    //   $http({
    //       url: '/api/upgrid/reports/shared/'+$stateParams.param1+'/'+$stateParams.param2+'/',
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    // }).then(function (response) {

    //     //console.log("data shared whoops = "+JSON.stringify(response.data[0].whoops[0]))
    //     console.log("wwr"+JSON.stringify(response.data[0].whoops[0]));
    //     // $scope.w_raw = response.data[0].whoops[0];
    //     // $scope.w_array_final = [];
    //     //  var w_array_1 = [];
    //     //  var w_array_2 = [];
    //     //  var w_array_3 = [];
    //     //  var w_array_4 = [];
    //     //  var w_array_5 = [];
    //     //  var w_array_6 = [];
    //     //  var w_array_7 = [];
    //     //  var w_array_8 = [];
    //     //  var w_array_9 = [];
    //     //  var w_array_10 = [];
         

    //     // for(i=0; i<$scope.w_raw.length; i++){
    //     //   if($scope.w_raw[i].additional_note_type === "dead_link")
    //     //   {

    //     //     w_array_1.push($scope.w_raw[i])

    //     //   } else if($scope.w_raw[i].additional_note_type === "typo")
    //     //   {
    //     //     w_array_2.push($scope.w_raw[i])

    //     //   } else if($scope.w_raw[i].additional_note_type === "outdated_information")
    //     //   {
    //     //     w_array_3.push($scope.w_raw[i])

    //     //   } else if($scope.w_raw[i].additional_note_type === "data_discrepancy")
    //     //   {
    //     //     w_array_4.push($scope.w_raw[i])

    //     //   } else if($scope.w_raw[i].additional_note_type === "sidebars")
    //     //   {

    //     //     w_array_5.push($scope.w_raw[i])

    //     //   } else if($scope.w_raw[i].additional_note_type === "infinite_loop")
    //     //   {
    //     //     w_array_6.push($scope.w_raw[i])

    //     //   } else if($scope.w_raw[i].additional_note_type === "floating_page")
    //     //   {

    //     //     w_array_7.push($scope.w_raw[i])

    //     //   } else if($scope.w_raw[i].additional_note_type === "confusing")
    //     //   {

    //     //     w_array_8.push($scope.w_raw[i])

    //     //   } else if($scope.w_raw[i].additional_note_type === "other_expert_note")
    //     //   {

    //     //     w_array_9.push($scope.w_raw[i])

    //     //   } else {

    //     //     w_array_10.push($scope.w_raw[i])
    //     //   }

          
    //     // }

    //     var whoops_final_release_time = response.data[0].whoops[0].whoops_final_release_time;
    //     var report_last_edit_time = response.data[0].whoops[0].report_last_edit_time;


    //     $scope.w_raw = response.data[0].whoops[0];
    //     console.log('response.data[0].whoops[0]='+JSON.stringify(response.data[0].whoops[0]));
             
    //          $scope.report = {};
    //          var w_array_1 = [];
    //          var w_array_2 = [];
    //          var w_array_3 = [];
    //          var w_array_4 = [];
    //          var w_array_5 = [];
    //          var w_array_6 = [];
    //          var w_array_7 = [];
    //          var w_array_8 = [];
    //          var w_array_9 = [];
    //          var w_array_10 = [];

    //          for(var i=0; i<$scope.w_raw.dead_link.length; i++){
    //               w_array_1.push($scope.w_raw.dead_link[i]);
    //              }

    //              for(var i=0; i<$scope.w_raw.typo.length; i++){
    //               w_array_2.push($scope.w_raw.typo[i]);
    //              }

    //              for(var i=0; i<$scope.w_raw.outdated_information.length; i++){
    //               w_array_3.push($scope.w_raw.outdated_information[i]);
    //              }

    //              for(var i=0; i<$scope.w_raw.data_discrepancy.length; i++){
    //               w_array_4.push($scope.w_raw.data_discrepancy[i]);
    //              }

    //              for(var i=0; i<$scope.w_raw.sidebars.length; i++){
    //               w_array_5.push($scope.w_raw.sidebars[i]);
    //              }

    //              for(var i=0; i<$scope.w_raw.infinite_loop.length; i++){
    //               w_array_6.push($scope.w_raw.infinite_loop[i]);
    //              }

    //              for(var i=0; i<$scope.w_raw.floating_page.length; i++){
    //               w_array_7.push($scope.w_raw.floating_page[i]);
    //              }

    //              for(var i=0; i<$scope.w_raw.confusing.length; i++){
    //               w_array_8.push($scope.w_raw.confusing[i]);
    //              }

    //              for(var i=0; i<$scope.w_raw.other_expert_note.length; i++){
    //               w_array_9.push($scope.w_raw.other_expert_note[i]);
    //              }

    //              w_array_10.push(
    //              {
    //               "university": response.data[0].whoops[0].university,
    //               "school": response.data[0].whoops[0].school,
    //               "program": response.data[0].whoops[0].program,
    //               "degree": response.data[0].whoops[0].degree,
    //               "w_release_time": whoops_final_release_time,
    //               "w_update_time": report_last_edit_time
    //              })


    //         // $scope.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];
            

    //     $scope.report.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];
    //     App.blocks('#whoops_loading', 'state_normal');

    //     //console.log('w_array_1='+JSON.stringify($scope.w_array_final));



    //   }).
    //  catch(function(error){
    //     console.log('an error occurred...'+JSON.stringify(error));

    //  });


           


    });
