/*
 *  Document   : base_pages_projects_view.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Project Page
 */

var BasePagesProjectsView = function() {
    // Helper variables - set in initTasks()
    var $tasks, $taskList, $taskListStarred, $taskListCompleted,
        $taskBadge, $taskBadgeStarred, $taskBadgeCompleted;

    // Set variables and default functionality
    var initTasks = function(){
        $tasks                  = jQuery('.js-tasks');

        $taskList               = jQuery('.js-task-list');
        $taskListStarred        = jQuery('.js-task-list-starred');
        $taskListCompleted      = jQuery('.js-task-list-completed');

        $taskBadge              = jQuery('.js-task-badge');
        $taskBadgeStarred       = jQuery('.js-task-badge-starred');
        $taskBadgeCompleted     = jQuery('.js-task-badge-completed');

        // Update badges
        badgesUpdate();

        // Task status update on checkbox click
        var $stask, $staskId;

        $tasks.on('click', '.js-task-status', function(e){
            e.preventDefault();

            $stask           = jQuery(this).closest('.js-task');
            $staskId         = $stask.attr('data-task-id');

            // Check task status and toggle it
            if ( $stask.attr('data-task-completed') === 'true' ) {
                taskSetActive( $staskId );
            } else {
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
            } else {
                taskStarAdd( $ftaskId );
            }
        });

    };

    // Update badges
    var badgesUpdate = function() {
        $taskBadge.text( $taskList.children().length || '' );
        $taskBadgeStarred.text( $taskListStarred.children().length || '' );
        $taskBadgeCompleted.text( $taskListCompleted.children().length || '' );
    };

    // Star a task
    var taskStarAdd = function( $taskId ){
        var $task = jQuery('.js-task[data-task-id="' + $taskId + '"]');

        // Check if exists and update accordignly the markup
        if ( $task.length > 0 ) {
            $task.attr('data-task-starred', true);
            $task.find('.js-task-star > i').toggleClass('fa-star fa-star-o');

            if ( $task.attr('data-task-completed') === 'false') {
                $task.prependTo($taskListStarred);
            }

            // Update badges
            badgesUpdate();

            // Star the task based on your database setup
            // ..
        }
    };

    // Unstar a task
    var taskStarRemove = function( $taskId ){
        var $task = jQuery('.js-task[data-task-id="' + $taskId + '"]');

        // Check if exists and update accordignly the markup
        if ( $task.length > 0 ) {
            $task.attr('data-task-starred', false);
            $task.find('.js-task-star > i').toggleClass('fa-star fa-star-o');

            if ( $task.attr('data-task-completed') === 'false') {
                $task.prependTo($taskList);
            }

            // Update badges
            badgesUpdate();

            // Unstar the task based on your database setup
            // ..
        }
    };

    // Set a task to active
    var taskSetActive = function( $taskId ){
        var $task = jQuery('.js-task[data-task-id="' + $taskId + '"]');

        // Check if exists and update accordignly
        if ( $task.length > 0 ) {
            $task.attr('data-task-completed', false);
//            $task.find('.block-table').toggleClass('bg-gray-lighter');
            $task.find('.js-task-status > input').prop('checked', false);
            $task.find('.js-task-content > del').contents().unwrap();

            if ( $task.attr('data-task-starred') === 'true') {
                $task.prependTo($taskListStarred);
            } else {
                $task.prependTo($taskList);
            }

            // Update badges
            badgesUpdate();

            // Update task status based on your database setup
            // ..
        }
    };

    // Set a task to completed
    var taskSetCompleted = function( $taskId ){
        var $task = jQuery('.js-task[data-task-id="' + $taskId + '"]');

        // Check if exists and update accordignly
        if ( $task.length > 0 ) {
            $task.attr('data-task-completed', true);
//            $task.find('.block-table').toggleClass('bg-gray-lighter');
            $task.find('.js-task-status > input').prop('checked', true);
            $task.find('.js-task-content').wrapInner('<del></del>');
            $task.prependTo($taskListCompleted);

            // Update badges
            badgesUpdate();

            // Update task status based on your database setup
            // ..
        }
    };

    return {
        init: function () {
            // Init Tasks
            initTasks();
        }
    };
}();

// Initialize when page loads
jQuery(function(){ BasePagesProjectsView.init(); });