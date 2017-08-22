angular.module('myApp')
.factory('nonDegreeWhoopsService', ['$http', '$q', '$filter', '$timeout', function ($http, $q, $filter, $timeout) {

//this would be the service to call your server, a standard bridge between your model an $http

// the database (normally on your server)
var randomsItems = [];


//fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
//in our case, it actually performs the logic which would happened in the server
function getPage(start, number, params, token) {
      var parsedParams = '';

      parsedParams += '&page=' + (Math.ceil(start / number) + 1);
      parsedParams += '&page_size=' + number;

      var deferred = $q.defer();

      console.log('number = ' + number);
      console.log('tableState: ');
      console.log(params);
      console.log('params = ' + '"' + parsedParams + '"');


      $http({
        url: '/api/upgrid/non_degree/whoops_reports?'+ parsedParams,
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

return {
    getPage: getPage
};

}]);