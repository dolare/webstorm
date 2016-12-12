//for the success(Home) parent page

var mainApp = angular.module('myApp.login.success', ['auth', 'ngCookies', 'ui.router', 'myApp.login.success.whoops', 'myApp.login.success.enhancement', 'myApp.login.success.cart', 'sticky']).
controller('SuccessController',
    function(avatarService, $timeout, Ceeb, $scope, $window, $location, $http, authenticationSvc, $cookies, $state, apiService, $localStorage, $sessionStorage, cartCounter) {
        
        console.log("$scope.Ceeb = "+Ceeb);

        $scope.Ceeb = Ceeb;

        console.log("Ceeb code in success page is"+$scope.Ceeb);
        var token = authenticationSvc.getUserInfo().accessToken;
        // $scope.jump = function (){
        //     progressJs().start().autoIncrease(10, 500);
        // }

        // $scope.check = function(){
        //     console.log("avatar id "+avatarService.getClientId());
        // }


        $scope.admin = authenticationSvc.getUserInfo().admin;
        //use ngStorage
        $scope.$storage = $localStorage;

        // Template Settings
        $scope.oneui = {
            version: '3.0', // Template version
            localStorage: false, // Enable/Disable local storage
            settings: {
                activeColorTheme: false, // Set a color theme of your choice, available: 'amethyst', 'city, 'flat', 'modern' and 'smooth'
                sidebarLeft: true, // true: Left Sidebar and right Side Overlay, false: Right Sidebar and left Side Overlay
                sidebarOpen: true, // Visible Sidebar by default (> 991px)
                sidebarOpenXs: false, // Visible Sidebar by default (< 992px)
                sidebarMini: false, // Mini hoverable Sidebar (> 991px)
                sideOverlayOpen: false, // Visible Side Overlay by default (> 991px)
                sideOverlayHover: false, // Hoverable Side Overlay (> 991px)
                sideScroll: true, // Enables custom scrolling on Sidebar and Side Overlay instead of native scrolling (> 991px)
                headerFixed: true // Enables fixed header
            }
        };

        // If local storage setting is enabled
        if ($scope.oneui.localStorage) {
            // Save/Restore local storage settings
            if ($scope.oneui.localStorage) {
                if (angular.isDefined($localStorage.oneuiSettings)) {
                    $scope.oneui.settings = $localStorage.oneuiSettings;
                } else {
                    $localStorage.oneuiSettings = $scope.oneui.settings;
                }
            }

            // Watch for settings changes
            $scope.$watch('oneui.settings', function () {
                // If settings are changed then save them to localstorage
                $localStorage.oneuiSettings = $scope.oneui.settings;
            }, true);
        }

        
        // Watch for sideScroll variable update
        $scope.$watch('oneui.settings.sideScroll', function () {
            // Handle Scrolling
            setTimeout(function () {
                $scope.helpers.uiHandleScroll();
            }, 150);
        }, true);

        // When view content is loaded
        $scope.$on('$viewContentLoaded', function () {
            // Hide page loader
            $scope.helpers.uiLoader('hide');

            // Resize #main-container
            $scope.helpers.uiHandleMain();
        });



        $scope.try_notify = function() {
            $.notify({
                // options
                message: 'Hello World'
            }, {
                // settings
                type: 'danger'
            });
        }


        //get user info
        $scope.userInfo = authenticationSvc.getUserInfo();

        //display the username
        $scope.message = "Hi " + $scope.userInfo.username;

        $scope.collapse = function(){
            alert("haha");
        }

        console.log('cookies after login: ' + $cookies.get('userInfo'));
        console.log('session after login: ' + $window.sessionStorage["userInfo"])

        $scope.avatar_id = avatarService.getClientId();


        //change ceeb in impersonation
        $scope.$watch(function () {
          return avatarService.getClientId();
        }, function (val) {
           
           $scope.avatar_id = avatarService.getClientId();
           console.log("$scope.avatar_id="+$scope.avatar_id);
           
           if($scope.admin==='True'&&$scope.avatar_id){
            $http({
              url: '/api/upgrid/user/'+$scope.avatar_id,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function (response) {

               $scope.Ceeb = response.data.Ceeb;
               // alert("changed"+$scope.Ceeb);
               console.log("apiservice Ceeb="+ JSON.stringify(Ceeb));
                
            }).catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));
                
            });

           } else if($scope.admin==='True'&&!$scope.avatar_id) {
            $scope.Ceeb = null;
            console.log("set to null");
           }


        });


        $scope.$watch(function() { 
            return avatarService.getClientId(); 
        }, function(newValue) {

            //alert("triggered"+newValue);
            $scope.avatar_id = newValue;
           
        });

        $scope.signout_avatar = function(){
            avatarService.signout();
            $state.go('admin');
        }


        //     'avatarService.getClientId()', function () {
        //     // Handle Scrolling
        //     alert("triggered")
        //     $scope.avatar_id = avatarService.getClientId();
        // }





        //init the cart number
        $scope.count = 0;

        //watching on the checkbox status in whoops and enhancement pages using ngStorage
        $scope.$watch('$storage.upgrid', function() {
            //console.log('monitoring...');
            //console.log('STORAGE in success.js= '+JSON.stringify($scope.$storage));

            //get the number of program checked and display the count on the cart icon
            //use the cartCounter service
            
            //for counting
            //console.log("$$$upgrid scope "+JSON.stringify($scope.$storage.upgrid));
            $scope.count = 0;
            for(var key in $scope.$storage.upgrid){

                //key.value  {"whoops":true,"WId":"daf3bd2f-612c-430b-8472-a31afb4ba345"}

                if($scope.$storage.upgrid[key].whoops){
                    $scope.count++
                }

                if($scope.$storage.upgrid[key].enhancement){
                    $scope.count++
                }

            }

        }, true);


        $scope.logout = function() {

            $scope.userInfo = authenticationSvc.logout();
            console.log("logout user Info should be null: " + $scope.userInfo);

            delete $scope.$storage.upgrid;
            avatarService.signout();
            $state.go("login");


        };

    });


/*
 * Partial views controllers
 *
 */

// Side Overlay Controller
mainApp.controller('SideOverlayCtrl', ['$scope', '$localStorage', '$window',
    function($scope, $localStorage, $window) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function() {
            // Handle Scrolling
            $scope.helpers.uiHandleScroll();
        });
    }
]);

// Sidebar Controller
mainApp.controller('SidebarCtrl', ['$scope', '$localStorage', '$window', '$location',
    function($scope, $localStorage, $window, $location) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function() {
            // Handle Scrolling
            $scope.helpers.uiHandleScroll();

            // Get current path to use it for adding active classes to our submenus
            $scope.path = $location.path();
        });
    }
]);

// Header Controller
mainApp.controller('HeaderCtrl', ['$scope', '$localStorage', '$window',
    function($scope, $localStorage, $window) {
        // When view content is loaded
        $scope.$on('$includeContentLoaded', function() {
            // Transparent header functionality
            $scope.helpers.uiHandleHeader();
        });
    }
]);