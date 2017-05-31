//for the whoops page

var whoops = angular.module('myApp')
whoops.controller('WhoopsController',
  function(avatarService, ajaxService, reportService, $location, tableDataService, filterFilter, $scope, apiService, $window, $http, authenticationSvc, $localStorage, $sessionStorage, $state, $filter, $q) {

    //progressJs().end();
    //////////
    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId()+'/' : "";

    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";

    console.log("host 1 is "+location.host);
    //for api test
    // $http({
    //       url: '/api/upgrid/whoops_reports/shared/'+'a37a52bf-e713-48aa-b171-12187466ad44/3de6274e-98ae-4080-b287-e7b41ebe8101',
    //       method: 'GET',
    //       headers: {
    //         'Authorization': 'JWT ' + token
    //       }
    // }).then(function (response) {

    //    $scope.details = response.data;

    //    console.log("return data"+ JSON.stringify(response.data));
    //    
    // }).
    //  catch(function(error){
    //     console.log('an error occurred...'+JSON.stringify(error));

    //  });

    $scope.count = 0;

    $scope.scrolltop = function(){
      
      angular.element(document.getElementById('scrolltop_whoops_page')).scrollTop(0);
      
    }

    $scope.WhoopsViewer = function(Id){
      
      //jQuery('#WhoopsReport').scrollTop(0);

      App.blocks('#whoops_loading', 'state_loading');
      

      $scope.date = new Date();

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
          
          //$scope.show_history_dead_link = false;
          console.log("$scope.show_history.dead_link="+$scope.show_history.dead_link);
          $http({
                url: '/api/upgrid/update/view/whoops/' + Id + '/' +avatarService.getClientId(),
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {

            console.log("whoops raw = "+JSON.stringify(response.data));

            var whoops_final_release_time = response.data.whoops_final_release_time;
            var report_last_edit_time = response.data.report_last_edit_time;

            // $scope.w_release_time = moment.tz(whoops_final_release_time, "America/New_York").format();
            // $scope.w_update_time = moment.tz(report_last_edit_time, "America/New_York").format()

            // console.log("$scope.w_release_time"+$scope.w_release_time);
            // console.log("$scope.w_update_time"+$scope.w_update_time);
            $scope.w_update_diff = response.data.update_diff;
            console.log("update_diff = "+JSON.stringify($scope.w_update_diff));
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

            //console.log('w_array_1='+JSON.stringify($scope.w_array_final));




          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error.data));

           });

    }


    $scope.addMessage = function() {
      $scope.count++;
    };
    
  
    //console.log("list is ---" + JSON.stringify(List));
    $scope.userInfo = authenticationSvc.getUserInfo();
    $scope.show_alert = true;

    //$scope.data = tableDataService.getWhoops(List);
    //console.log("DATA = ~~~~~~" + JSON.stringify($scope.data));
    $scope.$storage = $localStorage;

    
    // App.blocks('#loading', 'state_loading');

    //App.blocks('#loadingheader', 'refresh_toggle');


    $scope.whoopspipe = function(tableState){
      $scope.displayeddata = [];
      // $scope.isLoading = true;
      console.log("~~~tableState= "+JSON.stringify(tableState));
      App.blocks('#loadingtable', 'state_loading');



      var pagination = tableState.pagination;
      var start = pagination.start || 0;
      var number = pagination.number || 25;
        //ajaxService.getResult(start, number, tableState, token, "&cs=No").then(function (result) {


          var avatar = avatarService.getClientId() ? "&cid="+ avatarService.getClientId(): "";
          console.log("avatar = "+avatar);

        ajaxService.getResult(start, number, tableState, token, "", avatar).then(function (result) {
          console.log("AJAX service called !");

          $scope.displayeddata = result.data;

          console.log("%%%result.raw="+JSON.stringify(result.raw));
          console.log("%%%result.data="+JSON.stringify(result.data));

          $scope.data = tableDataService.getWhoops($scope.displayeddata);

          console.log("$scope.data = "+JSON.stringify($scope.data));

          tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update

          //total num of programs
          $scope.totalnum = result.raw.count;

          if($scope.width === undefined){

              

                    apiService.getReleasedWhoops(token).then(function(result) {
                        console.log("result="+result);
                        $scope.availablenum = result;
                        console.log("$scope.availablenum="+$scope.availablenum);
                        $scope.width = 100 * $scope.availablenum / $scope.totalnum;

                       
                        setTimeout(function(){jQuery('.chart-1').data('easyPieChart').update($scope.width);}, 100);

                    }, function(error) {
                       
                        console.log('error is: ' + JSON.stringify(error));

                    });


              
          }
          // $scope.isLoading = false;


          App.blocks('#loadingtable', 'state_normal');



        });

    }
              console.log("$scope.availablenum="+$scope.availablenum);
              console.log("$scope.totalnum="+$scope.totalnum);
    
    ////////////smart table
    $scope.itemsByPage = 25;


    //init for the checkbox ngStorage
    if ($scope.$storage.upgrid === undefined) {
      $scope.$storage.upgrid = {};

    }

    //checking single checkbox
    $scope.selectOne = function(Name, Degree, Id, WStatus, EStatus, Notes, Confirm) {
      

          $scope.$storage.upgrid[Name+'|'+Degree]["Id"] = Id

          $scope.$storage.upgrid[Name+'|'+Degree]["WStatus"] = WStatus
          $scope.$storage.upgrid[Name+'|'+Degree]["EStatus"] = EStatus
          $scope.$storage.upgrid[Name+'|'+Degree]["WNotes"] = Notes
          $scope.$storage.upgrid[Name+'|'+Degree]["EConfirm"] = Confirm


          console.log("$scope.$storage.upgrid="+JSON.stringify($scope.$storage.upgrid));
      
    };


    $scope.htmlShare = function(Id) {
      
      $scope.url = {
            text: null
        };
        $scope.shareLoading = true;
        $scope.copied = false;
        new Clipboard('.btn');


        
      $http({
        url: '/api/upgrid/reports/shared/',
        method: 'POST',
        data: {
          "whoops_id": Id,
          "enhancement_id": null,
          "client_id": client_id
          
        },
        headers: {
          'Authorization': 'JWT ' + token
        },
        'Content-Type': 'application/json'
    
      }).then(function(response) {
        console.log("share html RESPONSE is "+JSON.stringify(response.data));
     
          $scope.shareLoading = false;


            $scope.shared_id = response.data[0].split('/')[0];
            $scope.shared_token = response.data[0].split('/')[1];

            $scope.url = {
                text: 'https://'+location.host + '/#/shared_whoops_report/' + $scope.shared_id + '/' + $scope.shared_token + '/',
            };

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
       
      });

    };

    // $scope.togglefull = function (){
      
    //   angular.element(document.getElementById("myModal").getElementsByClassName("modal-dialog")).toggleClass('modal-dialogfull');
    //   angular.element(document.getElementById("myModal").getElementsByClassName("modal-content")).toggleClass('modal-contentfull');
    //   angular.element(document.getElementById("myModal").getElementsByClassName("block-content")).toggleClass('block-contentfull');

    // }


    $scope.printReport = function() {
      
      $("#printWhoops").printThis({ 
          debug: false,              
          importCSS: true,             
          importStyle: true,         
          printContainer: true,       
          loadCSS: "../static/css/print.css", 
          pageTitle: "Upgrid Whoops Report",             
          removeInline: false,        
          printDelay: 333,            
          header: null,             
          formValues: true          
      }); 
   }  



    $scope.togglefull = function(){
      angular.element(document.getElementById("WhoopsReport")).toggleClass('fullscreen-modal');
      

    }

  });
