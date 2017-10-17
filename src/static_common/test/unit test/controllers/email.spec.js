describe('EmailController', function(){
	beforeEach(angular.mock.module('myApp'));
	var $scope,$http,$timeout,EmailController;
	/* declare our mocks out here
	* so we can use them through the scope 
	* of this describe block.
	*/
	var authenticationSvc;

	// This function will be called before every "it" block.
	// This should be used to "reset" state for your tests.
	beforeEach(inject(function(_$controller_, _$http_, _$timeout_, _$rootScope_, _authenticationSvc_){
    // Create a "spy object" for our someService.
    // This will isolate the controller we're testing from
    // any other code.
    // we'll set up the returns for this later 
    	authenticationSvcMock = jasmine.createSpyObj('authenticationSvc',['getUserInfo']);
    	App.blocks=function(){
    		return true
    	}

    // INJECT! This part is critical
    // $rootScope - injected to create a new $scope instance.
    // $controller - injected to create an instance of our controller.
    // $q - injected so we can create promises for our mocks.
    // _$timeout_ - injected to we can flush unresolved promises.
    inject(function($rootScope,$controller,$q,_$timeout_,_$http_){
    	$scope = $rootScope.$new();
		// set up the returns for our authenticationSvcMock

		authenticationSvcMock.getUserInfo.and.returnValue({accessToken:'abc'});
      	$timeout = _$timeout_;
      	$http = _$http_;
      	EmailController = $controller('EmailController',{
      		$http: $http,
      		$scope: $scope,
      		authenticationSvc: authenticationSvcMock,
      		$timeout: $timeout
      	})
    })
	}));


	it('should exist',function(){
		expect(EmailController).toBeDefined();
	});
	it('should get init status',function(){
		expect($scope.pagenumber).toBeDefined();
		expect($scope.active_user).toBeDefined();
		expect($scope.pagenumber).toBe(1);
		expect($scope.active_user).toBe('active');
	})
	describe('preview_notification method',function(){
		
	})
	// it('Function to be defined',function(){
	// 	expect($scope.preview_notification).toBeDefined();
	// 	expect($scope.preview_notification).toBeDefined();
	// 	expect($scope.individual_send).toBeDefined();
	// 	expect($scope.send_notification).toBeDefined();
	// 	expect($scope.email_history).toBeDefined();
	// 	expect($scope.previous_page).toBeDefined();
	// 	expect($scope.next_page).toBeDefined();
	// 	expect($scope.page_change).toBeDefined();
	// 	expect($scope.custom_pagination).toBeDefined();
	// 	expect($scope.check_history_content).toBeDefined();
	// 	expect($scope.page_class).toBeDefined();
	// 	expect($scope.previous_class).toBeDefined();
	// 	expect($scope.next_class).toBeDefined();
	// })
});