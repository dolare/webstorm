angular.module('myApp').
controller('ShareExecutiveController', ['$stateParams', '$scope',
  '$http', 'executiveService',
  function($stateParams, $scope,
    $http, executiveService) {

    angular.element(document.getElementsByTagName("body")).addClass('frame');



    $scope.currency_symbols = executiveService.getCurrencySymbols();


    App.blocks('#sharedHistoryData_loading', 'state_loading');

    $http({
      url: '/api/upgrid/non_degree/shared_reports/' + $stateParams.param1 + '/' + $stateParams.param2,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      $scope.isShareMode = true;
      $scope.date = response.data.reports[0].date_created;

      $scope.expired_time = response.data.expired_time;

      $scope.school = response.data.reports[0].school_name;
      $scope.university = response.data.reports[0].university_name;
      $scope.categories = response.data.reports[0].categories;

      $scope.logo_url = executiveService.getLogoBySchoolName($scope.school, $scope.university);

      // Category offerings
      $scope.cat_offer = $scope.categories.length;

      // Course offerings
      $scope.course_offer = 0;

      for (let i = $scope.categories.length - 1; i >= 0; i--) {
        $scope.categories[i].course_offer = $scope.categories[i].courses.length;
        $scope.course_offer += $scope.categories[i].courses.length;
      }

      App.blocks('#sharedHistoryData_loading', 'state_normal');

    }).catch(function(error) {
      console.log('an error occurred...' + JSON.stringify(error));

    });
  }
]);