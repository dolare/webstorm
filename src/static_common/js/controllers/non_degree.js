//for the login and forgot page

angular.module('myApp').
controller('NonDegreeController',
    function($scope, $http, authenticationSvc) {
        
        $scope.clearSharedValue = function (){
      
          $scope.url = null;
        }

        $scope.Checked = [
            {
                "school_name": "London Business School",
                "university_name": "University of London",
            },

            {
                "school_name": "Harvard Business School",
                "university_name": "Harvard University",
            }



        ]



        $scope.togglefullen = function() {
              angular.element(document.getElementById("ViewAll")).toggleClass('fullscreen-modal');


            }

        $scope.scrolltop = function(){
      
          angular.element(document.getElementById('scrolltop_non_degree')).scrollTop(0);
        }

        $scope.setLinkValue= function() {


         $("#myModal1").modal('toggle');
         jQuery('.myTab-share a:first').tab('show')


       


    }



        $scope.htmlShare = function(day) {


      $scope.url = {
        text: null
      };


      $scope.copied = false;
      new Clipboard('.btn');


         jQuery('.myTab-share a:last').tab('show')

         App.blocks('#shareReports', 'state_loading');
      

        App.blocks('#shareReports', 'state_normal');
        $scope.url = {
          text: 'www.google.com',
        };

        App.blocks('#shareReports', 'state_normal');



      

    }


        $scope.printReport = function() {
      
          $("#top-report").printThis({ 
              debug: false,              
              importCSS: true,             
              importStyle: true,         
              printContainer: true,       
              loadCSS: "../static/css/print.css", 
              pageTitle: "Upgrid Reports",             
              removeInline: false,        
              printDelay: 333,            
              header: null,             
              formValues: true          
          }); 
       }  


    });
