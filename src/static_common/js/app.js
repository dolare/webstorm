'use strict';


// Declare app level module which depends on filters, and services
var App = angular.module('myApp', [
  'ngCookies',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'oc.lazyLoad',
  'ngAnimate',
  'ngSanitize',

]);


App.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.

  state('admin', {
    url: '/admin',
    parent: 'success_demo',
    templateUrl: '/static/views/Admin/AdminTable.html',
    controller: 'AdminMainController',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo && userInfo.admin === "True") {

          return $q.when(userInfo);

        } else {
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsAdmin: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.1/css/bootstrap-datepicker.min.css',
                                'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css',
                                'https://cdnjs.cloudflare.com/ajax/libs/select2-bootstrap-css/1.4.6/select2-bootstrap.min.css',
                                'https://cdnjs.cloudflare.com/ajax/libs/jquery-autocomplete/1.0.7/jquery.auto-complete.min.css',
                                '/static/js/third-party/bootstrap-duallistbox/bootstrap-duallistbox.min.css',
                                'https://cdnjs.cloudflare.com/ajax/libs/angular-smart-table/2.1.8/smart-table.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js',
                                '/static/js/third-party/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                '/static/js/third-party/bootstrap-duallistbox/jquery.bootstrap-duallistbox.min.js',
                                '/static/js/third-party/angular-bootstrap-duallistbox.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.1/js/bootstrap-datepicker.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.full.min.js',
                                '/static/js/third-party/masked-inputs/jquery.maskedinput.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/jquery-autocomplete/1.0.7/jquery.auto-complete.min.js',
                                '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js',
                                '/static/js/services/tableService.js',
                                '/static/js/services/apiService.js',
                                '/static/js/controllers/admin.js',

   
                            ]
                        });
                    }], 

      //get client list
      Client: function(depsAdmin, apiService, authenticationSvc) {
        
        if(authenticationSvc.getUserInfo().admin === "True"){
            var token = authenticationSvc.getUserInfo().accessToken;
        
            return apiService.getClient(token);
        } else {
            return null;
        }
      
      }
    }
    //end of resolve

  }).


  state('admin-reader', {
    url: '/admin-reader/:type/:university/:school/:program/:degree/:client_id/:object_id',
 
    templateUrl: '/static/views/Admin/Reader.html',
    controller: 'AdminReaderController',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo && userInfo.admin === "True") {

          //console.log("start logout");
          //console.log(userInfo);
          return $q.when(userInfo);

        } else {
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsAdminQuote: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                                '/static/js/controllers/admin-reader.js',
   
                            ]
                        });
                    }], 




    }


  }).




  state('updates', {
    url: '/updates',
    parent: 'success_demo',
    templateUrl: '/static/views/Admin/Updates.html',
    controller: 'UpdatesController',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo && userInfo.admin === "True") {

          //console.log("start logout");
          //console.log(userInfo);
          return $q.when(userInfo);

        } else {
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsAdminUpdates: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                '/static/js/third-party/angular-bootstrap-confirm.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/angular-smart-table/2.1.8/smart-table.min.js',
                                '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                                '/static/js/services/updateService.js',
                                '/static/js/controllers/admin-updates.js',
   
                            ]
                        });
                    }], 


    }


  }).




  state('executive', {
    url: '/executive_education',
    parent: 'success_demo',
    templateUrl: '/static/views/Admin/Executive.html',
    controller: 'ExecutiveController',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo && userInfo.admin === "True") {

          //console.log("start logout");
          //console.log(userInfo);
          return $q.when(userInfo);

        } else {
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsAdminUpdates: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                '/static/js/third-party/angular-bootstrap-confirm.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/angular-smart-table/2.1.8/smart-table.min.js',
                                '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css',
                                'https://cdnjs.cloudflare.com/ajax/libs/select2-bootstrap-css/1.4.6/select2-bootstrap.min.css',
                                'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.full.min.js',
                                '/static/js/services/updateService.js',
                                '/static/js/controllers/admin-executive.js',
                                '/static/js/services/executiveService.js',
   
                            ]
                        });
                    }], 


    }


  }).

  state('quote', {
    url: '/quote',
    parent: 'success_demo',
    templateUrl: '/static/views/Admin/Quote.html',
    controller: 'QuoteController',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo && userInfo.admin === "True") {

          //console.log("start logout");
          //console.log(userInfo);
          return $q.when(userInfo);

        } else {
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsAdminQuote: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.1.1/Chart.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js',
                                '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                                 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js',
                                '/static/js/controllers/admin-quote.js',
   
                            ]
                        });
                    }], 




    }


  }).

  state('admin_profile', {
    url: '/admin_profile',
    parent: 'success_demo',
    templateUrl: '/static/views/Admin/Profile.html',
    controller: 'AdminProfileController',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo && userInfo.admin === "True") {

          //console.log("start logout");
          //console.log(userInfo);
          return $q.when(userInfo);

        } else {
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsAdminProfile: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                
                                '/static/js/controllers/admin-profile.js',
   
                            ]
                        });
                    }], 


    }

  }).

  //Client pages
   state('intro', {
    url: '/',
    templateUrl: '/static/views/Login/intro.html',
    controller: 'LoginController',
    resolve: {
                    depsIntro: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                '/static/js/services/apiService.js',
                                '/static/js/controllers/login.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css',
                                'https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js',
                                
                            ]
                        });
                    }]
                }


  }).

  state('login', {
    url: '/login',
    params: {
      url: null
    },
    templateUrl: '/static/views/Login/login.html',
    controller: 'LoginController',
    resolve: {
                    depsLogin: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/services/apiService.js',
                              '/static/js/controllers/login.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js',
                                
                            ]
                        });
                    }]
                }


  }).


  state('verify', {
    url: '/upgrid/verify/:param1/',
    templateUrl: '/static/views/Login/verify.html',
    controller: 'VerifyController',
    resolve: {
                    depsReset: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/controllers/verify.js',
                             
                            ]
                        });
                    }]
                }

  }).


  state('forgot', {
    url: '/forgot',
    templateUrl: '/static/views/Login/forgot.html',
    controller: 'LoginController',
    resolve: {
                    depsForgot: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                                '/static/js/services/apiService.js',
                                '/static/js/controllers/login.js',
                                '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                                'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js',
                            ]
                        });
                    }]
                }

  })

  .state('reset', {
    url: '/upgrid/reset/:param2/',
    templateUrl: '/static/views/Login/resetpassword.html',
    controller: 'ResetController',
    resolve: {
                    depsReset: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/controllers/reset.js',
                              '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                            ]
                        });
                    }]
                }

  }).

  
  state('success_demo', {
    templateUrl: '/static/views/Home/success_demo.html',
    controller: 'SuccessController',
    abstract: true,
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo) {
          //console.log("start logout");
          //console.log(userInfo);
          return $q.when(userInfo);
        } else {
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsSuccess: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [ 
                                '/static/js/services/apiService.js',
                                '/static/js/services/counterService.js',
                                '/static/js/controllers/success.js',
                                
                                
                               
                            ]
                        });
                    }],


      //get raw data
      Ceeb: function(depsSuccess, apiService, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        console.log('*************');
        return apiService.getCustomer(userInfo.accessToken);

      }


    }

  }).

  state('dashboard', {

    url: '/dashboard',
    templateUrl: '/static/views/Home/dashboard.html',
    controller: 'DashboardController',
    parent: 'success_demo',
    //parent: 'success',
    resolve: {

      //authorization, unauthorized user can not enter the page
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        console.log("userInfo= "+userInfo)
        if (userInfo) {
          // console.log("whoops page authenticated");
          //console.log(userInfo);
          console.log('-------------');
          return $q.when(userInfo);
        } else {
          console.log('fail to see the page, route change error');
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsDashboard: ['$ocLazyLoad', 'depsSuccess', function($ocLazyLoad, depsSuccess) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                              '/static/js/third-party/easy-pie-chart/jquery.easypiechart.min.js',
                              '/static/js/services/updateService.js',
                              '/static/js/controllers/dashboard.js',
                              
                            ]
                        });
                    }],


      List: function(depsDashboard, apiService, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        console.log('*************');
        return apiService.getProfileList(userInfo.accessToken);

      },


      Dash: function(depsDashboard, apiService, authenticationSvc) {
        var token = authenticationSvc.getUserInfo().accessToken;
        console.log('*************');
        return apiService.getDashboard(token);

      },


      SUB: function(depsDashboard, apiService, authenticationSvc, avatarService) {
        var token = authenticationSvc.getUserInfo().accessToken;
        var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";
        console.log('*************');
        return apiService.getSubuser(token, client_id);

      },
      
    }


  }).
  state('whoops', {

    url: '/whoops',
    templateUrl: '/static/views/Home/whoops.html',
    controller: 'WhoopsController',
    parent: 'success_demo',
    //parent: 'success',
    resolve: {

      //authorization, unauthorized user can not enter the page
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        console.log("userInfo= "+userInfo)
        if (userInfo) {
          console.log("whoops page authenticated");
          //console.log(userInfo);
          console.log('-------------');
          return $q.when(userInfo);
        } else {
          console.log('fail to see the page, route change error');
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsWhoops: ['$ocLazyLoad','depsSuccess', function($ocLazyLoad, depsSuccess) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/services/tableService.js',
                              '/static/js/services/reportService.js',
                              '/static/js/services/ajaxService.js',
                              '/static/js/third-party/clipboard.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-smart-table/2.1.8/smart-table.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                              '/static/js/third-party/easy-pie-chart/jquery.easypiechart.min.js',
                              '/static/js/controllers/whoops.js',
                              
                            ]
                        });
                    }]
    
    }


  }).
  state('enhancement', {

    url: '/enhancement',
    templateUrl: '/static/views/Home/enhancement.html',
    controller: 'EnhancementController',
    parent: 'success_demo',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo) {
          console.log("authenticated");
          //console.log(userInfo);
          return $q.when(userInfo);
        } else {
          console.log('fail to see the page, route change error');
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsEnhancement: ['$ocLazyLoad', 'depsSuccess', function($ocLazyLoad, depsSuccess) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/services/tableService.js',
                              '/static/js/services/reportService.js',
                              '/static/js/services/ajaxService.js',
                              '/static/js/services/updateService.js',
                              '/static/js/third-party/clipboard.min.js',
                              '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-smart-table/2.1.8/smart-table.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                              '/static/js/third-party/easy-pie-chart/jquery.easypiechart.min.js',
                              '/static/js/controllers/enhancement.js',
                             
                              
                            ]
                        });
                    }],

      //get raw data
      List: function(depsEnhancement, apiService, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        console.log('*************');
        return apiService.getProfileList(userInfo.accessToken);

      }


    }

  }).
  state('non_degree', {

    url: '/non_degree',
    templateUrl: '/static/views/Home/non_degree.html',
    controller: 'NonDegreeController',
    parent: 'success_demo',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo) {
          console.log("authenticated");
          //console.log(userInfo);
          return $q.when(userInfo);
        } else {
          console.log('fail to see the page, route change error');
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsNondegree: ['$ocLazyLoad', 'depsSuccess', function($ocLazyLoad, depsSuccess) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/services/ajaxService.js',
                              '/static/js/third-party/clipboard.min.js',
                              '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-smart-table/2.1.8/smart-table.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                            
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-scroll/1.0.0/angular-scroll.min.js',
                              '/static/js/services/executiveService.js',
                              '/static/js/controllers/non_degree.js',
                             
                              
                            ]
                        });
                    }],

      //get raw data
      // Table: function(depsNondegree, ajaxService, authenticationSvc) {
      //   var userInfo = authenticationSvc.getUserInfo();
      //   console.log('*************');
      //   return ajaxService.nonDegree(userInfo.accessToken);

      // }


    }

  }).
  // Non-degree report state
  state('non_degree_report', {
    url: '/non_degree_report',
    templateUrl: '/static/views/Home/non_degree_report.html',
    controller: 'NonDegreeReportController',
    resolve: {
                    depsShareWhoops: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/controllers/non-degree_report.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                                
                            ]
                        });
                    }] 
    }
  }).
  state('reports', {

    url: '/reports',
    templateUrl: '/static/views/Home/cart.html',
    controller: 'ReportsController',
    parent: 'success_demo',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo) {
          console.log("authenticated");
          //console.log(userInfo);
          return $q.when(userInfo);
        } else {
          console.log('fail to see the page, route change error');
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsReports: ['$ocLazyLoad', 'depsSuccess', function($ocLazyLoad, depsSuccess) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            name: 'myApp.login.success.cart',
                            files: [
                              '/static/js/services/tableService.js',
                              '/static/js/services/reportService.js',
                              '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                              '/static/js/controllers/cart.js',
                              '/static/js/third-party/clipboard.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-smart-table/2.1.8/smart-table.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-scroll/1.0.0/angular-scroll.min.js',
                              
                              
                                
                            ]
                        });
                    }],


      Checked: function(depsReports, cartCounter) {
        
        return cartCounter.counter();

      },
      List: function(depsReports, apiService, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        console.log('*************');
        return apiService.getProfileList(userInfo.accessToken);

      }
    }

  }).
  state('profile', {

    url: '/profile',
    templateUrl: '/static/views/Home/profile.html',
    controller: 'ProfileController',
    parent: 'success_demo',
    resolve: {
      auth: function($q, authenticationSvc) {

        var userInfo = authenticationSvc.getUserInfo();
        if (userInfo) {
          console.log("authenticated");
          //console.log(userInfo);
          return $q.when(userInfo);
        } else {
          console.log('fail to see the page, route change error');
          return $q.reject({
            authenticated: false
          });
        }
      },

      depsProfile: ['$ocLazyLoad', 'depsSuccess', function($ocLazyLoad, depsSuccess) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/services/tableService.js',
                              '/static/js/services/ajaxService.js',
                              '/static/js/controllers/profile.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-smart-table/2.1.8/smart-table.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js',
                              '/static/js/third-party/bootstrap-notify/bootstrap-notify.min.js',
                              
                            ]
                        });
                    }],


      //get raw data
      List: function(depsProfile, apiService, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        console.log('*************');
        return apiService.getProfileList(userInfo.accessToken);

      },

      //get raw data
      SUB: function(depsProfile, apiService, authenticationSvc, avatarService) {
        var userInfo = authenticationSvc.getUserInfo();
        var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";
        console.log("client_id="+client_id)
        console.log('*************');
        return apiService.getSubuser(userInfo.accessToken, client_id);

      }

    }

  }).

  state('help', {
    url: '/support',
    templateUrl: '/static/views/Home/help.html',
    controller: 'SuccessController',
    parent: 'success_demo'

  }).

  //share the report(s)
  state('shareWhoopsReport', {
    url: '/shared_whoops_report/:param1/:param2/',
    templateUrl: '/static/views/Share/shared_whoops_report.html',
    controller: 'ShareWhoopsController',
    resolve: {
                    depsShareWhoops: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/controllers/share_whoops.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                                
                            ]
                        });
                    }]
                }
   
  }).
  state('shareEnhancementReport', {
    url: '/shared_enhancement_report/:param1/:param2/',
    templateUrl: '/static/views/Share/shared_enhancement_report.html',
    controller: 'ShareEnhancementController',
    resolve: {
                    depsShareEnhancement: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/controllers/share_enhancement.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                                
                            ]
                        });
                    }]
                }
   
  }).

  state('shareAll', {
    url: '/upgrid/share_selected_report/:param1/:param2/',
    templateUrl: '/static/views/Home/share_all.html',
    controller: 'ShareAllController',
    resolve: {
                    depsShareAll: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/services/counterService.js',
                              '/static/js/services/tableService.js',
                              '/static/js/services/reportService.js',
                              '/static/js/controllers/shareall.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-scroll/1.0.0/angular-scroll.min.js',
                              
                            ]
                        });
                    }]
                }

  }).


  //error pages
  state('404', {
    url: '/404',
    templateUrl: '/static/views/Errors/404.html',
    controller: 'ErrorController',
    resolve: {
                    deps500: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/controllers/error.js',
                             
                            ]
                        });
                    }]
                }
   
  }).

  //error pages
  state('500', {
    url: '/500',
    templateUrl: '/static/views/Errors/500.html',
    controller: 'ErrorController',
    resolve: {
                    deps500: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/controllers/error.js',
                             
                            ]
                        });
                    }]
                }
   
  }).state('expired', {
    url: '/expired',
    templateUrl: '/static/views/Errors/expired.html',
    controller: 'ErrorController',
    resolve: {
                    depsExpired: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/controllers/error.js',
                             
                            ]
                        });
                    }]
                }
   
  }).


  // XDF
  //share the report(s)
  state('xdf', {
    url: '/xdf',
    templateUrl: '/static/views/Share/XDF.html',
    controller: 'xdf',
    resolve: {      


                    auth: function($q, authenticationSvc) {

                      var userInfo = authenticationSvc.getUserInfo();
                      if (userInfo && userInfo.admin === "True") {

                        //console.log("start logout");
                        //console.log(userInfo);
                        return $q.when(userInfo);

                      } else {
                        return $q.reject({
                          authenticated: false
                        });
                      }
                    },

                    depsShareWhoops: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/third-party/easy-pie-chart/jquery.easypiechart.min.js',
                              '/static/js/controllers/xdf.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-scroll/1.0.0/angular-scroll.min.js',
                                
                            ]
                        });
                    }]
                }
   
  }).
  //share the report(s)
  state('xdf_2', {
    url: '/xdf_2',
    templateUrl: '/static/views/Share/XDF.html',
    controller: 'xdf_2',
    resolve: {  
                    auth: function($q, authenticationSvc) {

                      var userInfo = authenticationSvc.getUserInfo();
                      if (userInfo && userInfo.admin === "True") {

                        //console.log("start logout");
                        //console.log(userInfo);
                        return $q.when(userInfo);

                      } else {
                        return $q.reject({
                          authenticated: false
                        });
                      }
                    },

                    depsShareWhoops: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/third-party/easy-pie-chart/jquery.easypiechart.min.js',
                              '/static/js/controllers/xdf.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-scroll/1.0.0/angular-scroll.min.js',
                                
                            ]
                        });
                    }]
                }
   
  }).
  //share the report(s)
  state('xdf_3', {
    url: '/xdf_3',
    templateUrl: '/static/views/Share/XDF.html',
    controller: 'xdf_3',
    resolve: {      
                    auth: function($q, authenticationSvc) {

                      var userInfo = authenticationSvc.getUserInfo();
                      if (userInfo && userInfo.admin === "True") {

                        //console.log("start logout");
                        //console.log(userInfo);
                        return $q.when(userInfo);

                      } else {
                        return $q.reject({
                          authenticated: false
                        });
                      }
                    },


                    depsShareWhoops: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/third-party/easy-pie-chart/jquery.easypiechart.min.js',
                              '/static/js/controllers/xdf.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-scroll/1.0.0/angular-scroll.min.js',
                                
                            ]
                        });
                    }]
                }
   
  })

  .
  //share the report(s)
  state('xdf_4', {
    url: '/xdf_4',
    templateUrl: '/static/views/Share/XDF.html',
    controller: 'xdf_4',
    resolve: {        

                    auth: function($q, authenticationSvc) {

                        var userInfo = authenticationSvc.getUserInfo();
                        if (userInfo && userInfo.admin === "True") {

                          //console.log("start logout");
                          //console.log(userInfo);
                          return $q.when(userInfo);

                        } else {
                          return $q.reject({
                            authenticated: false
                          });
                        }
                      },


                    depsShareWhoops: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            insertBefore: '#css-bootstrap',
                            serie: true,
                            files: [
                              '/static/js/third-party/easy-pie-chart/jquery.easypiechart.min.js',
                              '/static/js/controllers/xdf.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.11/moment-timezone-with-data.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.1/angular-moment.min.js',
                              'https://cdnjs.cloudflare.com/ajax/libs/angular-scroll/1.0.0/angular-scroll.min.js',
                                
                            ]
                        });
                    }]
                }
   
  })

  ;

  //default route
  $urlRouterProvider.otherwise('/');


});


App.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');

});


//enable right click
App.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);

App.run(["$rootScope", "$location", "$state", "authenticationSvc",
  function($rootScope, $location, $state, authenticationSvc) {
    //var userInfo = authenticationSvc.getUserInfo();
    console.log('run');
    //when above route is resolved
    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams, userInfo) {
      //console.log(userInfo);
      //$anchorScroll();
    });


    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {

      console.log('start to redirect');
      
      console.log('redirecting event is ...' + event);
      console.log('redirecting fromState is ...' + JSON.stringify(fromState));
      console.log('redirecting error is ...' + error);
      if (error && !error.authenticated) {
        console.log("redirected");
        $state.go("login");
      }

    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (toState.resolve) {
        progressJs().start().autoIncrease(5, 100);
        console.log("*START");
    }
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if (toState.resolve) {
            progressJs().end();
            console.log("*END");
        }
    });

  }
]);


App.factory('AuthInterceptor',
  function( $localStorage, $sessionStorage, $injector, $location, $q, $stateParams) {
    return {
      // optional method
      // 'response': function(response) {
        
      //   //alert("get called");
      //   return response;
      // },
      'responseError': function(rejection) {
        
        console.log("url before redirect1..." + $location.url());

        //401
        if (rejection.status === 401 && rejection.config.url !== '/login') {
          var $state = $injector.get('$state');
          
          console.log("url before redirect..." + $location.url());
          //console.log("stateParams.url= ..."+$stateParams.url);
          console.log("STATE = " + JSON.stringify($state.current));
          //$cookies.remove("upgrid_userInfo");
          //$scope.userInfo = authenticationSvc.logout();
          //delete $scope.$storage.upgrid;


          console.log("output urls...");
          // This is the interesting bit:
          var myService = $injector.get('authenticationSvc');
          var myAvatar = $injector.get('avatarService');
          //$scope.$storage = $localStorage;
          myService.logout();
          
          myAvatar.signout();
          delete $localStorage.upgrid;
          
          
          // $.notify({

          $state.go('login', {
            url: $location.url()
          });
        
        //500
        } else if(rejection.status === 500 && rejection.config.url !== '/login') {
          var $state = $injector.get('$state');
          $state.go('500');

        //404
        } else if(rejection.status === 404 && rejection.config.url !== '/login') {
          var $state = $injector.get('$state');
          $state.go('404');

        //403
        } else if(rejection.status === 403 && rejection.config.url.substr(0,26) === '/api/upgrid/reports/shared') {


          console.log("rejection = "+JSON.stringify(rejection));
          console.log("rejection url = "+JSON.stringify(rejection.config.url));

          
          var $state = $injector.get('$state');
          $state.go('expired');
          

          // if(rejection.config.url.substr(0,16) === '/api/upgrid/ewr/'){
          //     var $state = $injector.get('$state');
          //     $state.go('expired');
          // }

          
        }
        return $q.reject(rejection);
      }


    };
  });


// Custom UI helper functions
App.factory('uiHelpers', function () {
    return {
       
        // Handles #main-container height resize to push footer to the bottom of the page
        uiHandleMain: function () {
            var lMain       = jQuery('#main-container');
            var hWindow     = jQuery(window).height();
            var hHeader     = jQuery('#header-navbar').outerHeight();
            var hFooter     = jQuery('#page-footer').outerHeight();

            if (jQuery('#page-container').hasClass('header-navbar-fixed')) {
                lMain.css('min-height', hWindow - hFooter);
            } else {
                lMain.css('min-height', hWindow - (hHeader + hFooter));
            }
        },
        // Handles sidebar and side overlay custom scrolling functionality
        uiHandleScroll: function(mode) {
            var windowW            = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var lPage              = jQuery('#page-container');
            var lSidebar           = jQuery('#sidebar');
            var lSidebarScroll     = jQuery('#sidebar-scroll');
            var lSideOverlay       = jQuery('#side-overlay');
            var lSideOverlayScroll = jQuery('#side-overlay-scroll');

            // Init scrolling
            if (mode === 'init') {
                // Init scrolling only if required the first time
                uiHandleScroll();
            } else {
                // If screen width is greater than 991 pixels and .side-scroll is added to #page-container
                if (windowW > 991 && lPage.hasClass('side-scroll') && (lSidebar.length || lSideOverlay.length)) {
                    // If sidebar exists
                    if (lSidebar.length) {
                        // Turn sidebar's scroll lock off (slimScroll will take care of it)
                        jQuery(lSidebar).scrollLock('disable');

                        // If sidebar scrolling does not exist init it..
                        if (lSidebarScroll.length && (!lSidebarScroll.parent('.slimScrollDiv').length)) {
                            lSidebarScroll.slimScroll({
                                height: lSidebar.outerHeight(),
                                color: '#fff',
                                size: '5px',
                                opacity : .35,
                                wheelStep : 15,
                                distance : '2px',
                                railVisible: false,
                                railOpacity: 1
                            });
                        }
                        else { // ..else resize scrolling height
                            lSidebarScroll
                                .add(lSidebarScroll.parent())
                                .css('height', lSidebar.outerHeight());
                        }
                    }

                    // If side overlay exists
                    if (lSideOverlay.length) {
                        // Turn side overlay's scroll lock off (slimScroll will take care of it)
                        jQuery(lSideOverlay).scrollLock('disable');

                        // If side overlay scrolling does not exist init it..
                        if (lSideOverlayScroll.length && (!lSideOverlayScroll.parent('.slimScrollDiv').length)) {
                            lSideOverlayScroll.slimScroll({
                                height: lSideOverlay.outerHeight(),
                                color: '#000',
                                size: '5px',
                                opacity : .35,
                                wheelStep : 15,
                                distance : '2px',
                                railVisible: false,
                                railOpacity: 1
                            });
                        }
                        else { // ..else resize scrolling height
                            lSideOverlayScroll
                                .add(lSideOverlayScroll.parent())
                                .css('height', lSideOverlay.outerHeight());
                        }
                    }
                } else {
                    // If sidebar exists
                    if (lSidebar.length) {
                        // If sidebar scrolling exists destroy it..
                        if (lSidebarScroll.length && lSidebarScroll.parent('.slimScrollDiv').length) {
                            lSidebarScroll
                                .slimScroll({destroy: true});
                            lSidebarScroll
                                .attr('style', '');
                        }

                        // Turn sidebars's scroll lock on
                        jQuery(lSidebar).scrollLock('enable');
                    }

                    // If side overlay exists
                    if (lSideOverlay.length) {
                        // If side overlay scrolling exists destroy it..
                        if (lSideOverlayScroll.length && lSideOverlayScroll.parent('.slimScrollDiv').length) {
                            lSideOverlayScroll
                                .slimScroll({destroy: true});
                            lSideOverlayScroll
                                .attr('style', '');
                        }

                        // Turn side overlay's scroll lock on
                        jQuery(lSideOverlay).scrollLock('enable');
                    }
                }
            }
        },
        // Handles page loader functionality
        uiLoader: function (mode) {
            var lBody       = jQuery('body');
            var lpageLoader = jQuery('#page-loader');

            if (mode === 'show') {
                if (lpageLoader.length) {
                    lpageLoader.fadeIn(250);
                } else {
                    lBody.prepend('<div id="page-loader"></div>');
                }
            } else if (mode === 'hide') {
                if (lpageLoader.length) {
                    lpageLoader.fadeOut(250);
                }
            }
        },
        // Handles transparent header functionality (solid on scroll - used in frontend pages)
        uiHandleHeader: function () {
            var lPage = jQuery('#page-container');

            if (lPage.hasClass('header-navbar-fixed') && lPage.hasClass('header-navbar-transparent')) {
                jQuery(window).on('scroll', function(){
                    if (jQuery(this).scrollTop() > 20) {
                        lPage.addClass('header-navbar-scroll');
                    } else {
                        lPage.removeClass('header-navbar-scroll');
                    }
                });
            }
        },
        // Handles blocks API functionality
        uiBlocks: function (block, mode, button) {
            // Set default icons for fullscreen and content toggle buttons
            var iconFullscreen         = 'si si-size-fullscreen';
            var iconFullscreenActive   = 'si si-size-actual';
            var iconContent            = 'si si-arrow-up';
            var iconContentActive      = 'si si-arrow-down';

            if (mode === 'init') {
                // Auto add the default toggle icons
                switch(button.data('action')) {
                    case 'fullscreen_toggle':
                        button.html('<i class="' + (button.closest('.block').hasClass('block-opt-fullscreen') ? iconFullscreenActive : iconFullscreen) + '"></i>');
                        break;
                    case 'content_toggle':
                        button.html('<i class="' + (button.closest('.block').hasClass('block-opt-hidden') ? iconContentActive : iconContent) + '"></i>');
                        break;
                    default:
                        return false;
                }
            } else {
                // Get block element
                var elBlock = (block instanceof jQuery) ? block : jQuery(block);

                // If element exists, procceed with blocks functionality
                if (elBlock.length) {
                    // Get block option buttons if exist (need them to update their icons)
                    var btnFullscreen  = jQuery('[data-js-block-option][data-action="fullscreen_toggle"]', elBlock);
                    var btnToggle      = jQuery('[data-js-block-option][data-action="content_toggle"]', elBlock);

                    // Mode selection
                    switch(mode) {
                        case 'fullscreen_toggle':
                            elBlock.toggleClass('block-opt-fullscreen');

                            // Enable/disable scroll lock to block
                            if (elBlock.hasClass('block-opt-fullscreen')) {
                                jQuery(elBlock).scrollLock('enable');
                            } else {
                                jQuery(elBlock).scrollLock('disable');
                            }

                            // Update block option icon
                            if (btnFullscreen.length) {
                                if (elBlock.hasClass('block-opt-fullscreen')) {
                                    jQuery('i', btnFullscreen)
                                        .removeClass(iconFullscreen)
                                        .addClass(iconFullscreenActive);
                                } else {
                                    jQuery('i', btnFullscreen)
                                        .removeClass(iconFullscreenActive)
                                        .addClass(iconFullscreen);
                                }
                            }
                            break;
                        case 'fullscreen_on':
                            elBlock.addClass('block-opt-fullscreen');

                            // Enable scroll lock to block
                            jQuery(elBlock).scrollLock('enable');

                            // Update block option icon
                            if (btnFullscreen.length) {
                                jQuery('i', btnFullscreen)
                                    .removeClass(iconFullscreen)
                                    .addClass(iconFullscreenActive);
                            }
                            break;
                        case 'fullscreen_off':
                            elBlock.removeClass('block-opt-fullscreen');

                            // Disable scroll lock to block
                            jQuery(elBlock).scrollLock('disable');

                            // Update block option icon
                            if (btnFullscreen.length) {
                                jQuery('i', btnFullscreen)
                                    .removeClass(iconFullscreenActive)
                                    .addClass(iconFullscreen);
                            }
                            break;
                        case 'content_toggle':
                            elBlock.toggleClass('block-opt-hidden');

                            // Update block option icon
                            if (btnToggle.length) {
                                if (elBlock.hasClass('block-opt-hidden')) {
                                    jQuery('i', btnToggle)
                                        .removeClass(iconContent)
                                        .addClass(iconContentActive);
                                } else {
                                    jQuery('i', btnToggle)
                                        .removeClass(iconContentActive)
                                        .addClass(iconContent);
                                }
                            }
                            break;
                        case 'content_hide':
                            elBlock.addClass('block-opt-hidden');

                            // Update block option icon
                            if (btnToggle.length) {
                                jQuery('i', btnToggle)
                                    .removeClass(iconContent)
                                    .addClass(iconContentActive);
                            }
                            break;
                        case 'content_show':
                            elBlock.removeClass('block-opt-hidden');

                            // Update block option icon
                            if (btnToggle.length) {
                                jQuery('i', btnToggle)
                                    .removeClass(iconContentActive)
                                    .addClass(iconContent);
                            }
                            break;
                        case 'refresh_toggle':
                            elBlock.toggleClass('block-opt-refresh');

                            // Return block to normal state if the demostration mode is on in the refresh option button - data-action-mode="demo"
                            if (jQuery('[data-js-block-option][data-action="refresh_toggle"][data-action-mode="demo"]', elBlock).length) {
                                setTimeout(function(){
                                    elBlock.removeClass('block-opt-refresh');
                                }, 2000);
                            }
                            break;
                        case 'state_loading':
                            elBlock.addClass('block-opt-refresh');
                            break;
                        case 'state_normal':
                            elBlock.removeClass('block-opt-refresh');
                            break;
                        case 'close':
                            elBlock.hide();
                            break;
                        case 'open':
                            elBlock.show();
                            break;
                        default:
                            return false;
                    }
                }
            }
        }
    };
});

// Run our App
App.run(function($rootScope, uiHelpers) {
    // Access uiHelpers easily from all controllers
    $rootScope.helpers = uiHelpers;

    // On window resize or orientation change resize #main-container & Handle scrolling
    var resizeTimeout;

    jQuery(window).on('resize orientationchange', function () {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function(){
            $rootScope.helpers.uiHandleScroll();
            $rootScope.helpers.uiHandleMain();
        }, 150);
    });
});



/*
 * Partial views controllers
 *
 */

// Side Overlay Controller
App.controller('SideOverlayCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
            // Handle Scrolling
            $scope.helpers.uiHandleScroll();
        });
    }
]);

// Sidebar Controller
App.controller('SidebarCtrl', ['$scope', '$localStorage', '$window', '$location',
    function ($scope, $localStorage, $window, $location) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
            // Handle Scrolling
            $scope.helpers.uiHandleScroll();

            // Get current path to use it for adding active classes to our submenus
            $scope.path = $location.path();
        });
    }
]);

// Header Controller
App.controller('HeaderCtrl', ['$scope', '$localStorage', '$window',
    function ($scope, $localStorage, $window) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function () {
            // Transparent header functionality
            $scope.helpers.uiHandleHeader();
        });
    }
]);