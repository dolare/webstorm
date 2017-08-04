/*Executive Education Admin controller*/

'use strict';

angular.module('myApp').controller('ExecutiveController', ['$sce', '$q', '$http', '$scope', '$localStorage', '$window', 'authenticationSvc', 'updateService', '$timeout', 'executiveService', 'orderByFilter', 
  function($sce, $q, $http, $scope, $localStorage, $window, authenticationSvc, updateService, $timeout, executiveService, orderBy) {

    // Inject underscore into $scope
      $scope._ = _;

    var token = authenticationSvc.getUserInfo().accessToken;
    $scope.itemsByPage = 25;
    
    $scope.emptyExecutiveLabel = 'Currently there are no Non-degree schools.';

    $scope.date = new Date().toISOString();

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
      'SGD': 'S$', // Singapore Dollar
      'null': '$', // The default currency sign is USD
    };

    

    $http({
      url: '/api/upgrid/non_degree/schools?is_non_degree=True',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    }).then(function(response) {
      $scope.non_degree_schools = response.data.results;

      // Order schools by their names
      $scope.non_degree_schools = orderBy($scope.non_degree_schools, 'school');

      

      for (var i = $scope.non_degree_schools.length - 1; i >= 0; i--) {
        var s = $scope.non_degree_schools[i];

        // select2 dropdown (active reports)
        (function(s) {
          $timeout(function() {
            var page_size = 6;
            $("#js-data-active-" + s.object_id).select2({
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
                  console.log('Loaded active report list of ' + s.school);
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

              placeholder: 'There are no reports yet.'

            });

            // Set default option as the latest report
            $.ajax({
              url: '/api/upgrid/non_degree/reports?school=' + s.object_id + '&active=True',
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              },
              dataType: 'json'
            }).then(function(data) {
              if (data.results.length > 0)
                $("#js-data-active-" + s.object_id).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
            });

          });
        })(s);
        
        // select2 dropdown (archived reports)
        (function(s) {
          $timeout(function() {
            var page_size = 6;
            $("#js-data-inactive-" + s.object_id).select2({
              ajax: {
                url: '/api/upgrid/non_degree/reports?school=' + s.object_id + '&active=False',
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
                  console.log('Loaded archived report list of ' + s.school);
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

              placeholder: 'There are no reports yet.'

            });

            // Set default option as the latest report
            $.ajax({
              url: '/api/upgrid/non_degree/reports?school=' + s.object_id + '&active=False',
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              },
              dataType: 'json'
            }).then(function(data) {
              if (data.results.length > 0)
                $("#js-data-inactive-" + s.object_id).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
            });

          });
        })(s);
      } // END for loop

      console.log('number of schools:', $scope.non_degree_schools.length);
    }).catch(function(error) {
      console.log('an error occurred...' + JSON.stringify(error));

    });

    $scope.previewReport = function(schoolId) {
      // Release preview release popover-enable
      $scope.releaseConfirmEnable = false;
      // Release preview release popover-is-open
      $scope.releaseConfirmIsOpen = false;
      jQuery('#previewReport').modal('toggle');

      App.blocks('#previewReport_loading', 'state_loading');

      // If true, the report is ready to release, otherwise not
      $scope.readyToRelease = false;
      console.log('Initialize readyToRelease to false, Ready? ' + $scope.readyToRelease);

      // assign the school id of this row to a field under $scope so that the releaseReport function in the popup window could access the current school id.
      $scope.current_school_id = schoolId;

      $q.all({
        // Get the report list
        reports: $http({
          url: '/api/upgrid/non_degree/reports?school=' + schoolId,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        }),
        // Get the current school programs' data
        preview: $http({
          url: '/api/upgrid/non_degree/schools/' + schoolId,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        })
      }).then(function(response) {
        var reports = response.reports.data; // Report list
        var preview = response.preview.data; // Current school data

        console.log('Loaded report list. There are ' + reports.results.length + ' reports');
        console.log('Loaded current data of ' + preview.school);
        
        $scope.school = preview.school;
        $scope.university = preview.university;
        $scope.categories = preview.categories;
        $scope.logo_url = executiveService.getLogoBySchoolName($scope.school, $scope.university);

        $scope.cat_offer = $scope.categories.length;
        $scope.course_offer = 0;

        for (var i = $scope.categories.length - 1; i >= 0; i--) {
          $scope.categories[i].course_offer = $scope.categories[i].courses.length;
          $scope.course_offer += $scope.categories[i].course_offer;
        }

        // Get the compared data between the preview data(school's current data) and the previous report

        // if there is no previous report 
        if (reports.count == 0) {
          $scope.hasUpdates = false;
          $scope.categories_compared = preview.categories;
          $scope.lastReleasedDate = null;
          $scope.cat_add = 0;
          $scope.cat_rm = 0;
          $scope.course_add = 0;
          $scope.course_rm = 0;

          console.log('No previous report.');
          $scope.readyToRelease = true;
          console.log('Ready? ' + $scope.readyToRelease);

          App.blocks('#previewReport_loading', 'state_normal');
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
            $scope.report_old = resp_prev_report.data;
            console.log('Loaded latest report of ' + resp_prev_report.data.school_name);

            $scope.lastReleasedDate = resp_prev_report.data.date_created;

            $scope.categories_compared = executiveService.updatedReport(resp_prev_report.data, preview).categories;
            console.log('Got compared results!');
            console.log('old categories: ');
            console.log(angular.toJson(resp_prev_report.data.categories));
            console.log('current categories: ');
            console.log(angular.toJson($scope.categories));
            console.log('compared categories: ');
            console.log(angular.toJson($scope.categories_compared));

            if (angular.toJson($scope.categories_compared) != angular.toJson($scope.categories)) {
              console.log('Update is found.');
              $scope.readyToRelease = true;
              console.log('Ready? ' + $scope.readyToRelease);
              $scope.hasUpdates = _.difference( _.pluck($scope.categories_compared, 'updated'), [1, 2, undefined]).length || _.difference(_.pluck(_.flatten(_.pluck($scope.categories_compared, 'courses')), 'name_old'), [undefined]).length > 0 || _.difference(_.pluck(_.flatten(_.pluck($scope.categories_compared, 'courses')), 'url_old'), [undefined]).length>0 ||_.difference(_.pluck(_.flatten(_.pluck($scope.categories_compared, 'courses')), 'course_dates_old'), [undefined]).length>0 || _.difference(_.pluck(_.flatten(_.pluck($scope.categories_compared, 'courses')), 'currency_old'), [undefined]).length>0 || _.difference(_.pluck(_.flatten(_.pluck($scope.categories_compared, 'courses')), 'type_old'), [undefined]).length>0 || _.difference(_.pluck(_.flatten(_.pluck($scope.categories_compared, 'courses')), 'tuition_number_old'), [undefined]).length>0;
            }
            else {
              console.log('No update.');
              $scope.readyToRelease = false;
              console.log('Ready? ' + $scope.readyToRelease);
              $scope.hasUpdates = false;
            }
            $scope.cat_add = _.filter($scope.categories_compared, {updated: 1}).length;
            $scope.cat_rm = _.filter($scope.categories_compared, {updated: 2}).length;

            $scope.course_add = 0;
            $scope.course_rm = 0;

            for (let i = $scope.categories_compared.length - 1; i >= 0; i--) {
              $scope.course_add += _.filter($scope.categories_compared[i].courses, {updated: 1}).length;
              $scope.course_rm += _.filter($scope.categories_compared[i].courses, {updated: 2}).length;
            }
            App.blocks('#previewReport_loading', 'state_normal');
          });
      }).catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
      });
    };

    $scope.releaseConfirm = function() {
      if ($scope.readyToRelease == true) {
        $scope.releaseConfirmEnable = true;
        $scope.releaseConfirmIsOpen = true;
      }
      else {
        console.log('No update. Cannot release!');
        $.notify({
          // options
          icon: "fa fa-warning",
          message: 'There is no update for these programs, so the report cannot be released this time.'
        }, {
          // settings
          type: 'warning',
          placement: {
            from: "top",
            align: "center"
          },
          z_index: 1999,
        });
      }
    };

    // Toggle releaseConfirmIsOpen
    $scope.toggleRCIsOpen = function() {
      $scope.releaseConfirmIsOpen = !$scope.releaseConfirmIsOpen;
    };

    // Toggle releaseConfirmEnable
    $scope.toggleRCEnable = function() {
      $scope.releaseConfirmEnable = !$scope.releaseConfirmEnable;
    };

    $scope.releaseReport = function() {
      if ($scope.readyToRelease == true) {
        $scope.readyToRelease = false;
        console.log('Set readyToRelease back to false, Ready? ' + $scope.readyToRelease);

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
          console.log('Released a report of ' + resp_post.data.school_name);
          // Update History dropdown list display
          $timeout(function() {
            $.ajax({
              url: '/api/upgrid/non_degree/reports?school=' + $scope.current_school_id + '&active=True',
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              },
              dataType: 'json'
            }).then(function(data) {
              if (data.results.length > 0)
                $("#js-data-active-" + $scope.current_school_id).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
              else
                $("#js-data-active-" + $scope.current_school_id).empty().trigger('change');
            });
          });
        }).catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));
        });
      }
      else {
        console.log('Warning: duplicate clicks on "Yes".');
        $.notify({
          // options
          icon: "fa fa-warning",
          message: 'You have already released the report, please wait.'
        }, {
          // settings
          type: 'warning',
          placement: {
            from: "top",
            align: "center"
          },
          z_index: 1999,
        });
      }
      
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

    $scope.editReport = function(reportId) {
      $scope.current_report_id = reportId;
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
        jQuery('#editReport').modal('toggle');

        App.blocks('#editReport_loading', 'state_loading');

        $http({
            url: '/api/upgrid/non_degree/reports/' + reportId,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(resp_report) {
            console.log('Report of ' + 'resp_report.data.school_name' + ' loaded, created on ' + moment.utc(resp_report.data.date_created).local().format('MM/DD/YYYY HH:mm:ss'));
            $scope.report = resp_report.data;

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
              $scope.course_offer += $scope.categories[i].courses.length;
            }

            $scope.catBeforeEdit = angular.toJson($scope.categories);
            // console.log('$scope.catBeforeEdit: ');
            // console.log($scope.catBeforeEdit);

            $scope.$watch('report', function(newV, oldV) {
              console.log(angular.toJson(newV));
            }, true);

            App.blocks('#editReport_loading', 'state_normal');
          });
      }
    };

    $scope.saveReport = function() {
      // console.log('Current categories: ');
      // console.log(angular.toJson($scope.categories));
      if ($scope.catBeforeEdit != angular.toJson($scope.categories)) 
        $http({
            url: '/api/upgrid/non_degree/reports/' + $scope.current_report_id,
            method: 'PATCH',
            data: {
              categories: $scope.categories
            },
            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(resp_patch) {
            console.log('School: ' + $scope.school + ', report # ' + $scope.current_report_id + ', modified.');
            // Update $scope.catBeforeEdit
            $scope.catBeforeEdit = angular.toJson($scope.categories);
            $.notify({
              // options
              icon: 'fa fa-warning',
              message: 'Changes have been saved!'
            }, {
              // settings
              type: 'warning',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });
          }).catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));
          });
      
      else
        $.notify({
          // options
          icon: 'fa fa-warning',
          message: "You haven't made any changes to this report."
        }, {
          // settings
          type: 'warning',
          placement: {
            from: "top",
            align: "center"
          },
          z_index: 1999,
        });
    };

    $scope.archiveReport = function(reportId, schoolId) {
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
      } else
        $http({
            url: '/api/upgrid/non_degree/reports/' + reportId,
            method: 'PATCH',
            data: {
              active: 'False'
            },
            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(resp_patch) {
            console.log('School: ' + schoolId + ', report # ' + reportId + ', archived.');
            $.notify({
              // options
              icon: 'fa fa-warning',
              message: 'Report is successfully archived.'
            }, {
              // settings
              type: 'warning',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });
            // Update dropdown list display
            $timeout(function(){
              // $("#js-data-active-" + schoolId).empty().trigger('change');
              // Update the active list.
              $.ajax({
                url: '/api/upgrid/non_degree/reports?school=' + schoolId + '&active=True',
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                },
                dataType: 'json'
              }).then(function(data) {
                if (data.results.length > 0)
                  $("#js-data-active-" + schoolId).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
                else
                  $("#js-data-active-" + schoolId).empty().trigger('change');
              });
              // Update the archived list.
              $.ajax({
                url: '/api/upgrid/non_degree/reports?school=' + schoolId + '&active=False',
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                },
                dataType: 'json'
              }).then(function(data) {
                if (data.results.length > 0)
                  $("#js-data-inactive-" + schoolId).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
                else
                  $("#js-data-inactive-" + schoolId).empty().trigger('change');
              });
            });
          }).catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));
          });
    };

    $scope.unarchiveReport = function(reportId, schoolId) {
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
      } else
        $http({
            url: '/api/upgrid/non_degree/reports/' + reportId,
            method: 'PATCH',
            data: {
              active: 'True'
            },
            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(resp_patch) {
            console.log('School: ' + schoolId + ', report # ' + reportId + ', unarchived.');
            $.notify({
              // options
              icon: 'fa fa-warning',
              message: 'Report is successfully unarchived.'
            }, {
              // settings
              type: 'warning',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });
            // Update dropdown list display
            $timeout(function(){
              // $("#js-data-inactive-" + schoolId).empty().trigger('change');
              // Update the active list.
              $.ajax({
                url: '/api/upgrid/non_degree/reports?school=' + schoolId + '&active=True',
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                },
                dataType: 'json'
              }).then(function(data) {
                if (data.results.length > 0)
                  $("#js-data-active-" + schoolId).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
                else
                  $("#js-data-active-" + schoolId).empty().trigger('change');
              });
              // Update the archived list.
              $.ajax({
                url: '/api/upgrid/non_degree/reports?school=' + schoolId + '&active=False',
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                },
                dataType: 'json'
              }).then(function(data) {
                if (data.results.length > 0)
                  $("#js-data-inactive-" + schoolId).append('<option selected value=' + data.results[0].object_id + '>' + moment.utc(data.results[0].date_created).local().format('MM/DD/YYYY HH:mm:ss') + '</option>').trigger('change');
                else
                  $("#js-data-inactive-" + schoolId).empty().trigger('change');
              });
            });
          }).catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));
          });
    };



    $scope.togglefullen_preview = function() {
      angular.element(document.getElementById("previewReport")).toggleClass('fullscreen-modal');
    };

    $scope.togglefullen_view = function() {
      angular.element(document.getElementById("viewReport")).toggleClass('fullscreen-modal');
    };

    $scope.togglefullen_edit = function() {
      angular.element(document.getElementById("editReport")).toggleClass('fullscreen-modal');
    };

    $scope.scrolltop_preview = function() {
      angular.element(document.getElementById('scrolltop_preview')).scrollTop(0);
    };

    $scope.scrolltop_view = function() {
      angular.element(document.getElementById('scrolltop_view')).scrollTop(0);
    };

    $scope.scrolltop_edit = function() {
      angular.element(document.getElementById('scrolltop_edit')).scrollTop(0);
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

    $scope.printReport_edit = function() {

      $("#print-content_edit").printThis({
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