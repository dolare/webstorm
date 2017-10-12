// unit test for avatar service
describe('Avatar Service',function(){
	var avatarService,
		$cookies,
		$http,
		$httpBackend;

	var mock_data = {
		id:2,
	    accessToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MDc4Mzk3OTUsImVtYWlsIjoiem1haUBncmlkZXQuY29tIiwidXNlcm5hbWUiOiJ6bWgiLCJvcmlnX2lhdCI6MTUwNzc1MzM5NSwidXNlcl9pZCI6IjdkMWY4MTBiLTIxZGQtNDQ3Mi1hNDU3LTdhNTliMDhlNGM4MSJ9.U0R1u0ZviW4g_y2PWMdRLyHPfpOZp9rLbplmkizQxk8"

	}

	//define mock module
	beforeEach(angular.mock.module('myApp'));	


	// inject service and hold it with a variable avatarService	
	beforeEach(inject(function(_avatarService_, _$cookies_, _$http_, _$httpBackend_){
		avatarService = _avatarService_;
		$cookies = _$cookies_;
		$httpBackend = _$httpBackend_;
	}));


	// test if the avatarService has been inject successful
	it('shoule be defined',function(){
		expect(avatarService).toBeDefined();
	});

	//test register method in avatar service
	describe('register',function(){
		it('should have cookie with upgrid_clientId having correct number',function(){
			avatarService.register(2);
			expect($cookies.get('upgrid_clientId')).toEqual("2");
			$cookies.remove('upgrid_clientId');
		});
	});

	// test get report type function in avatar service
	describe('Get Report type',function(){

		var test;
		it('should return whoops with mock id and token',function(){
			$httpBackend.when("GET",'/api/upgrid/accountmanager/is_manager/?client_id='+mock_data.id, {},function(headers){
				return {
            	   'Authorization': 'JWT ' + mock_data.accessToken
				};
			}).respond({data:"whoops"});

			avatarService.getReportType(mock_data.id,mock_data.accessToken).then(function(res){
				expect(res.data).toEqual('whoops');
			});

			$httpBackend.flush();
		});


	})

})