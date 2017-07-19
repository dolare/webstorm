/*Non-degree controller*/
'use strict';

angular.module('myApp').
controller('NonDegreeController', function($scope, $http, authenticationSvc, $localStorage, $sessionStorage, executiveService) {
  var token = authenticationSvc.getUserInfo().accessToken;
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
      'null': '$', // The default currency sign is USD
    };

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
    .then(function(response) {

       console.log("return data"+ JSON.stringify(response.data.results));
       $scope.school_table = response.data.results
       $scope.school_report_pair = {};

        angular.forEach($scope.school_table, function(value, index) {
         value["details"] = null;
        
         value["logo_url"] = executiveService.getLogoBySchoolName(value.school, value.university)

         //console.log("value = "+JSON.stringify(value));


          $http({
            url: '/api/upgrid/non_degree/reports?school=' + value.object_id,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(response) {

            
            
            if(response.data.results.length>0) {



              console.log("++++++++value.object_id="+value.object_id);
              console.log("++++++++response.data.results[0].object_id="+response.data.results[0].object_id);
              
              $scope.school_report_pair[value.object_id] = [];
              $scope.school_report_pair[value.object_id].push(response.data.results[0].object_id);
              $scope.school_report_pair[value.object_id].push(response.data.results.length>1? response.data.results[1].object_id:response.data.results[0].object_id)

              console.log("$scope.school_report_pair="+JSON.stringify($scope.school_report_pair))
              $http({
                    url: '/api/upgrid/non_degree/reports/overview/' + response.data.results[0].object_id + '/' + (response.data.results.length>1? response.data.results[1].object_id:response.data.results[0].object_id),
                    method: 'GET',
                    headers: {
                      'Authorization': 'JWT ' + token
                    }
                  })
                  .then(function(response) {
                    
                    value["details"] = {};

                    value.details["course_removed"] = response.data.course_removed
                    value.details["course_added"] = response.data.course_added
                    value.details["category_added"] = response.data.category_added
                    value.details["category_removed"] = response.data.category_removed

                    $scope.$storage.non_degree[value.object_id] = true;
                    


                  }).
                   catch(function(error){
                      console.log('an error occurred...'+JSON.stringify(error));
                  });
               } else {


               }


            }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));
            });
        })


        console.log("school_table = "+JSON.stringify($scope.school_table));
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));
    });




     //view the reports

     $scope.view_report = function () {

      $scope.open_legend = false;
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

        jQuery('#ViewAll').modal('toggle');

        App.blocks('#viewall_loading', 'state_loading');

        $scope.schools = [];

        $scope.show_school = {};

        //one id for one school
        angular.forEach(selected_ids, function(value, index) {

          var report_history = [];
          var new_school_data;
          var old_school_data;
          var school_data_temp;

          console.log("value = "+value)

          $http({
            url: '/api/upgrid/non_degree/reports?school=' + value,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(response) {

            console.log("history ver.="+JSON.stringify(response.data.results))
            //report_history = response.data.results;

            report_history = angular.copy(response.data.results)

            console.log("test_id_new="+report_history[0].object_id);

            return $http({
              url: '/api/upgrid/non_degree/reports/' + report_history[0].object_id,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
              });
            }).then(function(result) {

              // $scope.new_school_data = response


            console.log("new school data ="+JSON.stringify(result.data))
            new_school_data = result.data;

            new_school_data["logo_url"] = executiveService.getLogoBySchoolName(new_school_data.school_name, new_school_data.university_name)

            var test_id = (report_history.length === 1 ? report_history[0].object_id : report_history[1].object_id);
            console.log("test_id="+test_id)

             return $http({
                url: '/api/upgrid/non_degree/reports/' + (report_history.length === 1 ? report_history[0].object_id : report_history[1].object_id),
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

                return $http({
                    url: '/api/upgrid/non_degree/reports/overview/' + report_history[0].object_id + '/' + (report_history.length === 1 ? report_history[0].object_id : report_history[1].object_id),
                    method: 'GET',
                    headers: {
                      'Authorization': 'JWT ' + token
                    }
                  });

              }).then(function(overview_result) {

                school_data_temp["course_removed"] = overview_result.data.course_removed
                school_data_temp["course_added"] = overview_result.data.course_added
                school_data_temp["category_added"] = overview_result.data.category_added
                school_data_temp["category_removed"] = overview_result.data.category_removed

                $scope.schools.push(school_data_temp)

                App.blocks('#viewall_loading', 'state_normal');
                console.log("$scope.schools after ="+JSON.stringify($scope.schools));


                var test_pluck = _.pluck($scope.schools[0].categories, 'courses')
                console.log("COURSESESE = "+JSON.stringify(test_pluck))
                var test_union = _.union(test_pluck)
                var test_flatten = _.flatten(test_pluck);
                console.log("TEST_FLATTEN"+JSON.stringify(test_flatten))
                console.log("TEST_FIND"+JSON.stringify(_.filter(test_flatten, {updated: 2})));
                var test_without = _.difference(test_flatten, _.filter(test_flatten, {updated: 2}))
                console.log("COURSESESE_haha = "+ _.uniq(_.difference(_.flatten(_.pluck($scope.schools[0].categories, 'courses')), _.filter(_.flatten(_.pluck($scope.schools[0].categories, 'courses')), {updated: 2})), 'object_id').length);
                

              }).
               catch(function(error){
                  console.log('an error occurred...'+JSON.stringify(error));
              });




        })

        

       }
     }


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
                text: 'https://'+location.host + '/#/' + response.data.link +'/',
            };

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        App.blocks('#shareReports', 'state_normal');
      });

    };


////////////////////////////////////////////////////////////


  // // Retrieve the list of subsribed schools
  // $http({
  //     url: '/api/upgrid/non_degree/schools',
  //     method: 'GET',
  //     headers: {
  //       'Authorization': 'JWT ' + token
  //     }
  //   })
  //   .then(function(resp_schools) {

  //     $scope.school_list = resp_schools.data.results;


  //     for (let i = $scope.school_list.length - 1; i >= 0; i--) {
  //       let s = $scope.school_list[i];
  //       s.selected = false;
  //       s.logo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/LBS_logo_.png/150px-LBS_logo_.png';

  //       /*

  //       Update stats for this school: 
  //       s.cat_add: category additions
  //       s.cat_rm: category removals
  //       s.course_add: course additions
  //       s.course_rm: course removals

  //       Their default values are null, which mean no reports released.

  //       */
  //       s.cat_add = null;
  //       s.cat_rm = null;
  //       s.course_add = null;
  //       s.course_rm = null;

  //       // True if there is at least one repleased report of this school
  //       s.hasReport = false;

  //       //Retrieve the list of reports for a school
  //       $http({
  //           url: '/api/upgrid/non_degree/reports?school=' + s.object_id,
  //           method: 'GET',
  //           headers: {
  //             'Authorization': 'JWT ' + token
  //           }
  //         })
  //         .then(function(resp_reports) {

            
  //           // School has only 1 report
  //           if (resp_reports.data.results.length == 1) {
  //             s.cat_add = 0;
  //             s.cat_rm = 0;
  //             s.course_add = 0;
  //             s.course_rm = 0;

  //             s.hasReport = true;
  //           }
  //           // School has at least 2 reports
  //           else if (resp_reports.data.results.length > 1) {
  //             // Retrieve stats of updates of the two latest reports
  //             $http({
  //                 url: '/api/upgrid/non_degree/reports/overview/' + resp_reports.data.results[0].object_id + '/' + resp_reports.data.results[1].object_id,
  //                 method: 'GET',
  //                 headers: {
  //                   'Authorization': 'JWT ' + token
  //                 }
  //               })
  //               .then(function(resp_overview) {
  //                 s.cat_add = resp_overview.data.category_added;
  //                 s.cat_rm = resp_overview.data.category_removed;
  //                 s.course_add = resp_overview.data.course_added;
  //                 s.course_rm = resp_overview.data.course_removed;
  //               });

  //             s.hasReport = true;
  //           }
  //         });
  //     }

  //     // Watch school for changes
  //     $scope.$watch('school_list | filter: {selected: true}', function(nv) {
  //       $scope.selectedSchoolIds = nv.map(function(school) {
  //         return school.object_id;
  //       });
  //       console.log($scope.selectedSchoolIds);
  //     }, true);



  //   }).
  //    catch(function(error){
  //       console.log('an error occurred...'+JSON.stringify(error));

  //   });






  // // View selected schools
  // $scope.viewReport = function() {
  //   // $scope.selectedSchools = filterFilter($scope.school_list, {selected: true});
  //   console.log($scope.selectedSchoolIds);

    
  // };

  /*Non-degree Report Controller*/
  // $http.get('http://api.fixer.io/latest?base=USD').then(function(response) {
  //   $scope.fxRates = response.data;
  //   $scope.currency_symbols = {
  //     'USD': '$', // US Dollar
  //     'EUR': '€', // Euro
  //     'CRC': '₡', // Costa Rican Colón
  //     'GBP': '£', // British Pound Sterling
  //     'ILS': '₪', // Israeli New Sheqel
  //     'INR': '₹', // Indian Rupee
  //     'JPY': '¥', // Japanese Yen
  //     'KRW': '₩', // South Korean Won
  //     'NGN': '₦', // Nigerian Naira
  //     'PHP': '₱', // Philippine Peso
  //     'PLN': 'zł', // Polish Zloty
  //     'PYG': '₲', // Paraguayan Guarani
  //     'THB': '฿', // Thai Baht
  //     'UAH': '₴', // Ukrainian Hryvnia
  //     'VND': '₫', // Vietnamese Dong
  //     'CNY': '¥', // Chinese Yuan
  //   };
  //   $scope.fxConvert = function(amount, currency) {
  //     return amount / $scope.fxRates.rates[currency];
  //   }
  // });
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

});