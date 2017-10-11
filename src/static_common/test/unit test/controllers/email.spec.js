describe('EmailCtrl', function(){
    beforeEach(angular.mock.module('myApp'));
    beforeEach(function(){
      inject(function($injector){
        injector = $injector;
      })
  	it('Check defined',function(){
  		expect('$scope._').tobeDefined;
  	})
  });
});