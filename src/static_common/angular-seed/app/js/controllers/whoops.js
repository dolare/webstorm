//for the whoops page

var whoops = angular.module('myApp.login.success.whoops', [])
whoops.controller('WhoopsController',
  function(List, avatarService, ajaxService, reportService, $location, tableDataService, filterFilter, $scope, apiService, $window, $http, authenticationSvc, $localStorage, $sessionStorage, $state, $filter, $q) {

    //progressJs().end();
    //////////
    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId()+'/' : "";
    $scope.univeristy_name = List.profile.university;
    $scope.school_name = List.profile.school;

   
    console.log("host 1 is "+$location.absUrl());
    //for api test
    // $http({
    //       url: '/api/upgrid/user/program/?&name=app',
    //       method: 'GET',
    //       headers: {
    //         'Authorization': 'JWT ' + token
    //       }
    // }).then(function (response) {

    //    $scope.details = response.data;

    //    console.log("released report whoops"+ JSON.stringify(response));
    //     // if(response.status === 204){
    //     //   console.log("===204");
    //     // }
    // }).
    //  catch(function(error){
    //     console.log('an error occurred...'+JSON.stringify(error));

    //  });

    $scope.count = 0;



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

        $scope.w_array_final = [w_array_1, w_array_2, w_array_3, w_array_4, w_array_5, w_array_6, w_array_7, w_array_8, w_array_9];
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
    
    // $http({
    //       url: '/api/customerDetail/',
    //       method: 'POST',
    //       data: {
    //          email: authenticationSvc.getUserInfo().username
    //       },
    //       headers: {
    //         'Authorization': 'JWT ' + token
    //       }
    // }).then(function (response) {

    //    $scope.details = response.data;

    //    console.log("!!!GOT! customer detail="+ JSON.stringify(response));
    //     // if(response.status === 204){
    //     //   console.log("===204");
    //     // }
    // }).
    //  catch(function(error){
    //     console.log('an error occurred...'+JSON.stringify(error));

    //  });

    // /////////////////////////////
    // var part1 = [];
    // var part2 = [];
    // $http({
    //       url: '/api/selected_program/?order=oname&page=1&page_size=26',
    //       method: 'GET',
          
    //       headers: {
    //         'Authorization': 'JWT ' + token
    //       }
    // }).then(function (response) {

    //    $scope.details = response.data;
    //    //part1 = response.data;
    //    //console.log("***GOT! detail="+ JSON.stringify(response.data));
    //     // if(response.status === 204){
    //     //   console.log("===204");
    //     // }
    //     //console.log("abcd = "+JSON.stringify($scope.details));
    //     // if(response.data.next){
    //     //      console.log("it has next url");
    //     //                 $http({
    //     //                 url: response.data.next,
    //     //                 method: 'GET',
                        
    //     //                 headers: {
    //     //                   'Authorization': 'JWT ' + token
    //     //                 }
    //     //           }).then(function (response) {

    //     //              $scope.details = response.data;
    //     //              part2 = response.data.results;
    //     //              //console.log("***GOT! detail="+ JSON.stringify(response.data));
    //     //               // if(response.status === 204){
    //     //               //   console.log("===204");
    //     //               // }
    //     //               //console.log("_______final result = "+JSON.stringify(part1.concat(part2)));

    //     //           }).
    //     //            catch(function(error){
    //     //               console.log('an error occurred...'+JSON.stringify(error));

    //     //            });

    //     // } else {
    //     //   console.log("it does NOT has next url");
    //     // }

    // }).
    //  catch(function(error){
    //     console.log('an error occurred...'+JSON.stringify(error));

    //  });


    // $http({
    //       url: '/api/subuser/',
    //       method: 'POST',
    //       data: { "username": "ColumbiaUGSAS@S2",
    //             //+($scope.data.subuser.length+1)
    //               "password": "Test128",
    //               "email": "aha@gmail.com",
    //               "Ceeb": "2162",
    //               "Contact_Prefix": "Mr",
    //               "Contact_Name": "Aha",
    //               "Contact_Title": "Dean",
    //               "Contract_Level": "platina",
    //               "Contact_Tel": "2012732735"},
    //       headers: {'Authorization': 'JWT ' + token}

    //       }).then(function (response) {
    //           console.log('success create!');
    //           // $scope.data.subuser.push(
    //           //  {"username":$scope.data.username.split('@')[0]+"@S"+($scope.data.subuser.length+1),
    //           //   "email":$scope.subuser.email,
    //           //   "Contact_Prefix":$scope.subuser.form_contact_prefix,
    //           //   "Contact_Name": $scope.subuser.name,
    //           //   "Contact_Title":$scope.subuser.title,
    //           //   "Contact_Tel":$scope.subuser.tel});

    //           // //update data
    //           // $scope.data = tableDataService.getProfile(List);



    //          }).
    //        catch(function(error){
    //           console.log('an error occurred...'+JSON.stringify(error));


    //       });
    // // /////////
    

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
                    }, function(error) {
                       
                        console.log('error is: ' + JSON.stringify(error));

                    });

              
          }
          // $scope.isLoading = false;


          App.blocks('#loadingtable', 'state_normal');

          // $scope.totalnum = 0;
          // $scope.availablenum = 0;
          

          // $http({
          //       url: '/api/selected_program/?order=oname',
          //       method: 'GET',
                
          //       headers: {
          //         'Authorization': 'JWT ' + token
          //       }
          // }).then(function (response) {
          //   $scope.totalnum = response.data.count; 
          //   return $http({
          //       url: '/api/selected_program/?order=oname&fs=True',
          //       method: 'GET',
                
          //       headers: {
          //         'Authorization': 'JWT ' + token
          //       }
          //     });

          // }).then(function (response) {
          //     $scope.availablenum = response.data.count;
          //     console.log("$scope.availablenum="+$scope.availablenum);
          //     console.log("$scope.totalnum="+$scope.totalnum);
          //     $scope.width = 100 * $scope.availablenum / $scope.totalnum;
          // }).
          //  catch(function(error){
          //     console.log('an error occurred...'+JSON.stringify(error));

          //  });

          //+/+/+/+/+/+/+/check perfect 

           // var checkPerfect = [];
    
           //  for (i = 0; i < $scope.data.length; i++) {

           //    if ($scope.data[i].status) {
           //      checkPerfect.push(reportService.getWhoopsPerfect($scope.data[i].programId, token));
           //    }

           //  }

            // $q.all(checkPerfect).then(function(result) {

            //   console.log("result= " + JSON.stringify(result));
            //   for (i = 0; i < $scope.data.length; i++) {
            //     if (result[i] === 204 && $scope.data[i].status === 'True') {
            //       $scope.data[i].perfect = "True";
            //     } else {
            //       $scope.data[i].perfect = "False";

            //     }
            //   }

            // });

        });

    }


   
              console.log("$scope.availablenum="+$scope.availablenum);
              console.log("$scope.totalnum="+$scope.totalnum);
    
    //console.log("DATAAAAAA= "+JSON.stringify($scope.data));



    ////////////smart table
    $scope.itemsByPage = 25;
    $scope.toolTip = "kakaka";



    //init for the checkbox ngStorage
    if ($scope.$storage.upgrid === undefined) {
      $scope.$storage.upgrid = {};

    }

    //for testing if the program has error
    $scope.perfect = false;

    
    //remove the duplicate degree

    /////~~~~
    // for (i = 0; i < $scope.data.length; i++) {
    //   var exists = false;
    //   for (j = 0; j < $scope.degreeSelection.length; j++) {
    //     if ($scope.data[i].degreeName === $scope.degreeSelection[j]) {
    //       exists = true;
    //       break;
    //     }
    //   }

    //   if (!exists) {
    //     $scope.degreeSelection.push($scope.data[i].degreeName);
    //   };

    // };

    //////~~~~~


    //console.log("******data length=" + $scope.data.length);



    ///////////////////
    //available reports
    //$scope.totalnum = $scope.data.length;


    //////~~~~
    
    // $scope.totalnum = 0;
    // $scope.availablenum = 0;
    // for (i = 0; i < $scope.data.length; i++) {
    //   if ($scope.data[i].status) {
    //     if ($scope.data[i].status === "True") {
    //       $scope.availablenum++;
    //     }
    //     $scope.totalnum++;
    //   }
    // }

    ////~~~~~
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
      

      if($scope.$storage.upgrid[Name+'|'+ Degree]['whoops']){

          $scope.$storage.upgrid[Name+'|'+Degree]["WId"] = Id

          $scope.$storage.upgrid[Name+'|'+Degree]["WStatus"] = WStatus
          $scope.$storage.upgrid[Name+'|'+Degree]["EStatus"] = EStatus
          $scope.$storage.upgrid[Name+'|'+Degree]["WNotes"] = Notes
          $scope.$storage.upgrid[Name+'|'+Degree]["EConfirm"] = Confirm


      }else{
          $scope.$storage.upgrid[Name+'|'+Degree]["WId"] = (function () { return; })();
          $scope.$storage.upgrid[Name+'|'+Degree]["WStatus"] = WStatus
          $scope.$storage.upgrid[Name+'|'+Degree]["EStatus"] = EStatus
          $scope.$storage.upgrid[Name+'|'+Degree]["WNotes"] = Notes
          $scope.$storage.upgrid[Name+'|'+Degree]["EConfirm"] = Confirm
         

      }




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

    $scope.pdfShare = function(Id) {
      $scope.url = {
        text: null
      };

      $scope.copied = false;
      new Clipboard('.btn');

      $scope.shareLoading = true;

      $http({
        url: '/api/upgrid/whoops_reports/shared/',
        method: 'POST',
        data: {
          "univcustomer_program_id": Id
        },
        headers: {
          'Authorization': 'JWT ' + token
        },
        'Content-Type': 'application/json'
        //responseType: 'arraybuffer'
          // cache: true


      }).then(function(response) {
        console.log("RESPONSE is "+JSON.stringify(response.data.shared_pdf_access_link));
        
        console.log("link = " + $scope.pdflink);
        //window.open(fileURL);
        console.log("success");
        $scope.shareLoading = false;
        //console.log("dismiss share progress");
        $scope.url = {
          text: response.data.shared_pdf_access_link
        };


      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        $scope.shareLoading = false;
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

    // $scope.addtest = function(){
    //   console.log("data = "+JSON.stringify($scope.data));
    //   $scope.data.push({"programId":"daf3bd2f-612c-430b-8472-a31afb4ba345","programName":"African-African Studies","degreeName":"MA","status":"True","$$hashKey":"object:35","perfect":"False"})
    // }

    
  });