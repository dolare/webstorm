
// ********************************Updates********************************

angular.module('myApp').controller('UpdatesController', ['$sce', '$q', '$http', '$scope', '$localStorage', '$window', 'authenticationSvc', 'updateService',
  function($sce, $q, $http, $scope, $localStorage, $window, authenticationSvc, updateService) {
    console.log("welcome");
   
    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.itemsByPage = 25;
    $scope.emptyUpdateLabel = "Currently there is no update of the reports."
    $scope.date = new Date();
    $scope.popover = {
      "title": "Confirm for the updates",
      "confirmText": "<i class='glyphicon glyphicon-ok'></i> Confirm",
      "cancelText" : "<i class='glyphicon glyphicon-remove'></i> Cancel",
    }
    $scope.ondemand = false;
    $scope.update_client = [];

    $scope.only_update = true;


    


    $http({
          url: '/api/upgrid/update/dashboard/',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

      App.blocks('#loadingtable', 'state_loading');
      $scope.full_clients = response.data;
      console.log("loading")
      console.log("raw client = "+JSON.stringify(response.data))
      for(var i=0; i<response.data.length; i++){
        if(response.data[i].has_update.whoops_update !== 0 || response.data[i].has_update.enhancement_update !== 0)
        $scope.update_client.push(response.data[i]);
      }

      // var school_list_raw_unordered = _.sortBy($scope.update_client, 'university');
      //   var school_list_raw = _.pluck(school_list_raw_unordered, 'university');

      //   $scope.school_list = _.uniq(school_list_raw);
      //   console.log("$scope.school_list = "+JSON.stringify($scope.school_list))

       console.log("update client = "+ JSON.stringify(response.data));
        App.blocks('#loadingtable', 'state_normal');
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));
        App.blocks('#loadingtable', 'state_normal');

     });

     //prepare for the modal report w/e
     $scope.need_for_confirm = function(id, type, program, client_id){

      console.log("id= "+id);
      console.log("type= "+type);
      console.log("client_id= "+client_id)
      console.log("program= "+program);

      $scope.client_id_alias = client_id;
      console.log("$scope.client_id_alias = "+$scope.client_id_alias);
      $scope.release_customer_program_id = id;

      $scope.confirmed_diff_raw = {};

      $scope.w_confirmed_diff_raw = {};

      if(type==='whoops'){
        App.blocks('#whoops_loading', 'state_loading');
        console.log("type= "+type);
        $http({
          url: '/api/upgrid/update/whoops/diff_confirmation/'+ id + '/' + client_id + '/',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
          }).then(function (response) {


             //$scope.update_client = response.data;
             console.log("init data all = "+ JSON.stringify(response.data))
             console.log("init data =  "+ JSON.stringify(response.data.existing_report));
              

             var whoops_final_release_time = response.data.whoops_final_release_time;
             var report_last_edit_time = response.data.report_last_edit_time;

             //console.log("init outdated =  "+ JSON.stringify(response.data.existing_report.outdated_information[0].additional_note));

             $scope.w_update = response.data.initial_diff.new;
             console.log("w_update="+JSON.stringify($scope.w_update));

             $scope.w_raw = response.data.existing_report;
             console.log("w_raw = "+JSON.stringify($scope.w_raw))

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

             // for(var i=0; i<$scope.w_raw.details.length; i++){
             //  w_array_10.push($scope.w_raw.details[i]);
             // }
             w_array_10.push({
              "school": program.split('--')[0].split('-')[1],
              "university": program.split('--')[0].split('-')[0].split(':')[1],
              "program": program.split('--')[1],
              "degree": program.split('--')[2].split('-')[0],
              "w_release_time": whoops_final_release_time,
              "w_update_time": report_last_edit_time

             });





            $scope.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];
            
             App.blocks('#whoops_loading', 'state_normal');

            console.log('w_array_1='+JSON.stringify($scope.w_array_final));



          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });

      } else if(type==='enhancement'){

        console.log("type= "+type);
        App.blocks('#enhancement_loading', 'state_loading');
        $http({
          url: '/api/upgrid/update/enhancement/diff_confirmation/'+ id  + '/' + client_id + '/',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
          }).then(function (response) {

             //$scope.update_client = response.data;
             console.log("init data =  "+ JSON.stringify(response.data));
             // console.log("init enhancement data =  "+ JSON.stringify(response.data.existing_report));
              
             var enhancement_final_release_time = response.data.enhancement_final_release_time;
             var report_last_edit_time = response.data.report_last_edit_time;



             $scope.e_update = response.data.initial_diff;
             

             //array
             $scope.e_raw = response.data.existing_or_cache_report.program.concat(response.data.existing_or_cache_report.competing_programs);

             $scope.program_order = [];
             for(var i=0; i<$scope.e_raw.length; i++){
              $scope.program_order.push($scope.e_raw[i].object_id)
             }

             console.log("$scope.program_order="+JSON.stringify($scope.program_order));

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
             var e_array_11 = [];
             console.log("$scope.e_raw"+JSON.stringify($scope.e_raw));
             

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

             $scope.e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10, e_array_11];
             $scope.Object = Object;

             $scope.e_show_update = updateService.updateEnhancement(response.data, 'admin', $scope.program_order);
             console.log('$scope.e_show_update = '+JSON.stringify($scope.e_show_update));

             App.blocks('#enhancement_loading', 'state_normal');
             console.log("$scope.e_array_final= "+JSON.stringify($scope.e_array_final));
             console.log("e_update="+JSON.stringify($scope.e_update));
             console.log("diff = "+JSON.stringify(response.data.initial_diff));
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });

      }

     }


     $scope.w_confirm_update = function (category) {
      console.log("confirmed "+category);

      $scope.w_raw[category] = $scope.w_update[category];
      
      console.log("$scope.w_raw[category] = "+JSON.stringify($scope.w_raw[category]));


            if(category === 'dead_link'){
              
              $scope.w_array_final[0] = $scope.w_update[category]
             }

             if(category === 'typo'){
              
              $scope.w_array_final[1] = $scope.w_update[category]
             }

             if(category === 'outdated_information'){
              
              $scope.w_array_final[2] = $scope.w_update[category]
             }

             if(category === 'data_discrepancy'){
              
              $scope.w_array_final[3] = $scope.w_update[category]
             }

             if(category === 'sidebars'){
              
              $scope.w_array_final[4] = $scope.w_update[category]
             }

             if(category === 'infinite_loop'){
              
              $scope.w_array_final[5] = $scope.w_update[category]
             }

             if(category === 'floating_page'){
              
              $scope.w_array_final[6] = $scope.w_update[category]
             }
            
             if(category === 'confusing'){
              
              $scope.w_array_final[7] = $scope.w_update[category]
             }
              
             if(category === 'other_expert_note'){
              
              $scope.w_array_final[8] = $scope.w_update[category]
             }

             $scope.w_confirmed_diff_raw[category] = $scope.w_update[category];

             console.log("$scope.w_confirmed_diff_raw = "+JSON.stringify($scope.w_confirmed_diff_raw));

     }


     $scope.dynamicPopover = {
        content: 'Hello, World!',
        templateUrl: 'myPopoverTemplate.html',
        title: 'Title'
      };

    
     $scope.updated_whoops = function(id) {
        $scope.dropdown_list = [];
        $http({
          url: '/api/upgrid/update/programs/'+id,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
          }
          }).then(function (response) {

             //$scope.update_client = response.data;

             console.log("programs =  "+ JSON.stringify(response.data.whoops_update));

             
             $scope.dropdown_list = response.data.whoops_update;

             for(var i=0; i<$scope.dropdown_list.length; i++){

              $scope.dropdown_list[i].type = "whoops";

             }


            console.log("$scope.dropdown_list = "+JSON.stringify($scope.dropdown_list));

             

          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });
     }


     $scope.updated_enhancement = function(id) {
        $scope.dropdown_list = [];
        $http({
          url: '/api/upgrid/update/programs/'+id,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
          }
          }).then(function (response) {

             //$scope.update_client = response.data;

             console.log("programs =  "+ JSON.stringify(response.data.enhancement_update));
              $scope.dropdown_list = response.data.enhancement_update;

              for(var i=0; i<$scope.dropdown_list.length; i++){

                $scope.dropdown_list[i].type = "enhancement";

               }

               console.log("$scope.dropdown_list = "+JSON.stringify($scope.dropdown_list));

          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });
     }


     $scope.confirm_update = function(category, index, keys) {

        console.log(category + ' '+ index + ' ' + keys);

        console.log(keys.length);

        //init if does not exist -> e.g. xxx.p = {}
        if($scope.confirmed_diff_raw[$scope.program_order[index]] === undefined) {
          console.log("not existing");
          $scope.confirmed_diff_raw[$scope.program_order[index]] = {};
        } 


        //console.log("confirm the raw = "+ JSON.stringify($scope.e_raw));

        //push into array
        //for 'ex', Intl_transcript' and 'Intl_eng_test'
        if(keys.length === 0){


                $scope.confirmed_diff_raw[$scope.program_order[index]][category] = $scope.e_update[$scope.program_order[index]][category];
                $scope.e_raw[index][category] = $scope.e_update[$scope.program_order[index]][category];


        } else {

            for(var i=0; i<keys.length; i++) {

              //each key
              if(keys[i].split(".").length === 1){

                if($scope.confirmed_diff_raw[$scope.program_order[index]][category]===undefined){
                  $scope.confirmed_diff_raw[$scope.program_order[index]][category] = {};
                }



                $scope.confirmed_diff_raw[$scope.program_order[index]][category][keys[i]] = $scope.e_update[$scope.program_order[index]][category][keys[i]];
                $scope.e_raw[index][category][keys[i]] = $scope.e_update[$scope.program_order[index]][category][keys[i]];




              } else if (keys[i].split(".").length === 2) {

                console.log("nested");

             
                if($scope.confirmed_diff_raw[$scope.program_order[index]][category]===undefined){
                  $scope.confirmed_diff_raw[$scope.program_order[index]][category] = {};
                }


                $scope.confirmed_diff_raw[$scope.program_order[index]][category][keys[i].split(".")[0]] = {};
                $scope.confirmed_diff_raw[$scope.program_order[index]][category][keys[i].split(".")[0]][keys[i].split(".")[1]] = $scope.e_update[$scope.program_order[index]][category][keys[i].split(".")[0]][keys[i].split(".")[1]];
                $scope.e_raw[index][category][keys[i].split(".")[0]][keys[i].split(".")[1]] = $scope.e_update[$scope.program_order[index]][category][keys[i].split(".")[0]][keys[i].split(".")[1]];

              }

              console.log("confirm the raw after= "+ JSON.stringify($scope.e_raw));
              console.log("oooresult = "+JSON.stringify($scope.confirmed_diff_raw));
              
              
         }

       }

   }


   //release updates for whoops and enhancement

   $scope.w_release_updates = function(id) {
      $scope.w_confirmed_diff = {
        "old": $scope.confirmed_diff_raw,
        "new": $scope.confirmed_diff_raw
      } 


      //for api test
      $http({
            url: '/api/upgrid/update/whoops/diff_confirmation/',
            method: 'PUT',
            data: {
              "customer_program_id": id,
              "confirmed_diff": $scope.w_confirmed_diff,
              "cache_report": $scope.w_raw
            },
            headers: {
              'Authorization': 'JWT ' + token
            }
      }).then(function (response) {

        

         console.log("confirmed!!!"+ JSON.stringify(response.data));
         
      }).
       catch(function(error){
          console.log('an error occurred...'+JSON.stringify(error));

       });
   }


   $scope.release_updates = function(id) {

      console.log("confirm the raw after= "+ JSON.stringify($scope.e_raw));
      console.log("result = "+JSON.stringify($scope.confirmed_diff_raw));
      console.log("customer program id = "+id);



       $scope.e_raw_update = {
          "program": [],
          "competing_programs": [],
          "length": $scope.e_raw.length,
        }


      for(var i=0; i<$scope.e_raw.length; i++){


        if(i===0){
          $scope.e_raw_update.program.push($scope.e_raw[i])

        } else {
          $scope.e_raw_update.competing_programs.push($scope.e_raw[i])
        } 


      }

      console.log("$scope.e_raw_update="+JSON.stringify($scope.e_raw_update))


      //for api test
      $http({
            url: '/api/upgrid/update/enhancement/diff_confirmation/',
            method: 'PUT',
            data: {
              "customer_program_id": id,
              "confirmed_diff": $scope.confirmed_diff_raw,
              "cache_report": $scope.e_raw_update,
              "client_id": $scope.client_id_alias
            },
            headers: {
              'Authorization': 'JWT ' + token
            }
      }).then(function (response) {

        

         console.log("confirmed!!!"+ JSON.stringify(response.data));
         
      }).
       catch(function(error){
          console.log('an error occurred...'+JSON.stringify(error));

       });


   }


///////////////////
     $scope.togglefull = function(){
      angular.element(document.getElementById("WhoopsReport")).toggleClass('fullscreen-modal');
      

      }

      $scope.togglefullen = function(){
        angular.element(document.getElementById("EnhancementReport")).toggleClass('fullscreen-modal');
        

      }

        $scope.scrolltop1 = function(){
      
      angular.element(document.getElementById('scrolltop_whoops_page')).scrollTop(0);
    }

     $scope.scrolltop2 = function(){
      
      angular.element(document.getElementById('scrolltop_enhancement_page')).scrollTop(0);
    }



     $scope.testOnDemand = function(){


      $scope.ondemand = true;
                    $http({
                      url: '/api/upgrid/update/whoops/ondemand/',
                      method: 'PUT',
                      
                      headers: {
                        'Authorization': 'JWT ' + token
                      }
                    }).then(function (response) {


                      return $http({
                      url: '/api/upgrid/update/enhancement/ondemand/',
                      method: 'PUT',
                      headers: {
                        'Authorization': 'JWT ' + token
                      }
                    })

                    }).then(function (response) {

                      console.log("success ondemand");
                      $.notify({

                        // options
                        icon: "fa fa-check",
                        message: 'On-demand data have been successfully updated.'
                      }, {
                        // settings
                        type: 'success',
                        placement: {
                          from: "top",
                          align: "center"
                        },
                        z_index: 1999,
                      });
                      $scope.ondemand = false;


                        $scope.update_client = [];
                        $http({
                              url: '/api/upgrid/update/dashboard/',
                              method: 'GET',
                              headers: {
                                'Authorization': 'JWT ' + token
                              }
                        }).then(function (response) {

                          $scope.full_clients = response.data;
                          for(var i=0; i<response.data.length; i++){
                            if(response.data[i].has_update.whoops_update !== 0 || response.data[i].has_update.enhancement_update !== 0)
                            $scope.update_client.push(response.data[i]);
                          }
                            
                        }).
                         catch(function(error){
                            console.log('an error occurred...'+JSON.stringify(error));

                         });



                    }).
                     catch(function(error){
                        console.log('an error occurred...'+JSON.stringify(error));

                     });



     }

     //end of testOnDemand


         $scope.ondemand_one = function (id, type, client_id) {

        console.log("id= "+id);
        console.log("type= "+type);
        console.log("client_id= "+client_id)
        $scope.ondemand_single = true;
        if(type==="whoops"){

             $http({
                  url: '/api/upgrid/update/whoops/ondemand/',
                  method: 'PUT',
                  data: {
                    "customer_program_id": id,
                    "client_id": client_id
                  },
                  headers: {
                    'Authorization': 'JWT ' + token
                  }
                }).then(function (response) {
                   console.log('Whoops released')
                   $scope.ondemand_single = false;
                    $.notify({

                        // options
                        icon: "fa fa-check",
                        message: 'On-demand for a single program completed.'
                      }, {
                        // settings
                        type: 'success',
                        placement: {
                          from: "top",
                          align: "center"
                        },
                        z_index: 1999,
                      });

                }).
                 catch(function(error){
                    console.log('an error occurred...'+JSON.stringify(error));
                    $scope.ondemand_single = false;
                 });

        }

        if(type==="enhancement"){

             $http({
                  url: '/api/upgrid/update/enhancement/ondemand/',
                  method: 'PUT',
                  data: {
                    "customer_program_id": id,
                    "client_id": client_id
                  },
                  headers: {
                    'Authorization': 'JWT ' + token
                  }
                }).then(function (response) {
                  console.log('Enhancement released')
                  $scope.ondemand_single = false;
                   $.notify({

                        // options
                        icon: "fa fa-check",
                        message: 'On-demand for a single program completed.'
                      }, {
                        // settings
                        type: 'success',
                        placement: {
                          from: "top",
                          align: "center"
                        },
                        z_index: 1999,
                      });

                }).
                 catch(function(error){
                    console.log('an error occurred...'+JSON.stringify(error));
                    $scope.ondemand_single = false;
                 });
        }

     }







  }
]);



angular.module('myApp').filter('keylength', function(){
     return function(input){
     if(!angular.isObject(input)){
          return '0';
      }
     return Object.keys(input).length;
  }
})