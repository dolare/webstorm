//for the cart page

angular.module('myApp').
controller('ReportsController',
  function(avatarService, $location, List, $timeout, Checked, reportService, tableDataService, $scope, cartCounter, $window, $http, authenticationSvc, $state, $filter, $q, $localStorage, $sessionStorage) {
    var token = authenticationSvc.getUserInfo().accessToken;
    //init the ngStorage
    $scope.$storage = $localStorage;

    $scope.clearSharedValue = function (){
      
      $scope.url = null;
    }

    $scope.clearSharedValue();

    //console.log("result========"+JSON.stringify(List));
    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";

    // console.log("$state.params.url= "+$state.params.url);
    ///////////////////////////////////
    $scope.showMessage = true;

    //show the message when no program added
    $scope.message = "Please add some reports from 'whoops!' or 'enhancement' page first.";
    $scope.itemsByPage = 25;

    $scope.univeristy_name = List.profile.university;
    $scope.school_name = List.profile.school;
    $scope.date = new Date();
    ///////////////////////////////////////
    //user performs no action


    console.log("output Checked programs = " + JSON.stringify(Checked));
    $scope.Checked = Checked;

    $scope.scrolltop = function() {

      angular.element(document.getElementById('scrolltop_cart')).scrollTop(0);
    }

    // alert('wahaha[0]='+$scope.obj1.wahaha[0]);

      
    $scope.printReport = function() {
      
      $("#top-report").printThis({ 
          debug: false,              
          importCSS: true,             
          importStyle: true,         
          printContainer: true,       
          loadCSS: "../static/css/print.css", 
          pageTitle: "Upgrid Reports",             
          removeInline: false,        
          printDelay: 333,            
          header: null,             
          formValues: true          
      }); 
   }  

    

    $scope.togglefullen = function() {
      angular.element(document.getElementById("ViewAll")).toggleClass('fullscreen-modal');


    }

    $scope.setLinkValue= function() {

      $scope.whoops_ids = "";
      $scope.enhancement_ids = "";

       $scope.share_counter = cartCounter.counter();

      console.log("share_counter"+JSON.stringify($scope.share_counter));


      angular.forEach($scope.share_counter, function(value, index) {

        if($scope.share_counter[index].whoops){
          $scope.whoops_ids = $scope.whoops_ids + $scope.share_counter[index].Id + '/';
        }

        if($scope.share_counter[index].enhancement){
          $scope.enhancement_ids = $scope.enhancement_ids + $scope.share_counter[index].Id + '/';
        }


      });

     

      if($scope.whoops_ids === "" && $scope.enhancement_ids === ""){
        $.notify({

              // options
              icon: "fa fa-warning",
              message: 'Please make your selection.'
            }, {
              // settings
              type: 'warning',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });

      } else {

         $("#myModal1").modal('toggle');
         jQuery('.myTab-share a:first').tab('show')


       }


    }


    $scope.htmlShare = function(day) {


      $scope.url = {
        text: null
      };


      $scope.copied = false;
      new Clipboard('.btn');


         jQuery('.myTab-share a:last').tab('show')

         App.blocks('#shareReports', 'state_loading');
        //  $scope.url = {
        // text: $location.absUrl().split('#')[0] + '#/upgrid/share_selected_report/asd3dhu38dj93jdj93/',

        //  };
         $http({
        url: '/api/upgrid/reports/shared/',
        method: 'POST',
        data: {
          "whoops_id": ($scope.whoops_ids === ""? null: $scope.whoops_ids.slice(0,-1)),
          "enhancement_id": ($scope.enhancement_ids === ""? null: $scope.enhancement_ids.slice(0,-1)),
          "client_id": client_id,
          "expired_day": day,
          "expired_sec": 0,

        },
        headers: {
          'Authorization': 'JWT ' + token
        },
        'Content-Type': 'application/json'

      }).then(function(response) {
        

        $scope.shared_id = response.data.link.split('/')[0];
        $scope.shared_token = response.data.link.split('/')[1];
        $scope.expired_time = response.data.expired_time;

        App.blocks('#shareReports', 'state_normal');
        $scope.url = {
          text: 'https://'+location.host + '/#/upgrid/share_selected_report/' + $scope.shared_id + '/' + $scope.shared_token + '/',
        };

        console.log("shared_id="+$scope.shared_id);
        console.log("$scope.shared_token"+$scope.shared_token);

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        App.blocks('#shareReports', 'state_normal');

      });

      

    }



    $scope.ViewAll = function() {


      App.blocks('#viewall_loading', 'state_loading');

      console.log("$local=" + JSON.stringify($storage.upgrid));
      console.log('storage result= ' + JSON.stringify(cartCounter.counter()));

      $scope.view_counter = cartCounter.counter();

      console.log("$scope.view_counter = " + JSON.stringify($scope.view_counter));
      $scope.report_array = [];

      for (i = 0; i < $scope.view_counter.length; i++) {

        $scope.report_array.push({
          'order': i,
          'w_array_final': [],
          'e_array_final': [],
          'whoops_report_program': $scope.view_counter[i].name,
          'whoops_report_degree': $scope.view_counter[i].degree
        });

      }

      


      angular.forEach($scope.view_counter, function(value, index) {
        console.log("index=" + index)
        if ($scope.view_counter[index].whoops) {


          console.log("*index=" + index);
          console.log("$scope.view_counter[index].Id" + $scope.view_counter[index].Id);

        
            $http({
                url: '/api/upgrid/update/view/whoops/' + $scope.view_counter[index].Id + '/' +avatarService.getClientId(),
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {

            var whoops_final_release_time = response.data.whoops_final_release_time;
            var report_last_edit_time = response.data.report_last_edit_time;


            $scope.w_raw = response.data.existing_report;
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

                 w_array_10.push(
                 {
                  "university": response.data.university,
                  "school": response.data.school,
                  "program": response.data.program,
                  "degree": response.data.degree,
                  "w_release_time": whoops_final_release_time,
                  "w_update_time": report_last_edit_time
                 })

            //$scope.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];
        

            $scope.report_array[index].w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9, w_array_10];


          }).
          catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

          });



        }



        //////////////


        if ($scope.view_counter[index].enhancement) {
          

            $http({
                url: '/api/upgrid/update/view/enhancement/' + $scope.view_counter[index].Id + '/' +avatarService.getClientId(),
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {

            var enhancement_final_release_time = response.data.enhancement_final_release_time;
            var report_last_edit_time = response.data.report_last_edit_time;


            $scope.e_raw = response.data.existing_report.program.concat(response.data.existing_report.competing_programs);

            //console.log("$scope.e_raw = "+JSON.stringify($scope.e_raw));
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


            $scope.report_array[index].e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10, e_array_11];
            //App.blocks('#enhancement_loading', 'state_normal');

            //console.log('e_array_1='+JSON.stringify($scope.e_array_final));


          }).
          catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

          });



        }


      });



      $q.all($scope.report_array).then(function(result) {

        // console.log("$scope.report_array= "+JSON.stringify($scope.report_array));
        App.blocks('#viewall_loading', 'state_normal');
      });


    }



    if (false) {

      $scope.showMessage = false;

      $scope.showFilter = true;

      var preData = tableDataService.getCart(List);
      console.log("preData= " + JSON.stringify(preData));
      $scope.data = [];
      for (i = 0; i < preData.length; i++) {
        //data[i].programName = $scope.programs[i].program_name;

        //check if undefined
        if ($scope.$storage.upgrid[preData[i].programName + preData[i].degreeName] !== undefined) {

          //check if has true value
          if ($scope.$storage.upgrid[preData[i].programName + preData[i].degreeName].whoops === true || $scope.$storage.upgrid[preData[i].programName + preData[i].degreeName].enhancement === true)
            $scope.data.push({
              "programId": preData[i].programId,
              "programName": preData[i].programName,
              "degreeName": preData[i].degreeName,
              "status": preData[i].status,
              "confirm": preData[i].confirm,
              "notes": preData[i].notes,
              "competing": preData[i].competing
            });

        }


      }


      console.log("D.A.T.A = " + JSON.stringify($scope.data));



      $scope.degreeSelection = [];
      //remove the duplicate degree
      for (i = 0; i < $scope.data.length; i++) {
        var exists = false;
        for (j = 0; j < $scope.degreeSelection.length; j++) {
          if ($scope.data[i].degreeName === $scope.degreeSelection[j]) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          $scope.degreeSelection.push($scope.data[i].degreeName);
        };

      };


      ///////////////////////////////////


      //checkbox sync with previous pages
      $scope.checkbox = function() {

        if (cartCounter.countNo().length < preData.length) {
          $scope.$storage.checkAllwhoops = false;
          $scope.$storage.checkAllenhancement = false;

        } else { //all defined
          $scope.$storage.checkAllwhoops = true;

          for (var key in $scope.$storage.upgrid) {
            if ($scope.$storage.upgrid[key].whoops !== true) {
              $scope.$storage.checkAllwhoops = false;
              console.log('set checkAll-whoops false')

              break;

            }

          };

          $scope.$storage.checkAllenhancement = true;
          //obj
          for (var key in $scope.$storage.upgrid) {
            if ($scope.$storage.upgrid[key].enhancement !== true) {
              $scope.$storage.checkAllenhancement = false;
              console.log('set checkAll-enhancement false');
              break;

            };
          }

        };

      };
    };


  });
