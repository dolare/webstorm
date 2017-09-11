angular.module('myApp')
.factory('nonDegreeWhoopsService', ['avatarService', '$http', '$q', '$filter', '$timeout', function (avatarService, $http, $q, $filter, $timeout) {



  var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";
//this would be the service to call your server, a standard bridge between your model an $http

// the database (normally on your server)

//fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
//in our case, it actually performs the logic which would happened in the server
    function getPage(start, number, params, token, filter) {
          var deferred = $q.defer();
          var parsedParams = '';

          for (var filed in filter) {
            if (filter.hasOwnProperty(filed)) {
               parsedParams += '&' + filed + '=' + filter[filed]
            }
          }

          parsedParams += '&page=' + (Math.ceil(start / number) + 1);
          parsedParams += '&page_size=' + number;

          $http({
            url: '/api/upgrid/non_degree/whoops_reports?'+ parsedParams + '&client_id='+client_id,
            method: 'GET',

            headers: {
              'Authorization': 'JWT ' + token
            }

          }).then(function(response) {
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

    return {
        getPage: getPage
    };

}]);