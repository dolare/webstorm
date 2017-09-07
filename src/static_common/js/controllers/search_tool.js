/*Exec. Ed. Search Tool controller*/

'use strict';

angular.module('myApp').controller('SearchToolController', ['$q', '$http', '$scope', 'authenticationSvc', 'executiveService', 'ajaxService', function($q, $http, $scope, authenticationSvc, executiveService, ajaxService) {
    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.searchType = 'categories';
    $scope.showResults = false;
    $scope.itemsByPage = 25;

    // When clicking on the search button, let showResults be true and call the table pipe function.
    $scope.search = function() {
      if ($.trim($scope.searchKeyword)) {
        $scope.showResults = true;
        if ($scope.searchType == 'categories')
          $scope.tableCtrl_categories.pipe($scope.tableCtrl_categories.tableState());
        else
          $scope.tableCtrl_courses.pipe($scope.tableCtrl_courses.tableState());
      }
    }
    // Smart table pipe function
    $scope.callServer_categories = function(tableState, tableCtrl) {
      $scope.tableCtrl_categories = tableCtrl;
      if ($scope.showResults) {
        App.blocks('#loadingCategories', 'state_loading');

        var pagination = tableState.pagination;
        var start = tableState.pagination.start || 0; // The index of item in the school list used to display in the table.
        var number = tableState.pagination.number || 25; // Number of entries showed per page.

        var url = '/api/upgrid/non_degree/categories' + '?search=' + $scope.searchKeyword;

        ajaxService.getPage(start, number, url, tableState, token).then(function(response) {
          $scope.results = response.data.results;
          $scope.count = response.data.count;
          tableState.pagination.numberOfPages = response.numberOfPages; // Set the number of pages so the pagination can update.
          tableState.pagination.totalItemCount = response.data.count; // This property of tableState.pagination is currently not being used yet.

          angular.forEach($scope.results, function(result, key) {
            result.logo_url = executiveService.getLogoBySchoolName(result.school_name, result.university_name);
          });

          App.blocks('#loadingCategories', 'state_normal');
        });
      }
    }

    $scope.callServer_courses = function(tableState, tableCtrl) {
      $scope.tableCtrl_courses = tableCtrl;
      if ($scope.showResults) {
        App.blocks('#loadingCourses', 'state_loading');

        var pagination = tableState.pagination;
        var start = tableState.pagination.start || 0; // The index of item in the school list used to display in the table.
        var number = tableState.pagination.number || 25; // Number of entries showed per page.

        var url = '/api/upgrid/non_degree/courses' + '?search=' + $scope.searchKeyword;

        ajaxService.getPage(start, number, url, tableState, token).then(function(response) {
          $scope.results = response.data.results;
          $scope.count = response.data.count;
          tableState.pagination.numberOfPages = response.numberOfPages; // Set the number of pages so the pagination can update.
          tableState.pagination.totalItemCount = response.data.count; // This property of tableState.pagination is currently not being used yet.

          angular.forEach($scope.results, function(result, key) {
            result.logo_url = executiveService.getLogoBySchoolName(result.school_name, result.university_name);
          });

          App.blocks('#loadingCourses', 'state_normal');
        });
      }
    }


  }
]);