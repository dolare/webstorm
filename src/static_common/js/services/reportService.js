//to generate report
angular.module('reportServiceModule', [])
  .factory('reportService', function($http, $q) {


    var getWhoops = function(Id, token) {

      var deferred = $q.defer();
      $http({
        url: '/api/whoops/',
        method: 'POST',
        data: {
          "object_id":  Id
        },
        headers: {
          'Authorization': 'JWT ' + token
        },

        responseType: 'arraybuffer'

      }).then(function(response) {
        console.log("whoops success");
        var file = new Blob([response.data], {
          type: 'application/pdf'
        });
        var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
        deferred.resolve(fileURL);


      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        deferred.reject(error);
      });
      return deferred.promise;

    };

    //check if one program has whoops report
    var getWhoopsPerfect = function(Id, token) {

      var deferred = $q.defer();

      $http({
        url: '/api/whoops/',
        method: 'POST',
        data: {
          "object_id":  Id
        },
        headers: {
          'Authorization': 'JWT ' + token
        }

      }).then(function(response) {
        deferred.resolve(response.status);

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        deferred.reject(error);
      });

      return deferred.promise;
    }


    var getEnhancement = function(Id, competing, token) {
      var deferred = $q.defer();

      var competingUrl = Id + '/';

      for (j = 0; j < competing.length; j++) {

        competingUrl += competing[j].programId + '/';
      }

      $http({
        url: '/api/enhancement/',
        method: 'POST',
        data: {
              "email": $scope.emailadd
        },
        headers: {
          'Authorization': 'JWT ' + token
        },

        responseType: 'arraybuffer'


      }).then(function(response) {
        console.log("enhancement success");
        var file = new Blob([response.data], {
          type: 'application/pdf'
        });
        var fileURL = (window.URL || window.webkitURL).createObjectURL(file);
        deferred.resolve(fileURL);
      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        deferred.reject(error);
      });

      return deferred.promise;

    };

    var downloadWhoops = function(Id, token) {

      var deferred = $q.defer();
      $http({
        url: '/api/whoops/',
        method: 'POST',
        data: {
          "object_id": Id
        },
        headers: {
          'Authorization': 'JWT ' + token
        },

        responseType: 'arraybuffer'

      }).then(function(response) {
        console.log("whoops success");
        var file = new Blob([response.data], {
          type: 'application/pdf'
        });
        //var fileURL = (window.URL||window.webkitURL).createObjectURL(file);
        deferred.resolve(file);


      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        deferred.reject(error);
      });
      return deferred.promise;

    };

    var downloadEnhancement = function(Id, token) {
      var deferred = $q.defer();

      // var competingUrl = Id + '/';

      // for (j = 0; j < competing.length; j++) {

      //   competingUrl += competing[j].programId + '/';
      // }

      $http({
        url: '/api/enhancement/',
        method: 'POST',
        data: {
              object_id: Id
        },
        headers: {
          'Authorization': 'JWT ' + token
        },

        responseType: 'arraybuffer'


      }).then(function(response) {
        console.log("enhancement success");
        var file = new Blob([response.data], {
          type: 'application/pdf'
        });
        //var fileURL = (window.URL||window.webkitURL).createObjectURL(file);
        deferred.resolve(file);
      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        deferred.reject(error);
      });

      return deferred.promise;

    };

    var confirmProgram = function(obj_id, token) {
      console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      //var deferred = $q.defer();
      return $http({
        url: '/api/changeconfirm/' + obj_id + '/',
        method: 'PUT',
        data: {
          customerconfirmation_status: "Yes"
        },
        headers: {
          'Authorization': 'JWT ' + token
        }

      }).then(function(response) {
        console.log('success confirm');


      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));


      });

      //return deferred.promise;
    };
    var accessControl = function(email, token) {
      
        //console.log('success control whoops');
        return $http({
          url: '/api/WhoopsPermission/',
          method: 'POST',
          data: {
                  "email": email,
                       
                },
          headers: {
            'Authorization': 'JWT ' + token
          }
       
      }).then(function(response) {

        console.log("GOT! Access detail=" + JSON.stringify(response));


      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));


      });

      //return deferred.promise;
    };

    return {
      getWhoops: getWhoops,
      getWhoopsPerfect: getWhoopsPerfect,
      getEnhancement: getEnhancement,
      downloadWhoops: downloadWhoops,
      downloadEnhancement: downloadEnhancement,
      confirmProgram: confirmProgram,
      accessControl: accessControl



    };



  });