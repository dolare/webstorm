/*Executive Education Admin controller*/

'use strict';

angular.module('myApp').controller('ExecutiveController', ['$sce', '$q', '$http', '$scope', '$localStorage', '$window', 'authenticationSvc', 'updateService', '$timeout', 'executiveService',
  function($sce, $q, $http, $scope, $localStorage, $window, authenticationSvc, updateService, $timeout, executiveService) {

    var token = authenticationSvc.getUserInfo().accessToken;
    $scope.emptyExecutiveLabel = "Currently there is no update of the reports."
    $http({
      url: '/api/upgrid/non_degree/schools?is_non_degree=True',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    }).then(function(response) {

      $scope.non_degree_schools = response.data.results;

      for (let i = $scope.non_degree_schools.length - 1; i >= 0; i--) {
        let s = $scope.non_degree_schools[i];

        // select2 dropdown
        $timeout(function() {
          var page_size = 6;
          $("#js-data-" + s.object_id).select2({
            ajax: {
              url: '/api/upgrid/non_degree/reports?school=' + s.object_id,
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
                params.page = params.page || 1;

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

            placeholder: 'No reports available.'

          });

          // Set default option as the latest report
          $.ajax({
            url: '/api/upgrid/non_degree/reports?school=' + s.object_id,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            },
            dataType: 'json'
          }).then(function(data) {
            if (data.results.length > 0)
              $("#js-data-" + s.object_id).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
          });

        }, 100);

        // detect if a report is ready to release for a school, it could be that there are updates of 
        s.readyToRelease = false;

        // Get report list
        $http({
          url: '/api/upgrid/non_degree/reports?school=' + s.object_id,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function(resp_reports) {

          if (resp_reports.data.results.length > 0)
            $http({
              url: '/api/upgrid/non_degree/reports/' + resp_reports.data.results[0].object_id,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function(resp_report) {
              $http({
                url: '/api/upgrid/non_degree/schools/' + s.object_id,
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
              }).then(function(resp_schoolpreview) {
                var compareResult = executiveService.updatedReport(resp_report.data, resp_schoolpreview.data);

                if (JSON.stringify(compareResult) != JSON.stringify(resp_schoolpreview.data))
                  return s.readyToRelease = true;
                else
                  return s.readyToRelease = false;
              });
            });
          else
            return s.readyToRelease = true;
        });

        s.releaseReport = function() {

          s.readyToRelease = false;

          var form = new FormData();
          form.append("school", s.object_id);

          $http({
            url: '/api/upgrid/non_degree/reports',
            method: 'POST',
            data: form,
            mimeType: "multipart/form-data",
            processData: false,
            contentType: false,
            headers: {
              'Authorization': 'JWT ' + token,
              'Content-Type': undefined,

            },
            // transformRequest: angular.identity,
          }).then(function(response) {
            $scope.date = new Date().toISOString();
            $scope.school = response.data.school_name;
            $scope.university = response.data.university_name;
            $scope.categories = response.data.categories;

            // Category offerings
            $scope.cat_offer = $scope.categories.length;

            // Course offerings
            $scope.course_offer = 0;

            for (let i = $scope.categories.length - 1; i >= 0; i--) {
              $scope.categories[i].course_offer = $scope.categories[i].courses.length;
              $scope.course_offer += $scope.categories[i].courses.length;
            }

            // Trigger dropdown list update and select the first report in history
            $.ajax({
              url: '/api/upgrid/non_degree/reports?school=' + response.data.school,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              },
              dataType: 'json'
            }).then(function(data) {
              $("#js-data-" + response.data.school).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
            });

          }).
          catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

          });

          jQuery('#releaseReport').modal('toggle');
        }

      }

    }).
    catch(function(error) {
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
        $http({
            url: '/api/upgrid/non_degree/reports/' + reportId,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(resp_report) {
            $scope.date = resp_report.data.date_created;
            $scope.school = resp_report.data.school_name;
            $scope.university = resp_report.data.university_name;
            $scope.categories = resp_report.data.categories;

            // Category offerings
            $scope.cat_offer = $scope.categories.length;

            // Course offerings
            $scope.course_offer = 0;

            for (let i = $scope.categories.length - 1; i >= 0; i--) {
              $scope.categories[i].course_offer = $scope.categories[i].courses.length;
              $scope.course_offer += $scope.categories[i].courses.length;
            }
          });

        jQuery('#viewReport').modal('toggle');
      }

    };

    $scope.togglefullen_release = function() {
      angular.element(document.getElementById("releaseReport")).toggleClass('fullscreen-modal');
    };

    $scope.togglefullen_view = function() {
      angular.element(document.getElementById("viewReport")).toggleClass('fullscreen-modal');
    };

    $scope.scrolltop = function() {
      angular.element(document.getElementById('scrolltop_non_degree')).scrollTop(0);
    };

    $scope.printReport_release = function() {

      $("#releaseReport").printThis({
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

    $scope.printReport_view = function() {

      $("#viewReport").printThis({
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

  }
]);