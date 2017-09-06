var comparison = angular.module('myApp')
comparison.controller('ComparisonController',
  function(avatarService, $scope, $http, authenticationSvc, avatarService, $timeout) {

    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId() + '/' : "";

    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";

    // $timeout( function(){
    //         jQuery('.comparison_height').scrollLock();
    //     }, 5000 );

    $http({
      url: '/api/upgrid/non_degree/schools?page_size=100&client_id='+client_id,
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    }).then(function(response) {

      $scope.schools = response.data.results

      console.log("return data" + JSON.stringify($scope.schools, null, 4));

    }).
    catch(function(error) {
      console.log('an error occurred...' + JSON.stringify(error));

    });




    $scope.get_cat1 = function(school_id) {

      if (school_id) {
        $http({
          url: '/api/upgrid/non_degree/schools/' + school_id + '/categories',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function(response) {

          $scope.cat1 = response.data

          console.log("return cat" + JSON.stringify($scope.cat1, null, 4));



        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });

      } else {
        $scope.cat1 = null
        $scope.courses1 = null
      }


    }


    $scope.get_cat2 = function(school_id) {

      if (school_id) {
        $http({
          url: '/api/upgrid/non_degree/schools/' + school_id + '/categories',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function(response) {

          $scope.cat2 = response.data

          console.log("return cat" + JSON.stringify($scope.cat2, null, 4));

        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });
      } else {
        $scope.cat2 = null
        $scope.courses2 = null
      }


    }



    $scope.get_courses1 = function(school_id, cat_id) {

      console.log("school_id=" + school_id + " cat_id=" + cat_id)

      $http({
        url: '/api/upgrid/non_degree/schools/' + school_id + '/categories/' + cat_id + '/courses',
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        $scope.courses1 = response.data;

        angular.forEach($scope.courses1, function(course, key) {
          if (course.course_dates.length > 0 && course.tuition_number && !course.is_advanced_management_program)
            course.edr = getEDR(course.course_dates[0].start_date, course.course_dates[0].end_date, course.tuition_number);
          else
            course.edr = null;
        });

        console.log("return courses" + JSON.stringify($scope.courses1, null, 4));

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });

    }



    $scope.get_courses2 = function(school_id, cat_id) {

      console.log("school_id=" + school_id + " cat_id=" + cat_id)

      $http({
        url: '/api/upgrid/non_degree/schools/' + school_id + '/categories/' + cat_id + '/courses',
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        $scope.courses2 = response.data;

        angular.forEach($scope.courses2, function(course, key) {
          if (course.course_dates.length > 0 && course.tuition_number && !course.is_advanced_management_program)
            course.edr = getEDR(course.course_dates[0].start_date, course.course_dates[0].end_date, course.tuition_number);
          else
            course.edr = null;
        });

        console.log("return courses" + JSON.stringify($scope.courses2, null, 4));

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });

    }

    // Function to calculate EDR (Equivalent Daily Rate), given the course start date, end date and the amount of tuition
    var getEDR = function(startDate, endDate, tuition) {
      var start = new Date(startDate);
      var end = new Date(endDate);
      console.log('Number of days: ' + ((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)));
      return tuition / ((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000) + 1);
    }
  });