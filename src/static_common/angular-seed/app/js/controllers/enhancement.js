//for the enhancement page
angular.module('myApp.login.success.enhancement', []).
controller('EnhancementController', function(avatarService, ajaxService, List, reportService, apiService, tableDataService, $localStorage, $sessionStorage, $scope, $window, $location, $http, authenticationSvc, $cookies, $state, $filter, $q) {
    // $scope.isActive = function(route) {
    //     return route === $location.path();
    // };
    //progressJs().end();
    var userInfo = authenticationSvc.getUserInfo();
    var token = authenticationSvc.getUserInfo().accessToken;
    $scope.emailadd = authenticationSvc.getUserInfo().username;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId()+'/' : "";

    // $scope.$route = $route;

    $scope.$storage = $localStorage;

    $scope.accountType = tableDataService.getProfile(List).accountType;
    console.log("account type = " + $scope.accountType);
    
          if($scope.width === undefined){
           
           $http({
              url: '/api/upgrid/user/dashboard/'+avatarService.getClientId(),
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function (response) {

               console.log("dashboard="+ JSON.stringify(response.data));
                $scope.customerprogram_nums = response.data.customerprogram_nums;
                $scope.finalreleased_enhancement = response.data.finalreleased_enhancement;
                $scope.unconfirmedprogram_nums = response.data.unconfirmedprogram_nums;
                $scope.width = 100 * $scope.finalreleased_enhancement / $scope.customerprogram_nums;

                if ($scope.accountType === 'main') {
                    //load modal when not confirmed
                    if ($scope.unconfirmedprogram_nums !== 0) {
                        console.log("$scope.unconfirmedprogram_nums="+$scope.unconfirmedprogram_nums);
                        $("#myModalConfirm").modal('show');
                    };
                    
                }


             }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });

           }

    // $http({
    //       url: '/api/upgrid/enhancement_reports/',
    //       method: 'PUT',
    //       data: {
    //         object_id: "98fcdb0b-e78c-4f94-b2a4-ce8cf8deb734/be679bd5-1d5d-4408-8b01-4c897cab2e47"
    //       },
    //       headers: {
    //         'Authorization': 'JWT ' + token
    //       }
    // }).then(function (response) {

    //    $scope.details = response.data;

    //    console.log("confirm applied"+ JSON.stringify(response));
    //     // if(response.status === 204){
    //     //   console.log("===204");
    //     // }
    // }).
    //  catch(function(error){
    //     console.log('an error occurred...'+JSON.stringify(error));

    //  });


    


    ////////////////////////////////////
    //get the program+degree data from deferred promise
    //Newest data
    //data used for the enhancement table (confirmed)
    
    //////$scope.data = tableDataService.getEnhancement(List);

    

    $scope.displayeddata1 = [];

    //App.blocks('#confirmloading', 'state_loading');


    $scope.confirmpipe = function(tableState){
      //$scope.isLoadingConfirm = true;
      App.blocks('#confirmloading', 'state_loading');
      console.log("piping");
      console.log("~~~tableState= "+JSON.stringify(tableState));
      var pagination = tableState.pagination;
      var start = pagination.start || 0;
      var number = pagination.number || 25;
        //ajaxService.getResult(start, number, tableState, token, "&cs=No").then(function (result) {

          var avatar = avatarService.getClientId() ? "&cid="+ avatarService.getClientId(): "";

        ajaxService.getResult(start, number, tableState, token, "&cs=No", avatar).then(function (result) {
          console.log("AJAX service called !");

          
          console.log("ajaxService.getResult confirm = "+JSON.stringify(result.data));

          $scope.displayeddata1 = tableDataService.getEnhancementConfirm(result.data);
          console.log("confirm data ="+JSON.stringify($scope.displayeddata1));
          tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
          
          //$scope.isLoadingConfirm = false;
          App.blocks('#confirmloading', 'state_normal');

  

        });

    }


     $scope.displayeddata = [];


    //App.blocks('#loading', 'state_loading');

      $scope.enhancementpipe = function(tableState){

      App.blocks('#loadingtable', 'state_loading');
      //$scope.isLoading = true;
      console.log("piping");
      console.log("enhancement~~~tableState= "+JSON.stringify(tableState));
      var pagination = tableState.pagination;
      var start = pagination.start || 0;
      var number = pagination.number || 25;
        //ajaxService.getResult(start, number, tableState, token, "&cs=No").then(function (result) {

          var avatar = avatarService.getClientId() ? "&cid="+ avatarService.getClientId(): "";
        ajaxService.getResult(start, number, tableState, token, "&cs=Yes", avatar).then(function (result) {
          console.log("AJAX service called !");

          
          console.log("ajaxService.getResult = "+JSON.stringify(result));
          console.log("result.data="+JSON.stringify(result.data));
          $scope.displayeddata = tableDataService.getEnhancement(result.data);

          console.log("displayeddata="+JSON.stringify($scope.displayeddata));
          tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
          



          //$scope.isLoading = false;
          App.blocks('#loadingtable', 'state_normal');

  

        });

    }



    //init the confirm dialog data
    //////$scope.confirmData = tableDataService.getEnhancementConfirm(List);
    //////console.log("List is %%%%%%%%%%" + JSON.stringify(List));
    //console.log("CSLIST = "+CSList);

    //$scope.unconfirmedprogram_nums = CSList;

    $scope.message = "Please make your confirmation first.";

    $scope.messageSub = "Please wait for the primary account to complete the confirmation.";


       
    //COPY to tables
    $scope.itemsByPage = 25;
    $scope.itemsByPage1 = 25;
    console.log("##############################");
    if ($scope.$storage.upgrid === undefined) {
        $scope.$storage.upgrid = {};
    }
    

    $scope.openCompeting = function (id, index, competing){

        console.log("competing="+JSON.stringify(competing));
        
        console.log("storage check"+JSON.stringify($scope.$storage.confirmation));

        if(competing.length === 0){

            //alert("triggered");
            $http({
                  url: '/api/upgrid/user/'+ avatar_value +'competing_program/'+id+'/',
                  method: 'GET',
                  headers: {
                    'Authorization': 'JWT ' + token
                  }
            }).then(function (response) {

               $scope.details = response.data;

               console.log("competing programs"+ JSON.stringify(response.data.competing_program));

               var competingArray = response.data.competing_program;
                competingArray.sort(function(a, b) {
                    return parseInt(a.order) - parseInt(b.order);
                });

               console.log("displayeddata1="+JSON.stringify($scope.displayeddata1));
               //alert(JSON.stringify($scope.displayeddata1[index]));
               $scope.displayeddata1[index].competing = competingArray;
                // if(response.status === 204){
                //   console.log("===204");
                // }
            }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });


            

        }

       
    }


    $scope.openTableCompeting = function (id, index, competing){

        console.log("competing="+JSON.stringify(competing));
        
        //console.log("storage check"+JSON.stringify($scope.$storage.confirmation));

        if(competing.length === 0){
            //alert("triggered");

            $http({
                  url: '/api/upgrid/user/'+ avatar_value +'competing_program/'+id+'/',
                  method: 'GET',
                  headers: {
                    'Authorization': 'JWT ' + token
                  }
            }).then(function (response) {

               $scope.details = response.data;

               console.log("competing programs"+ JSON.stringify(response.data.competing_program));

               var competingArray = response.data.competing_program;
                competingArray.sort(function(a, b) {
                    return parseInt(a.order) - parseInt(b.order);
                });

               console.log("displayeddata="+JSON.stringify($scope.displayeddata));
               //alert(JSON.stringify($scope.displayeddata1[index]));
               $scope.displayeddata[index].competing = competingArray;
                // if(response.status === 204){
                //   console.log("===204");
                // }
            }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });


            

        }

       
    }


    $scope.$watch('$storage.confirmation', function() {
            console.log('monitoring...');
            //console.log('STORAGE in success.js= '+JSON.stringify($scope.$storage));

            //get the number of program checked and display the count on the cart icon
            //use the cartCounter service
            
            console.log("$$$upgrid scope "+JSON.stringify($scope.$storage.upgrid));
            $scope.confirm_count = 0;

            $scope.confirm_button = false


            for(var key in $scope.$storage.confirmation){

                
                //key.value  {"whoops":true,"WId":"daf3bd2f-612c-430b-8472-a31afb4ba345"}
                if($scope.$storage.confirmation[key].checked) {
                    $scope.confirm_button = true;
                    $scope.confirm_count++
                }
            }


        }, true);

    $scope.showstorage = function() {

        console.log("checked storage = "+JSON.stringify($scope.$storage.confirmation));

        for(var key in $scope.$storage.confirmation){
            if($scope.$storage.confirmation[key].checked === true)
            {
                console.log("object_id = "+key);
            }
        }


    }

    //checkbox in the table heading
    $scope.selectAll = function() {
        for (var i = 0; i < $scope.data.length; i++) {
            if ($scope.data[i].status === 'True' && $scope.data[i].confirm === 'Yes') {
                if ($storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName] === undefined) {
                    $storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName] = {
                        "enhancement": true
                    };
                } else {
                    $storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName].enhancement = $scope.$storage.checkAllenhancement;
                }
            }
        }
    };
    //~~~~
    //ngTableDefaults.settings.counts = [];
    //remove the duplicate degree
    // $scope.degreeSelection = [];
    
    // for (i = 0; i < $scope.data.length; i++) {
    //     var exists = false;
    //     for (j = 0; j < $scope.degreeSelection.length; j++) {
    //         if ($scope.data[i].degreeName === $scope.degreeSelection[j]) {
    //             exists = true;
    //             break;
    //         }
    //     }
    //     if (!exists) {
    //         $scope.degreeSelection.push($scope.data[i].degreeName);
    //     };
    // };
    //~~~~~
    //one checked
    $scope.selectOne = function(Name, Degree, Id,  WStatus, EStatus, Confirm, Notes) {
        // $scope.checkAll = true;
        // for (var i = 0; i < $scope.data.length; i++) {
        //     if ($scope.data[i].confirm === "Yes" && $scope.data[i].status === "True") {
        //         if ($storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName] === undefined) {
        //             console.log("storage undefined");
        //             $scope.checkAll = false;
        //             break;
        //         } else if ($storage.upgrid[$scope.data[i].programName + $scope.data[i].degreeName].enhancement !== true) {
        //             $scope.checkAll = false;
        //             break;
        //         }
        //     }
        // };
        // $scope.$storage.checkAllenhancement = $scope.checkAll;

        if($scope.$storage.upgrid[Name+'|'+ Degree]['enhancement']){

            // var competingUrl = Id + '/';
           
            // for (i = 0; i < competing.length; i++) {
            //     competingUrl += competing[i].programId + '/';
            // }

            $scope.$storage.upgrid[Name+'|'+ Degree]['EId'] = Id;
            $scope.$storage.upgrid[Name+'|'+ Degree]['WStatus'] = WStatus
            $scope.$storage.upgrid[Name+'|'+ Degree]['EStatus'] = EStatus
            $scope.$storage.upgrid[Name+'|'+ Degree]['EConfirm'] = Confirm
            $scope.$storage.upgrid[Name+'|'+ Degree]['WNotes'] = Notes

        } else {

            $scope.$storage.upgrid[Name+'|'+ Degree]['EId'] = (function () { return; })();
            $scope.$storage.upgrid[Name+'|'+ Degree]['WStatus'] = WStatus
            $scope.$storage.upgrid[Name+'|'+ Degree]['EStatus'] = EStatus
            $scope.$storage.upgrid[Name+'|'+ Degree]['EConfirm'] = Confirm
            $scope.$storage.upgrid[Name+'|'+ Degree]['WNotes'] = Notes
        }


        //delete the empty localstorage
        // if( JSON.stringify($storage.upgrid[Name+'|'+ Degree]) === "{}"){
        //     $storage.upgrid[Name+'|'+ Degree] = (function () { return; })();
        // } else {
        //   console.log("Value= "+JSON.stringify($storage.upgrid[Name+'|'+ Degree]));
        // }

        

      console.log("upgrid data="+JSON.stringify($scope.$storage.upgrid));
      //console.log("test123 = "+$scope.test123);
    };
    $scope.pdfViewer = function(Id, competing) {
       //$event.stopPropagation();

        //jQuery("p:nth-child($index)").addClass("text-primary");
        //angular.element(document.getElementById("loadingtable").getElementsByClassName("js-table-sections-header")).toggleClass('open');

        PDFObject.embed("#", "#my-container");
        $scope.viewerLoading = true;
        
        $http({
            url: '/api/upgrid/'+ avatar_value +'enhancement_reports/'+Id+'/',
            method: 'GET',
            headers: {
                'Authorization': 'JWT ' + token
            },
            // 'Content-Type': 'application/json'
            responseType: 'arraybuffer'
        }).then(function(response) {
            console.log("RESPONSE= " + JSON.stringify(response));
            var file = new Blob([response.data], {
                type: 'application/pdf'
            });
            var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
            $scope.pdflink = fileURL;
            console.log("link = " + $scope.pdflink);
            //window.open(fileURL);
            console.log("success");
            console.log("dismissing progress bar");
            $scope.viewerLoading = false;
            PDFObject.embed(fileURL, "#my-container");
        }).
        catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));
            $scope.viewerLoading = false;
        });
    };
    $scope.pdfDownload = function(Id, competing, name, degree) {
        App.blocks('#loadingtable', 'state_loading');
        console.log("downloading");
        var competingUrl = Id + '/';
        //console.log('caught! '+program+' '+degree);
        for (i = 0; i < competing.length; i++) {
            competingUrl += competing[i].programId + '/';
        }
        $http({
            url: '/api/enhancement/',
            method: 'POST',
            data: {
                object_id: competingUrl.slice(0,-1)
            },
            headers: {
                'Authorization': 'JWT ' + token
            },
            // 'Content-Type': 'application/json'
            responseType: 'arraybuffer'
        }).then(function(response) {
            var file = new Blob([response.data], {
                type: 'application/pdf'
            });
            var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
            //$scope.pdflink = fileURL;
            //window.open(fileURL);
            console.log("success");
            saveAs(file, 'Enhancement_Report-' + name + '(' + degree + ')' + '.pdf');
            App.blocks('#loadingtable', 'state_normal');
        }).
        catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));
        });
    }
    $scope.pdfShare = function(Id, competing) {
        $scope.url = {
            text: null
        };
        $scope.shareLoading = true;
        $scope.copied = false;
        new Clipboard('.btn');
        
        var competingUrl = Id + '/';
        //console.log('caught! '+program+' '+degree);
        for (i = 0; i < competing.length; i++) {
            competingUrl += competing[i].programId + '/';
        }
        $http({
            url: '/api/upgrid/enhancement_reports/shared/',
            method: 'POST',
            data: {
                "univcustomer_program_id": Id
            },
            headers: {
                'Authorization': 'JWT ' + token
            },
            'Content-Type': 'application/json'
            //responseType: 'arraybuffer'
        }).then(function(response) {
            console.log("RESPONSE is "+JSON.stringify(response.data.shared_pdf_access_link));
        
            $scope.shareLoading = false;
           
            $scope.url = {
                text: response.data.shared_pdf_access_link
            };
        }).
        catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));
            $scope.shareLoading = false;
        });
    }
    $scope.confirmDialog = function() {
        //get the unconfirmed programs list
        $scope.confirmAll = false;
        //recall to update
        $scope.confirmpipe({"sort":{},"search":{},"pagination":{"start":0,"totalItemCount":0}});
        // {"sort":{},"search":{},"pagination":{"start":0,"totalItemCount":0}}

        console.log("confirm dialog works");
    }


    $scope.confirmSelected = function() {

        var confirm_list = "";
        for(var key in $scope.$storage.confirmation){
            if($scope.$storage.confirmation[key].checked === true)
            {
                console.log("object_id = "+key);
                confirm_list = confirm_list+ key + '/';

            }
        }

        delete $scope.$storage.confirmation;
        console.log("confirm_list = "+confirm_list);

        if(confirm_list!==""){

            $http({
              url: '/api/upgrid/enhancement_reports/',
              method: 'PUT',
              data: {
                object_id: confirm_list.slice(0,-1)
              },
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function (response) {

               

               console.log("confirm result"+ JSON.stringify(response));

               return $http({
                          url: '/api/upgrid/user/dashboard/'+avatarService.getClientId(),
                          method: 'GET',
                          headers: {
                            'Authorization': 'JWT ' + token
                          }
                        });

               }).then(function (response) {
                $scope.customerprogram_nums = response.data.customerprogram_nums;
                $scope.finalreleased_enhancement = response.data.finalreleased_enhancement;
                $scope.unconfirmedprogram_nums = response.data.unconfirmedprogram_nums;
                console.log("customerprogram_nums = "+$scope.customerprogram_nums);
                $scope.width = 100 * $scope.finalreleased_enhancement / $scope.customerprogram_nums;

                $("#myModalConfirm").modal('toggle');
                $scope.$broadcast('refreshProducts');

               $.notify({

              // options
               icon: "fa fa-check",
               message: 'The programs have been confirmed successfully.'
                }, {
                  // settings
                  type: 'success',
                  placement: {
                    from: "top",
                    align: "center"
                  },
                  z_index: 1999,
                });

                // if(response.status === 204){
                //   console.log("===204");
                // }
            }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });

         }


    }


    $scope.confirmCheckOne = function() {
        // $scope.confirmCheckAllBox = true;
        // for (var i = 0; i < $scope.confirmData.length; i++) {
        //     if ($scope.confirmData[i].checked !== true) {
        //         $scope.confirmCheckAllBox = false;
        //         break;
        //     }
        // };
        // $scope.confirmAll = $scope.confirmCheckAllBox;
    }
    $scope.confirmCheckAll = function() {
            //console.log("confirm all = "+$scope.confirmAll);
            for (var i = 0; i < $scope.confirmData.length; i++) {
                $scope.confirmData[i].checked = $scope.confirmAll;
            }
        }
        //for test
    $scope.setAllToUnconfirmed = function() {
        var setBackArray = [];
        for (i = 0; i < List.customer.customerprogram.length; i++) {
            setBackArray.push($http({
                url: '/api/changeconfirm/' + List.customer.customerprogram[i].object_id + '/',
                method: 'PUT',
                data: {
                    customerconfirmation_status: "No"
                },
                headers: {
                    'Authorization': 'JWT ' + token
                }
            }).then(function(response) {
                console.log('success unconfirm');
            }).catch(function(error) {
                console.log('an error occurred...' + JSON.stringify(error));
            }));
        }
        $q.all(setBackArray).then(function(result) {
            $scope.data = tableDataService.getEnhancement(List);
        });
        console.log("ALL HAVE BEEN SET BACK TO UNCONFIRMED");
    }


    $scope.togglefull = function (){
      
      angular.element(document.getElementById("myModal").getElementsByClassName("modal-dialog")).toggleClass('modal-dialogfull');
      angular.element(document.getElementById("myModal").getElementsByClassName("modal-content")).toggleClass('modal-contentfull');
      angular.element(document.getElementById("myModal").getElementsByClassName("block-content")).toggleClass('block-contentfull');

    }
    
});