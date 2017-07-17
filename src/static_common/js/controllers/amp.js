/*AMP controller*/
'use strict';

angular.module('myApp').
controller('AMPController', function($scope, $http, authenticationSvc, $localStorage, $sessionStorage) {
  var token = authenticationSvc.getUserInfo().accessToken;
  $scope.$storage = $localStorage;

  //console.log("table = "+JSON.stringify(Table));

  $scope._ = _;
 


  $scope.printReport = function() {

    $("#top-report").printThis({
      debug: false,
      importCSS: true,
      importStyle: true,
      printContainer: true,
      loadCSS: "../static/css/print.css",
      pageTitle: "Upgrid Reports",
      removeInline: false,
      printDelay: 333,
      header: null,
      formValues: true
    });
  };

});