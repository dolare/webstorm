// ********************************Executive********************************
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

    }

    $scope.releaseSchool = function(Id) {

      var form = new FormData();
      form.append("school", Id);

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



    }



    $scope.schooldata_old = {
      "object_id": "be9912e2-0f90-4103-8af4-2779f405bf8b",
      "school_name": "The Graduate School of Arts and Sciences–Camden",
      "university_name": "Rutgers University - Camden",
      "school": "580bbf8b-642b-4eb7-914c-03a054981719",
      "date_created": "2017-06-30T20:30:42.283374Z",
      "categories": [{
          "name": "category1",
          "courses": [{
              "url": null,
              "Repeatable": "Y",
              "course_dates": [{
                  "end_date": "2017-06-29",
                  "start_date": "2017-06-26",
                  "object_id": "70881026-1738-4ce1-91fd-c59530c0879e"
                },
                {
                  "end_date": "2017-06-13",
                  "start_date": "2017-06-06",
                  "object_id": "ebe37b70-3cd7-4e9b-87f9-5e47f8ac312b"
                }
              ],
              "currency": null,
              "name": "course1",
              "date_modified": "2017-06-26T18:26:30.399316Z",
              "type": "onsite",
              "object_id": "59b0eb7e-4b83-48fe-a78c-2050d90a5ba3",
              "tuition_number": 222
            },
            {
              "url": null,
              "Repeatable": "Y",
              "course_dates": [{
                  "end_date": "2017-06-26",
                  "start_date": "2017-05-23",
                  "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                },
                {
                  "end_date": "2017-05-26",
                  "start_date": "2017-05-17",
                  "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                }
              ],
              "currency": null,
              "name": "course2",
              "date_modified": "2017-06-26T18:28:04.317155Z",
              "type": "online",
              "object_id": "cb107646-aa9e-4e79-a508-a6d425f5474b",
              "tuition_number": 333
            },
            {
              "url": null,
              "Repeatable": "Y",
              "course_dates": [{
                  "end_date": "2017-06-26",
                  "start_date": "2017-05-23",
                  "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                },
                {
                  "end_date": "2017-05-26",
                  "start_date": "2017-05-17",
                  "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                }
              ],
              "currency": null,
              "name": "course_deleted",
              "date_modified": "2017-06-26T18:28:04.317155Z",
              "type": "online",
              "object_id": "sb999999-aa9e-4e79-a508-a6d425f5474b",
              "tuition_number": 333
            }
          ],
          "object_id": "03c655e6-3ab0-4849-85bd-3bbc5f9a2dff",
          "date_modified": "2017-06-26T18:24:48.069051Z"
        },
        {
          "name": "category2_old",
          "courses": [{
            "url": null,
            "Repeatable": "Y",
            "course_dates": [{
                "end_date": "2017-06-26",
                "start_date": "2017-05-23",
                "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
              },
              {
                "end_date": "2017-05-26",
                "start_date": "2017-05-17",
                "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
              }
            ],
            "currency": null,
            "name": "course2",
            "date_modified": "2017-06-26T18:28:04.317155Z",
            "type": "online",
            "object_id": "cb107646-aa9e-4e79-a508-a6d425f5474b",
            "tuition_number": 333
          }],
          "object_id": "177febab-6548-42bb-ac17-988ae3dcd112",
          "date_modified": "2017-06-26T18:25:18.858474Z"
        },
        {
          "name": "category3",
          "courses": [{
              "url": null,
              "Repeatable": null,
              "course_dates": [],
              "currency": null,
              "name": "course3",
              "date_modified": "2017-06-30T04:56:39.306371Z",
              "type": null,
              "object_id": "3699c1e0-cd98-4d66-a254-cb769910afed",
              "tuition_number": null
            },
            {
              "url": null,
              "Repeatable": null,
              "course_dates": [],
              "currency": null,
              "name": "course4",
              "date_modified": "2017-06-30T04:56:15.269661Z",
              "type": null,
              "object_id": "2452c3b4-5040-441e-9572-0e106316c6b7",
              "tuition_number": null
            }
          ],
          "object_id": "ebe867a9-0a1d-4994-968b-ddd8d3a01653",
          "date_modified": "2017-06-30T04:55:21.914913Z"
        },


        {
          "name": "category5",
          "courses": [],
          "object_id": "x2671e12-2903-4c58-be84-07af8281bcb1",
          "date_modified": "2017-05-30T04:55:39.670543Z"
        }
      ]
    };

    $scope.schooldata_new = {
      "object_id": "be9912e2-0f90-4103-8af4-2779f405bf8b",
      "school_name": "The Graduate School of Arts and Sciences–Camden",
      "university_name": "Rutgers University - Camden",
      "school": "580bbf8b-642b-4eb7-914c-03a054981719",
      "date_created": "2017-06-30T20:30:42.283374Z",
      "categories": [{
          "name": "category1",
          "courses": [{
              "url": "www.google.com",
              "Repeatable": "N",
              "course_dates": [{
                  "end_date": "2017-05-29",
                  "start_date": "2017-06-26",
                  "object_id": "70881026-1738-4ce1-91fd-c59530c0879e"
                },
                {
                  "end_date": "2017-06-13",
                  "start_date": "2017-06-06",
                  "object_id": "ebe37b70-3cd7-4e9b-87f9-5e47f8ac312b"
                }
              ],
              "currency": 100,
              "name": "course1",
              "date_modified": "2017-06-26T18:26:30.399316Z",
              "type": "onsite",
              "object_id": "59b0eb7e-4b83-48fe-a78c-2050d90a5ba3",
              "tuition_number": 222
            },
            {
              "url": null,
              "Repeatable": "N",
              "course_dates": [{
                  "end_date": "2017-06-26",
                  "start_date": "2017-05-23",
                  "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                },
                {
                  "end_date": "2017-05-26",
                  "start_date": "2017-05-17",
                  "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                }
              ],
              "currency": null,
              "name": "course2",
              "date_modified": "2017-06-26T18:28:04.317155Z",
              "type": "online",
              "object_id": "cb107646-aa9e-4e79-a508-a6d425f5474b",
              "tuition_number": 333
            },

            {
              "url": null,
              "Repeatable": "Y",
              "course_dates": [{
                  "end_date": "2017-06-26",
                  "start_date": "2017-05-23",
                  "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                },
                {
                  "end_date": "2017-05-26",
                  "start_date": "2017-05-17",
                  "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                }
              ],
              "currency": null,
              "name": "course_added",
              "date_modified": "2017-06-26T18:28:04.317155Z",
              "type": "online",
              "object_id": "ha997646-aa9e-4e79-a508-a6d425f5474b",
              "tuition_number": 333
            }
          ],
          "object_id": "03c655e6-3ab0-4849-85bd-3bbc5f9a2dff",
          "date_modified": "2017-06-26T18:24:48.069051Z"
        },
        {
          "name": "category2",
          "courses": [{
            "url": null,
            "Repeatable": "Y",
            "course_dates": [{
                "end_date": "2017-06-26",
                "start_date": "2017-05-23",
                "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
              },
              {
                "end_date": "2017-05-26",
                "start_date": "2017-05-17",
                "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
              }
            ],
            "currency": null,
            "name": "course2",
            "date_modified": "2017-06-26T18:28:04.317155Z",
            "type": "online",
            "object_id": "cb107646-aa9e-4e79-a508-a6d425f5474b",
            "tuition_number": 333
          }],
          "object_id": "177febab-6548-42bb-ac17-988ae3dcd112",
          "date_modified": "2017-06-26T18:25:18.858474Z"
        },
        {
          "name": "category3",
          "courses": [{
              "url": null,
              "Repeatable": null,
              "course_dates": [],
              "currency": null,
              "name": "course3",
              "date_modified": "2017-06-30T04:56:39.306371Z",
              "type": null,
              "object_id": "3699c1e0-cd98-4d66-a254-cb769910afed",
              "tuition_number": null
            },
            {
              "url": null,
              "Repeatable": null,
              "course_dates": [],
              "currency": null,
              "name": "course4",
              "date_modified": "2017-06-30T04:56:15.269661Z",
              "type": null,
              "object_id": "2452c3b4-5040-441e-9572-0e106316c6b7",
              "tuition_number": null
            }
          ],
          "object_id": "ebe867a9-0a1d-4994-968b-ddd8d3a01653",
          "date_modified": "2017-06-30T04:55:21.914913Z"
        },
        {
          "name": "category4",
          "courses": [],
          "object_id": "92671e12-2903-4c58-be84-07af8281bcb1",
          "date_modified": "2017-06-30T04:55:39.670543Z"
        }
      ]
    };


    $scope.schooldata_3 = {
      "object_id": "be9912e2-0f90-4103-8af4-2779f405bf8b",
      "school_name": "The Graduate School of Arts and Sciences–Camden",
      "university_name": "Rutgers University - Camden",
      "school": "580bbf8b-642b-4eb7-914c-03a054981719",
      "date_created": "2017-06-30T20:30:42.283374Z",
      "categories": [{
          "name": "category1",
          "courses": [{
              "url": null,
              "Repeatable": "Y",
              "course_dates": [{
                  "end_date": "2017-06-29",
                  "start_date": "2017-06-26",
                  "object_id": "70881026-1738-4ce1-91fd-c59530c0879e"
                },
                {
                  "end_date": "2017-06-13",
                  "start_date": "2017-06-06",
                  "object_id": "ebe37b70-3cd7-4e9b-87f9-5e47f8ac312b"
                }
              ],
              "currency": null,
              "name": "course1",
              "date_modified": "2017-06-26T18:26:30.399316Z",
              "type": "onsite",
              "object_id": "59b0eb7e-4b83-48fe-a78c-2050d90a5ba3",
              "tuition_number": 222
            }
            
          ],
          "object_id": "03c655e6-3ab0-4849-85bd-3bbc5f9a2dff",
          "date_modified": "2017-06-26T18:24:48.069051Z"
        }

      ]
    };

    var testExec = executiveService.updatedReport($scope.schooldata_3, $scope.schooldata_3);

    console.log(JSON.stringify(testExec));


  }
]);