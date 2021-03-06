
angular.module('myApp').
controller('ShareExecutiveController', ['$timeout', '$stateParams', '$scope', '$location', '$window', '$http', '$state', 'orderByFilter', 'executiveService', function($timeout, $stateParams, $scope, $location, $window, $http, $state, orderBy, executiveService) {
			
		$scope.isShared = true;

		// Introduce Underscore.js;
  		$scope._ = _;

		$scope.currency_symbols = executiveService.getCurrencySymbols();

		
		App.blocks('#sharedTrackingReport_loading', 'state_loading');
		
		console.log("share executive, URL params = "+$stateParams.param1+'/'+$stateParams.param2+'/');


		$http({
			url: '/api/upgrid/non_degree/shared_reports/'+$stateParams.param1+'/'+$stateParams.param2,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function (response) {

			console.log("shared executive, # of reports: "+ response.data.reports.length)

			$scope.date = response.data.date_created;

			$scope.expired_time = response.data.expired_time;
			
			$scope.schools = [];

			$scope.show_school = {};

			// Sort schools by school ID so that reports of same school are put in pairs
			var reports = orderBy(response.data.reports, 'school');
			// Put the earlier released report first in school report pairs
			for (var i = reports.length - 1; i >= 1; i-=2) {
				if (new Date(reports[i-1].date_created) > new Date(reports[i].date_created))
					reports.swap(i, i-1);
				// In each pair, compare one to the other, get compared report for each school
				$scope.schools.push(executiveService.updatedReport(reports[i-1], reports[i]));
				console.log('#' + ((i - 1) / 2) + ' report comparison done');
			}
			// Order schools by their names
			$scope.schools = orderBy($scope.schools, 'school_name');

			for (var j = $scope.schools.length - 1; j >= 0; j--) {
				var s = $scope.schools[j];
				s.logo_url = executiveService.getLogoBySchoolName(s.school_name, s.university_name);

				// Category offerings
				s.category_offer = s.categories.length - _.where(s.categories, {updated: 2}).length;

				// Course offerings
				s.course_offer = _.uniq(_.difference(_.flatten(_.pluck(s.categories, 'courses')), _.where(_.flatten(_.pluck(s.categories, 'courses')), {updated: 2})), 'object_id').length;

				s.category_added = _.where(s.categories, {updated: 1}).length;

                s.category_removed = _.where(s.categories, {updated: 2}).length;

                s.course_added = 0;

                s.course_removed = 0;

                for (var k = s.categories.length - 1; k >= 0; k--) {
                  s.course_added += _.where(s.categories[k].courses, {updated: 1}).length;
                  s.course_removed += _.where(s.categories[k].courses, {updated: 2}).length;
                  s.categories[k].course_offer = _.difference(s.categories[k].courses, _.where(s.categories[k].courses, {updated: 2})).length;
                  s.categories[k].course_added = _.filter(s.categories[k].courses, {updated: 1}).length;
                  s.categories[k].course_removed = _.filter(s.categories[k].courses, {updated: 2}).length;

                }
			}

			App.blocks('#sharedTrackingReport_loading', 'state_normal');

		}).catch(function(error){
		console.log('an error occurred...'+JSON.stringify(error));

 		});






					 


}]);

Array.prototype.swap = function(e1, e2) {
	this[e1] = this.splice(e2, 1, this[e1])[0];
	return this;
}
