/*AMP controller*/
'use strict';

angular.module('myApp').
controller('AMPController', function(executiveService, $scope, $http, authenticationSvc, $localStorage, $sessionStorage) {
  var token = authenticationSvc.getUserInfo().accessToken;
  $scope.$storage = $localStorage;

  //console.log("table = "+JSON.stringify(Table));

  $scope._ = _;
 

  $http({
      url:'/api/upgrid/non_degree/schools?is_AMP=True',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function(response) {
      $scope.school_table = response.data.results
      
        console.log("school_table = "+JSON.stringify($scope.school_table));

        angular.forEach($scope.school_table, function(value, index) {
        
         value["logo_url"] = executiveService.getLogoBySchoolName(value.school, value.university)

          $http({
            url: '/api/upgrid/non_degree/schools/' + value.object_id + '/courses',
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(result) {

            value["courses"] = result.data.results;

            console.log("result = "+JSON.stringify(result.data));

          }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));
          });


       })

      }).catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));
      });


      $scope.showUrl = function (parentIndex, Index){


          $http({
            url: '/api/upgrid/non_degree/schools/' + $scope.school_table[parentIndex].object_id + '/courses/' + $scope.school_table[parentIndex].courses[Index].object_id + '/urls',
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(response) {

            //value["courses"] = result.data.results;

            console.log("response = "+JSON.stringify(response.data));
            $scope.urls = response.data.results;

            $scope.school_table[parentIndex].courses[Index]['urls'] = $scope.urls;


          }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));
          });

      }


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