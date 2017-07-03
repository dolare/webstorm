/*Non-degree controller*/

'use strict';

angular.module('myApp').controller('NonDegreeReportController', ['$scope', '$http', function($scope, $http) {
	$http.get('http://api.fixer.io/latest?base=USD').then(function(response) {
		$scope.fxRates = response.data;
		$scope.currency_symbols = {
		    'USD': '$', // US Dollar
		    'EUR': '€', // Euro
		    'CRC': '₡', // Costa Rican Colón
		    'GBP': '£', // British Pound Sterling
		    'ILS': '₪', // Israeli New Sheqel
		    'INR': '₹', // Indian Rupee
		    'JPY': '¥', // Japanese Yen
		    'KRW': '₩', // South Korean Won
		    'NGN': '₦', // Nigerian Naira
		    'PHP': '₱', // Philippine Peso
		    'PLN': 'zł', // Polish Zloty
		    'PYG': '₲', // Paraguayan Guarani
		    'THB': '฿', // Thai Baht
		    'UAH': '₴', // Ukrainian Hryvnia
		    'VND': '₫', // Vietnamese Dong
		    'CNY': '¥', // Chinese Yuan
		};
		$scope.fxConvert = function(amount, currency) {
			return amount / $scope.fxRates.rates[currency];
		}
	});
	$http.get('/static/data/non-degree_report.json').then(function(response) {
		$scope.universities = response.data.data;
		$scope.date = response.data.date;
		for (let i = 0; i < $scope.universities.length; i++) {
			let u = $scope.universities[i];
			// category offerings
			u.cat_offer = u.categories.length;

			u.course_offer = 0; // university course offerings
			u.course_add = 0; // university course additions
			u.course_rm = 0; // university course removals

			// category additions
			u.cat_add = 0;

			// category removals
			u.cat_rm = 0;

			for (let j = 0; j < u.categories.length; j++) {
				let c = u.categories[j]; // category course offerings
				if(c.status == 'add')
					u.cat_add++;
				if(c.status == 'rm')
					u.cat_rm++;

				c.course_offer = c.courses.length;
				c.course_add = 0; // category course additions
				c.course_rm = 0; // category course removals
				for (let k in c.courses) {
					if(c.courses[k].status == 'add')
						c.course_add++;
					if(c.courses[k].status == 'rm')
						c.course_rm++;
				}

				u.course_offer += c.course_offer;
				u.course_add += c.course_add;
				u.course_rm += c.course_rm;
			}
		}
	});
}]);