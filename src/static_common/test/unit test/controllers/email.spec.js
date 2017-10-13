describe('EmailCtrl', function(){
	beforeEach(angular.mock.module('myApp'));
	var $controller;
	beforeEach(function(){
		inject(function($injector){
			injector = $injector;
		})
	});

	beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
	}));
	it('should exit',function(){
		
	})
});