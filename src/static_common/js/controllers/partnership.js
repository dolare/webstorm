// PartnershipController
'use strict';

angular.module('myApp').
controller('PartnershipController', function(avatarService, executiveService, $scope, $timeout, $http, authenticationSvc, $localStorage, $sessionStorage, $window) {
	var token = authenticationSvc.getUserInfo().accessToken;

	$scope.partnership_data = [
{"Client_list":"Ericsson","Country":"Sweden","University_school":"Columbia Business School","Case_study":"http://go-execed.gsb.columbia.edu/l/48172/2017-07-09/5dbtw2/48172/124191/ColumbiaBusinessSchool_Ericsson_CaseStudy.pdf ","Source":"https://www8.gsb.columbia.edu/execed/programs-for-organizations/select-client-list"},
{"Client_list":"AmBev","Country":"Brazil","University_school":"Columbia Business School",},
{"Client_list":"Center for Curatorial Leadership","Country":"USA","University_school":"Columbia Business School",},
{"Client_list":"Cheung Kong Graduate School of Business","Country":"China","University_school":"Columbia Business School",},
{"Client_list":"China Eastern Airlines","Country":"China","University_school":"Columbia Business School",},
{"Client_list":"CITIC Private Equity","Country":"China","University_school":"Columbia Business School",},
{"Client_list":"Credit Suisse","Country":"Switzerland","University_school":"Columbia Business School",},
{"Client_list":"Debevoise and Plimpton","Country":"USA","University_school":"Columbia Business School",},
{"Client_list":"Deloitte ","Country":"UK","University_school":"Columbia Business School",},
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
{"Client_list":"A.P Moller-Maersk Group","Country":"Denmark","University_school":"Harvard Business School","Case_study":"https://www.exed.hbs.edu/programs/custom/Documents/client-story-maersk.pdf","Source":"https://www.exed.hbs.edu/programs/custom/Pages/client-stories.aspx"},
{"Client_list":"ZEISS Group","Country":"Germany","University_school":"Harvard Business School","Case_study":"https://www.exed.hbs.edu/programs/custom/Documents/client-story-zeiss.pdf","Source":"https://www.exed.hbs.edu/programs/custom/Pages/client-stories.aspx"},
{"Client_list":"CISCO","Country":"USA","University_school":"Rutgers Business School-Newark and New Brunswick","Source":"http://www.business.rutgers.edu/executive-education/corporate-programs"},
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
{"Client_list":"A.P Moller-Maersk Group","Country":"Denmark","University_school":"Stanford Graduate School of Business","Source":"https://www.gsb.stanford.edu/exec-ed/organizations/custom-programs/formats"},
{"Client_list":"Cathay Pacific Catering Services","Country":"Hong Kong","University_school":"Stanford Graduate School of Business",},
{"Client_list":"New Zealand Merino Wool","Country":"New Zealand","University_school":"Stanford Graduate School of Business",},
{"Client_list":"Schlumberger","Country":"USA","University_school":"Stanford Graduate School of Business",},
{"Client_list":"Valero Energy","Country":"USA","University_school":"Stanford Graduate School of Business",},
{"Client_list":"PepsiCo","Country":"USA","University_school":"University of Chicago Booth School of Business","Case_study":"https://www.chicagobooth.edu/executiveeducation/about-us/media-gallery/content/custom-programs/pepsico-partners-with-chicago-booth-client-spotlight","Source":"https://www.chicagobooth.edu/executiveeducation/custom-programs/testimonials"},
{"Client_list":"Aon PLC","Country":"UK  ","University_school":"University of Chicago Booth School of Business","Source":"https://www.chicagobooth.edu/executiveeducation/custom-programs"},
{"Client_list":"Citigroup ","Country":"USA","University_school":"University of Chicago Booth School of Business",},
{"Client_list":"The Minnesota Historical Society","Country":"USA","University_school":"University of Minnesota Carlson School of Management","Case_study":"https://carlsonschool.umn.edu/executive-education/corporate-services/the-minnesota-historical-society-brings-the-past-the","Source":"https://carlsonschool.umn.edu/executive-education/for-organizations"},
{"Client_list":"Cenex Harvest States (CHS)","Country":"USA","University_school":"University of Minnesota Carlson School of Management","Case_study":"https://carlsonschool.umn.edu/executive-education/for-organizations/case-studies/chs-grows-leaders",},
{"Client_list":"Polaris","Country":"USA","University_school":"University of Minnesota Carlson School of Management","Case_study":"https://carlsonschool.umn.edu/executive-education/for-organizations/case-studies/polaris-revs-up",},
{"Client_list":"General Mills","Country":"USA","University_school":"University of Minnesota Carlson School of Management",},
{"Client_list":"Hempel","Country":"Denmark","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-hempel-story","Source":"https://www.imd.org/custom-programs/management-courses/"},
{"Client_list":"UniCredit","Country":"Italy","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-unicredit-story",},
{"Client_list":"Orkla","Country":"Norway","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-orkla-story",},
{"Client_list":"ABB","Country":"Switzerland","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-abb-story",},
{"Client_list":"A.P Moller-Maersk Group","Country":"Denmark","University_school":"IMD",},
{"Client_list":"Electrolux","Country":"Sweden","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-electrolux-story",},
{"Client_list":"Enterprise Ireland","Country":"Ireland","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-enterprise-ireland-story",},
{"Client_list":"Hilti","Country":"Liechtenstein","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-hilti-story",},
{"Client_list":"Nestlé","Country":"Switzerland","University_school":"IMD",},
{"Client_list":"Royal DSM","Country":"Netherlands","University_school":"IMD",},
{"Client_list":"Sanofi","Country":"France","University_school":"IMD",},
{"Client_list":"SNCF","Country":"France","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-sncf-story",},
{"Client_list":"Stora Enso","Country":"Finland","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-stora-enso-story",},
{"Client_list":"Tetra Pak","Country":"Switzerland","University_school":"IMD",},
{"Client_list":"TUI","Country":"Germany","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-tui-story",},
{"Client_list":"Abu Dhabi Marine Operating Company","Country":"United Arab Emirates","University_school":"IMD",},
{"Client_list":"Albatha","Country":"United Arab Emirates","University_school":"IMD",},
{"Client_list":"Oman's Private Public Partnership Committee","Country":"Oman","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-oman-story",},
{"Client_list":"Tawuniya","Country":"Saudi Arabia","University_school":"IMD",},
{"Client_list":"The Saudi British Bank","Country":"Saudi Arabia","University_school":"IMD",},
{"Client_list":"Cisco","Country":"USA","University_school":"IMD",},
{"Client_list":"Mars Petcare","Country":"USA","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-mars-story",},
{"Client_list":"Seminarium","Country":"Mexico","University_school":"IMD",},
{"Client_list":"Tenaris","Country":"Luxembourg","University_school":"IMD",},
{"Client_list":"Agricultural Bank of China","Country":"China","University_school":"IMD",},
{"Client_list":"Bank Indonesia","Country":"Indonesia","University_school":"IMD",},
{"Client_list":"Changi Airport International PTE Ltd","Country":"Singapore","University_school":"IMD",},
{"Client_list":"China Minsheng Banking Corporation","Country":"China","University_school":"IMD",},
{"Client_list":"GE - USA","Country":"India","University_school":"IMD","Case_study":"https://www.imd.org/custom-programs/management-courses-ge-india-story",},
{"Client_list":"Hershey - USA","Country":"Singapore","University_school":"IMD",},
{"Client_list":"Hong Leong Group","Country":"Malaysia","University_school":"IMD",},
{"Client_list":"Kerridge & Partners","Country":"New Zealand","University_school":"IMD",},
{"Client_list":"Mahindra & Mahindra","Country":"India","University_school":"IMD",},
{"Client_list":"Ntuc Enterprise Co-operative Limited","Country":"Singapore","University_school":"IMD",},
{"Client_list":"Shell - Netherlands","Country":"Singapore","University_school":"IMD",},
{"Client_list":"Temasek Management Services PTE Ltd","Country":"Singapore","University_school":"IMD",},
{"Client_list":"The Bank of Tokyo-Mitsubishi UFJ","Country":"Japan","University_school":"IMD",},
{"Client_list":"Unilever - UK","Country":"Singapore ","University_school":"IMD",},
{"Client_list":"Generali","Country":"Italy","University_school":"INSEAD","Case_study":"https://www.insead.edu/node/25931","Source":"https://www.insead.edu/executive-education/customised-programmes"},
{"Client_list":"ABN AMRO","Country":"Netherlands","University_school":"INSEAD","Case_study":"https://www.insead.edu/ajax/node/13741",},
{"Client_list":"NATIONAL AMBULANCE - USA","Country":"United Arab Emirates","University_school":"INSEAD","Case_study":"https://www.insead.edu/node/31446",},
{"Client_list":"METINVEST","Country":"Ukraine","University_school":"INSEAD","Case_study":"https://www.insead.edu/node/10591",},
{"Client_list":"Telenor","Country":"Norway","University_school":"INSEAD","Case_study":"https://www.insead.edu/executive-education/customised-programmes/Telenor-Case-Study",},
{"Client_list":"Accenture","Country":"Republic of Ireland","University_school":"INSEAD","Case_study":"https://www.insead.edu/executive-education/customised-online-programmes#organisational-change",},
{"Client_list":"Microsoft","Country":"USA","University_school":"INSEAD","Case_study":"https://www.insead.edu/executive-education/customised-programmes/Microsoft-Case-Study",},
{"Client_list":"SAP","Country":"Germany","University_school":"University of Viginia Darden School of Business","Case_study":"http://www.darden.virginia.edu/executive-education/custom/sap-blended-learning-client-story/","Source":" "},
{"Client_list":"Cheung Kong Graduate School of Business (CKGSB) ","Country":"China","University_school":"University of Viginia Darden School of Business","Case_study":"http://www.darden.virginia.edu/executive-education/custom/sap-blended-learning-client-story/","Source":" "},
{"Client_list":"Ascom","Country":"Switzerland","University_school":"University of Viginia Darden School of Business","Source":"http://www.darden.virginia.edu/executive-education/custom/design/"},
{"Client_list":"International Foodservice Distributors Association (IFDA) ","Country":"USA","University_school":"University of Viginia Darden School of Business","Source":"http://www.darden.virginia.edu/executive-education/custom/design/"},
{"Client_list":"Plantronics","Country":"USA","University_school":"UC Berkeley - Haas ","Case_study":"https://executive.berkeley.edu/case-study/developing-agile-adaptive-organizational-culture","Source":" "},
{"Client_list":"Statoil","Country":"Norway","University_school":"UC Berkeley - Haas ","Case_study":"https://executive.berkeley.edu/case-study/statoil-project-executive-program","Source":" "},
{"Client_list":"Cepheid","Country":"USA","University_school":"UC Berkeley - Haas ","Case_study":"https://executive.berkeley.edu/case-study/cepheid-global-leadership-program","Source":" "},
{"Client_list":"The Ministry of Science and Higher Education ","Country":"Republic of Poland","University_school":"UC Berkeley - Haas ","Case_study":"https://executive.berkeley.edu/case-study/ministry-science-and-higher-education-poland","Source":" "},
{"Client_list":"GoforGood","Country":"Brazil","University_school":"UC Berkeley - Haas ","Source":"https://executive.berkeley.edu/iag"},
{"Client_list":"Caterpillar","Country":"USA","University_school":"University of North Carolina Kenan-Flagler Business School ","Case_study":"http://www.kenan-flagler.unc.edu/~/media/Files/documents/executive-development/unc-caterpillar-case-study.pdf","Source":"http://www.kenan-flagler.unc.edu/executive-development/custom-programs/partners"},
{"Client_list":"Owens Corning","Country":"USA","University_school":"University of North Carolina Kenan-Flagler Business School ","Case_study":"http://www.kenan-flagler.unc.edu/~/media/files/documents/executive-development/owens-corning-iedp.pdf?la=en","Source":"http://www.kenan-flagler.unc.edu/executive-development/custom-programs/partners"},
{"Client_list":"Chubb Limited","Country":"Switzerland","University_school":"Vanderbilt University Owen Graduate School of Management","Case_study":"https://issuu.com/vanderbiltowen/docs/chubb_case_sheet_jan16","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/"},
{"Client_list":"Regions Financial Corporation","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Case_study":"https://www.youtube.com/watch?v=zFpiSNSkf6s","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/"},
{"Client_list":"Nissan Motor Corporation","Country":"Japan","University_school":"Vanderbilt University Owen Graduate School of Management","Case_study":"https://s3.amazonaws.com/vu-web/owen/wp/2017/08/03230159/Nissan20Case20Study_FEB17.pdf","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/"},
{"Client_list":"NASA","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/case-studies/"},
{"Client_list":"Video Gaming Technologies","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/case-studies/"},
{"Client_list":"Asurion","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"AutoZone","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"BlueCross Blue Shield of TN","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"Bridgestone","Country":"Japan","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"Cardinal Health","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"Community Health Systems","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"FedEx","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"International Paper","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"Mars Petcare","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"Schneider Electric","Country":"France","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"Tractor Supply Company","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"TVA","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"U.S. Army","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"Vanderbilt University Medical Center","Country":"USA","University_school":"Vanderbilt University Owen Graduate School of Management","Source":"https://business.vanderbilt.edu/executive-education/custom-solutions/client-list/"},
{"Client_list":"Children's Hospital of Atlanta","Country":"USA","University_school":"Emory University Goizueta Business School","Case_study":"https://goizueta.emory.edu/executiveprograms/why/case_studies.html",},
{"Client_list":"UPS","Country":"USA","University_school":"Emory University Goizueta Business School","Case_study":"https://goizueta.emory.edu/executiveprograms/why/case_studies.html",},
{"Client_list":"SunTrust Banks","Country":"USA","University_school":"Emory University Goizueta Business School","Case_study":"https://goizueta.emory.edu/executiveprograms/why/case_studies.html",},
{"Client_list":"Emory's Learning Services","Country":"USA","University_school":"Emory University Goizueta Business School","Case_study":"https://goizueta.emory.edu/executiveprograms/why/case_studies.html",},
{"Client_list":"Mitsubishi Motors","Country":"Japan","University_school":"Emory University Goizueta Business School","Case_study":"https://goizueta.emory.edu/executiveprograms/why/case_studies.html",},
{"Client_list":"AAA – Ohio Auto Club","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"American Electric Power (AEP)","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"AG Entrepreneur","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Aggreko","Country":"UK","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Alliance Data","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"American Marketing Association (AMA)","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"The Andersons","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"U.S. Army","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"AWDA","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"BI Roxane","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"BISYS","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Bob Evans Farms","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Bricker & Eckler","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"The Builders Exchange of Central Ohio","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Cardinal Health","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"JP Morgan Chase","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Chemical Abstracts Service","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Coca-Cola, North America","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Columbus Public Schools","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Crane Group","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Diamond Power International, Inc.","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Elmer’s Products, Inc.","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Express","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Federal Bureau of Investigation (FBI)","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Greif, Inc.","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Honda - Japan","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Huntington","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Kaiser Aluminum","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Korea Advanced Institute of Science and Technology (KAIST)","Country":"South Korea","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"LG Chemical","Country":"South Korea","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Lifestyle Communities","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Limited","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Lutheran Social Services","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"A.P Moller-Maersk Group","Country":"Denmark","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Mettler Toledo","Country":"Switzerland","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"M/I Homes","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"National Association of Wholesaler-Distributors (NAW)","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Nationwide","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Nationwide Children’s Hospital","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Online Computer Library Center (OCLC)","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Ohio Civil Service Employees Association (OCSEA)","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"OSU Optometry","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"OSU Pharmacy","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"PricewaterhouseCoopers","Country":"UK","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Resource Interactive","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"RG Barry","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Robbins & Myers","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Ross Heart Hospital","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Scott Miracle-Gro","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Securities Association of China","Country":"China","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"State of Ohio Lottery Commission","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Textron","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"TODCO","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Tosoh - Japan","Country":"USA","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Welding Alloys","Country":"UK","University_school":"Ohio State University Fisher College of Business","Source":"https://fisher.osu.edu/executive-education/custom-corporate-programs"},
{"Client_list":"Microsoft","Country":"USA","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Santander bank","Country":"USA","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Hyundai","Country":"South Korea","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Merck","Country":"USA","University_school":"UPenn Wharton","Case_study":"https://executiveeducation.wharton.upenn.edu/~/media/wee/clients/client%20success%20pdfs/client%20success%20profile%20-%20merck.pdf","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"AXA","Country":"France","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Mitsui & Co.","Country":"Japan","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"DSM","Country":"Netherlands","University_school":"UPenn Wharton","Case_study":"https://executiveeducation.wharton.upenn.edu/~/media/wee/clients/client%20success%20pdfs/client-success-profile-dsm.pdf","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Siam Cement Group (SCG)","Country":"Thailand","University_school":"UPenn Wharton","Case_study":"https://executiveeducation.wharton.upenn.edu/~/media/wee/clients/client%20success%20pdfs/client-success-profile-scg.pdf","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Standard Bank","Country":"South Africa","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Philips","Country":"Netherlands","University_school":"UPenn Wharton","Case_study":"https://executiveeducation.wharton.upenn.edu/~/media/wee/clients/client%20success%20pdfs/client-success-profile-philips.pdf","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Braskem","Country":"Brazil","University_school":"UPenn Wharton","Case_study":"https://executiveeducation.wharton.upenn.edu/~/media/wee/clients/client%20success%20pdfs/client-success-profile-braskem.pdf","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Schlumberger","Country":"USA","University_school":"UPenn Wharton","Case_study":"https://executiveeducation.wharton.upenn.edu/~/media/wee/clients/client%20success%20pdfs/program-success-profile-cfo.pdf","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Women's World Banking","Country":"USA","University_school":"UPenn Wharton","Case_study":"https://executiveeducation.wharton.upenn.edu/~/media/wee/clients/client%20success%20pdfs/client-success-profile-wwb.pdf","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Zoetis","Country":"USA","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations/our-clients"},
{"Client_list":"Google","Country":"USA","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations"},
{"Client_list":"Citi","Country":"USA","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations"},
{"Client_list":"Nissan","Country":"Japan","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations"},
{"Client_list":"GSK","Country":"UK","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations"},
{"Client_list":"China Minsheng Bank","Country":"China","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations"},
{"Client_list":"Estee Lauder","Country":"USA","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations"},
{"Client_list":"Bradesco","Country":"Brazil","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations"},
{"Client_list":"Evonik","Country":"Germany","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations"},
{"Client_list":"NFL","Country":"USA","University_school":"UPenn Wharton","Source":"https://executiveeducation.wharton.upenn.edu/for-organizations"}
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
	//initialize states
	$scope.init_func();
	$scope.client_sort=1;
	$scope.school_sort=1;
	$scope.case_sort=1;
	$scope.client_sort=1;

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
			$scope.pagination_arr_length();
		},200);
	}
	//click client and sort same logic with school and pdf(case study)
	$scope.sortClient=function(){
		$scope.pagenumber = 1;
		$scope.school_sort=1;
		$scope.case_sort=1;
		$scope.country_sort=1;
		if($scope.client_sort<3){
			$scope.client_sort++
		} else if($scope.client_sort==3){
			$scope.client_sort=2;
		};
		$scope.partnershipFilter('Client_list',$scope.client_sort);

	}
	$scope.sortCountry=function(){
		$scope.pagenumber = 1;
		$scope.school_sort=1;
		$scope.case_sort=1;
		$scope.client_sort=1;
		if($scope.country_sort<3){
			$scope.country_sort++
		} else if($scope.country_sort==3){
			$scope.country_sort=2;
		};
		$scope.partnershipFilter('Country',$scope.country_sort);
	}
	$scope.sortSchool=function(){
		$scope.pagenumber = 1;
		$scope.client_sort=1;
		$scope.case_sort=1;
		$scope.country_sort=1;
		if($scope.school_sort<3){
			$scope.school_sort++
		} else if($scope.school_sort==3){
			$scope.school_sort=2;
		};
		$scope.partnershipFilter('University_school',$scope.school_sort);
	}
	$scope.sortPDF=function(){
		$scope.pagenumber = 1;
		$scope.client_sort=1;
		$scope.school_sort=1;
		$scope.country_sort=1;
		if($scope.case_sort<2){
			$scope.case_sort++
		} else if($scope.case_sort==3){
			$scope.case_sort=2;
		};
		$scope.partnershipFilter('Case_study',$scope.case_sort);
	}
	
	
	//ng-repeat orderby;
	//custom filter set expression and reverse
	
	$scope.partnershipFilter = function(sort,num){
		if(num==2){
			$scope.filter_str='"'+sort+'"';
			$scope.reverse=false;
		};
		if(num==3){
			$scope.filter_str='"'+sort+'"';
			$scope.reverse=true;
		};
		if(num==1){
			return null;
		}
	}

	//custom pagination
    $scope.pagenumber = 1;
    $scope.list_show = 25;
    $scope.pagination_arr_length = function(){
    	$scope.pagination_number_arr = [];	
    	if($scope.after_filter_data){
    		$scope.arr_length = Math.ceil($scope.after_filter_data.length/$scope.list_show);
    	} else{
    		$scope.arr_length = Math.ceil($scope.partnership_data.length/$scope.list_show);
    	}
    	console.log($scope.arr_length);
    	for(var i=1;i<$scope.arr_length+1;i++){
    		$scope.pagination_number_arr.push(i);
    	}
    };
	$scope.pagination_arr_length();

    $scope.pagination_filter = function(index){
    	$window.scrollTo(0, 0);
    	switch($scope.pagenumber){
    		case 1:
    			if(index < 25){
    				return true
    			};
    			break;
			case 2:
    			if(index < 50 && index > 24){
    				return true
    			};
    			break;
			case 3:
    			if(index < 75 && index > 49){
    				return true
    			};
    			break;
			case 4:
    			if(index < 100 && index > 74){
    				return true
    			};
    			break;
			case 5:
    			if(index < 125 && index > 99){
    				return true
    			};
    			break;
			case 6:
    			if(index < 150 && index > 124){
    				return true
    			};
    			break;
			case 7:
    			if(index < 175 && index > 149){
    				return true
    			};
    			break;	
			case 8:
    			if(index < 200 && index > 174){
    				return true
    			};
    			break;
			case 9:
    			if(index < 225 && index > 199){
    				return true
    			};
    			break;
    	};
    };
    $scope.page_change = function(page){
        $scope.pagenumber = page;
    };
    $scope.page_class = function(page){
      if($scope.pagenumber == page){
        return 'active';
      }
    };
    $scope.previous_class = function(){
      if($scope.pagenumber == 1){
        return 'disabled';
      }
    };
    $scope.next_class = function(){
      if($scope.pagenumber == 9){
        return 'disabled';
      }
    };
    $scope.previous_page = function(){
    	if($scope.pagenumber!=1){
    		$scope.pagenumber--;
    	};
    };
    $scope.next_page = function(){
    	if($scope.pagenumber!=9){
	    	$scope.pagenumber++;
    	};
    };
});