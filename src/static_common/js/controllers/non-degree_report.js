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
		    'null': '$', // default as US Dollar
		};
		$scope.fxConvert = function(amount, currency) {
			return amount / $scope.fxRates.rates[currency];
		}
	});

	$http.get('/static/data/non-degree_report.json').then(function(response) {
		$scope.schools = response.data;
		$scope.date = new Date().toISOString();
		for (let i = $scope.schools.length - 1; i >= 0; i--) {
			let s = $scope.schools[i];
			// category offerings
			s.cat_offer = 0;

			s.course_offer = 0; // school course offerings
			s.course_add = 0; // school course additions
			s.course_rm = 0; // school course removals

			// category additions
			s.cat_add = 0;

			// category removals
			s.cat_rm = 0;

			for (let j = 0; j < s.categories.length; j++) {
				let c = s.categories[j]; // category course offerings
				if (c.status == 'add') {
					s.cat_add++;
					s.cat_offer++;
				}
				else if (c.status == 'rm')
					s.cat_rm++;
				else
					s.cat_offer++;

				c.course_offer = 0;
				c.course_add = 0; // category course additions
				c.course_rm = 0; // category course removals
				for (let k in c.courses) {
					if (c.courses[k].status == 'add') {
						c.course_add++;
						c.course_offer++;
					}
					else if (c.courses[k].status == 'rm')
						c.course_rm++;
					else
						c.course_offer++;
				}

				s.course_offer += c.course_offer;
				s.course_add += c.course_add;
				s.course_rm += c.course_rm;
			}
		}
	});

	$scope.statusComparator = function (status1, status2) {
		var order = {
			'add': 0,
			'rm': 1,
			'uc': 2
		};

		return (order[status1] < order[status2]) ? -1 : 1;
	}
}]);