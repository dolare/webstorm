/*Executive Education Admin controller*/
'use strict';

angular.module('myApp').controller('EmailController', ['$q', '$http', '$scope', 'authenticationSvc', 'updateService', '$timeout', 'executiveService', 'ajaxService',
  function($q, $http, $scope, authenticationSvc, updateService, $timeout, executiveService, ajaxService) {

    // Inject underscore into $scope
    $scope._ = _;
    $scope.active_user = 'active';
    var token = authenticationSvc.getUserInfo().accessToken;
    //API for get email details
    $scope.preview_notification = function(){
      $http({
        url: '/api/upgrid/non_degree/preview_notification',
        method: 'get',
        params:{
          is_active: $scope.active_user?($scope.active_user=='active'?'True':'False'):null,
          is_demo:$scope.demo_user?($scope.demo_user=='demo'?'True':'False'):null
        },
        headers: {
            'Authorization': 'JWT ' + token
          }
        }
        ).then(function(res){
          console.log(res);
          App.blocks('#emailloading', 'state_loading');
          $scope.email = res.data;
          var emailarr = [];
          var email_address;
          //transfer object data to array
          for (email_address in $scope.email){
            var emailel = {   
            'email_address':'',
            'school':'',
            'university':'',
            'client_name':'',
            'username':'',
            'content':'',
            'last_sent':''
            };
            emailel.email_address = email_address;
            emailel.school =  $scope.email[email_address].school;
            emailel.university =  $scope.email[email_address].university;
            emailel.client_name = $scope.email[email_address].clientname;
            emailel.username =  $scope.email[email_address].username;
            emailel.content = $scope.email[email_address].email_content;
            emailel.last_sent = $scope.email[email_address].date_lastsent;
            emailarr.push(emailel);
          }
          $scope.emailarr = emailarr
          App.blocks('#emailloading', 'state_normal');

        })
    };
    $scope.preview_notification();
    //content in Model
    $scope.checkcontent = function(email){
        $timeout( function(){
            hljs.initHighlighting();
            $scope.show_code = true
        }, 100 );
        var str = email.content
        $scope.email_content = str;
        $scope.email_need_send = email.email_address;
        console.log($scope.email_need_send);

    };
    //API for individual_send
    $scope.individual_send = function(){
        console.log($scope.email_need_send);
        $http({
          url: '/api/upgrid/non_degree/send_notification',
          method: 'post',
          data: {
            email: $scope.email_need_send
          },
          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function(res){
          $scope.server_res = res.data.success;
          $scope.preview_notification();
          $.notify({

                        // options
                        icon: "fa fa-check",
                        message: $scope.server_res
                    }, {
                        // settings
                        type: 'success',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                    });
        }).then(function(err){
        if(err){
          $.notify({

                        // options
                        icon: "fa fa-check",
                        message: err
                    }, {
                        // settings
                        type: 'success',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                    });
          }
        });
    }

    //api for send email
    $scope.send_notification = function(){
      if(JSON.stringify($scope.email)=='{}'){ //check email without api calls using content from last preview_notification api
        $.notify({

                        // options
                        icon: "fa fa-check",
                        message: 'No Email need to be sent'
                    }, {
                        // settings
                        type: 'error',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                    });
      } else{
        $http({
        url: '/api/upgrid/non_degree/send_notification',
        method: 'post',
        headers: {
            'Authorization': 'JWT ' + token
          }
      }).then(function(res){
          $scope.server_res = res.data.success;
          $scope.preview_notification();
          $.notify({

                        // options
                        icon: "fa fa-check",
                        message: $scope.server_res
                    }, {
                        // settings
                        type: 'success',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                    });
      }).then(function(err){
        if(err){
          $.notify({

                        // options
                        icon: "fa fa-check",
                        message: err
                    }, {
                        // settings
                        type: 'success',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                    });
        }
      })
      }   
    };
    //API for email History
    $scope.pagenumber = 1;
    $scope.email_history = function(){
      $http({
        url: '/api/upgrid/non_degree/sent_email_history',
        method: 'get',
        params: {
          page: $scope.pagenumber
        },
        headers: {
            'Authorization': 'JWT ' + token
        }
      }).then(function(res){
        $scope.history_data = res.data;
        $scope.history_arr = res.data.results;
        $scope.previous_url = res.data.previous;
        $scope.next_url = res.data.next;
        if($scope.pagenumber==1){
          $scope.email_pagination = $scope.history_arr.length;
        }
        $scope.custom_pagination();

      }).then(function(err){
        console.log(err);
      })
    }
    $scope.previous_page = function(){
      $http({
        url: $scope.previous_url,
        method: 'get',
        headers: {
            'Authorization': 'JWT ' + token
        }
      }).then(function(res){
        $scope.history_data = res.data;
        $scope.history_arr = res.data.results;
        $scope.previous_url = res.data.previous;
        $scope.next_url = res.data.next;
      }).then(function(err){
        console.log(err);
      })
    };
    $scope.next_page = function(){
      $http({
        url: $scope.next_url,
        method: 'get',
        headers: {
            'Authorization': 'JWT ' + token
        }
      }).then(function(res){
        $scope.history_data = res.data;
        $scope.history_arr = res.data.results;
        $scope.previous_url = res.data.previous;
        $scope.next_url = res.data.next;
      }).then(function(err){
        console.log(err);
      }) 
    };
    $scope.page_change = function(page){
        $scope.pagenumber = page;
        $scope.email_history();
    }
    $scope.custom_pagination = function(){
      $scope.email_total = $scope.history_data.count;
      var page = Math.ceil($scope.email_total/$scope.email_pagination);
      $scope.pagination_number_arr = [];
      for (var i = 1; i<page+1;i++){
        $scope.pagination_number_arr.push(i)
      }
    }
    $scope.check_history_content = function(email){
      $timeout( function(){
          hljs.initHighlighting();
          $scope.show_code = true
      }, 100 );
      var str = email.email_content
      $scope.email_content = str;
      $scope.email_need_send = email.email_address;
    };
    $scope.page_class = function(page){
      if($scope.pagenumber == page){
        return 'active';
      }
    };
    $scope.previous_class = function(){
      if(!$scope.previous_url){
        return 'disabled';
      }
    };
    $scope.next_class = function(){
      if(!$scope.next_url){
        return 'disabled';
      }
    }
  }
]);