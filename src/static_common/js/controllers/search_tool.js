/*Exec. Ed. Search Tool controller*/

'use strict';

angular.module('myApp').controller('SearchToolController', ['$q', '$http', '$scope', 'authenticationSvc', 'executiveService', 'ajaxService', function($q, $http, $scope, authenticationSvc, executiveService, ajaxService) {
    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.searchType = 'categories';
    $scope.searchKeyword = null;
    $scope.showResults = false;
    $scope.itemsByPage = 25;

    $scope.search = function() {
        var url = '/api/upgrid/non_degree/' + $scope.searchType + '?search=' + $scope.searchKeyword;
        $http({
            url: '/api/upgrid/non_degree/' + $scope.searchType + '?search=' + $scope.searchKeyword,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(response) {
            $scope.searched = true;
            $scope.results = response.data;
            angular.forEach($scope.results, function(result, key) {
              result.logo_url = executiveService.getLogoBySchoolName(result.school_name, result.university_name);
            });
          });
    }
    // Smart table pipe function
    $scope.callServer = function(tableState) {
      App.blocks('#loadingResults', 'state_loading');


    }


  }
]);