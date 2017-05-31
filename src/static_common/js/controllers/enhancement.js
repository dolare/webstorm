//for the enhancement page
angular.module('myApp').
controller('EnhancementController', function(updateService, avatarService, ajaxService, List, reportService, apiService, tableDataService, $localStorage, $sessionStorage, $scope, $window, $location, $http, authenticationSvc, $state, $filter, $q) {
    // $scope.isActive = function(route) {
    //     return route === $location.path();
    // };
    //progressJs().end();
    var userInfo = authenticationSvc.getUserInfo();
    var token = authenticationSvc.getUserInfo().accessToken;
    $scope.emailadd = authenticationSvc.getUserInfo().username;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId()+'/' : "";
    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";
    var unenhancement_avatar = avatarService.getClientId() ? "?client_id="+avatarService.getClientId() : "";

    /////////
    



    // $scope.$route = $route;

    $scope.$storage = $localStorage;


    $scope.scrolltop = function(){
      
      angular.element(document.getElementById('scrolltop_enhancement_page')).scrollTop(0);
    }


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
          $scope.customerprogram_nums = response.data.customer_program_nums;
          $scope.finalreleased_enhancement = response.data.final_released_enhancement;
          $scope.unconfirmedprogram_nums = response.data.unconfirmed_program_nums;
          $scope.width = 100 * $scope.finalreleased_enhancement / $scope.customerprogram_nums;

          if ($scope.accountType === 'main') {
              //load modal when not confirmed
              if ($scope.unconfirmedprogram_nums !== 0) {
                  $("#myModalConfirm").modal('show');

                  App.blocks('#confirmloading', 'state_loading');

                  //api
                  $http({
                        url: '/api/upgrid/user/unenhancement/programs/'+unenhancement_avatar,
                        method: 'GET',
                        headers: {
                          'Authorization': 'JWT ' + token
                        }
                  }).then(function (response) {
                    console.log("unconfirmed_enhancement"+ JSON.stringify(response.data));
                    $scope.displayeddata1 = response.data

                    

                    App.blocks('#confirmloading', 'state_normal');
                  }).
                   catch(function(error){
                      console.log('an error occurred...'+JSON.stringify(error));
                      App.blocks('#confirmloading', 'state_normal');
                   });



              };
              
          }

          if($scope.unconfirmedprogram_nums === 0){
              setTimeout(function(){jQuery('.chart-1').data('easyPieChart').update($scope.width);}, 100);
          }


       }).
       catch(function(error){
          console.log('an error occurred...'+JSON.stringify(error));

       });

     }

    $scope.EnhancementViewer = function(Id){
      $scope.date = new Date();
      App.blocks('#enhancement_loading', 'state_loading');
            //App.blocks('#my-block', 'state_loading');

      
          $http({
                url: '/api/upgrid/update/view/enhancement/' + Id + '/' +avatarService.getClientId(),
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {

            
             console.log("released response ="+ JSON.stringify(response));

             var enhancement_final_release_time = response.data.enhancement_final_release_time;
             var report_last_edit_time = response.data.report_last_edit_time;

             
             console.log("released report enhancement"+ JSON.stringify(response.data));
             //$scope.e_raw = response.data;    
             $scope.e_raw = response.data.existing_report.program.concat(response.data.existing_report.competing_programs);

             //console.log("$scope.e_raw="+JSON.stringify($scope.e_raw[0]));
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



             e_array_11.push(
             {
              
              "e_release_time": enhancement_final_release_time,
              "e_update_time": report_last_edit_time

             })

             $scope.report.e_array_final = [e_array_1, e_array_2, e_array_3, e_array_4, e_array_5, e_array_6, e_array_7, e_array_8, e_array_9, e_array_10, e_array_11];
              

             console.log("$scope.report.e_array_final="+JSON.stringify($scope.report.e_array_final));
             //update_diff
             // process update_diff
             $scope.e_update_diff = response.data.update_diff;
             //console.log("$scope.e_array_final[10][0]= "+$scope.e_array_final[10][0].e_release_time);


             $scope.e_show_update = updateService.updateEnhancement(response.data, 'client');
             console.log('$scope.e_show_update = '+JSON.stringify($scope.e_show_update));
             // $scope.e_show_update = {};

             $scope.open_popover = true;


             angular.element(document).ready(function () {
               App.blocks('#enhancement_loading', 'state_normal');
               //App.blocks('#my-block', 'state_normal');
             });

              
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });

    }


    $scope.togglefullen = function(){
      angular.element(document.getElementById("EnhancementReport")).toggleClass('fullscreen-modal');
      

    }

    $scope.printReport = function() {
      window.print();
      
   }

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

        // ajaxService.getResult(start, number, tableState, token, "&cs=No", avatar).then(function (result) {
        //   console.log("AJAX service called !");

          
        //   console.log("ajaxService.getResult confirm = "+JSON.stringify(result.data));
          
        //   $scope.displayeddata1 = tableDataService.getEnhancementConfirm(result.data);
        //   console.log("confirm data ="+JSON.stringify($scope.displayeddata1));
        //   tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
         
        //   //$scope.isLoadingConfirm = false;
        //   App.blocks('#confirmloading', 'state_normal');


        // });

        //api
        $http({
              url: '/api/upgrid/user/unenhancement/programs/'+unenhancement_avatar,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
        }).then(function (response) {
          console.log("unconfirmed_enhancement"+ JSON.stringify(response.data));
          $scope.displayeddata1 = response.data

          

          App.blocks('#confirmloading', 'state_normal');
        }).
         catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));
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
          console.log("%%%result.raw="+JSON.stringify(result.raw));
          //total num of programs
          $scope.totalnum = result.raw.count;

          $scope.displayeddata = tableDataService.getEnhancement(result.data);

          console.log("displayeddata="+JSON.stringify($scope.displayeddata));
          tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
          

          //$scope.isLoading = false;
          App.blocks('#loadingtable', 'state_normal');


  

        });

    }


    $scope.message = "Please make your confirmation first.";

    $scope.messageSub = "Please wait for the primary account to complete the confirmation.";


       
    //COPY to tables
    $scope.itemsByPage = 25;
    $scope.itemsByPage1 = 25;
    console.log("##############################");
    if ($scope.$storage.upgrid === undefined) {
        $scope.$storage.upgrid = {};
    }
    

    $scope.openCompeting = function (id, index){

        
        console.log("storage check"+JSON.stringify($scope.$storage.confirmation));


            //alert("triggered");
            $http({
                  url: '/api/upgrid/user/'+ avatar_value +'competing_program/'+id+'/',
                  method: 'GET',
                  cache: true,
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


    $scope.openTableCompeting = function (id, index, competing){

        console.log("competing="+JSON.stringify(competing));
        
        //console.log("storage check"+JSON.stringify($scope.$storage.confirmation));

        if(competing.length === 0){
            //alert("triggered");
            console.log("avatar_value="+avatar_value);
            $http({
                  url: '/api/upgrid/user/'+ avatar_value +'competing_program/'+id+'/',
                  method: 'GET',
                  headers: {
                    'Authorization': 'JWT ' + token
                  }
            }).then(function (response) {

               $scope.details = response.data;
               //console.log("compting response = "+reponse)
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

    $scope.selectOne = function(Name, Degree, Id,  WStatus, EStatus, Confirm, Notes) {
        
       

            $scope.$storage.upgrid[Name+'|'+ Degree]['Id'] = Id;
            $scope.$storage.upgrid[Name+'|'+ Degree]['WStatus'] = WStatus
            $scope.$storage.upgrid[Name+'|'+ Degree]['EStatus'] = EStatus
            $scope.$storage.upgrid[Name+'|'+ Degree]['EConfirm'] = Confirm
            $scope.$storage.upgrid[Name+'|'+ Degree]['WNotes'] = Notes

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
              "whoops_id": null,
              "enhancement_id": Id,
              "client_id":client_id
            },
            headers: {
                'Authorization': 'JWT ' + token
            },
            'Content-Type': 'application/json'
            //responseType: 'arraybuffer'
        }).then(function(response) {
            console.log("shared link RESPONSE is "+JSON.stringify(response.data));
            $scope.shareLoading = false;
            $scope.shared_id = response.data[0].split('/')[0];
            $scope.shared_token = response.data[0].split('/')[1];

            $scope.url = {
                text: 'https://'+location.host + '/#/shared_enhancement_report/' + $scope.shared_id + '/' + $scope.shared_token + '/',
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

        App.blocks('#confirmloading', 'state_loading');

        //api
        $http({
              url: '/api/upgrid/user/unenhancement/programs/'+unenhancement_avatar,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
        }).then(function (response) {
          console.log("unconfirmed_enhancement"+ JSON.stringify(response.data));
          $scope.displayeddata1 = response.data

          App.blocks('#confirmloading', 'state_normal');
        }).
         catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));
            App.blocks('#confirmloading', 'state_normal');
         });



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
                "object_id": confirm_list.slice(0,-1),
                "client_id": client_id
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
                $scope.customerprogram_nums = response.data.customer_program_nums;
                $scope.finalreleased_enhancement = response.data.final_released_enhancement;
                $scope.unconfirmedprogram_nums = response.data.unconfirmed_program_nums;
                //console.log("customerprogram_nums = "+$scope.customerprogram_nums);

                console.log("$scope.unconfirmedprogram_nums="+$scope.unconfirmedprogram_nums);

                if($scope.unconfirmedprogram_nums === 0) {
                    $scope.width = 100 * $scope.finalreleased_enhancement / $scope.customerprogram_nums;

                    setTimeout(function(){jQuery('.chart-1').data('easyPieChart').update($scope.width);}, 100);
                    
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
                }

                $("#myModalConfirm").modal('toggle');
                $scope.$broadcast('refreshProducts');
                

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
        
    }
    $scope.confirmCheckAll = function() {
            //console.log("confirm all = "+$scope.confirmAll);
            for (var i = 0; i < $scope.confirmData.length; i++) {
                $scope.confirmData[i].checked = $scope.confirmAll;
            }
        }



    $scope.togglefull = function (){
      
      angular.element(document.getElementById("myModal").getElementsByClassName("modal-dialog")).toggleClass('modal-dialogfull');
      angular.element(document.getElementById("myModal").getElementsByClassName("modal-content")).toggleClass('modal-contentfull');
      angular.element(document.getElementById("myModal").getElementsByClassName("block-content")).toggleClass('block-contentfull');

    }
    
});
