//for the cart page

angular.module('myApp').
controller('ShareAllController',
    function($stateParams, $location, $timeout, reportService, tableDataService, $scope, cartCounter, $window, $http, authenticationSvc, $state, $filter, $q, $localStorage, $sessionStorage) {
        var token = authenticationSvc.getUserInfo().accessToken;
        //init the ngStorage
        $scope.$storage = $localStorage;
        //console.log("result========"+JSON.stringify(List));

        // console.log("$state.params.url= "+$state.params.url);
        ///////////////////////////////////
        angular.element(document.getElementsByTagName("body")).addClass('frame');

        $scope.date = new Date();
        ///////////////////////////////////////
        //user performs no action


        $http({
            url: '/api/upgrid/reports/shared/' + $stateParams.param1 + '/' + $stateParams.param2 + '/',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {

            //console.log("wwr" + JSON.stringify(response.data));


            var whoops_all = response.data[0].whoops;
            var enhancement_all = response.data[1].enhancement;

            //console.log("whoops_all=" + JSON.stringify(whoops_all));
            //console.log("enhancement_all=" + JSON.stringify(enhancement_all));


            $scope.whoops_array = [];
            $scope.enhancement_array = [];
            $scope.report_array = [];

              // for (i = 0; i < $scope.view_counter.length; i++) {

              //   $scope.report_array.push({
              //     'order': i,
              //     'w_array_final': [],
              //     'e_array_final': [],
              //     'whoops_report_program': $scope.view_counter[i].name,
              //     'whoops_report_degree': $scope.view_counter[i].degree
              //   });

              // }



            angular.forEach(whoops_all, function(value, index) {

                console.log("value whoops=" + JSON.stringify(value));
                
                $scope.w_raw = value;

                var whoops_final_release_time = $scope.w_raw.whoops_final_release_time;
                var report_last_edit_time = $scope.w_raw.report_last_edit_time;



                var w_array_final = [];
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



                if(!$scope.w_raw.dead_link){
              $scope.w_raw.dead_link = [];
             } else {
              for(var i=0; i<$scope.w_raw.dead_link.length; i++){
                w_array_1.push($scope.w_raw.dead_link[i]);
               }
             }

             if(!$scope.w_raw.typo){
              $scope.w_raw.typo = [];
             } else {
              for(var i=0; i<$scope.w_raw.typo.length; i++){
                w_array_2.push($scope.w_raw.typo[i]);
               }
             }

             if(!$scope.w_raw.outdated_information){
              $scope.w_raw.outdated_information = [];
             } else {
              for(var i=0; i<$scope.w_raw.outdated_information.length; i++){
                w_array_3.push($scope.w_raw.outdated_information[i]);
               }
             }

             if(!$scope.w_raw.data_discrepancy){
              $scope.w_raw.data_discrepancy = [];
             } else {
              for(var i=0; i<$scope.w_raw.data_discrepancy.length; i++){
                w_array_4.push($scope.w_raw.data_discrepancy[i]);
               }
             }

             if(!$scope.w_raw.sidebars){
              $scope.w_raw.sidebars = [];
             } else {
              for(var i=0; i<$scope.w_raw.sidebars.length; i++){
                w_array_5.push($scope.w_raw.sidebars[i]);
               }
             }

             if(!$scope.w_raw.infinite_loop){
              $scope.w_raw.infinite_loop = [];
             } else {
              for(var i=0; i<$scope.w_raw.infinite_loop.length; i++){
                w_array_6.push($scope.w_raw.infinite_loop[i]);
               }
             }

             if(!$scope.w_raw.floating_page){
              $scope.w_raw.floating_page  = [];
             } else {
              for(var i=0; i<$scope.w_raw.floating_page.length; i++){
                w_array_7.push($scope.w_raw.floating_page[i]);
               }
             }

             if(!$scope.w_raw.confusing){
              $scope.w_raw.confusing = [];
             } else {
              for(var i=0; i<$scope.w_raw.confusing.length; i++){
                w_array_8.push($scope.w_raw.confusing[i]);
               }
             }

             if(!$scope.w_raw.other_expert_note){
              $scope.w_raw.other_expert_note = [];
             } else {
              for(var i=0; i<$scope.w_raw.other_expert_note.length; i++){
                w_array_9.push($scope.w_raw.other_expert_note[i]);
               }
             }
                 w_array_10.push(
                 {
                  "university": $scope.w_raw.university,
                  "school": $scope.w_raw.school,
                  "program": $scope.w_raw.program,
                  "degree": $scope.w_raw.degree,
                  "w_release_time": whoops_final_release_time,
                  "w_update_time": report_last_edit_time
                 })

                w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];

                $scope.whoops_array.push(w_array_final)
                //console.log("w_array_final[9][0].program"+JSON.stringify(w_array_final[9][0].program));
                


            });

            
            angular.forEach(enhancement_all, function(value, index) {

                console.log("enhancement value = "+JSON.stringify(value));
                $scope.e_raw = value.program.concat(value.competing_programs);

                var enhancement_final_release_time = $scope.e_raw.enhancement_final_release_time;
                var report_last_edit_time = $scope.e_raw.report_last_edit_time;

                //console.log("$scope.e_raw = "+JSON.stringify($scope.competing_programs));

                var e_array_final = [];
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

                // for (i = 0; i < $scope.e_raw.length; i++) {
                //   e_array_1.push($scope.e_raw['p' + (i === 0 ? '' : i + 1)]);
                //   e_array_2.push($scope.e_raw['c' + (i === 0 ? '' : i + 1)]);
                //   e_array_3.push($scope.e_raw['t' + (i === 0 ? '' : i + 1)]);
                //   e_array_4.push($scope.e_raw['d' + (i === 0 ? '' : i + 1)]);
                //   e_array_5.push($scope.e_raw['r' + (i === 0 ? '' : i + 1)]);
                //   e_array_6.push($scope.e_raw['ex' + (i === 0 ? '' : i + 1)]);
                //   e_array_7.push($scope.e_raw['Intl_transcript' + (i === 0 ? '' : i + 1)]);
                //   e_array_8.push($scope.e_raw['Intl_eng_test' + (i === 0 ? '' : i + 1)]);
                //   e_array_9.push($scope.e_raw['s' + (i === 0 ? '' : i + 1)]);
                //   e_array_10.push($scope.e_raw['dura' + (i === 0 ? '' : i + 1)]);

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

                e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10, e_array_11];
                $scope.enhancement_array.push(e_array_final)
               
            });




            for(var i=0; i<$scope.whoops_array.length; i++){
                console.log("$scope.whoops_array[i]"+JSON.stringify($scope.whoops_array[i]));
                var program_array = {
                  
                  'w_array_final': $scope.whoops_array[i],
                  'e_array_final': [],
                  'whoops_report_program': $scope.whoops_array[i][9][0].program,
                  'whoops_report_degree': $scope.whoops_array[i][9][0].degree
                }

                for(var j=0; j<$scope.enhancement_array.length; j++){
                    if($scope.whoops_array[i][9][0].program === $scope.enhancement_array[j][0][0].program_name && $scope.whoops_array[i][9][0].degree === $scope.enhancement_array[j][0][0].degree.name)
                    {
                        program_array.e_array_final = $scope.enhancement_array[j];
                        $scope.enhancement_array.splice(j, 1);
                        break;
                    }

                }

                 $scope.report_array.push(program_array);

            }



            var array_length = $scope.report_array.length;

           
            for(var k=0; k<$scope.enhancement_array.length; k++){
                $scope.report_array.push({
                  
                  'w_array_final': [],
                  'e_array_final': $scope.enhancement_array[k],
                  'whoops_report_program': $scope.enhancement_array[k][0][0].program_name,
                  'whoops_report_degree': $scope.enhancement_array[k][0][0].degree.name
                })
            }
                

              //sorting in alphabetical order
              $scope.report_array.sort(function(a, b) {
                return (a.whoops_report_program.toLowerCase() > b.whoops_report_program.toLowerCase()) ? 1 : ((b.whoops_report_program.toLowerCase() > a.whoops_report_program.toLowerCase()) ? -1 : 0);
              });


              for(var i=0; i<$scope.report_array.length; i++){
                $scope.report_array[i].order = i;
              }


            console.log("$scope.report_array="+JSON.stringify($scope.report_array));
            
        }).
        catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

        });



    });
