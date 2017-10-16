describe('Controllers', function(){
	beforeEach(angular.mock.module('myApp'));
	describe('Testing EmailController',function(){
		var scope, emailctrl;

		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			emailctrl = $controller('EmailController',{
				scope:scope
			});
		}));
		it('should initialize the pagenumber',function(){
			expect(scope.pagenumber).toBeDefined();
			expect(scope.pagenumber).toBe(1);
		})	
	})
	
});