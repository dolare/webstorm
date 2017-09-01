/*Exec. Ed. Search Tool controller*/

'use strict';

angular.module('myApp').controller('SearchToolController', ['$q', '$http', '$scope', 'authenticationSvc', '$timeout', 
  function($q, $http, $scope, authenticationSvc, $timeout) {
    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.keywords = ['keyword1', 'keyword2', 'keyword3'];

    
  }
]);