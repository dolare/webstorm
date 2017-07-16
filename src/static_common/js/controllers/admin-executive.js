/*Executive Education Admin controller*/

'use strict';

angular.module('myApp').controller('ExecutiveController', ['$sce', '$q', '$http', '$scope', '$localStorage', '$window', 'authenticationSvc', 'updateService', '$timeout', 'executiveService',
  function($sce, $q, $http, $scope, $localStorage, $window, authenticationSvc, updateService, $timeout, executiveService) {

    // Inject underscore into $scope
      $scope._ = _;

    var token = authenticationSvc.getUserInfo().accessToken;
    $scope.emptyExecutiveLabel = 'Currently there is no update of the reports.';

    $scope.date = new Date().toISOString();

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

        

        s.previewReport = function() {

          jQuery('#previewReport').modal('toggle');

          App.blocks('#previewReport_loading', 'state_loading');

          // assign the school id of this row to a field under $scope so that the releaseReport function in the popup window could access the current school id.
          $scope.current_school_id = s.object_id;

          $q.all({
            // Get the report list
            reports: $http({
              url: '/api/upgrid/non_degree/reports?school=' + s.object_id,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            }),
            // Get the current school programs' data
            preview: $http({
              url: '/api/upgrid/non_degree/schools/' + s.object_id,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            })
          }).then(function(response) {
            var reports = response.reports.data;
            var preview = response.preview.data;
            
            $scope.school = preview.school;
            $scope.university = preview.university;
            $scope.categories = preview.categories;
            $scope.logo_url = executiveService.getLogoBySchoolName($scope.school);

            // Get the compared data between the preview data(school's current data) and the previous report

            // if there is no previous report 
            if (reports.count == 0) {
              $scope.categories_compared = preview.categories;
              $scope.cat_add = 0;
              $scope.cat_rm = 0;
              $scope.course_add = 0;
              $scope.course_rm = 0;
            }
            // else there would be a previous report, and get that report
            else
              $http({
                url: '/api/upgrid/non_degree/reports/' + reports.results[0].object_id,
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
              }).then(function(resp_prev_report) {
                $scope.categories_compared = executiveService.updatedReport(resp_prev_report.data, preview).categories;
                $scope.cat_add = _.filter($scope.categories_compared, {updated: 1}).length;
                $scope.cat_rm = _.filter($scope.categories_compared, {updated: 2}).length;

                $scope.course_add = 0;
                $scope.course_rm = 0;

                for (let i = $scope.categories_compared.length - 1; i >= 0; i--) {
                  $scope.course_add += _.filter($scope.categories_compared[i].courses, {updated: 1}).length;
                  $scope.course_rm += _.filter($scope.categories_compared[i].courses, {updated: 2}).length;
                }
              });
          }).finally(function() {
            App.blocks('#previewReport_loading', 'state_normal');
          });
        };

      } // END for loop

    }).
    catch(function(error) {
      console.log('an error occurred...' + JSON.stringify(error));

    });

    $scope.releaseReport = function() {

      // Set the readyToRelease property of the processing school to false to prevent repetitively releasing a report
      _.filter($scope.non_degree_schools, {object_id: $scope.current_school_id})[0].readyToRelease = false;

      var form = new FormData();
      form.append("school", $scope.current_school_id);

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
      }).then(function(resp_post) {
        // Trigger dropdown list update and select the first report in history
        $.ajax({
          url: '/api/upgrid/non_degree/reports?school=' + resp_post.data.school,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          },
          dataType: 'json'
        }).then(function(data) {
          $("#js-data-" + resp_post.data.school).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
        });

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });

    };

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
            $scope.date = resp_report.data.date_created;
            $scope.school = resp_report.data.school_name;
            $scope.university = resp_report.data.university_name;
            $scope.categories = resp_report.data.categories;

            $scope.logo_url = executiveService.getLogoBySchoolName($scope.school);

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

    $scope.togglefullen_preview = function() {
      angular.element(document.getElementById("previewReport")).toggleClass('fullscreen-modal');
    };

    $scope.togglefullen_view = function() {
      angular.element(document.getElementById("viewReport")).toggleClass('fullscreen-modal');
    };

    $scope.scrolltop_preview = function() {
      angular.element(document.getElementById('scrolltop_preview')).scrollTop(0);
    };

    $scope.scrolltop_view = function() {
      angular.element(document.getElementById('scrolltop_view')).scrollTop(0);
    };

    $scope.printReport_preview = function() {

      $("#print-content_preview").printThis({
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

      $("#print-content_view").printThis({
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