angular.module('myApp').factory("ajaxService",
  function($http, $q, $filter, $timeout, executiveService) {


    function getResult(start, number, params, token, enhancement, avatar) {

      var deferred = $q.defer();

      console.log("page num =  " + (start / number + 1));
      console.log("number =" + number);
      console.log("params=" + JSON.stringify(params));
      if (number === 25) {
        console.log("page number 25");

        $http({
          url: "/api/upgrid/user/program/" + (params.search.predicateObject ? ("?name=" + (params.search.predicateObject.programName ? params.search.predicateObject.programName : "") + "&degree=" + (params.search.predicateObject.degreeName ? params.search.predicateObject.degreeName : "") + "&wfs=" + (params.search.predicateObject.whoops_status ? params.search.predicateObject.whoops_status : "") + "&efs=" + (params.search.predicateObject.enhancement_status ? params.search.predicateObject.enhancement_status : "")) : "?") + enhancement + avatar + "&order=" + (params.sort.reverse ? "-" : "") + (params.sort.predicate ? (params.sort.predicate === "programName" ? "oname" : false || params.sort.predicate === "degreeName" ? "degree" : false || params.sort.predicate === "whoops_status" ? "wfs" : false || params.sort.predicate === "enhancement_status" ? "efs" : false) : "oname") + "&page=" + (start / number + 1),
          method: 'GET',

          headers: {
            'Authorization': 'JWT ' + token
          }

        }).then(function(response) {
          //  console.log("response.data.results[0] is "+JSON.stringify(response.data.results[0]));
          // console.log("response.data.results[0].customer.split('#')[1] is "+JSON.stringify(response.data.results[0].customer.split('#')[1]));
          console.log("@@@GOT! ajax detail=" + JSON.stringify(response));
          deferred.resolve({
            raw: response.data,
            data: response.data.results,
            // total: response.data.count,
            // available: parseInt(response.data.results[0].customer.split('#')[1]),
            numberOfPages: Math.ceil(response.data.count / number)
          });
        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });

      } else if (number === 50) {
        console.log("page number 50");
        var part1 = [];
        var part2 = [];

        $http({
          url: "/api/upgrid/user/program/" + (params.search.predicateObject ? ("?name=" + (params.search.predicateObject.programName ? params.search.predicateObject.programName : "") + "&degree=" + (params.search.predicateObject.degreeName ? params.search.predicateObject.degreeName : "") + "&wfs=" + (params.search.predicateObject.whoops_status ? params.search.predicateObject.whoops_status : "") + "&efs=" + (params.search.predicateObject.enhancement_status ? params.search.predicateObject.enhancement_status : "")) : "?") + enhancement + avatar + "&order=" + (params.sort.reverse ? "-" : "") + (params.sort.predicate ? (params.sort.predicate === "programName" ? "oname" : false || params.sort.predicate === "degreeName" ? "degree" : false || params.sort.predicate === "whoops_status" ? "wfs" : false || params.sort.predicate === "enhancement_status" ? "efs" : false) : "oname") + "&page=" + (start / number + 1),
          method: 'GET',

          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function(response) {

          part1 = response.data.results;

          if (!response.data.next) {
            deferred.resolve({
              raw: response.data,
              data: response.data.results,
              // total: response.data.count,
              // available: parseInt(response.data.results[0].customer.split("#")[1]),
              numberOfPages: Math.ceil(response.data.count / number)
            });

          } else {
            $http({
              url: response.data.next + enhancement,
              method: 'GET',

              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function(response) {


              part2 = response.data.results;
              deferred.resolve({
                raw: response.data,
                data: part1.concat(part2),
                // total: response.data.count,
                // available: parseInt(response.data.results[0].customer.split("#")[1]),
                numberOfPages: Math.ceil(response.data.count / number)
              });

              //console.log("_______final result = "+JSON.stringify(part1.concat(part2)));

            }).
            catch(function(error) {
              console.log('an error occurred...' + JSON.stringify(error));

            });

          }


        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });



      }



      return deferred.promise;
    }

    function getPage(start, number, url, params, token, filters) {
      var parsedParams = '';

      parsedParams += '&page=' + (Math.ceil(start / number) + 1);
      parsedParams += '&page_size=' + number;
      parsedParams += '&ordering=' + (params.sort.reverse ? '-' : '') + (params.sort.predicate ? params.sort.predicate : '');
      parsedParams += '&search=' + ((params.search.hasOwnProperty('predicateObject') && params.search.predicateObject.hasOwnProperty('searchValue')) ? params.search.predicateObject.searchValue : '');

      for (var f in filters) {
        if (filters[f] != null) {
          parsedParams += '&' + f + '=' + filters[f];
        }
      }

      var deferred = $q.defer();

      console.log('number = ' + number);
      console.log('tableState: ');
      console.log(params);
      console.log('params = ' + '"' + parsedParams + '"');


      $http({
        url: url + parsedParams,
        method: 'GET',

        headers: {
          'Authorization': 'JWT ' + token
        }

      }).then(function(response) {
        console.log("@@@GOT! ajax response, its data is: ");
        console.log(JSON.stringify(response.data));
        deferred.resolve({
          data: response.data,
          numberOfPages: Math.ceil(response.data.count / number)
        });
      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        deferred.reject('an error occurred...' + JSON.stringify(error));

      });
      return deferred.promise;

    }

    function nonDegree(token) {



      var promise = $http({
          url: '/api/upgrid/non_degree/schools',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        })
        .then(function(response) {

          console.log("return data" + JSON.stringify(response.data.results));
          var school_table = response.data.results

          angular.forEach(school_table, function(value, index) {
            value["details"] = null;
            value["logo_url"] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/LBS_logo_.png/150px-LBS_logo_.png';

            $http({
                url: '/api/upgrid/non_degree/reports?school=' + value.object_id,
                method: 'GET',
                headers: {
                  'Authorization': 'JWT ' + token
                }
              })
              .then(function(result) {
                if (result.data.results.length > 0) {
                  $http({
                      url: '/api/upgrid/non_degree/reports/overview/' + result.data.results[0].object_id + '/' + (result.data.results.length > 1 ? result.data.results[1].object_id : result.data.results[0].object_id),
                      method: 'GET',
                      headers: {
                        'Authorization': 'JWT ' + token
                      }
                    })
                    .then(function(numbers) {

                      console.log("numbers" + JSON.stringify(numbers))
                      value["details"] = {};

                      value.details["course_removed"] = numbers.data.course_removed
                      value.details["course_added"] = numbers.data.course_added
                      value.details["category_added"] = numbers.data.category_added
                      value.details["category_removed"] = numbers.data.category_removed



                    }).
                  catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));
                  });
                }
              }).
            catch(function(error) {
              console.log('an error occurred...' + JSON.stringify(error));
            });
          })

          return school_table;
          console.log("school_table = " + JSON.stringify(school_table));
        }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
      });

      return promise;

    }

    function getReleasePreviewData(schoolId, token) {
      var deferred = $q.defer();
      $q.all({
        // Get the report list
        reports: $http({
          url: '/api/upgrid/non_degree/reports?school=' + schoolId + '&active=True',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        }),
        // Get the current school programs' data
        currentData: $http({
          url: '/api/upgrid/non_degree/schools/' + schoolId,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        })
      }).then(function(response) {
        var reports = response.reports.data; // Report list
        var currentData = response.currentData.data; // Current school data

        console.log('Loaded report list. There are ' + reports.results.length + ' reports');
        console.log('Loaded current data of ' + currentData.school);

        var readyToRelease = false;
        var report_last = {};
        var report_compared = {};

        // Get the compared data between the current data(school's current data) and the previous report

        // If there is no previous report 
        if (reports.count == 0) {
          report_compared = currentData;
          console.log('No previous report.');
          readyToRelease = true;
          deferred.resolve({
            currentData: currentData,
            report_last: report_last,
            report_compared: report_compared,
            readyToRelease: readyToRelease
          });
        }
        // Else there would be a previous report, then get that report.
        else {
          $http({
            url: '/api/upgrid/non_degree/reports/' + reports.results[0].object_id,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(resp_report_last) {
            console.log('Loaded the last report of ' + resp_report_last.data.school_name);

            report_last = resp_report_last.data;

            report_compared = executiveService.updatedReport(report_last, currentData);

            console.log('Got compared results!');
            console.log('Last report: ');
            console.log(angular.toJson(report_last, 2));
            console.log('Current data: ');
            console.log(angular.toJson(currentData, 2));
            console.log('Compared report: ');
            console.log(angular.toJson(report_compared, 2));

            if (angular.toJson(report_compared.categories) != angular.toJson(currentData.categories)) {
              console.log('Update is found.');
              readyToRelease = true;
            }
            else {
              console.log('No update.');
              readyToRelease = false;
            }
            deferred.resolve({
              currentData: currentData,
              report_last: report_last,
              report_compared: report_compared,
              readyToRelease: readyToRelease
            });
          });
        }

      }).catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        deferred.reject('an error occurred...' + JSON.stringify(error));
      });

      return deferred.promise;
    }


    // backdoor service

    function backDoor(api_url, start, number, params, token, avatar) {

      var deferred = $q.defer();

     
      console.log("page num =  " + (start / number + 1));
      console.log("number =" + number);
      console.log("params=" + JSON.stringify(params));

      console.log("page number 25");

      $http({
        url: api_url + (params.search.predicateObject ? ("?search=" + (params.search.predicateObject.customer_program ? params.search.predicateObject.customer_program : "")) : ""),
        method: 'GET',

        headers: {
          'Authorization': 'JWT ' + token
        }

      }).then(function(response) {
        //  console.log("response.data.results[0] is "+JSON.stringify(response.data.results[0]));
        // console.log("response.data.results[0].customer.split('#')[1] is "+JSON.stringify(response.data.results[0].customer.split('#')[1]));

        console.log("@@@GOT! ajax detail=" + JSON.stringify(response));
        deferred.resolve({
          raw: response.data,
          data: response.data.results,
          // total: response.data.count,
          // available: parseInt(response.data.results[0].customer.split('#')[1]),
          numberOfPages: Math.ceil(response.data.count / number)
        });
      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });


      return deferred.promise;
    }




    return {
      getResult: getResult,
      getPage: getPage,
      nonDegree: nonDegree,
      getReleasePreviewData: getReleasePreviewData,
      backDoor: backDoor
    };

  });