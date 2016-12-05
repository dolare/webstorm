//for the whoops page

var whoops = angular.module('myApp.login.success.whoops', [])
whoops.controller('WhoopsController',
  function(avatarService, ajaxService, reportService, $location, tableDataService, filterFilter, $scope, apiService, $window, $http, authenticationSvc, $localStorage, $sessionStorage, $state, $filter, $q) {

    //progressJs().end();
    //////////
    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId()+'/' : "";

        
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
    //     // if(response.status === 204){
    //     //   console.log("===204");
    //     // }
    // }).
    //  catch(function(error){
    //     console.log('an error occurred...'+JSON.stringify(error));

    //  });

    $scope.count = 0;

    $scope.scrolltop = function(){
      
      angular.element(document.getElementById('scrolltop_whoops_page')).scrollTop(0);
    }


    $scope.WhoopsViewer = function(Id, Program, Degree){
      
      //jQuery('#WhoopsReport').scrollTop(0);

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


          if($scope.width === undefined){
              $scope.totalnum = result.raw.count;

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
    $scope.toolTip = "kakaka";



    //init for the checkbox ngStorage
    if ($scope.$storage.upgrid === undefined) {
      $scope.$storage.upgrid = {};

    }

    //for testing if the program has error
    $scope.perfect = false;

  
    //for the title checkbox
    $scope.selectAll = function() {
      for (var i = 0; i < $scope.data.length; i++) {

        if ($scope.data[i].status === 'True' && $scope.data[i].perfect !== 'True') {
          if ($storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName] === undefined) {
            $storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName] = {
              "whoops": true
            };

          } else {
            $storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName].whoops = $scope.$storage.checkAllwhoops;
          }

        }
      }

    };

    

    //checking single checkbox
    $scope.selectOne = function(Name, Degree, Id, WStatus, EStatus, Notes, Confirm) {
      

          $scope.$storage.upgrid[Name+'|'+Degree]["Id"] = Id

          $scope.$storage.upgrid[Name+'|'+Degree]["WStatus"] = WStatus
          $scope.$storage.upgrid[Name+'|'+Degree]["EStatus"] = EStatus
          $scope.$storage.upgrid[Name+'|'+Degree]["WNotes"] = Notes
          $scope.$storage.upgrid[Name+'|'+Degree]["EConfirm"] = Confirm


          console.log("$scope.$storage.upgrid="+JSON.stringify($scope.$storage.upgrid));
      
    };



    //trigger pdf viewer
    $scope.pdfViewer = function(Id) {
      PDFObject.embed("#", "#my-container");
      $scope.viewerLoading = true;
      $http({
        url: '/api/upgrid/'+ avatar_value +'whoops_reports/'+Id+'/',
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        },
        // 'Content-Type': 'application/json'
        responseType: 'arraybuffer'
          // cache: true



      }).then(function(response) {
        if (response.status === 204) {
          console.log("success 204");
        } else {
          console.log("whoop response = " + JSON.stringify(response));
          //console.log(response.headers)
          var file = new Blob([response.data], {
            type: 'application/pdf'
          });
          var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
          $scope.pdflink = fileURL;
          console.log("link = " + $scope.pdflink);
          console.log("success");
          console.log("dismissing progress bar");
          $scope.viewerLoading = false;
          PDFObject.embed(fileURL, "#my-container");

        };


      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        $scope.viewerLoading = false;
      }).finally(function() {
        // $scope.viewerLoading=false;
      });



    }

    $scope.pdfDownload = function(Id, name, degree) {
      App.blocks('#loadingtable', 'state_loading');
      $http({
        url: '/api/whoops/' ,
        method: 'POST',
        data: {
          "object_id": Id
        },
        headers: {
          'Authorization': 'JWT ' + token
        },
        // 'Content-Type': 'application/json'
        responseType: 'arraybuffer'
          // cache: true



      }).then(function(response) {
        var file = new Blob([response.data], {
          type: 'application/pdf'
        });
        var fileURL = (window.URL || window.webkitURL).createObjectURL(file);

        console.log("success");

        saveAs(file, 'Whoops_Report-' + name + '(' + degree + ')' + '.pdf');

        App.blocks('#loadingtable', 'state_normal');

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });



    }

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
                text: location.host + '/static/angular-seed/app/index.html#'+'/shared_whoops_report/' + $scope.shared_id + '/' + $scope.shared_token + '/',
            };

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
       
      });

    };


    $scope.reportShare = function(Id, Program, Degree) {
      $scope.url = {
        text: null
      };

      $scope.copied = false;
      new Clipboard('.btn');

      $scope.shareLoading = true;

        $scope.url = {
          text: $location.absUrl().split('#')[0]+'#/upgrid/share_whoops_report/'+Id+'/'+Program+'/'+Degree+'/',
        };


        $scope.shareLoading = false;
    

    };



    // $scope.togglefull = function (){
      
    //   angular.element(document.getElementById("myModal").getElementsByClassName("modal-dialog")).toggleClass('modal-dialogfull');
    //   angular.element(document.getElementById("myModal").getElementsByClassName("modal-content")).toggleClass('modal-contentfull');
    //   angular.element(document.getElementById("myModal").getElementsByClassName("block-content")).toggleClass('block-contentfull');

    // }


    $scope.printReport = function() {
      window.print();
      
   }  



    $scope.togglefull = function(){
      angular.element(document.getElementById("WhoopsReport")).toggleClass('fullscreen-modal');
      

    }

  });