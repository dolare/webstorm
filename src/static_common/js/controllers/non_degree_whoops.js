var non_degree_whoops = angular.module('myApp')
non_degree_whoops.controller('NonDegreeWhoopsController',
  function($scope, $http, authenticationSvc, avatarService, $timeout) {

  	var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId()+'/' : "";


  	 $http({
          url: '/api/upgrid/non_degree/whoops_reports?starred=False&completed=False',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       $scope.whoops_active = response.data.results

       console.log("successful..............");
       console.log(response);
       console.log("return data"+ JSON.stringify($scope.whoops_active, null, 4));

    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });

  	 $http({
          url: '/api/upgrid/non_degree/whoops_reports?starred=True&completed=False',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       $scope.whoops_starred = response.data.results

       console.log("successful..............");
       console.log(response);
       console.log("return data"+ JSON.stringify($scope.whoops_active, null, 4));

    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });

  	 $http({
          url: '/api/upgrid/non_degree/whoops_reports?completed=True',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       $scope.whoops_completed = response.data.results

       console.log("successful..............");
       console.log(response);
       console.log("return data"+ JSON.stringify($scope.whoops_active, null, 4));

    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });

    jQuery(function(){ BasePagesProjectsView.init(); });


//     $scope.get_cat1 = function(school_id){
//
//     	if(school_id) {
//     		$http({
//          url: '/api/upgrid/non_degree/schools/'+ school_id +  '/categories',
//          method: 'GET',
//          headers: {
//            'Authorization': 'JWT ' + token
//          }
//    }).then(function (response) {
//
//       $scope.cat1 = response.data
//
//       console.log("return cat"+ JSON.stringify($scope.cat1, null, 4));
//
//
//
//    }).
//     catch(function(error){
//        console.log('an error occurred...'+JSON.stringify(error));
//
//     });
//
//     	} else {
//     		$scope.cat1 = null
//     		$scope.courses1 = null
//     	}
//
//
//     }
//
//
//     $scope.get_cat2 = function(school_id){
//
//     	if(school_id){
//     		$http({
//          url: '/api/upgrid/non_degree/schools/'+ school_id +  '/categories',
//          method: 'GET',
//          headers: {
//            'Authorization': 'JWT ' + token
//          }
//    }).then(function (response) {
//
//       $scope.cat2 = response.data
//
//       console.log("return cat"+ JSON.stringify($scope.cat2, null, 4));
//
//    }).
//     catch(function(error){
//        console.log('an error occurred...'+JSON.stringify(error));
//
//     });
//     	} else {
//     		$scope.cat2 = null
//     		$scope.courses2 = null
//     	}
//
//
//     }
//
//
//
//     $scope.get_courses1 = function(school_id, cat_id) {
//
//     	console.log("school_id="+school_id+" cat_id="+cat_id)
//
//     	$http({
//          url: '/api/upgrid/non_degree/schools/'+ school_id +  '/categories/' + cat_id + '/courses',
//          method: 'GET',
//          headers: {
//            'Authorization': 'JWT ' + token
//          }
//	    }).then(function (response) {
//
//	       $scope.courses1 = response.data
//
//	       console.log("return courses"+ JSON.stringify($scope.courses1, null, 4));
//
//	    }).
//	     catch(function(error){
//	        console.log('an error occurred...'+JSON.stringify(error));
//
//	     });
//
//     }
//
//
//
//     $scope.get_courses2 = function(school_id, cat_id) {
//
//     	console.log("school_id="+school_id+" cat_id="+cat_id)
//
//     	$http({
//          url: '/api/upgrid/non_degree/schools/'+ school_id +  '/categories/' + cat_id + '/courses',
//          method: 'GET',
//          headers: {
//            'Authorization': 'JWT ' + token
//          }
//	    }).then(function (response) {
//
//	       $scope.courses2 = response.data
//
//	       console.log("return courses"+ JSON.stringify($scope.courses2, null, 4));
//
//	    }).
//	     catch(function(error){
//	        console.log('an error occurred...'+JSON.stringify(error));
//
//	     });
//
//     }


  });
