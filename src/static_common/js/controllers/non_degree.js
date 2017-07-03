/*Non-degree controller*/
'use strict';

angular.module('myApp').
controller('NonDegreeController', ['$scope', '$http', 'authenticationSvc', function($scope, $http, authenticationSvc) {
  var token = authenticationSvc.getUserInfo().accessToken;

  // selected schools' IDs
  $scope.selectedSchoolIds = [];

  // selected schools
  $scope.selectedSchools = [];

  $scope.clearSharedValue = function() {

    $scope.url = null;
  };

  // Retrieve the list of subsribed schools
  $http({
      url: '/api/upgrid/non_degree/schools',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function(resp_schools) {
      $scope.school_list = resp_schools.data.results;
      for (let i = $scope.school_list.length - 1; i >= 0; i--) {
        let s = $scope.school_list[i];
        s.selected = false;
        s.logo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/LBS_logo_.png/150px-LBS_logo_.png';

        /*

        Update stats for this school: 
        s.cat_add: category additions
        s.cat_rm: category removals
        s.course_add: course additions
        s.course_rm: course removals

        Their default values are null, which mean no reports released.

        */
        s.cat_add = null;
        s.cat_rm = null;
        s.course_add = null;
        s.course_rm = null;

        // True if there is at least one repleased report of this school
        s.hasReport = false;

        //Retrieve the list of reports for a school
        $http({
            url: '/api/upgrid/non_degree/reports?school=' + s.object_id,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(resp_reports) {

            
            // School has only 1 report
            if (resp_reports.data.results.length == 1) {
              s.cat_add = 0;
              s.cat_rm = 0;
              s.course_add = 0;
              s.course_rm = 0;

              s.hasReport = true;
            }
            // School has at least 2 reports
            else if (resp_reports.data.results.length > 1) {
              // Retrieve stats of updates of the two latest reports
              $http({
                  url: '/api/upgrid/non_degree/reports/overview/' + resp_reports.data.results[0].object_id + '/' + resp_reports.data.results[1].object_id,
                  method: 'GET',
                  headers: {
                    'Authorization': 'JWT ' + token
                  }
                })
                .then(function(resp_overview) {
                  s.cat_add = resp_overview.data.category_added;
                  s.cat_rm = resp_overview.data.category_removed;
                  s.course_add = resp_overview.data.course_added;
                  s.course_rm = resp_overview.data.course_removed;
                });

              s.hasReport = true;
            }
          });
      }

      // Watch school for changes
      $scope.$watch('school_list | filter: {selected: true}', function(nv) {
        $scope.selectedSchoolIds = nv.map(function(school) {
          return school.object_id;
        });
        console.log($scope.selectedSchoolIds);
      }, true);

    });


  // View selected schools
  $scope.viewReport = function() {
    // $scope.selectedSchools = filterFilter($scope.school_list, {selected: true});
    console.log($scope.selectedSchoolIds);

    
  };

  /*Non-degree Report Controller*/
  $http.get('http://api.fixer.io/latest?base=USD').then(function(response) {
    $scope.fxRates = response.data;
    $scope.currency_symbols = {
      'USD': '$', // US Dollar
      'EUR': '€', // Euro
      'CRC': '₡', // Costa Rican Colón
      'GBP': '£', // British Pound Sterling
      'ILS': '₪', // Israeli New Sheqel
      'INR': '₹', // Indian Rupee
      'JPY': '¥', // Japanese Yen
      'KRW': '₩', // South Korean Won
      'NGN': '₦', // Nigerian Naira
      'PHP': '₱', // Philippine Peso
      'PLN': 'zł', // Polish Zloty
      'PYG': '₲', // Paraguayan Guarani
      'THB': '฿', // Thai Baht
      'UAH': '₴', // Ukrainian Hryvnia
      'VND': '₫', // Vietnamese Dong
      'CNY': '¥', // Chinese Yuan
    };
    $scope.fxConvert = function(amount, currency) {
      return amount / $scope.fxRates.rates[currency];
    }
  });
  // $http.get('/static/data/non-degree_report.json').then(function(response) {
  //   $scope.universities = response.data.data;
  //   $scope.date = response.data.date;
  //   for (let i = 0; i < $scope.universities.length; i++) {
  //     let s = $scope.universities[i];
  //     // category offerings
  //     s.cat_offer = s.categories.length;

  //     s.course_offer = 0; // university course offerings
  //     s.course_add = 0; // university course additions
  //     s.course_rm = 0; // university course removals

  //     // category additions
  //     s.cat_add = 0;

  //     // category removals
  //     s.cat_rm = 0;

  //     for (let j = 0; j < s.categories.length; j++) {
  //       let c = s.categories[j]; // category course offerings
  //       if (c.status == 'add')
  //         s.cat_add++;
  //       if (c.status == 'rm')
  //         s.cat_rm++;

  //       c.course_offer = c.courses.length;
  //       c.course_add = 0; // category course additions
  //       c.course_rm = 0; // category course removals
  //       for (let k in c.courses) {
  //         if (c.courses[k].status == 'add')
  //           c.course_add++;
  //         if (c.courses[k].status == 'rm')
  //           c.course_rm++;
  //       }

  //       s.course_offer += c.course_offer;
  //       s.course_add += c.course_add;
  //       s.course_rm += c.course_rm;
  //     }
  //   }
  // });
  /*END Non-degree Report Controller*/



  $scope.togglefullen = function() {
    angular.element(document.getElementById("ViewAll")).toggleClass('fullscreen-modal');
  };

  $scope.scrolltop = function() {
    angular.element(document.getElementById('scrolltop_non_degree')).scrollTop(0);
  };

  $scope.setLinkValue = function() {
    $("#myModal1").modal('toggle');
    jQuery('.myTab-share a:first').tab('show');
  };



  $scope.htmlShare = function(day) {
    $scope.url = {
      text: null
    };

    $scope.copied = false;
    new Clipboard('.btn');


    jQuery('.myTab-share a:last').tab('show');

    App.blocks('#shareReports', 'state_loading');


    App.blocks('#shareReports', 'state_normal');
    $scope.url = {
      text: 'www.google.com',
    };

    App.blocks('#shareReports', 'state_normal');




  };


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

}]);