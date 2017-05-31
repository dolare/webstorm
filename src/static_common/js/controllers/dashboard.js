//for the dashboard page

var dashboard = angular.module('myApp')
dashboard.controller('DashboardController',
  function(apiService, updateService, avatarService, $sce, $timeout, $window, Dash, authenticationSvc, $http, List, SUB, $scope) {
    
    var token = authenticationSvc.getUserInfo().accessToken;
    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";

    var container = angular.element(document.getElementById('scrollframe'));
    $scope.univeristy_name = List.profile.university;
    $scope.school_name = List.profile.school;
    $scope.Ceeb = List.profile.Ceeb;
    $scope.htmlPopover = $sce.trustAsHtml('1. Confirmation dialog added for delete actions.<br>2. Report template simplified.<br>3. Redesigned the style of the Reports template.<br>4. The release time and update time were integrated into the reports.');




     $scope.newly_released_function = function(refresh) {

        console.log("refresh="+refresh)
        if(refresh){
          App.blocks('#timeline-release', 'state_loading');
          
        }

        //dashboard sections
        //for api test
        $http({
              url: '/api/upgrid/user/dashboard/newly_released/'+client_id,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
        }).then(function (response) {

           var newly_released_raw = response.data;

           $scope.newly_released = [];

           for(var i=0; i<newly_released_raw.FinalReleasedWhoops.length; i++){

              if(newly_released_raw.FinalReleasedWhoops[i].whoops_final_release_time){
                  newly_released_raw.FinalReleasedWhoops[i].type = 'whoops';
                  newly_released_raw.FinalReleasedWhoops[i].released_time = newly_released_raw.FinalReleasedWhoops[i].whoops_final_release_time;
                  $scope.newly_released.push(newly_released_raw.FinalReleasedWhoops[i]);
              }

           }


           for(var i=0; i<newly_released_raw.FinalReleasedEnhancement.length; i++){

              if(newly_released_raw.FinalReleasedEnhancement[i].enhancement_final_release_time){
                  newly_released_raw.FinalReleasedEnhancement[i].type = 'enhancement';
                  newly_released_raw.FinalReleasedEnhancement[i].released_time = newly_released_raw.FinalReleasedEnhancement[i].enhancement_final_release_time;
                  $scope.newly_released.push(newly_released_raw.FinalReleasedEnhancement[i]);
              }
           }

           if(refresh){
             App.blocks('#timeline-release', 'state_normal');
           }
           
           console.log("$scope.newly_released = "+ JSON.stringify($scope.newly_released));

           
        }).
         catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));

            if(refresh){
             App.blocks('#timeline-release', 'state_normal');
           }

         });



     }


     $scope.newly_released_function();



     $scope.newly_updated_function = function(refresh) {

        if(refresh){
          App.blocks('#timeline-update', 'state_loading');
          
        }

        //for api test
        $http({
              url: '/api/upgrid/user/dashboard/newly_updated/'+client_id,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
        }).then(function (response) {

           
           var newly_updated_raw = response.data;

           $scope.newly_updated = [];

           for(var i=0; i<newly_updated_raw.WhoopsUpdateList.length; i++){

              if(newly_updated_raw.WhoopsUpdateList[i].last_edit_time){
                  newly_updated_raw.WhoopsUpdateList[i].type = 'whoops';
                  $scope.newly_updated.push(newly_updated_raw.WhoopsUpdateList[i]);
              }

           }


           for(var i=0; i<newly_updated_raw.EnhancementUpdateList.length; i++){

              if(newly_updated_raw.EnhancementUpdateList[i].last_edit_time){
                  newly_updated_raw.EnhancementUpdateList[i].type = 'enhancement';
                  $scope.newly_updated.push(newly_updated_raw.EnhancementUpdateList[i]);
              }
           }

           if(refresh){
             App.blocks('#timeline-update', 'state_normal');
           }

           console.log("$scope.newly_updated = "+ JSON.stringify($scope.newly_updated));



        }).
         catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));

            if(refresh){
             App.blocks('#timeline-update', 'state_normal');
           }

         });
     }



     $scope.newly_updated_function();
     



    $scope.scrolltop1 = function(){
      
      angular.element(document.getElementById('scrolltop_whoops')).scrollTop(0);
    }

    $scope.scrolltop2 = function(){
      
      angular.element(document.getElementById('scrolltop_enhancement')).scrollTop(0);
    }

    $scope.scrolltop3 = function(){
      
      angular.element(document.getElementById('scrolltop_enhancement_update')).scrollTop(0);
    }



    //console.log("ceeb result is"+JSON.stringify(List.profile.Ceeb));
   console.log("dashboard result is"+JSON.stringify(List));
   console.log("Dash = "+JSON.stringify(Dash));


   ///test update report

   console.log("clientid = "+ avatarService.getClientId());

  
    $scope.WhoopsViewer = function(Id){
      jQuery("#scrolltop").scrollTop(0);
      container.scrollTop(0, 5000);
      App.blocks('#whoops_loading', 'state_loading');
      
      $scope.show_history = 
          { dead_link: false,
            typo: false,
            outdated_information: false,
            data_discrepancy: false,
            sidebars: false,
            infinite_loop: false,
            floating_page: false,
            confusing: false,
            other_expert_note: false

          };

      $scope.date = new Date();
   
      $http({
                url: '/api/upgrid/update/view/whoops/' + Id + '/' +avatarService.getClientId(),
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {

        console.log("wwr"+JSON.stringify(response.data));
        
        var whoops_final_release_time = response.data.whoops_final_release_time;
        var report_last_edit_time = response.data.report_last_edit_time;

        console.log("whoops_final_release_time="+whoops_final_release_time);
        console.log("report_last_edit_time="+report_last_edit_time);
        $scope.w_update_diff = response.data.update_diff;
        $scope.w_raw = response.data.existing_report;

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
                  "university": response.data.university,
                  "school": response.data.school,
                  "program": response.data.program,
                  "degree": response.data.degree,
                  "w_release_time": whoops_final_release_time,
                  "w_update_time": report_last_edit_time
                 })

        $scope.report.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];
        App.blocks('#whoops_loading', 'state_normal');

        console.log('w_array_1='+JSON.stringify($scope.w_array_final));



      }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });

    }


    $scope.EnhancementViewer = function(Id){
      $scope.date = new Date();
      App.blocks('#enhancement_loading', 'state_loading');
    
        //ewr
         // $http({
         //        url: '/api/upgrid/ewr/'+Id,
         //        method: 'GET',
         //        headers: {
         //          'Authorization': 'JWT ' + token
         //        }
         //  }).then(function (response) {

          $http({
                url: '/api/upgrid/update/view/enhancement/' + Id + '/' +avatarService.getClientId(),
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {


            
             console.log("released report whoops"+ JSON.stringify(response.data));
              
             var enhancement_final_release_time = response.data.enhancement_final_release_time;
             var report_last_edit_time = response.data.report_last_edit_time;

             $scope.e_raw = response.data.existing_report.program.concat(response.data.existing_report.competing_programs);
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


             //$scope.e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10];
             e_array_11.push(
             {
              
              "e_release_time": enhancement_final_release_time,
              "e_update_time": report_last_edit_time

             })


             $scope.report.e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10, e_array_11];
             
             $scope.e_update_diff = response.data.update_diff;
             $scope.e_show_update = updateService.updateEnhancement(response.data, 'client');

             App.blocks('#enhancement_loading', 'state_normal');

             console.log('e_array_1='+JSON.stringify($scope.e_array_final));

              
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });



    }
     

   //show the name and position
   $scope.contact_name = List.profile.contact_name;
   $scope.position = List.profile.position;
   $scope.subuser = SUB;

   //dashboard headline number
   
   $scope.total_num = Dash.ceeb_program_nums;
   $scope.customer_num = Dash.customer_program_nums;
   $scope.whoops_num = Dash.final_released_whoops;
   $scope.enhancement_num = Dash.final_released_enhancement;
   $scope.unconfirmed_num =Dash.unconfirmed_program_nums;

   //dashboard pie chart data
   var percent1 = $scope.customer_num/$scope.total_num*100;
   var percent2 = $scope.whoops_num/$scope.customer_num*100;
   var percent3 = $scope.enhancement_num/$scope.customer_num*100;
   var percent4 = ($scope.customer_num-$scope.unconfirmed_num)/$scope.customer_num*100;


   setTimeout(function(){jQuery('.chart-1').data('easyPieChart').update(percent1);}, 100);

   setTimeout(function(){jQuery('.chart-2').data('easyPieChart').update(percent2);}, 100);

   setTimeout(function(){jQuery('.chart-3').data('easyPieChart').update(percent3);}, 100);

   setTimeout(function(){jQuery('.chart-4').data('easyPieChart').update(percent4);}, 100);


   $scope.test1 = 25;
   $scope.customer = List;

   $scope.printReport = function() {
      window.print();
      
   }


    console.log("welcome!");

    $scope.togglefull = function(){
      angular.element(document.getElementById("WhoopsReport")).toggleClass('fullscreen-modal');
      

    }

    $scope.togglefullen = function(){
      angular.element(document.getElementById("EnhancementReport")).toggleClass('fullscreen-modal');
      

    }

    $scope.togglefullen1 = function(){
      angular.element(document.getElementById("EnhancementReport1")).toggleClass('fullscreen-modal');
      

    }


    
  });
