/*Non-degree controller*/
'use strict';

angular.module('myApp').
controller('NonDegreeController', function($scope, $http, authenticationSvc, $localStorage, $sessionStorage, executiveService, $timeout) {
  var token = authenticationSvc.getUserInfo().accessToken;

  $scope.itemsByPage = 25;

  $scope.$storage = $localStorage;

  //console.log("table = "+JSON.stringify(Table));

  $scope.$storage.non_degree = null

  $scope._ = _;
  $scope.testObject = {one: 1, two: 2, three: 3, four: 4};

  // selected schools' IDs
  $scope.selectedSchoolIds = [];

  // selected schools
  $scope.selectedSchools = [];

  $scope.clearSharedValue = function() {

    $scope.url = null;
  };

  $scope.currency_symbols = executiveService.getCurrencySymbols();

  $scope.check_storage = function(){
    console.log("$scope.$storage.non_degree="+JSON.stringify($scope.$storage.non_degree))
  }


  $scope.$storage.non_degree = {}

   $http({
      url: '/api/upgrid/non_degree/schools',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function(resp_schools) {

      console.log("resp_schools: "+ JSON.stringify(resp_schools.data.results));
      $scope.school_table = resp_schools.data.results
      $scope.school_report_pair = {};
      angular.forEach($scope.school_table, function(value, index) {
        // select2 dropdown (report to compare with)
        (function(value) {
          $timeout(function() {
            var page_size = 7;
            $("#js-data-" + value.object_id).select2({
              ajax: {
                url: '/api/upgrid/non_degree/reports?school=' + value.object_id + '&active=True',
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
                  console.log('Loaded active report list of ' + value.school);
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
                        text: moment.utc(item.date_created).local().format('MM/DD/YYYY'),
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

              placeholder: 'No older reports.'

            });

            // $("#js-data-" + value.object_id).on('change', function() {});

          });
        })(value);

        value["details"] = null;
      
        value["logo_url"] = executiveService.getLogoBySchoolName(value.school, value.university)

       //console.log("value = "+JSON.stringify(value));


        $http({
          url: '/api/upgrid/non_degree/reports?school=' + value.object_id + '&active=True',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        })
        .then(function(resp_reports) {
          console.log('processing ' + value.university + ' ' + value.school);
          
          
          if(resp_reports.data.results.length>0) {
            // If there is at least one report in the list, get the release date of the last report.
            value.lastReleaseDate = resp_reports.data.results[0].date_created;

            //console.log("++++++++value.object_id="+value.object_id);
            //console.log("++++++++resp_reports.data.results[0].object_id="+resp_reports.data.results[0].object_id);
            
            $scope.school_report_pair[value.object_id] = new Array(2);
            $scope.school_report_pair[value.object_id][0] = resp_reports.data.results[0].object_id;

            if (resp_reports.data.results.length == 1) {
              $scope.setReportPair(value.object_id, resp_reports.data.results[0].object_id);
            }
            else {
              // If there are at leasat 2 reports in the list, you can select which report to compare the last released report with and set the default option as the report before the last one.
              $timeout(function(){
                $("#js-data-" + value.object_id).append('<option selected value=' + resp_reports.data.results[1].object_id + '>' + moment.utc(resp_reports.data.results[1].date_created).local().format('MM/DD/YYYY') + '</option>').trigger('change');
              });
            }

            
            $scope.$storage.non_degree[value.object_id] = true;
            
            
            }

            else {
              // If there is no previous report, set lastReleaseDate to null.
              value.lastReleaseDate = null;
            }


          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));
          });
      });


        console.log("school_table = "+JSON.stringify($scope.school_table));
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));
    });

    // The setReportPair function would be call every time the option of the REPORT TO COMPARE WITH dropdown in each row.
    $scope.setReportPair = function(schoolId, oldReportId) {
      if (oldReportId) {
        var school = _.find($scope.school_table, function(res) {return res.object_id == schoolId;});
        $scope.school_report_pair[schoolId][1] = oldReportId;
        console.log('Generated report pair for ' + school.school);
        $http({
          url: '/api/upgrid/non_degree/reports/overview/' + $scope.school_report_pair[schoolId][0] + '/' + $scope.school_report_pair[schoolId][1],
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        })
        .then(function(resp_overview) {
          
          
          school["details"] = {};

          school.details["course_removed"] = resp_overview.data.course_removed;
          school.details["course_added"] = resp_overview.data.course_added;
          school.details["category_added"] = resp_overview.data.category_added;
          school.details["category_removed"] = resp_overview.data.category_removed;


          console.log('Generated details for ' + school.school + ' : ');
          console.log(angular.toJson(school.details));
        });
      }
    };


    //view the reports

     $scope.view_report = function () {

      $scope.open_legend = false;
      var selected_ids = [];
      angular.forEach($scope.$storage.non_degree, function(value, key) {
        if(value){
          selected_ids.push(key)
        }

      });

      console.log("selected_ids="+JSON.stringify(selected_ids));
    

      if (selected_ids.length===0) {
        $.notify({
          // options
          icon: "fa fa-warning",
          message: 'Please make a selection from the table.'
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
      else {

        jQuery('#ViewAll').modal('toggle');

        App.blocks('#viewall_loading', 'state_loading');

        $scope.schools = [];

        $scope.show_school = {};

        //one id for one school
        angular.forEach(selected_ids, function(value, index) {

          var new_school_data;
          var old_school_data;
          var school_data_temp;

          console.log("value = " + value)

          

          console.log("test_id_new = " + $scope.school_report_pair[value][0]);

          $http({
            url: '/api/upgrid/non_degree/reports/' + $scope.school_report_pair[value][0],
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            },
          }).then(function(result) {

            // console.log("new school data ="+JSON.stringify(result.data))
            new_school_data = result.data;

            new_school_data["logo_url"] = executiveService.getLogoBySchoolName(new_school_data.school_name, new_school_data.university_name);

            var test_id = $scope.school_report_pair[value][1];
            console.log("test_id="+test_id)

            return $http({
                url: '/api/upgrid/non_degree/reports/' + $scope.school_report_pair[value][1],
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
              })

          }).then(function(final_result) {

            old_school_data = final_result.data;
            console.log("old school data ="+JSON.stringify(final_result.data));
            console.log("new_school_data ="+JSON.stringify(new_school_data));
            school_data_temp = executiveService.updatedReport(old_school_data, new_school_data)
            console.log("school_data_temp = "+JSON.stringify(school_data_temp))

            var school = _.find($scope.school_table, function(res) {return res.object_id == value;});

            school_data_temp["course_added"] = school.details["course_added"];
            school_data_temp["course_removed"] = school.details["course_removed"];
            school_data_temp["category_added"] = school.details["category_added"];
            school_data_temp["category_removed"] = school.details["category_removed"];

            $scope.schools.push(school_data_temp);

            App.blocks('#viewall_loading', 'state_normal');
            console.log("$scope.schools after ="+JSON.stringify($scope.schools));
          }).catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));
          });

        });
      }
     };


     $scope.checkAll_None = function(value) {

      for(var i=0; i<$scope.school_table.length; i++){

        if($scope.school_table[i].details){
          console.log("i="+i)
          $scope.$storage.non_degree[$scope.school_table[i].object_id] = value

        }

      }

     };

      $scope.htmlShare = function(day) {
      
      var reports_ids = [];
      jQuery('.myTab-share a:last').tab('show')
      
      $scope.url = {
            text: null
        };

        App.blocks('#shareReports', 'state_loading');
        
        $scope.copied = false;
        new Clipboard('.btn');
        
        console.log("$scope.$storage.non_degree = "+JSON.stringify($scope.$storage.non_degree));

        
          angular.forEach($scope.$storage.non_degree, function(value, key) {
            
            if(value){
              reports_ids.push($scope.school_report_pair[key][0]);
              reports_ids.push($scope.school_report_pair[key][1]);
            }
          });

          console.log("reports_ids="+JSON.stringify(reports_ids));
      $http({
        url: '/api/upgrid/non_degree/shared_reports',
        method: 'POST',
        data: {
          "reports": reports_ids,
          "expired_day": day,
          "expired_sec": 0,
          
        },
        headers: {
          'Authorization': 'JWT ' + token
        },
        'Content-Type': 'application/json'
    
      }).then(function(response) {
        console.log("share html RESPONSE is "+JSON.stringify(response.data));
     
          App.blocks('#shareReports', 'state_normal');



            // $scope.shared_id = response.data.link.split('/')[0];
            // $scope.shared_token = response.data.link.split('/')[1];

            $scope.expired_time = response.data.expired_time;

            $scope.url = {
                text: 'https://'+location.host + '/#/shared_reports/' + response.data.link +'/',
            };

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        App.blocks('#shareReports', 'state_normal');
      });

    };


  $scope.togglefullen = function() {
    angular.element(document.getElementById("ViewAll")).toggleClass('fullscreen-modal');
  };

  $scope.scrolltop = function() {
    angular.element(document.getElementById('scrolltop_non_degree')).scrollTop(0);
  };

  $scope.setLinkValue = function() {

    var selected_ids = [];
       angular.forEach($scope.$storage.non_degree, function(value, key) {
          if(value){
            selected_ids.push(key)
          }

        });

       console.log("selected_ids="+JSON.stringify(selected_ids))
    

       if(selected_ids.length===0){
          $.notify({

          // options
          icon: "fa fa-warning",
          message: 'Please make a selection from the table.'
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

          $("#myModal1").modal('toggle');
          jQuery('.myTab-share a:first').tab('show');
       }

    


  };



  // $scope.htmlShare = function(day) {
  //   $scope.url = {
  //     text: null
  //   };

  //   $scope.copied = false;
  //   new Clipboard('.btn');


  //   jQuery('.myTab-share a:last').tab('show');

  //   App.blocks('#shareReports', 'state_loading');


  //   App.blocks('#shareReports', 'state_normal');
  //   $scope.url = {
  //     text: 'www.google.com',
  //   };

  //   App.blocks('#shareReports', 'state_normal');




  // };


  $scope.printReport = function() {

    $("#top-report").printThis({
      debug: false,
      importCSS: true,
      importStyle: false,
      printContainer: true,
      loadCSS: "../static/css/print.css",
      pageTitle: "NON-DEGREE TRACKING REPORT",
      removeInline: false,
      printDelay: 333,
      header: null,
      formValues: true
    });
  };

});