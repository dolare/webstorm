angular.module('myApp').controller('AdminBackdoorController', ['authenticationSvc', '$http', '$scope', '$state', '$stateParams', '$localStorage', '$window',
  function(authenticationSvc, $http, $scope, $state, $stateParams, $localStorage, $window) {

    var token = authenticationSvc.getUserInfo().accessToken;

      
    

  }
]);
