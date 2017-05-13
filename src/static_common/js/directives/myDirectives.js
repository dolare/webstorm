var App = angular.module('myApp');


//view loader
App.directive('jsViewLoaderPro', function (ngProgressFactory) {
    return {
        link: function (scope, element) {
            var el = jQuery(element);

            // Hide the view loader, populate it with content and style it
            el
                .hide()
                .html('<i class="fa-fw fa fa-refresh fa-spin text-primary"></i>')
                .css({
                    'position': 'fixed',
                    'top': '20px',
                    'left': '50%',
                    'height': '20px',
                    'width': '20px',
                    'margin-left': '-10px',
                    'z-index': 99999
                 });
              
              var progressbar = ngProgressFactory.createInstance();
              progressbar.setColor("#5c90d2");
              progressbar.setHeight("2px");
            // On state change start event, show the element
            scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                //el.fadeIn(250);
                //progressJs().start().autoIncrease(15, 500);
                progressbar.start();
            });

            // On state change success event, hide the element
            scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                //el.fadeOut(250);
                //progressJs().end();
                //progressbar = ngProgressFactory.createInstance();
                progressbar.complete();
            });
        }
    };
});




App.directive('pageSelect', function() {
  return {
    restrict: 'E',
    template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
    link: function(scope, element, attrs) {
      scope.$watch('currentPage', function(c) {
        scope.inputPage = c;
      });
    }
  }
});


App.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    
                    element.bind('click',function (event) {
                        // if ( window.confirm(msg) ) {
                        //     scope.$eval(clickAction)
                        // }

                        bootbox.confirm({
                          message: msg,
                          title: "Confirm", 
                          callback: function(result){ 
                          if(result){

                            scope.$eval(clickAction)

                          }
                        }
                      })
                    });
                }
            };
    }])


App.directive('csSelect', function() {
  return {
    require: '^stTable',
    template: '<input type="checkbox"/>',
    scope: {
      row: '=csSelect'
    },
    link: function(scope, element, attr, ctrl) {

      element.bind('change', function(evt) {
        scope.$apply(function() {
          ctrl.select(scope.row, 'multiple');
        });
      });

      scope.$watch('row.isSelected', function(newValue, oldValue) {
        if (newValue === true) {
          element.parent().addClass('st-selected');
        } else {
          element.parent().removeClass('st-selected');
        }
      });
    }
  };
});

App.directive('scrollTo', function ($location, $anchorScroll) {
  return function(scope, element, attrs) {

    element.bind('click', function(event) {
        event.stopPropagation();
        var off = scope.$on('$locationChangeStart', function(ev) {
            off();
            ev.preventDefault();
        });
        var location = attrs.scrollTo;
        $location.hash(location);
        $anchorScroll();
    });

  };
});

App.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, event) {
            element.bind('click', function(e) {
                console.log("class "+e);
                    
                    //for(var key in element)console.log(element[key])
                    
                    element.toggleClass(attrs.toggleClass);
                 
                
            });
        }
    };
});

//customized_oneui_directive
// Custom Table functionality: Section toggling
// By adding the attribute 'data-js-table-sections' to your table
App.directive('jsTableSectionsFixed', function () {
    return {
        link: function (scope, element) {
            var table      = jQuery(element);
            var tableRows  = jQuery('.js-table-sections-header > tr', table);

            
            table.delegate('.js-table-sections-header > tr', 'click', function(e) {
                if (e.target.type !== 'checkbox'
                        && e.target.type !== 'button'
                        && e.target.type !== 'radio'
                        && e.target.tagName.toLowerCase() !== 'a'
                        && e.target.tagName.toLowerCase() !== 'span'
                        && !jQuery(e.target).parent('label').length) {
                    var row    = jQuery(this);
                    var tbody  = row.parent('tbody');

                    if (! tbody.hasClass('open')) {
                        jQuery('tbody', table).removeClass('open');
                    }

                    tbody.toggleClass('open');
                }

            });
        }
    };
});


//for create/edit table
//customized_oneui_directive
// Custom Table functionality: Section toggling
// By adding the attribute 'data-js-table-sections' to your table
App.directive('jsTableSectionsEdit', function () {
    return {
        link: function (scope, element) {
            var table      = jQuery(element);
            var tableRows  = jQuery('.js-table-sections-header > tr', table);

            console.log("in the directive");
            table.delegate('.js-table-sections-header > tr', 'click', function(e) {
                if (e.target.type !== 'checkbox'
                        && e.target.type !== 'button'
                        && e.target.type !== 'radio'
                        && e.target.tagName.toLowerCase() !== 'a'
                        && e.target.tagName.toLowerCase() !== 'span'
                        && e.target.tagName.toLowerCase() !== 'i'
                        && !jQuery(e.target).parent('label').length) {
                    var row    = jQuery(this);
                    var tbody  = row.parent('tbody');

                    if (! tbody.hasClass('open')) {
                        jQuery('tbody', table).removeClass('open');
                    }

                    tbody.toggleClass('open');
                }

            });
        }
    };
});



//table for admin update
App.directive('jsTableSectionsUpdate', function () {
    return {
        link: function (scope, element) {
            var table      = jQuery(element);
            var tableRows  = jQuery('.js-table-sections-header > tr', table);

            console.log("in the directive");
            table.delegate('.js-table-sections-header > tr', 'click', function(e) {
                if (e.target.tagName.toLowerCase() === 'button'
                  || e.target.type === 'button' 
                  || e.target.tagName.toLowerCase() === 'i') {
                    var row    = jQuery(this);
                    var tbody  = row.parent('tbody');

                    if (! tbody.hasClass('open')) {
                        jQuery('tbody', table).removeClass('open');
                    }

                    tbody.toggleClass('open');
                }

            });
        }
    };
});



App.directive('slideToggle', function() {  
  return {
    restrict: 'A',      
    scope:{},
    controller: function ($scope) {}, 
    link: function(scope, element, attr) {
      element.bind('click', function() {                  
        var $slideBox = angular.element(attr.slideToggle);
        var slideDuration = parseInt(attr.slideToggleDuration, 10) || 200;
        $slideBox.stop().slideToggle(slideDuration);
      });
    }
  };  
});


App.directive('stPaginationScroll', ['$timeout', function (timeout) {
        return{
            require: 'stTable',
            link: function (scope, element, attr, ctrl) {
                var itemByPage = 20;
                var pagination = ctrl.tableState().pagination;
                var lengthThreshold = 50;
                var timeThreshold = 400;
                var handler = function () {
                    //call next page
                    ctrl.slice(pagination.start + itemByPage, itemByPage);
                };
                var promise = null;
                var lastRemaining = 9999;
                var container = angular.element(element.parent());

                container.bind('scroll', function () {
                    var remaining = container[0].scrollHeight - (container[0].clientHeight + container[0].scrollTop);

                    //if we have reached the threshold and we scroll down
                    if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

                        //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                        if (promise !== null) {
                            timeout.cancel(promise);
                        }
                        promise = timeout(function () {
                            handler();

                            //scroll a bit up
                            container[0].scrollTop -= 500;

                            promise = null;
                        }, timeThreshold);
                    }
                    lastRemaining = remaining;
                });
            }

        };
   }]);


// App.directive('toggle', function() {
//   return {
//     restrict: 'A',
//     link: function(scope, element, attrs) {
//       if (attrs.toggle == "tooltip") {
//         $(element).tooltip();
//       }
//       if (attrs.toggle == "popover") {
//         $(element).popover();
//       }
//     }
//   };
// });


App.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm, attrs) {
      var idToScroll = attrs.href;
      $elm.on('click', function() {
        var $target;
        if (idToScroll) {
          $target = $(idToScroll);
        } else {
          $target = $elm;
        }
        $("body").animate({scrollTop: $target.offset().top}, "slow");
      });
    }
  }
});

App.directive('scrollToItem', function() {                                                      
    return {                                                                                 
        restrict: 'A',                                                                       
        scope: {                                                                             
            scrollTo: "@"                                                                    
        },                                                                                   
        link: function(scope, $elm,attr) {                                                   

            $elm.on('click', function() {                                                    
                $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top - 60 }, "slow");
            });                                                                              
        }                                                                                    
    }})  


App.directive('shake', ['$animate',
  function($animate) {
    return {
      scope: {
        count: '='
      },
      link: function(scope, element, attrs) {

        scope.$watch('count', function(newValue, oldValue) {

          // console.log("newValue= "+newValue);
          // console.log("oldValue= "+oldValue);
          if (newValue === oldValue) return;

          if (newValue > oldValue)
          {
            $animate.addClass(element, 'pulseme').then(function() {
               element.removeClass('pulseme');
            });
          }else{
            $animate.addClass(element, 'shrinkeme').then(function() {
               element.removeClass('shrinkeme');
            });
          }
          
        });
      }
    };
  }
]);

// Custom Table functionality: Section toggling
// By adding the attribute 'data-js-table-sections' to your table
App.directive('jsTableSection', function () {
    return {
        link: function (scope, element) {
            var table;
            var tableRows;
            angular.element(document).ready(function() {
                //MANIPULATE THE DOM
                table = jQuery(element);
                tableRows  = jQuery('.js-table-sections-header > tr', table); 
                console.log('rows:'+ JSON.stringify(tableRows));
                
                tableRows.on('click', function(e) {
                if (e.target.type !== 'checkbox'
                        && e.target.type !== 'button'
                        && e.target.tagName.toLowerCase() !== 'a'
                        && !jQuery(e.target).parent('label').length) {
                    var row    = jQuery(this);
                    var tbody  = row.parent('tbody');

                    if (! tbody.hasClass('open')) {
                        jQuery('tbody', table).removeClass('open');
                    }

                    tbody.toggleClass('open');
                }
            });
            
            });


            
             
        }
    };
});

App.directive("refreshTable", function(){
    return {
        require:'stTable',
        restrict: "A",
        link:function(scope,elem,attr,table){
            scope.$on("refreshProducts", function() {
                table.pipe(table.tableState());
            });
    }
}});

App.directive('selectOnClick', ['$window', function ($window) {
    // Linker function
    return function (scope, element, attrs) {
      element.bind('click', function () {
        if (!$window.getSelection().toString()) {
          this.setSelectionRange(0, this.value.length)
        }
      });
    };
}]);
