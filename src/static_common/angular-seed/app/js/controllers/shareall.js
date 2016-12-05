//for the cart page

angular.module('myApp.shareall', []).
controller('ShareAllController',
  function($location, List, $timeout, Checked, reportService, tableDataService, $scope, cartCounter, $window, $http, authenticationSvc, $state, $filter, $q, $localStorage, $sessionStorage) {
    var token = authenticationSvc.getUserInfo().accessToken;
    //init the ngStorage
    $scope.$storage = $localStorage;
    //console.log("result========"+JSON.stringify(List));

    // console.log("$state.params.url= "+$state.params.url);
    ///////////////////////////////////
    angular.element(document.getElementsByTagName("body")).addClass('frame');

    

    $scope.univeristy_name = List.profile.university;
    $scope.school_name = List.profile.school;
    $scope.date = new Date();
    ///////////////////////////////////////
    //user performs no action
    

    
   
    $scope.Checked = Checked;
    $scope.view_counter = cartCounter.counter();

        $scope.report_array = [];

        for(i=0; i<$scope.view_counter.length; i++){

          $scope.report_array.push({'w_array_final': [],
                                    'e_array_final': [],
                                    'whoops_report_program': $scope.view_counter[i].name ,
                                    'whoops_report_degree': $scope.view_counter[i].degree
                                   }
                                   );

        }

       
        angular.forEach($scope.view_counter, function (value, index) {
            console.log("index="+index)
            if($scope.view_counter[index].whoops){


              console.log("*index="+index);
              console.log("$scope.view_counter[index].WId"+$scope.view_counter[index].Id);
           
              $http({
                url: '/api/upgrid/wwr/'+$scope.view_counter[index].Id,
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
              }).then(function (response) {

                  //console.log("wwr"+JSON.stringify(response.data));
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
                  
                  // console.log("$scope.report_array[n].w_array_final="+$scope.report_array[n].w_array_final)
                  // // App.blocks('#whoops_loading', 'state_normal');
                  // // console.log('w_array_1='+JSON.stringify($scope.w_array_final));
                  $scope.report_array[index].w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9];


                }).
               catch(function(error){
                  console.log('an error occurred...'+JSON.stringify(error));

               });



          }



          //////////////


          if($scope.view_counter[index].enhancement){
                     $http({
                            url: '/api/upgrid/ewr/'+$scope.view_counter[index].Id,
                            method: 'GET',
                            headers: {
                              'Authorization': 'JWT ' + token
                            }
                      }).then(function (response) {

                        

                         //console.log("released report whoops"+ JSON.stringify(response.data));
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

                         $scope.report_array[index].e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10];
                         //App.blocks('#enhancement_loading', 'state_normal');

                         //console.log('e_array_1='+JSON.stringify($scope.e_array_final));

                          
                      }).
                       catch(function(error){
                          console.log('an error occurred...'+JSON.stringify(error));

                       });




          }


        });



  });