//for the dashboard page

var dashboard = angular.module('myApp.login.success.dashboard', [])
dashboard.controller('DashboardController',
  function($timeout, $window, Dash, authenticationSvc, $http, apiService, List, $scope) {
  	
  	var token = authenticationSvc.getUserInfo().accessToken;
    
   console.log("dashboard result is"+JSON.stringify(List));
   console.log("Dash = "+JSON.stringify(Dash));
   console.log("getAdmin@dash = "+JSON.stringify(apiService.getAdmin()));

   
   // $http({
   //        url: '/api/upgrid/ewr/'+"c732b4d6-77d2-4c59-8570-54d11f089083",
   //        method: 'GET',
   //        headers: {
   //          'Authorization': 'JWT ' + token
   //        }
   //  }).then(function (response) {

      

   //     console.log("released report whoops"+ JSON.stringify(response));
        
   //  }).
   //   catch(function(error){
   //      console.log('an error occurred...'+JSON.stringify(error));

   //   });




    $scope.date = new Date();

   //show the name and position
   $scope.contact_name = List.profile.contact_name;
   $scope.position = List.profile.position;
   $scope.subuser = List.profile.subuser_list;

   //dashboard headline number
   
   $scope.total_num = Dash.ceebprogram_nums;
   $scope.customer_num = Dash.customerprogram_nums;
   $scope.whoops_num = Dash.finalreleased_whoops;
   $scope.enhancement_num = Dash.finalreleased_enhancement;
   $scope.unconfirmed_num =Dash.unconfirmedprogram_nums;

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
       //$timeout($window.print, 0);
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
    
  });