/*Exec. Ed. Search Tool controller*/

'use strict';

angular.module('myApp').controller('SearchToolController', ['$q', '$http', '$scope', 'authenticationSvc', '$timeout', 
  function($q, $http, $scope, authenticationSvc, $timeout) {
    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.searchType = 'categories';
    $scope.searchKeyword = null;

    $scope.search = function() {
        $http({
            url: '/api/upgrid/non_degree/' + $scope.searchType + '?search=' + $scope.searchKeyword,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(response) {
            $scope.results = response.data;
            angular.forEach($scope.results, function(result, key) {
              result.logo_url = executiveService.getLogoBySchoolName(result.school, result.university);
            });
          });
    }


  }
]);