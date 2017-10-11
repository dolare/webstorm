//for the login and forgot page

var login = angular.module('myApp');
login.controller('LoginController',
    function(apiService, avatarService, $stateParams, $scope, $location, $window, $http, authenticationSvc, $cookies, $state) {
        //$scope.userInfo = null;


        //fix the modal bug from bootstrap.js
        angular.element(document).find('body').removeClass('modal-open');
        angular.element(document.getElementsByClassName("modal-backdrop")).remove();

        console.log('cookies before login: ' + $cookies.get('userInfo'));
        console.log('session before login: ' + $window.sessionStorage["userInfo"]);


        // Material inputs helper
        //sidebar menu
        jQuery('.form-material.floating > .form-control').each(function() {
            var $input = jQuery(this);
            var $parent = $input.parent('.form-material');

            if ($input.val()) {
                $parent.addClass('open');
            }

            $input.on('change', function() {
                if ($input.val()) {
                    $parent.addClass('open');
                } else {
                    $parent.removeClass('open');
                }
            });
        });

        // $.validator.addMethod("emailz", function(value, element) {
        // return this.optional(element) || /^[a-zA-Z0-9._-]+@gmail.com$/i.test(value);
        // }, "Please enter a valid Email. ie... mrbrown@gmail.com");
        //////////
        jQuery('.js-validation-login').validate({
            errorClass: 'help-block text-right animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function(error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            success: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            rules: {
                'login-username': {
                    //emailz: true,
                    required: true,
                    // minlength: 3
                },
                'login-password': {
                    required: true,
                    minlength: 5
                }
            },
            messages: {
                'login-username': {
                    required: 'Please enter an email address',
                    // minlength: 'Your email must consist of at least 3 characters'
                },
                'login-password': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long'
                }
            }
        });



        //////////
        jQuery('.js-validation-reminder').validate({
            errorClass: 'help-block text-right animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function(error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            success: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            rules: {
                'register-email': {
                    required: true,
                    email: true
                }
            },
            messages: {
                'register-email': {
                    required: 'The email address is required.',
                    email: 'Please enter your email address.'
                }
            }
        });


        ////////// notify
        var uiHelperNotify = function() {
            // Init notifications (with .js-notify class)
            jQuery('.js-notify').on('click', function() {
                var $notify = jQuery(this);
                var $notifyMsg = $notify.data('notify-message');
                var $notifyType = $notify.data('notify-type') ? $notify.data('notify-type') : 'info';
                var $notifyFrom = $notify.data('notify-from') ? $notify.data('notify-from') : 'top';
                var $notifyAlign = $notify.data('notify-align') ? $notify.data('notify-align') : 'right';
                var $notifyIcon = $notify.data('notify-icon') ? $notify.data('notify-icon') : '';
                var $notifyUrl = $notify.data('notify-url') ? $notify.data('notify-url') : '';

                jQuery.notify({
                    icon: $notifyIcon,
                    message: $notifyMsg,
                    url: $notifyUrl
                }, {
                    element: 'body',
                    type: $notifyType,
                    allow_dismiss: true,
                    newest_on_top: true,
                    showProgressbar: false,
                    placement: {
                        from: $notifyFrom,
                        align: $notifyAlign
                    },
                    offset: 20,
                    spacing: 10,
                    z_index: 1033,
                    delay: 5000,
                    timer: 1000,
                    animate: {
                        enter: 'animated fadeIn',
                        exit: 'animated fadeOutDown'
                    }
                });
            });
        };

        jQuery(function() {
            // Init page helpers (BS Notify Plugin)
            App.initHelpers('notify');
        });

        /////////

        //for the 'forgot-password' page
        $scope.sendEmail = function() {

            if ($scope.email && $scope.forgotform.$valid) {

                $http({
                    url: '/api/upgrid/user/password/reset/',
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    data: {
                        "email": $scope.email
                    }

                }).then(function(response) {

                    $scope.details = response.data;
                    console.log("GOT! detail=" + JSON.stringify($scope.details));
                    console.log('congrats on email validation');
                    $scope.email = "";
                    $.notify({

                        // options
                        icon: "fa fa-check",
                        message: 'You should receive a password reset email shortly. If you do not receive one within the next few minutes, please verify that you have submitted the correct email address.'
                    }, {
                        // settings
                        type: 'success',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                    });
                }).
                catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));

                    $scope.email = "";

                    $.notify({

                        // options
                        icon: "fa fa-times",
                        message: 'System error, please try again.'
                    }, {
                        // settings
                        type: 'danger',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                    });
                });

                //from email to username + reset password link
                //username/ceeb used for link generating
                //send email thru an api

            }

        }


        $scope.login = function() {

                if($scope.username && $scope.password) {
                authenticationSvc.login($scope.username, $scope.password, $scope.rememberMe)
                    .then(function(result) {
                        //App.blocks('#loginblock', 'state_loading');
                        var token = authenticationSvc.getUserInfo().accessToken;
                        $scope.userInfo = result;
                        //console.log('congrats');
                        console.log("success userInfo: " + $scope.userInfo);
                        $scope.error = '';
                        $scope.message = '';

                        console.log("avatarService.getClientId()= "+avatarService.getClientId());

                        angular.element(document.getElementById("loginform").getElementsByClassName("form-group")).removeClass('has-error');
                        console.log("if it is admin"+JSON.stringify(authenticationSvc.getUserInfo().admin));
                        
                            
                           
                            apiService.getCustomer(authenticationSvc.getUserInfo().accessToken).then(function(result) {
                                 
                                 var ceeb = result;
                                 console.log("ccc ceeb= "+result)

                                // if(authenticationSvc.getUserInfo().admin === "True"){
                                //      $state.go('admin-dashboard')
                                // }else{

                                //     //console.log("authenticationSvc.getUserInfo().admin === False")
                                //     if (ceeb==='2174') {
                                //     //$location.url($stateParams.url);
                                //         $state.go('non_degree');

                                //     } else {
                                //         $state.go('dashboard');
                                //     }




                                // }

                                if(authenticationSvc.getUserInfo().admin === "True"){
                                        $state.go('admin-dashboard');
                                    } else if(_.contains(authenticationSvc.getUserInfo().admin, 'whoops') && _.contains(authenticationSvc.getUserInfo().admin, 'enhancement') ){
                                        $state.go('dashboard');
                                    } else if(_.contains(authenticationSvc.getUserInfo().admin, 'non-degree')) {
                                        $state.go('non_degree');
                                    } else if(_.contains(authenticationSvc.getUserInfo().admin, 'AMP')){
                                        $state.go('amp');
                                    } else {
                                        $state.go('dashboard');
                                    }
                                //progressJs().start().set(100).end();
                                //App.blocks('#loginblock', 'state_normal');

                            })

                            

            

                        
                    }, function(error) {
                        //$window.alert("Invalid credentials");
                        console.log('error is: ' + JSON.stringify(error));

                        //reset form if error
                        //$scope.username = "";

                        $scope.password = "";
                        $scope.error = 'Error: Invalid user or password';
                        
                        angular.element(document.getElementById("loginform").getElementsByClassName("form-group")).addClass('has-error');
                        
                        $scope.message = '';
                        App.blocks('#loginblock', 'state_normal');
                    });

                };

                console.log($window.sessionStorage["userInfo"]);
                console.log("remember me value: "+$scope.rememberMe);



            }
            //if logged, redirect to whoops page
        if (authenticationSvc.getUserInfo()) {

            console.log('login again to home page');
            console.log('before going to whoops = ' + authenticationSvc.getUserInfo());
            //console.log('before going to whoops, cookies = '+$cookies.get('userInfo'));
            if(authenticationSvc.getUserInfo().admin === "True"){
                $state.go('admin-dashboard');
            } else if(_.contains(authenticationSvc.getUserInfo().admin, 'whoops') && _.contains(authenticationSvc.getUserInfo().admin, 'enhancement') ){
                $state.go('dashboard');
            } else if(_.contains(authenticationSvc.getUserInfo().admin, 'non-degree')) {
                $state.go('non_degree');
            } else if(_.contains(authenticationSvc.getUserInfo().admin, 'AMP')){
                $state.go('amp');
            } else {
                $state.go('dashboard');
            }
            

        };


    });


    
