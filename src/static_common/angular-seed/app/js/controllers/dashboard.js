//for the dashboard page

var dashboard = angular.module('myApp.login.success.dashboard', [])
dashboard.controller('DashboardController',
  function($sce, ReleasedEnhancement, ReleasedWhoops, $timeout, $window, Dash, authenticationSvc, $http, apiService, List, $scope) {
  	
  	var token = authenticationSvc.getUserInfo().accessToken;
    $scope.univeristy_name = List.profile.university;
    $scope.school_name = List.profile.school;
    $scope.Ceeb = List.profile.Ceeb;
    $scope.htmlPopover = $sce.trustAsHtml('1. Enhancement titles modified');

    //console.log("ceeb result is"+JSON.stringify(List.profile.Ceeb));
   console.log("dashboard result is"+JSON.stringify(List));
   console.log("Dash = "+JSON.stringify(Dash));
   console.log("getAdmin@dash = "+JSON.stringify(apiService.getAdmin()));
   console.log("whoops true program = "+JSON.stringify(ReleasedWhoops));
   $scope.newly_released_whoops = ReleasedWhoops;

   console.log("enhancement true program = "+JSON.stringify(ReleasedEnhancement));
   $scope.newly_released_enhancement = ReleasedEnhancement;

  
    $scope.WhoopsViewer = function(Id, Program, Degree){
      App.blocks('#whoops_loading', 'state_loading');
       

      $scope.whoops_report_program = Program;
      $scope.whoops_report_degree = Degree;
      $scope.date = new Date();
      $http({
          url: '/api/upgrid/wwr/'+Id,
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
         var w_array_10 = [];
         

        for(i=0; i<$scope.w_raw.length; i++){
          if($scope.w_raw[i].additional_note_type === "dead_link")
          {

            w_array_1.push($scope.w_raw[i])

          } else if($scope.w_raw[i].additional_note_type === "typo")
          {
            w_array_2.push($scope.w_raw[i])

          } else if($scope.w_raw[i].additional_note_type === "outdated_information")
          {
            w_array_3.push($scope.w_raw[i])

          } else if($scope.w_raw[i].additional_note_type === "data_discrepancy")
          {
            w_array_4.push($scope.w_raw[i])

          } else if($scope.w_raw[i].additional_note_type === "sidebars")
          {

            w_array_5.push($scope.w_raw[i])

          } else if($scope.w_raw[i].additional_note_type === "infinite_loop")
          {
            w_array_6.push($scope.w_raw[i])

          } else if($scope.w_raw[i].additional_note_type === "floating_page")
          {

            w_array_7.push($scope.w_raw[i])

          } else if($scope.w_raw[i].additional_note_type === "confusing")
          {

            w_array_8.push($scope.w_raw[i])

          } else if($scope.w_raw[i].additional_note_type === "other_expert_note")
          {

            w_array_9.push($scope.w_raw[i])

          } else {

            w_array_10.push($scope.w_raw[i])
          }

          
        }

        $scope.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];
        App.blocks('#whoops_loading', 'state_normal');

        console.log('w_array_1='+JSON.stringify($scope.w_array_final));



      }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });

    }


    $scope.EnhancementViewer = function(Id, Program, Degree){
      $scope.date = new Date();
      App.blocks('#enhancement_loading', 'state_loading');
      
      $scope.enhancement_report_program = Program;
      $scope.enhancement_report_degree = Degree;
        //ewr
         $http({
                url: '/api/upgrid/ewr/'+Id,
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



    }

    $scope.EnhancementViewer1 = function(Id, Program, Degree){
      $scope.date = new Date();
      App.blocks('#enhancement_loading1', 'state_loading');
      
      $scope.enhancement_report_program = Program;
      $scope.enhancement_report_degree = Degree;
        //ewr
         $http({
                url: '/api/upgrid/ewr/'+Id,
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
             App.blocks('#enhancement_loading1', 'state_normal');

             console.log('e_array_1='+JSON.stringify($scope.e_array_final));

              
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });



    }

     

   //show the name and position
   $scope.contact_name = List.profile.contact_name;
   $scope.position = List.profile.position;
   $scope.subuser = List.profile.sub_user_list;

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
          //jQuery('.pie-chart-mine').data('easyPieChart').update(test1);
          //console.log("pie-chart="+JSON.stringify(jQuery('.pie-chart')));
          //jQuery('.pie-chart').data('easyPieChart').update(50);
            // jQuery(document).ready(function(){
                  
            //       jQuery('.pie-chart').data('easyPieChart').update(50);

            // });

            // //angular.element(getElementsByClassName("pie-chart")).data('easyPieChart').update(50);
            // // jQuery('.js-pie-randomize').on('click', function(){
            //   var init_pie = function(){
            //     jQuery('.js-pie-randomize')
            //         .parents('.block')
            //         .find('.pie-chart')
            //         .each(function() {
            //             var random = Math.floor((Math.random() * 100) + 1);
            //             console.log("random = "+random)
            //             console.log("this ="+this);
            //             jQuery(this).data('easyPieChart').update(25);
            //             console.log("this is "+JSON.stringify(jQuery(this)));
            //             // jQuery(this)
            //             //     .data('easyPieChart')
            //             //     .update(random);
            //         });
            //   }

            //   init_pie();




            // });
            

             
    
   // jQuery('.pie-chart').data('easyPieChart').update(50);
   // jQuery(this)
   //                          .data('easyPieChart')
   //                          .update(random);

   // $http({
   //        url: '/api/upgrid/user/',
   //        method: 'GET',
   //        headers: {
   //          'Authorization': 'JWT ' + token
   //        }
   //  }).then(function (response) {

   //     $scope.details = response.data;

   //     console.log("@@@user detail="+ JSON.stringify(response));
   //      // if(response.status === 204){
   //      //   console.log("===204");
   //      // }
   //  }).
   //   catch(function(error){
   //      console.log('an error occurred...'+JSON.stringify(error));

   //   });


   
   //jQuery('.pie-chart').data('easyPieChart').update(50);

    // jQuery('.js-pie-randomize').on('click', function(){

    //             //var random = Math.floor((Math.random() * 100) + 1);
    //             jQuery('.pie-chart').data('easyPieChart').update(50);



    //         });
    //var token = authenticationSvc.getUserInfo().accessToken;
    
    // $http({
    //       url: '/api/upgrid/user/dashboard/',
    //       method: 'GET',
    //       headers: {
    //         'Authorization': 'JWT ' + token
    //       }
    // }).then(function (response) {

    //    $scope.details = response.data;

    //    console.log("dashboard="+ JSON.stringify(response.data));
    //     // if(response.status === 204){
    //     //   console.log("===204");
    //     // }
    // }).
    //  catch(function(error){
    //     console.log('an error occurred...'+JSON.stringify(error));

    //  });

    
     // Init counter functionality
        // jQuery('[data-toggle="countTo"]').each(function(){
        //     var $this       = jQuery(this);
        //     var $after      = $this.data('after');
        //     var $before     = $this.data('before');
        //     var $speed      = $this.data('speed') ? $this.data('speed') : 1500;
        //     var $interval   = $this.data('interval') ? $this.data('interval') : 15;

        //     $this.appear(function() {
        //         $this.countTo({
        //             speed: $speed,
        //             refreshInterval: $interval,
        //             onComplete: function() {
        //                 if($after) {
        //                     $this.html($this.html() + $after);
        //                 } else if ($before) {
        //                     $this.html($before + $this.html());
        //                 }
        //             }
        //         });
        //     });
        // });

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