var non_degree_whoops = angular.module('myApp')
non_degree_whoops.controller('NonDegreeWhoopsController',
function($scope, $http, authenticationSvc, avatarService, $timeout) {

    var token = authenticationSvc.getUserInfo().accessToken;
    var avatar_value = avatarService.getClientId() ? avatarService.getClientId()+'/' : "";

    $http({
      url: '/api/upgrid/non_degree/whoops_reports?starred=False&completed=False',
      method: 'GET',
      headers: {'Authorization': 'JWT ' + token }
    })
    .then(function (response) {

    $scope.whoops_active = response.data.results
    $scope.whoops_active_number = response.data.count

    console.log("successful..............");
    console.log(response);
    console.log("return data"+ JSON.stringify($scope.whoops_active, null, 4));

    })
    .catch(function(error){
    console.log('an error occurred...'+JSON.stringify(error));

    });

    $http({
      url: '/api/upgrid/non_degree/whoops_reports?starred=True&completed=False',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function (response) {

    $scope.whoops_starred = response.data.results
    $scope.whoops_starred_number = response.data.count

    console.log("successful..............");
    console.log(response);
    console.log("return data"+ JSON.stringify($scope.whoops_active, null, 4));

    }).
    catch(function(error){
    console.log('an error occurred...'+JSON.stringify(error));

    });

    $http({
      url: '/api/upgrid/non_degree/whoops_reports?completed=True',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function (response) {

    $scope.whoops_completed = response.data.results
    $scope.whoops_completed_number = response.data.count

    console.log("successful..............");
    console.log(response);
    console.log("return data"+ JSON.stringify($scope.whoops_active, null, 4));

    }).
    catch(function(error){
    console.log('an error occurred...'+JSON.stringify(error));

    });

    var $tasks, $taskList, $taskListStarred, $taskListCompleted,
        $taskBadge, $taskBadgeStarred, $taskBadgeCompleted;
    $tasks                  = jQuery('.js-tasks');
    $taskList               = jQuery('.js-task-list');
    $taskListStarred        = jQuery('.js-task-list-starred');
    $taskListCompleted      = jQuery('.js-task-list-completed');

    // Task status update on checkbox click
    var $stask, $staskId;
    $tasks.on('click', '.js-task-status', function(e){
        e.preventDefault();

        $stask           = jQuery(this).closest('.js-task');
        $staskId         = $stask.attr('data-task-id');

        // Check task status and toggle it
        if ( $stask.attr('data-task-completed') === 'true' ) {
            console.log("setActive");
            taskSetActive( $staskId );
        } else {
            console.log("setCompleted");
            taskSetCompleted( $staskId );
        }
    });

    // Task starred status update on star click
    var $ftask, $ftaskId;
    $tasks.on('click', '.js-task-star', function(){
        $ftask           = jQuery(this).closest('.js-task');
        $ftaskId         = $ftask.attr('data-task-id');

        // Check task starred status and toggle it
        if ( $ftask.attr('data-task-starred') === 'true' ) {
            taskStarRemove( $ftaskId );
            console.log("taskStarRemove");
        } else {
            taskStarAdd( $ftaskId );
            console.log("taskStarAdd");
        }
    });

    // Star a task
    var taskStarAdd = function( $taskId ){
        var form = new FormData();
        form.append("starred", "true");

        $http({
            url: '/api/upgrid/non_degree/whoops_reports/'+ $taskId,
            method: 'PATCH',
            headers: {'Authorization': 'JWT ' + token, 'Content-Type': undefined, },
            data: form,
        })
        .then(function (response) {
            console.log(response.data);
            var $task = jQuery('.js-task[data-task-id="' + $taskId + '"]');

            // Check if exists and update accordignly the markup
            if ( $task.length > 0 ) {
                $task.attr('data-task-starred', true);
                $task.find('.js-task-star > i').toggleClass('fa-star fa-star-o');

                if ( $task.attr('data-task-completed') === 'false') {
                    $task.prependTo($taskListStarred);
                }
            }
        })
        .catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));

        });



    };

    // Unstar a task
    var taskStarRemove = function( $taskId ){
        var form = new FormData();
        form.append("starred", "false");

        $http({
            url: '/api/upgrid/non_degree/whoops_reports/'+ $taskId,
            method: 'PATCH',
            headers: {'Authorization': 'JWT ' + token, 'Content-Type': undefined, },
            data: form,
        })
        .then(function (response) {
            console.log(response.data);
            var $task = jQuery('.js-task[data-task-id="' + $taskId + '"]');

            // Check if exists and update accordignly the markup
            if ( $task.length > 0 ) {
                $task.attr('data-task-starred', false);
                $task.find('.js-task-star > i').toggleClass('fa-star fa-star-o');

                if ( $task.attr('data-task-completed') === 'false') {
                    $task.prependTo($taskList);
                }
            }
        })
        .catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));

        });


    };

    // Set a task to active
    var taskSetActive = function( $taskId ){
        var form = new FormData();
        form.append("completed", "false");

        $http({
            url: '/api/upgrid/non_degree/whoops_reports/'+ $taskId,
            method: 'PATCH',
            headers: {'Authorization': 'JWT ' + token, 'Content-Type': undefined, },
            data: form,
        })
        .then(function (response) {
            console.log(response.data);
            var $task = jQuery('.js-task[data-task-id="' + $taskId + '"]');

            // Check if exists and update accordignly
            if ( $task.length > 0 ) {
                $task.attr('data-task-completed', false);
                $task.find('.js-task-status > input').prop('checked', false);
                $task.find('.js-task-content > del').contents().unwrap();

                if ( $task.attr('data-task-starred') === 'true') {
                    $task.prependTo($taskListStarred);
                } else {
                    $task.prependTo($taskList);
                }
            }
        })
        .catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));

        });


    };

    // Set a task to completed
    var taskSetCompleted = function( $taskId ){
        var form = new FormData();
        form.append("completed", "true");

        $http({
            url: '/api/upgrid/non_degree/whoops_reports/'+ $taskId,
            method: 'PATCH',
            headers: {'Authorization': 'JWT ' + token, 'Content-Type': undefined, },
            data: form,
        })
        .then(function (response) {
            console.log(response.data);
            var $task = jQuery('.js-task[data-task-id="' + $taskId + '"]');

            // Check if exists and update accordignly
            if ( $task.length > 0 ) {
                $task.attr('data-task-completed', true);
                $task.find('.js-task-status > input').prop('checked', true);
                $task.find('.js-task-content').wrapInner('<del></del>');
                $task.prependTo($taskListCompleted);
            }
        })
        .catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));

        });

    };

//    $scope.toggle_starred = function(data-task-id){
//        $ftask           = jQuery(this).closest('.js-task');
//        $ftaskId         = $ftask.attr('data-task-id');
//
//        // Check task starred status and toggle it
//        if ( $ftask.attr('data-task-starred') === 'true' ) {
//            taskStarRemove( $ftaskId );
//        } else {
//            taskStarAdd( $ftaskId );
//        }
//    }
//    $scope.toggle_completed = function(data-task-id){
//        $stask           = jQuery(this).closest('.js-task');
//        $staskId         = $stask.attr('data-task-id');
//
//        // Check task status and toggle it
//        if ( $stask.attr('data-task-completed') === 'true' ) {
//            taskSetActive( $staskId );
//        } else {
//            taskSetCompleted( $staskId );
//        }
//    }


    // Set variables and default functionality
//    var initTasks = function(){
//        $tasks                  = jQuery('.js-tasks');
//        $taskList               = jQuery('.js-task-list');
//        $taskListStarred        = jQuery('.js-task-list-starred');
//        $taskListCompleted      = jQuery('.js-task-list-completed');
//
////        $taskBadge              = jQuery('.js-task-badge');
////        $taskBadgeStarred       = jQuery('.js-task-badge-starred');
////        $taskBadgeCompleted     = jQuery('.js-task-badge-completed');
//
//        // Task status update on checkbox click
//        var $stask, $staskId;
//
//        $tasks.on('click', '.js-task-status', function(e){
//            e.preventDefault();
//
//            $stask           = jQuery(this).closest('.js-task');
//            $staskId         = $stask.attr('data-task-id');
//
//            // Check task status and toggle it
//            if ( $stask.attr('data-task-completed') === 'true' ) {
//                taskSetActive( $staskId );
//            } else {
//                taskSetCompleted( $staskId );
//            }
//        });
//
//        // Task starred status update on star click
//        var $ftask, $ftaskId;
//
//        $tasks.on('click', '.js-task-star', function(){
//            $ftask           = jQuery(this).closest('.js-task');
//            $ftaskId         = $ftask.attr('data-task-id');
//
//            // Check task starred status and toggle it
//            if ( $ftask.attr('data-task-starred') === 'true' ) {
//                taskStarRemove( $ftaskId );
//            } else {
//                taskStarAdd( $ftaskId );
//            }
//        });
//
//    };




  });
