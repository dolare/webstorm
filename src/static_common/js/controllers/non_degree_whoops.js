var non_degree_whoops = angular.module('myApp')
non_degree_whoops.controller('NonDegreeWhoopsController', ['avatarService', '$scope', '$http', 'authenticationSvc', 'avatarService', '$timeout', 'nonDegreeWhoopsService',
function(avatarService, $scope, $http, authenticationSvc, avatarService, $timeout, nonDegreeWhoopsService) {

    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId()+'/' : "";
    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";

    $scope.get_whoops_active = function get_whoops_active(tableState, tableCtrlActive) {
        $scope.tableCtrlActive = tableCtrlActive;
        $scope.isLoading = true;
        var filter = {'starred': false,
                      'completed': false}

        var pagination = tableState.pagination;

        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var number = pagination.number || 10;  // Number of entries showed per page.

        nonDegreeWhoopsService.getPage(start, number, tableState, token, filter).then(function (result) {
            $scope.whoops_active = result.data.results;
            $scope.whoops_active_number = result.data.count;
            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
            $scope.isLoading = false;
        });
    };

    $scope.get_whoops_starred = function get_whoops_starred(tableState, tableCtrlStarred) {
        $scope.tableCtrlStarred = tableCtrlStarred;
        $scope.isLoading = true;
        var filter = {'starred': true,
                      'completed': false}

        var pagination = tableState.pagination;

        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var number = pagination.number || 10;  // Number of entries showed per page.

        nonDegreeWhoopsService.getPage(start, number, tableState, token, filter).then(function (result) {
            $scope.whoops_starred = result.data.results;
            $scope.whoops_starred_number = result.data.count;
            tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
            $scope.isLoading = false;
        });
    };

    $scope.get_whoops_completed = function get_whoops_completed(tableState, tableCtrlCompleted) {
        $scope.tableCtrlCompleted = tableCtrlCompleted;
        $scope.isLoading = true;
        var filter = {'completed': true}

        var pagination = tableState.pagination;

        var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
        var number = pagination.number || 10;  // Number of entries showed per page.

        nonDegreeWhoopsService.getPage(start, number, tableState, token, filter).then(function (result) {
            $scope.whoops_completed = result.data.results;
            $scope.whoops_completed_number = result.data.count;
            tableState.pagination.numberOfPages = result.numberOfPages;  //set the number of pages so the pagination can update
            $scope.isLoading = false;
        });
    };

    $scope.set_whoops = function set_whoops(taskId, key, value){

        var form = new FormData();
        form.append(key, value);

        $http({
            url: '/api/upgrid/non_degree/whoops_reports/'+ taskId,
            method: 'PATCH',
            headers: {'Authorization': 'JWT ' + token, 'Content-Type': undefined, },
            data: form,
        })
        .then(function (response) {
            $scope.tableCtrlActive.pipe($scope.tableCtrlActive.tableState());
            $scope.tableCtrlStarred.pipe($scope.tableCtrlStarred.tableState());
            $scope.tableCtrlCompleted.pipe($scope.tableCtrlCompleted.tableState());
        })
        .catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));
        });
    }

}]);
