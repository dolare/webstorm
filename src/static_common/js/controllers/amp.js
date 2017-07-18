/*AMP controller*/
'use strict';

angular.module('myApp').
controller('AMPController', function(executiveService, $scope, $http, authenticationSvc, $localStorage, $sessionStorage) {
  var token = authenticationSvc.getUserInfo().accessToken;
  $scope.$storage = $localStorage;

  //console.log("table = "+JSON.stringify(Table));

  $scope._ = _;
 

  $http({
      url:'/api/upgrid/non_degree/schools?is_AMP=True',
      method: 'GET',
      headers: {
        'Authorization': 'JWT ' + token
      }
    })
    .then(function(response) {
      $scope.school_table = response.data.results
      
        console.log("school_table = "+JSON.stringify($scope.school_table));

        angular.forEach($scope.school_table, function(value, index) {
        
         value["logo_url"] = executiveService.getLogoBySchoolName(value.school, value.university)

          $http({
            url: '/api/upgrid/non_degree/schools/' + value.object_id + '/courses',
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(result) {

            value["courses"] = result.data.results;

            console.log("result = "+JSON.stringify(result.data));

          }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));
          });


       })

      }).catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));
      });


      $scope.showUrl = function (parentIndex, Index){


          $http({
            url: '/api/upgrid/non_degree/schools/' + $scope.school_table[parentIndex].object_id + '/courses/' + $scope.school_table[parentIndex].courses[Index].object_id + '/urls',
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(response) {

            //value["courses"] = result.data.results;

            console.log("response = "+JSON.stringify(response.data));
            $scope.urls = response.data.results;

            $scope.school_table[parentIndex].courses[Index]['urls'] = $scope.urls;


          }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));
          });

      }

      $scope.getReport = function(Id1, Id2, Id3) {
        console.log(Id1+ ' '+Id2+ ' '+Id3)

        App.blocks('#amp_loading', 'state_loading');
        

          $http({
            url: '/api/upgrid/non_degree/schools/' + Id1 + '/courses/' + Id2 + '/urls/'+Id3 +'/amp_reports',
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(response) {

            //value["courses"] = result.data.results;

            console.log("response = "+JSON.stringify(response.data));
            
            return $http({
            url: '/api/upgrid/non_degree/schools/' + Id1 + '/courses/' + Id2 + '/urls/'+Id3 +'/amp_reports/'+response.data.results[0].object_id,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          });
          }).then(function(result) {
            
            // var amp_old = result.data.start_scan.raw_contents
            // var amp_new = result.data.end_scan.raw_contents

            var amp_old = result.data.start_scan.text_contents
            var amp_new = result.data.end_scan.text_contents

            var final_diff = differentiateTextContent(amp_old, amp_new)
            console.log("final_diff = "+JSON.stringify(final_diff));
            App.blocks('#amp_loading', 'state_normal');
          }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));
          });



      }


    var differentiateTextContent = function (checkedContent, newestContent) {
      var differences = [],
          color = '',
          span = null;

      var diff = JsDiff.diffLines(checkedContent, newestContent),
          diffRptContent = document.getElementById('diffRptContent'),
          fragment = document.createDocumentFragment(),
          idIndex = 0;

      differences = [];

      diff.forEach(function(part){
        // green for additions, red for deletions
        // grey for common parts
        span = document.createElement('span');
        if(part.added) {
          span.id = 'diff' + idIndex;
          span.style.backgroundColor = '#46c37b';
          span.style.color = 'white';
          differences.push(
            {
              value: 'diff' + idIndex,
              text: 'difference#' + idIndex
            }
          );
          idIndex++;
        } else if(part.removed) {
          span.id = 'diff' + idIndex;
          span.style.backgroundColor = '#d26a5c';
          span.style.color = 'white';
          differences.push(
            {
              value: 'diff' + idIndex,
              text: 'difference#' + idIndex
            }
          );
          idIndex++;
        } else {
          span.style.backgroundColor = 'white';
          span.style.color = '#393939';
        }

        span.appendChild(document
          .createTextNode(part.value));
        fragment.appendChild(span);
      });

      diffRptContent.appendChild(fragment);

      return differences;
    };

    $scope.togglefullen = function(){
      angular.element(document.getElementById("amp_report")).toggleClass('fullscreen-modal');
      

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
  };

});