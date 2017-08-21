/*Exec. Ed. History controller*/

'use strict';

angular.module('myApp').controller('HistoryController', ['$q', '$http', '$scope', '$window', 'authenticationSvc', 'updateService', '$timeout', 'executiveService', 
  function($q, $http, $scope, $window, authenticationSvc, updateService, $timeout, executiveService) {
    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.emptyWarning = 'Currently there are no schools.';

    $scope.currency_symbols = executiveService.getCurrencySymbols();

    // Order schools by their names
    $http({
      url: '/api/upgrid/non_degree/schools?ordering=school',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    }).then(function(response) {
      $scope.schools = response.data.results;

      console.log('number of schools:', $scope.schools.length);

      for (var i = $scope.schools.length - 1; i >= 0; i--) {
        var s = $scope.schools[i];

        // School logos
        s.logo_url = executiveService.getLogoBySchoolName(s.school, s.university);

        // Get number of history reports for each school
        (function(s) {
          $http({
            url: '/api/upgrid/non_degree/reports?school=' + s.object_id + '&active=True',
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(resp_reports) {
            s.numberOfHistoryReports = resp_reports.data.count == 0 ? 0 : resp_reports.data.count - 1;
          });
        })(s);
        

        // select2 dropdown (history reports)
        (function(s) {
          $timeout(function() {
            var page_size = 7;
            $("#js-data-" + s.object_id).select2({
              ajax: {
                url: '/api/upgrid/non_degree/reports?school=' + s.object_id + '&active=True',
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                },
                dataType: 'json',
                data: function(params) {
                  var query = {
                    search: params.term, // search term
                    page: params.page,
                    page_size: page_size
                  }

                  return query;
                },
                processResults: function(data, params) {
                  // parse the results into the format expected by Select2
                  // since we are using custom formatting functions we do not need to
                  // alter the remote JSON data, except to indicate that infinite
                  // scrolling can be used
                  console.log('Loaded report list of ' + s.school);
                  params.page = params.page || 1;

                  if (data.previous == null) {
                    console.log('Report list 1st page.');
                    console.log('Report list including the latest one: ');
                    console.log(data.results);
                    data.results.splice(0,1);
                    console.log('The latest report is removed: ');
                    console.log(data.results);
                  }
                  return {
                    results: data.results.map(function(item) {
                      return {
                        id: item.object_id,
                        text: moment.utc(item.date_created).local().format('MM/DD/YYYY HH:mm:ss'),
                      };
                    }),
                    pagination: {
                      more: (params.page * page_size) < data.count
                    }
                  };


                  
                },

                cache: true
              },
              // Permanently hide the search box
              minimumResultsForSearch: Infinity,

              placeholder: 'Please select a report.'

            });

          });
        })(s);

      } // END for loop

    }).catch(function(error) {
      console.log('an error occurred...' + JSON.stringify(error));

    });

    $scope.viewReport = function(reportId) {
      if (reportId == null) {
        $.notify({

          // options
          icon: "fa fa-warning",
          message: 'Please select a report from the dropdown list.'
        }, {
          // settings
          type: 'warning',
          placement: {
            from: "top",
            align: "center"
          },
          z_index: 1999,
        });
      } else {
        jQuery('#viewReport').modal('toggle');

        App.blocks('#viewReport_loading', 'state_loading');

        $http({
            url: '/api/upgrid/non_degree/reports/' + reportId,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(resp_report) {
            console.log('Report of ' + 'resp_report.data.school_name' + ' loaded, created on ' + moment.utc(resp_report.data.date_created).local().format('MM/DD/YYYY HH:mm:ss'));

            $scope.date = resp_report.data.date_created;
            $scope.school = resp_report.data.school_name;
            $scope.university = resp_report.data.university_name;
            $scope.categories = resp_report.data.categories;

            $scope.logo_url = executiveService.getLogoBySchoolName($scope.school, $scope.university);

            // Category offerings
            $scope.cat_offer = $scope.categories.length;

            // Course offerings
            $scope.course_offer = 0;

            for (let i = $scope.categories.length - 1; i >= 0; i--) {
              $scope.categories[i].course_offer = $scope.categories[i].courses.length;
              $scope.course_offer += $scope.categories[i].courses.length;
            }

            App.blocks('#viewReport_loading', 'state_normal');
          });
      }

    };

    $scope.printReport_view = function() {

      $("#print-content_view").printThis({
        debug: false,
        importCSS: true,
        importStyle: true,
        printContainer: true,
        loadCSS: "../static/css/print.css",
        pageTitle: "History Report",
        removeInline: false,
        printDelay: 333,
        header: null,
        formValues: true
      });
    };

    $scope.scrolltop_view = function() {
      angular.element(document.getElementById('scrolltop_view')).scrollTop(0);
    };

    $scope.togglefullen_view = function() {
      angular.element(document.getElementById("viewReport")).toggleClass('fullscreen-modal');
    };
  }
]);

