var comparison = angular.module('myApp')
comparison.controller('ComparisonController',
  function($scope, $http, authenticationSvc, avatarService) {

  	var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId()+'/' : "";

  	 $http({
          url: '/api/upgrid/non_degree/schools?page_size=100',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       $scope.schools = response.data.results

       console.log("return data"+ JSON.stringify($scope.schools, null, 4));
       
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });




     $scope.get_cat1 = function(school_id){

     	if(school_id) {
     		$http({
          url: '/api/upgrid/non_degree/schools/'+ school_id +  '/categories',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       $scope.cat1 = response.data

       console.log("return cat"+ JSON.stringify($scope.cat1, null, 4));
       
       

    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });

     	} else {
     		$scope.cat1 = null
     		$scope.courses1 = null
     	}
     	
     	
     }


     $scope.get_cat2 = function(school_id){
     	
     	if(school_id){
     		$http({
          url: '/api/upgrid/non_degree/schools/'+ school_id +  '/categories',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       $scope.cat2 = response.data

       console.log("return cat"+ JSON.stringify($scope.cat2, null, 4));
       
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });
     	} else {
     		$scope.cat2 = null
     		$scope.courses2 = null
     	}
     	

     }



     $scope.get_courses1 = function(school_id, cat_id) {
     	
     	console.log("school_id="+school_id+" cat_id="+cat_id)

     	$http({
          url: '/api/upgrid/non_degree/schools/'+ school_id +  '/categories/' + cat_id + '/courses',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
	    }).then(function (response) {

	       $scope.courses1 = response.data

	       console.log("return courses"+ JSON.stringify($scope.courses1, null, 4));
	       
	    }).
	     catch(function(error){
	        console.log('an error occurred...'+JSON.stringify(error));

	     });

     }



     $scope.get_courses2 = function(school_id, cat_id) {
     	
     	console.log("school_id="+school_id+" cat_id="+cat_id)

     	$http({
          url: '/api/upgrid/non_degree/schools/'+ school_id +  '/categories/' + cat_id + '/courses',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
	    }).then(function (response) {

	       $scope.courses2 = response.data

	       console.log("return courses"+ JSON.stringify($scope.courses2, null, 4));
	       
	    }).
	     catch(function(error){
	        console.log('an error occurred...'+JSON.stringify(error));

	     });

     }


  });
