// PartnershipController
'use strict';

angular.module('myApp').
controller('PartnershipController', function(avatarService, executiveService, $scope, $timeout, $http, authenticationSvc, $localStorage, $sessionStorage) {
	var token = authenticationSvc.getUserInfo().accessToken;

	$scope.partnership_data = [
{"Client_list":"Ericsson","Country":"Sweden","University_school":"Columbia Business School","Case Study":"http://go-execed.gsb.columbia.edu/l/48172/2017-07-09/5dbtw2/48172/124191/ColumbiaBusinessSchool_Ericsson_CaseStudy.pdf ",},
{"Client_list":"AmBev","Country":"Brazil","University_school":"Columbia Business School",},
{"Client_list":"Center for Curatorial Leadership","Country":"USA","University_school":"Columbia Business School",},
{"Client_list":"Cheung Kong Graduate School of Business","Country":"China","University_school":"Columbia Business School",},
{"Client_list":"China Eastern Airlines","Country":"China","University_school":"Columbia Business School",},
{"Client_list":"CITIC Private Equity","Country":"China","University_school":"Columbia Business School",},
{"Client_list":"Credit Suisse","Country":"Switzerland","University_school":"Columbia Business School",},
{"Client_list":"Debevoise and Plimpton","Country":"USA","University_school":"Columbia Business School",},
{"Client_list":"Deloitte ","Country":"UK  ","University_school":"Columbia Business School",},
{"Client_list":"Deutsche Bank","Country":"Germany","University_school":"Columbia Business School",},
{"Client_list":"Deutsche Telekom","Country":"Germany","University_school":"Columbia Business School",},
{"Client_list":"Development Bank of Japan","Country":"Japan","University_school":"Columbia Business School",},
{"Client_list":"IPADE Business School","Country":"Mexico","University_school":"Columbia Business School",},
{"Client_list":"Kering","Country":"France","University_school":"Columbia Business School",},
{"Client_list":"King Khalid Foundation","Country":"Saudi Arabia","University_school":"Columbia Business School",},
{"Client_list":"Novartis Oncology","Country":"Switzerland","University_school":"Columbia Business School",},
{"Client_list":"Pernod Ricard USA","Country":"USA","University_school":"Columbia Business School",},
{"Client_list":"Société Générale","Country":"France","University_school":"Columbia Business School",},
{"Client_list":"Standard Chartered Bank","Country":"UK  ","University_school":"Columbia Business School",},
{"Client_list":"Tudor Investment Corporation","Country":"USA","University_school":"Columbia Business School",},
{"Client_list":"A.P Moller-Maersk Group","Country":"Denmark","University_school":"Harvard Business School","Case Study":"https://www.exed.hbs.edu/programs/custom/Documents/client-story-maersk.pdf",},
{"Client_list":"ZEISS Group","Country":"Germany","University_school":"Harvard Business School","Case Study":"https://www.exed.hbs.edu/programs/custom/Documents/client-story-zeiss.pdf",},
{"Client_list":"Católica Lisbon School of Business and Economics","Country":"Portugal","University_school":"Kellogg School of Management Northwestern University",},
{"Client_list":"Guanghua School of Management","Country":"China","University_school":"Kellogg School of Management Northwestern University",},
{"Client_list":"Indian School of Business","Country":"India","University_school":"Kellogg School of Management Northwestern University",},
{"Client_list":"IPADE Business School","Country":"Mexico","University_school":"Kellogg School of Management Northwestern University",},
{"Client_list":"Sasin Graduate Institute of Business Administration of Chulalongkorn University","Country":"Thailand","University_school":"Kellogg School of Management Northwestern University",},
{"Client_list":"Seminarium Internacional","Country":"Chile","University_school":"Kellogg School of Management Northwestern University",},
{"Client_list":"The American University in Cairo School of Business","Country":"Egypt","University_school":"Kellogg School of Management Northwestern University",},
{"Client_list":"CISCO","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"ETS","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"ImClone Systems","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"Johnson & Johnson","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"Merck & Co.","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"Motorola","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"Prudential Financial","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"Roche Holding AG","Country":"Switzerland","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"Sodexo","Country":"France","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"SonoSite","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"TNT","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"Verizon Wireless","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick",},
{"Client_list":"A.P Moller-Maersk Group","Country":"Denmark","University_school":"Stanford Graduate School of Business",},
{"Client_list":"Cathay Pacific Catering Services","Country":"Hong Kong","University_school":"Stanford Graduate School of Business",},
{"Client_list":"New Zealand Merino Wool","Country":"New Zealand","University_school":"Stanford Graduate School of Business",},
{"Client_list":"Schlumberger","Country":"USA","University_school":"Stanford Graduate School of Business",},
{"Client_list":"Valero Energy","Country":"USA","University_school":"Stanford Graduate School of Business",},
{"Client_list":"PepsiCo","Country":"USA","University_school":"University of Chicago Booth School of Business","Case Study":"https://www.chicagobooth.edu/executiveeducation/about-us/media-gallery/content/custom-programs/pepsico-partners-with-chicago-booth-client-spotlight",},
{"Client_list":"Aon PLC","Country":"UK  ","University_school":"University of Chicago Booth School of Business",},
{"Client_list":"Citigroup ","Country":"USA","University_school":"University of Chicago Booth School of Business",},
{"Client_list":"The Minnesota Historical Society","Country":"USA","University_school":"University of Minnesota Carlson School of Management","Case Study":"https://carlsonschool.umn.edu/executive-education/corporate-services/the-minnesota-historical-society-brings-the-past-the",},
{"Client_list":"Cenex Harvest States (CHS)","Country":"USA","University_school":"University of Minnesota Carlson School of Management","Case Study":"https://carlsonschool.umn.edu/executive-education/for-organizations/case-studies/chs-grows-leaders",},
{"Client_list":"Polaris","Country":"USA","University_school":"University of Minnesota Carlson School of Management","Case Study":"https://carlsonschool.umn.edu/executive-education/for-organizations/case-studies/polaris-revs-up",},
{"Client_list":"General Mills","Country":"USA","University_school":"University of Minnesota Carlson School of Management",},
{"Client_list":"AIGA (American Institute of Graphic Arts)","Country":"USA","University_school":"Yale School of Management",},
{"Client_list":"ATD (Association for Talent Development)","Country":"USA","University_school":"Yale School of Management",},
{"Client_list":"Seminarium Internacional","Country":"Chile","University_school":"Yale School of Management",}
]
	//count the number of clients and schools
	$scope.init_func=function(){
		var client_arr = [],
			school_arr = [],
			country_arr = [];
		for(var i=0;i<$scope.partnership_data.length;i++){
			var client_track=0,
				school_track=0,
				country_track=0;
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
			for (var k=0;k<country_arr.length;k++){
				if(country_arr[k].Country==$scope.partnership_data[i].Country){
					country_track=1;
				}
			}
			if(client_track==0){
				client_arr.push($scope.partnership_data[i]);
			}
			if(school_track==0){
				school_arr.push($scope.partnership_data[i]);
			}
			if(country_track==0){
				country_arr.push($scope.partnership_data[i]);
			}
		}
		$scope.client_num=client_arr.length;
		$scope.school_num=school_arr.length;
		$scope.country_num=country_arr.length;
	};
	$scope.init_func();
	$scope.change_num = function(){
		$timeout(function(){
			var client_arr = [],
			    country_arr = [],
			    school_arr = [];
			for(var i=0;i<$scope.after_filter_data.length;i++){
				var client_track=0,
					school_track=0,
					country_track=0;
				for (var k=0;k<client_arr.length;k++){
					if(client_arr[k].Client_list==$scope.after_filter_data[i].Client_list){
						client_track=1;
					}
				}
				for (var k=0;k<school_arr.length;k++){
					if(school_arr[k].University_school==$scope.after_filter_data[i].University_school){
						school_track=1;
					}
				}
				for (var k=0;k<country_arr.length;k++){
					if(country_arr[k].Country==$scope.after_filter_data[i].Country){
						country_track=1;
					}
				}
				if(client_track==0){
					client_arr.push($scope.after_filter_data[i]);
				}
				if(school_track==0){
					school_arr.push($scope.after_filter_data[i]);
				}
				if(country_track==0){
					country_arr.push($scope.after_filter_data[i]);
				}
			}
			$scope.client_num=client_arr.length;
			$scope.school_num=school_arr.length;
			$scope.country_num=country_arr.length;
		},200);
		
	}
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
	$scope.sortCountry=function(){
		$scope.partnershipFilter('Country',$scope.country_sort);
		if($scope.country_sort<3){
			$scope.country_sort++
		} else if($scope.country_sort==3){
			$scope.country_sort=1
		};
	}
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