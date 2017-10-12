// PartnershipController
'use strict';

angular.module('myApp').
controller('PartnershipController', function(avatarService, executiveService, $scope, $http, authenticationSvc, $localStorage, $sessionStorage) {
	var token = authenticationSvc.getUserInfo().accessToken;

	$scope.partnership_data = [
		{"Client_list":"Ericsson","University_school":"Columbia Business School","Case_study":"http://go-execed.gsb.columbia.edu/l/48172/2017-07-09/5dbtw2/48172/124191/ColumbiaBusinessSchool_Ericsson_CaseStudy.pdf ",},
		{"Client_list":"AmBev","University_school":"Columbia Business School",},
		{"Client_list":"Center for Curatorial Leadership","University_school":"Columbia Business School",},
		{"Client_list":"Cheung Kong Graduate School of Business","University_school":"Columbia Business School",},
		{"Client_list":"China Eastern Airlines","University_school":"Columbia Business School",},
		{"Client_list":"CITIC Private Equity","University_school":"Columbia Business School",},
		{"Client_list":"Credit Suisse","University_school":"Columbia Business School",},
		{"Client_list":"Debevoise and Plimpton","University_school":"Columbia Business School",},
		{"Client_list":"Deloitte ","University_school":"Columbia Business School",},
		{"Client_list":"Deutsche Bank","University_school":"Columbia Business School",},
		{"Client_list":"Deutsche Telekom","University_school":"Columbia Business School",},
		{"Client_list":"Development Bank of Japan","University_school":"Columbia Business School",},
		{"Client_list":"IPADE Business School","University_school":"Columbia Business School",},
		{"Client_list":"Kering","University_school":"Columbia Business School",},
		{"Client_list":"King Khalid Foundation","University_school":"Columbia Business School",},
		{"Client_list":"Novartis Oncology","University_school":"Columbia Business School",},
		{"Client_list":"Pernod Ricard USA","University_school":"Columbia Business School",},
		{"Client_list":"Société Générale","University_school":"Columbia Business School",},
		{"Client_list":"Standard Chartered Bank","University_school":"Columbia Business School",},
		{"Client_list":"Tudor Investment Corporation","University_school":"Columbia Business School",},
		{"Client_list":"A.P Moller-Maersk Group","University_school":"Harvard Business School","Case_study":"https://www.exed.hbs.edu/programs/custom/Documents/client-story-maersk.pdf",},
		{"Client_list":"ZEISS Group","University_school":"Harvard Business School","Case_study":"https://www.exed.hbs.edu/programs/custom/Documents/client-story-zeiss.pdf",},
		{"Client_list":"Católica Lisbon School of Business and Economics","University_school":"Kellogg School of Management Northwestern University",},
		{"Client_list":"Guanghua School of Management","University_school":"Kellogg School of Management Northwestern University",},
		{"Client_list":"Indian School of Business","University_school":"Kellogg School of Management Northwestern University",},
		{"Client_list":"IPADE Business School","University_school":"Kellogg School of Management Northwestern University",},
		{"Client_list":"Sasin Graduate Institute of Business Administration of Chulalongkorn University","University_school":"Kellogg School of Management Northwestern University",},
		{"Client_list":"Seminarium Internacional","University_school":"Kellogg School of Management Northwestern University",},
		{"Client_list":"The American University in Cairo School of Business","University_school":"Kellogg School of Management Northwestern University",},
		{"Client_list":"CISCO","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"ETS","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"ImClone Systems","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"Johnson & Johnson","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"Merck & Co.","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"Motorola","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"Prudential","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"Roche Holding AG","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"Sodexo","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"SonoSite","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"TNT","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"Verizon Wireless","University_school":"Rutgers Business School-Newark and New Brunswick",},
		{"Client_list":"A.P Moller-Maersk Group","University_school":"Stanford Graduate School of Business",},
		{"Client_list":"Cathay Pacific Catering Services","University_school":"Stanford Graduate School of Business",},
		{"Client_list":"New Zealand Merino Wool","University_school":"Stanford Graduate School of Business",},
		{"Client_list":"Schlumberger","University_school":"Stanford Graduate School of Business",},
		{"Client_list":"Valero Energy","University_school":"Stanford Graduate School of Business",},
		{"Client_list":"PepsiCo","University_school":"University of Chicago Booth School of Business","Case_study":"https://www.chicagobooth.edu/executiveeducation/about-us/media-gallery/content/custom-programs/pepsico-partners-with-chicago-booth-client-spotlight",},
		{"Client_list":"Aon PLC","University_school":"University of Chicago Booth School of Business",},
		{"Client_list":"Citigroup Corporate and Investment Banking","University_school":"University of Chicago Booth School of Business",},
		{"Client_list":"The Minnesota Historical Society","University_school":"University of Minnesota Carlson School of Management","Case_study":"https://carlsonschool.umn.edu/executive-education/corporate-services/the-minnesota-historical-society-brings-the-past-the",},
		{"Client_list":"Cenex Harvest States (CHS)","University_school":"University of Minnesota Carlson School of Management","Case_study":"https://carlsonschool.umn.edu/executive-education/for-organizations/case-studies/chs-grows-leaders",},
		{"Client_list":"Polaris","University_school":"University of Minnesota Carlson School of Management","Case_study":"https://carlsonschool.umn.edu/executive-education/for-organizations/case-studies/polaris-revs-up",},
		{"Client_list":"General Mills","University_school":"University of Minnesota Carlson School of Management",},
		{"Client_list":"AIGA","University_school":"Yale School of Management",},
		{"Client_list":"ATD","University_school":"Yale School of Management",},
		{"Client_list":"Seminarium International","University_school":"Yale School of Management",}
	]
	//count the number of clients and schools
	$scope.init_func=function(){
		var client_arr = [];
		var school_arr = [];
		for(var i=0;i<$scope.partnership_data.length;i++){
			var client_track=0,
				school_track=0;
			for (var k=0;k<client_arr.length;k++){
				if(client_arr[k].Client_list==$scope.partnership_data[i].Client_list){
					client_track=1;
				}
			}
			for (var k=0;k<school_arr.length;k++){
				if(school_arr[k].University_school==$scope.partnership_data[i].University_school){
					school_track=1;
				}
			}
			if(client_track==0){
				client_arr.push($scope.partnership_data[i]);
			}
			if(school_track==0){
				school_arr.push($scope.partnership_data[i]);
			}
		}
		$scope.client_num=client_arr.length;
		$scope.school_num=school_arr.length;
	};
	$scope.init_func();
	//click client and sort same logic with school and pdf(case study)
	$scope.sortClient=function(){
		$scope.partnershipFilter('Client_list',$scope.client_sort);
		$scope.school_sort=1;
		$scope.case_sort=1;
		if($scope.client_sort<3){
			$scope.client_sort++
		} else if($scope.client_sort==3){
			$scope.client_sort=1
		};
	}
	// $scope.sortCountry=function(){
	// 	$scope.partnershipFilter('Country',$scope.country_sort);
	// 	if($scope.country_sort<3){
	// 		$scope.country_sort++
	// 	} else if($scope.country_sort==3){
	// 		$scope.country_sort=1
	// 	};
	// }
	$scope.sortSchool=function(){
		$scope.partnershipFilter('University_school',$scope.school_sort);
		$scope.client_sort=1;
		$scope.case_sort=1;
		if($scope.school_sort<3){
			$scope.school_sort++
		} else if($scope.school_sort==3){
			$scope.school_sort=1
		};
	}
	$scope.sortPDF=function(){
		$scope.partnershipFilter('Case_study',$scope.case_sort);
		$scope.client_sort=1;
		$scope.school_sort=1;
		if($scope.case_sort<3){
			$scope.case_sort++
		} else if($scope.case_sort==3){
			$scope.case_sort=1
		};
	}
	
	
	//ng-repeat orderby;
	//custom filter set expression and reverse
	
	$scope.partnershipFilter = function(sort,num){
		if(num==1){
			$scope.filter_str='"'+sort+'"';
			$scope.reverse=false;
		};
		if(num==2){
			$scope.filter_str='"'+sort+'"';
			$scope.reverse=true;
		};
		if(num==3){
			return null;
		}
	}

	//custom pagination
    $scope.pagenumber = 1;
    $scope.pagination_number_arr= [1];	
});