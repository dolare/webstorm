'use strict';


// Declare app level module which depends on filters, and services
var App = angular.module('myApp', [
  'ngRoute',
  'myApp.reset.controllers',
  'myApp.login.controllers',
  'myApp.login.success',
  'myApp.login.success.dashboard',
  'myApp.login.success.whoops',
  'myApp.login.success.enhancement',
  'myApp.login.success.cart',
  'myApp.login.success.profile',
  'myApp.shareall',
  'myApp.admin',
  'myApp.ShareWhoops',
  'myApp.ShareEnhancement',
  'auth',
  'avatar',
  'ui.router',
  'ngStorage',
  'apiServiceModule',
  'counterServiceModule',
  'tableServiceModule',
  'ui.bootstrap',
  'smart-table',
  'reportServiceModule',
  'updateServiceModule',
  'oc.lazyLoad',
  'ajaxModule',
  'ngAnimate',
  'ngSanitize',
  'ngProgress',
  'frapontillo.bootstrap-duallistbox',
  'duScroll',
  'xeditable',
  'mwl.confirm',
  'angularMoment'

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

          //console.log("start logout");
          //console.log(userInfo);
          return $q.when(userInfo);

        } else {
          return $q.reject({
            authenticated: false
          });
        }
      },
      //get client list
      Client: function(apiService, authenticationSvc) {
        
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
      }


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
      }


    }


  }).

  state('chart', {
    url: '/chart',
    parent: 'admin',
    templateUrl: '/static/views/Admin/comp_charts.html',
    controller: 'CompChartsCtrl',


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
      }


    }

  }).

  //Client pages
   state('intro', {
    url: '/',
    templateUrl: '/static/views/Login/intro.html',
    controller: 'LoginController',


  }).

  state('login', {
    url: '/login',
    params: {
      url: null
    },
    templateUrl: '/static/views/Login/login.html',
    controller: 'LoginController',


  }).
  state('forgot', {
    url: '/forgot',
    templateUrl: '/static/views/Login/forgot.html',
    controller: 'LoginController',

  })

  .state('reset', {
    url: '/upgrid/reset/:param1/:param2/',
    templateUrl: '/static/views/Login/resetpassword.html',
    controller: 'ResetController',

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

      //get raw data
      Ceeb: function(apiService, authenticationSvc) {
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

      List: function(apiService, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        console.log('*************');
        return apiService.getProfileList(userInfo.accessToken);

      },


      Dash: function(apiService, authenticationSvc) {
        var token = authenticationSvc.getUserInfo().accessToken;
        console.log('*************');
        return apiService.getDashboard(token);

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


      //get raw data
      List: function(apiService, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        console.log('*************');
        return apiService.getProfileList(userInfo.accessToken);

      }


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

      Checked: function(cartCounter) {
        
        return cartCounter.counter();

      },
      List: function(apiService, authenticationSvc) {
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


      //get raw data
      List: function(apiService, authenticationSvc) {
        var userInfo = authenticationSvc.getUserInfo();
        console.log('*************');
        return apiService.getProfileList(userInfo.accessToken);

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
   
  }).
  state('shareEnhancementReport', {
    url: '/shared_enhancement_report/:param1/:param2/',
    templateUrl: '/static/views/Share/shared_enhancement_report.html',
    controller: 'ShareEnhancementController',
   
  }).

  state('shareAll', {
    url: '/upgrid/share_selected_report/:param1/:param2/',
    templateUrl: '/static/views/Home/share_all.html',
    controller: 'ShareAllController',
    

  }).


  //error pages
  state('500', {
    url: '/500',
    templateUrl: '/static/views/Errors/500.html',
    controller: 'ErrorController',
   
  }).state('expired', {
    url: '/expired',
    templateUrl: '/static/views/Errors/expired.html',
    controller: 'ErrorController',
   
  });

  //default route
  // $urlRouterProvider.otherwise('/login');
  $urlRouterProvider.otherwise('/');


});
//for the Blob.js, download file
App.config(['$compileProvider', function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
}]);

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

    //when above route fails to resolve
    //the commented was written for ng-route
    //$rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {

      console.log('start to redirect');
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

          //     // options
          //     icon: "fa fa-times",
          //     message: 'Your session has expired. Please log in again.'
          //   }, {
          //     // settings
          //     type: 'danger',
          //     placement: {
          //       from: "top",
          //       align: "center"
          //     },
          //     z_index: 1999,
          //   });


          $state.go('login', {
            url: $location.url()
          });
        
        } else if(rejection.status === 500 && rejection.config.url !== '/login') {
          var $state = $injector.get('$state');
          $state.go('500');
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

// view loader

App.directive('jsViewLoaderPro', function (ngProgressFactory) {
    return {
        link: function (scope, element) {
            var el = jQuery(element);

            // Hide the view loader, populate it with content and style it
            el
                .hide()
                .html('<i class="fa-fw fa fa-refresh fa-spin text-primary"></i>')
                .css({
                    'position': 'fixed',
                    'top': '20px',
                    'left': '50%',
                    'height': '20px',
                    'width': '20px',
                    'margin-left': '-10px',
                    'z-index': 99999
                 });
              
              var progressbar = ngProgressFactory.createInstance();
              progressbar.setColor("#5c90d2");
              progressbar.setHeight("2px");
            // On state change start event, show the element
            scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                //el.fadeIn(250);
                //progressJs().start().autoIncrease(15, 500);
                progressbar.start();
            });

            // On state change success event, hide the element
            scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                //el.fadeOut(250);
                //progressJs().end();
                //progressbar = ngProgressFactory.createInstance();
                progressbar.complete();
            });
        }
    };
});




App.directive('pageSelect', function() {
  return {
    restrict: 'E',
    template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
    link: function(scope, element, attrs) {
      scope.$watch('currentPage', function(c) {
        scope.inputPage = c;
      });
    }
  }
});


App.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    
                    element.bind('click',function (event) {
                        // if ( window.confirm(msg) ) {
                        //     scope.$eval(clickAction)
                        // }

                        bootbox.confirm({
                          message: msg,
                          title: "Confirm", 
                          callback: function(result){ 
                          if(result){

                            scope.$eval(clickAction)

                          }
                        }
                      })
                    });
                }
            };
    }])


App.filter('unique', function() {
  return function(arr, field) {
    var o = {},
      i, l = arr.length,
      r = [];
    for (i = 0; i < l; i += 1) {
      o[arr[i][field]] = arr[i];
    }
    for (i in o) {
      r.push(o[i]);
    }
    return r;
  };
});


App.directive('csSelect', function() {
  return {
    require: '^stTable',
    template: '<input type="checkbox"/>',
    scope: {
      row: '=csSelect'
    },
    link: function(scope, element, attr, ctrl) {

      element.bind('change', function(evt) {
        scope.$apply(function() {
          ctrl.select(scope.row, 'multiple');
        });
      });

      scope.$watch('row.isSelected', function(newValue, oldValue) {
        if (newValue === true) {
          element.parent().addClass('st-selected');
        } else {
          element.parent().removeClass('st-selected');
        }
      });
    }
  };
});

App.directive('scrollTo', function ($location, $anchorScroll) {
  return function(scope, element, attrs) {

    element.bind('click', function(event) {
        event.stopPropagation();
        var off = scope.$on('$locationChangeStart', function(ev) {
            off();
            ev.preventDefault();
        });
        var location = attrs.scrollTo;
        $location.hash(location);
        $anchorScroll();
    });

  };
});

App.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, event) {
            element.bind('click', function(e) {
                console.log("class "+e);
                    
                    //for(var key in element)console.log(element[key])
                    
                    element.toggleClass(attrs.toggleClass);
                 
                
            });
        }
    };
});

//customized_oneui_directive
// Custom Table functionality: Section toggling
// By adding the attribute 'data-js-table-sections' to your table
App.directive('jsTableSectionsFixed', function () {
    return {
        link: function (scope, element) {
            var table      = jQuery(element);
            var tableRows  = jQuery('.js-table-sections-header > tr', table);

            table.delegate('.js-table-sections-header > tr', 'click', function(e) {
                if (e.target.type !== 'checkbox'
                        && e.target.type !== 'button'
                        && e.target.type !== 'radio'
                        && e.target.tagName.toLowerCase() !== 'a'
                        && e.target.tagName.toLowerCase() !== 'span'
                        && !jQuery(e.target).parent('label').length) {
                    var row    = jQuery(this);
                    var tbody  = row.parent('tbody');

                    if (! tbody.hasClass('open')) {
                        jQuery('tbody', table).removeClass('open');
                    }

                    tbody.toggleClass('open');
                }

            });
        }
    };
});


//for create/edit table
//customized_oneui_directive
// Custom Table functionality: Section toggling
// By adding the attribute 'data-js-table-sections' to your table
App.directive('jsTableSectionsEdit', function () {
    return {
        link: function (scope, element) {
            var table      = jQuery(element);
            var tableRows  = jQuery('.js-table-sections-header > tr', table);

            console.log("in the directive");
            table.delegate('.js-table-sections-header > tr', 'click', function(e) {
                if (e.target.type !== 'checkbox'
                        && e.target.type !== 'button'
                        && e.target.type !== 'radio'
                        && e.target.tagName.toLowerCase() !== 'a'
                        && e.target.tagName.toLowerCase() !== 'span'
                        && e.target.tagName.toLowerCase() !== 'i'
                        && !jQuery(e.target).parent('label').length) {
                    var row    = jQuery(this);
                    var tbody  = row.parent('tbody');

                    if (! tbody.hasClass('open')) {
                        jQuery('tbody', table).removeClass('open');
                    }

                    tbody.toggleClass('open');
                }

            });
        }
    };
});



//table for admin update
App.directive('jsTableSectionsUpdate', function () {
    return {
        link: function (scope, element) {
            var table      = jQuery(element);
            var tableRows  = jQuery('.js-table-sections-header > tr', table);

            console.log("in the directive");
            table.delegate('.js-table-sections-header > tr', 'click', function(e) {
                if (e.target.tagName.toLowerCase() === 'button'
                  || e.target.type === 'button' 
                  || e.target.tagName.toLowerCase() === 'i') {
                    var row    = jQuery(this);
                    var tbody  = row.parent('tbody');

                    if (! tbody.hasClass('open')) {
                        jQuery('tbody', table).removeClass('open');
                    }

                    tbody.toggleClass('open');
                }

            });
        }
    };
});



App.directive('slideToggle', function() {  
  return {
    restrict: 'A',      
    scope:{},
    controller: function ($scope) {}, 
    link: function(scope, element, attr) {
      element.bind('click', function() {                  
        var $slideBox = angular.element(attr.slideToggle);
        var slideDuration = parseInt(attr.slideToggleDuration, 10) || 200;
        $slideBox.stop().slideToggle(slideDuration);
      });
    }
  };  
});


App.directive('stPaginationScroll', ['$timeout', function (timeout) {
        return{
            require: 'stTable',
            link: function (scope, element, attr, ctrl) {
                var itemByPage = 20;
                var pagination = ctrl.tableState().pagination;
                var lengthThreshold = 50;
                var timeThreshold = 400;
                var handler = function () {
                    //call next page
                    ctrl.slice(pagination.start + itemByPage, itemByPage);
                };
                var promise = null;
                var lastRemaining = 9999;
                var container = angular.element(element.parent());

                container.bind('scroll', function () {
                    var remaining = container[0].scrollHeight - (container[0].clientHeight + container[0].scrollTop);

                    //if we have reached the threshold and we scroll down
                    if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

                        //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                        if (promise !== null) {
                            timeout.cancel(promise);
                        }
                        promise = timeout(function () {
                            handler();

                            //scroll a bit up
                            container[0].scrollTop -= 500;

                            promise = null;
                        }, timeThreshold);
                    }
                    lastRemaining = remaining;
                });
            }

        };
   }]);


// App.directive('toggle', function() {
//   return {
//     restrict: 'A',
//     link: function(scope, element, attrs) {
//       if (attrs.toggle == "tooltip") {
//         $(element).tooltip();
//       }
//       if (attrs.toggle == "popover") {
//         $(element).popover();
//       }
//     }
//   };
// });


App.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {
      var idToScroll = attrs.href;
      $elm.on('click', function() {
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = $elm;
        }
        $("body").animate({scrollTop: $target.offset().top}, "slow");
      });
    }
  }
});

App.directive('scrollToItem', function() {                                                      
    return {                                                                                 
        restrict: 'A',                                                                       
        scope: {                                                                             
            scrollTo: "@"                                                                    
        },                                                                                   
        link: function(scope, $elm,attr) {                                                   

            $elm.on('click', function() {                                                    
                $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top - 60 }, "slow");
            });                                                                              
        }                                                                                    
    }})  


App.directive('shake', ['$animate',
  function($animate) {
    return {
      scope: {
        count: '='
      },
      link: function(scope, element, attrs) {

        scope.$watch('count', function(newValue, oldValue) {

          // console.log("newValue= "+newValue);
          // console.log("oldValue= "+oldValue);
          if (newValue === oldValue) return;

          if (newValue > oldValue)
          {
            $animate.addClass(element, 'pulseme').then(function() {
               element.removeClass('pulseme');
            });
          }else{
            $animate.addClass(element, 'shrinkeme').then(function() {
               element.removeClass('shrinkeme');
            });
          }
          
        });
      }
    };
  }
]);

// Custom Table functionality: Section toggling
// By adding the attribute 'data-js-table-sections' to your table
App.directive('jsTableSection', function () {
    return {
        link: function (scope, element) {
            var table;
            var tableRows;
            angular.element(document).ready(function() {
                //MANIPULATE THE DOM
                table = jQuery(element);
                tableRows  = jQuery('.js-table-sections-header > tr', table); 
                console.log('rows:'+ JSON.stringify(tableRows));
                
                tableRows.on('click', function(e) {
                if (e.target.type !== 'checkbox'
                        && e.target.type !== 'button'
                        && e.target.tagName.toLowerCase() !== 'a'
                        && !jQuery(e.target).parent('label').length) {
                    var row    = jQuery(this);
                    var tbody  = row.parent('tbody');

                    if (! tbody.hasClass('open')) {
                        jQuery('tbody', table).removeClass('open');
                    }

                    tbody.toggleClass('open');
                }
            });
            
            });


            
             
        }
    };
});

App.directive("refreshTable", function(){
    return {
        require:'stTable',
        restrict: "A",
        link:function(scope,elem,attr,table){
            scope.$on("refreshProducts", function() {
                table.pipe(table.tableState());
            });
    }
}});

App.directive('selectOnClick', ['$window', function ($window) {
    // Linker function
    return function (scope, element, attrs) {
      element.bind('click', function () {
        if (!$window.getSelection().toString()) {
          this.setSelectionRange(0, this.value.length)
        }
      });
    };
}]);


// from OneUI

// App.directive('slider', function () {
//         return {
//             restrict:'A',
//             compile: function (element) {
//                 // wrap tag
//                 var contents = element.html();
//                 element.html('<div class="slideable_content" style=" margin:0 !important; padding:0 !important" >' + contents + '</div>');

//                 return function postLink(scope, element, attrs) {
//                     var i = 0;
//                     // default properties
//                     scope.$watch(attrs.slider, (n, o) => {
//                         if (n !== o) {
//                             i++;
//                             var target = element[0],
//                                 content = target.querySelector('.slideable_content');
//                             if(n) {
//                                 content.style.border = '1px solid rgba(0,0,0,0)';
//                                 var y = content.clientHeight, z = i;
//                                 content.style.border = 0;
//                                 target.style.height = y + 'px';
//                                 setTimeout(() => {
//                                     if (z === i) {
//                                         target.style.height = 'auto';   
//                                     }
//                                 }, 500);
//                             } else {
//                                 target.style.height = target.clientHeight + 'px';
//                                 setTimeout(() => {
//                                     target.style.height = '0px';
//                                 });
//                             }
//                         }
//                     }); 

//                     attrs.duration = (!attrs.duration) ? '0.5s' : attrs.duration;
//                     attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
//                     element.css({
//                         'overflow': 'hidden',
//                         'height': '0px',
//                         'transitionProperty': 'height',
//                         'transitionDuration': attrs.duration,
//                         'transitionTimingFunction': attrs.easing
//                     });
//                 };
//             }
//         };
//     });


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

App.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
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
