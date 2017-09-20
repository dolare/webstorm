/*Exec. Ed. Search Tool controller*/

'use strict';

angular.module('myApp').controller('SearchToolController', ['$q', '$http', '$scope', '$timeout', '$filter', 'authenticationSvc', 'executiveService', 'ajaxService', function($q, $http, $scope, $timeout, $filter, authenticationSvc, executiveService, ajaxService) {
    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.searchType = 'categories';
    $scope.showCategoryResults = false;
    $scope.showCourseResults = false;
    $scope.itemsByPage = 25;
    $scope.inputKeywords = '';

    $http({
      method: 'GET',
      url: '/static/data/keyword.json'
    }).then(function(resp_keyword_clusters) {
      $scope.keywordClusters = resp_keyword_clusters.data;
    });

    // When clicking on keyword cluster tag, append key words into search box.
    $scope.appendKeywords = function(keywords) {
      var index = 0;
      angular.forEach(keywords, function(frequency, keyword) {
        if ($scope.inputKeywords && !$scope.inputKeywords.endsWith(', ') && !$scope.inputKeywords.endsWith(','))
          $scope.inputKeywords += ', ';
        $scope.inputKeywords += keyword;
        if (index < Object.keys(keywords).length - 1)
          $scope.inputKeywords += ', ';
        index++;
      });
      $scope.inputKeywords = $scope.inputKeywords.substring(0, 150);
      $scope.search();
    };

    // When clicking on the search button, clear old results and call corresponding smart table pipe function.
    $scope.search = function() {
      console.log('inputKeywords: ' + $scope.inputKeywords);
      console.log('$.trim($scope.inputKeywords): ' + $.trim($scope.inputKeywords));
      // If inputKeywords is an empty string or a string that only consists of spaces, it wouldn't do the search.
      // inputKeywords is the string in the input box. searchKeywords is the string used to search.
      if ($.trim($scope.inputKeywords)) {
        console.log('Seach function called!');
        $scope.searchKeywords = $.trim($scope.inputKeywords);
        $scope.results_categories = [];
        $scope.results_courses = [];
        $scope.showCategoryResults = false;
        $scope.showCourseResults = false;
        // categoryMode and courseMode are used to work with clickCategoryRadio and clickCourseRadio functions
        if ($scope.searchType == 'categories') {
          $scope.categoryMode = true;
          $scope.courseMode = false;
          $scope.tableCtrl_categories.tableState().pagination.start = 0; // Reset the item index to 0 so that the page could be reset to 0 before conducting a new search.
          $scope.tableCtrl_categories.pipe($scope.tableCtrl_categories.tableState());
          $scope.showCategoryResults = true;
        }
        else {
          $scope.categoryMode = false;
          $scope.courseMode = true;
          $scope.tableCtrl_courses.tableState().pagination.start = 0; // Reset the item index to 0 so that the page could be reset to 0 before conducting a new search.
          $scope.tableCtrl_courses.pipe($scope.tableCtrl_courses.tableState());
          $scope.showCourseResults = true;
        }
      }
    };
    $scope.pressedEnter = function(keyEvent) {
      if (keyEvent.which == 13)
        $scope.search();
    };
    $scope.clickCategoryRadio = function() {
      $scope.showCourseResults = false;
      // If the inputKeywords is not empty, do search when clicking on the radio.
      if ($.trim($scope.inputKeywords)) 
        $scope.search();
      // If the inputKeywords is empty and it was showing category results, show category results again. 
      else if ($scope.categoryMode) {
        $scope.showCategoryResults = true;
      }
    };
    $scope.clickCourseRadio = function() {
      $scope.showCategoryResults = false;
      // If the inputKeywords is not empty, do search when clicking on the radio.
      if ($.trim($scope.inputKeywords)) 
        $scope.search();
      // If the inputKeywords is empty and it was showing course results, show course results again. 
      else if ($scope.courseMode) {
        $scope.showCourseResults = true;
      }
    };
    // Smart table pipe function
    $scope.callServer_categories = function(tableState, tableCtrl) {
      $scope.tableCtrl_categories = tableCtrl;
      if ($scope.showCategoryResults) {
        App.blocks('#loadingCategories', 'state_loading');

        var pagination = tableState.pagination;
        var start = tableState.pagination.start || 0; // The index of item in the school list used to display in the table.
        var number = tableState.pagination.number || 25; // Number of entries showed per page.

        var url = '/api/upgrid/non_degree/categories' + '?multiple_search=' + $scope.searchKeywords;

        ajaxService.getPage(start, number, url, tableState, token).then(function(response) {
          $scope.results_categories = response.data.results;
          $scope.count = response.data.count;
          tableState.pagination.numberOfPages = response.numberOfPages; // Set the number of pages so the pagination can update.
          tableState.pagination.totalItemCount = response.data.count; // This property of tableState.pagination is currently not being used yet.
          angular.forEach($scope.results_categories, function(result, index) {
            // Get school logo url for each result.
            result.logo_url = executiveService.getLogoBySchoolName(result.school_name, result.university_name);
          });

          $timeout(function() {
            // Add backslash "\" in front of the parentheses in seachKeyword so that the parentheses in table content could be matched by the following regex.
            $scope.searchKeywords = $scope.searchKeywords.replace(/([\(\)])/g, '\\$1');
            // Split the search keywords by comma.
            var keywords = $scope.searchKeywords.split(',');
            angular.forEach(keywords, function(keyword, index) {
              keyword = $.trim(keyword);
              // Create a regular expression with the keyword.
              var regexp = new RegExp('(' + keyword + ')', 'ig');
              // Put all matching string with span tag with the class "marked".
              $('*', 'td.result_name').contents().filter(function() {
                if (typeof (Node) == 'undefined') {
                    return this.nodeType == 3;
                }
                else {
                    return this.nodeType == Node.TEXT_NODE;
                }
              })
              .each(function(index) {
                var nodeText = $(this)[0].nodeValue;
                nodeText = nodeText.replace(regexp, '<span class="marked">$1</span>');
                $(this).replaceWith(nodeText);
              });
            });
          });

          App.blocks('#loadingCategories', 'state_normal');
        });
      }
    };

    $scope.callServer_courses = function(tableState, tableCtrl) {
      $scope.tableCtrl_courses = tableCtrl;
      if ($scope.showCourseResults) {
        App.blocks('#loadingCourses', 'state_loading');

        var pagination = tableState.pagination;
        var start = tableState.pagination.start || 0; // The index of item in the school list used to display in the table.
        var number = tableState.pagination.number || 25; // Number of entries showed per page.

        var url = '/api/upgrid/non_degree/courses' + '?multiple_search=' + $scope.searchKeywords;

        ajaxService.getPage(start, number, url, tableState, token).then(function(response) {
          $scope.results_courses = response.data.results;
          $scope.count = response.data.count;
          tableState.pagination.numberOfPages = response.numberOfPages; // Set the number of pages so the pagination can update.
          tableState.pagination.totalItemCount = response.data.count; // This property of tableState.pagination is currently not being used yet.

          angular.forEach($scope.results_courses, function(result, key) {
            // Get school logo url for each result.
            result.logo_url = executiveService.getLogoBySchoolName(result.school_name, result.university_name);
          });

          $timeout(function() {
            // Add backslash "\" in front of the parentheses in seachKeyword so that the parentheses in table content could be matched by the following regex.
            $scope.searchKeywords = $scope.searchKeywords.replace(/([\(\)])/g, '\\$1');
            // Split the search keywords by comma.
            var keywords = $scope.searchKeywords.split(',');
            angular.forEach(keywords, function(keyword, index) {
              keyword = $.trim(keyword);
              // Create a regular expression with the keyword.
              var regexp = new RegExp('(' + keyword + ')', 'ig');
              // Put all matching string with span tag with the class "marked".
              $('*', 'td.result_name').contents().filter(function() {
                if (typeof (Node) == 'undefined') {
                    return this.nodeType == 3;
                }
                else {
                    return this.nodeType == Node.TEXT_NODE;
                }
              })
              .each(function(index) {
                var nodeText = $(this)[0].nodeValue;
                nodeText = nodeText.replace(regexp, '<span class="marked">$1</span>');
                $(this).replaceWith(nodeText);
              });
            });
          });

          App.blocks('#loadingCourses', 'state_normal');
        });
      }
    };


  }
]);