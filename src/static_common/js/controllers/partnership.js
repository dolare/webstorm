// PartnershipController
'use strict';

angular.module('myApp').
controller('PartnershipController', function(avatarService, executiveService, $scope, $http, authenticationSvc, $localStorage, $sessionStorage) {
  var token = authenticationSvc.getUserInfo().accessToken;
  $scope.$storage = $localStorage;
});