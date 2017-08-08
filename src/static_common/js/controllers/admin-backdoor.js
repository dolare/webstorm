angular.module('myApp').controller('AdminBackdoorController', ['$timeout', 'authenticationSvc', '$http', '$scope', '$state', '$stateParams', '$localStorage', '$window','avatarService', 'ajaxService',
  function($timeout, authenticationSvc, $http, $scope, $state, $stateParams, $localStorage, $window, avatarService, ajaxService) {

    var token = authenticationSvc.getUserInfo().accessToken;


    $scope.itemsByPage = 25;



    $scope.whoops_pipe = function(tableState){
      $scope.displayeddata = [];
      // $scope.isLoading = true;
      console.log("~~~tableState= "+JSON.stringify(tableState));
      App.blocks('#loadingtable', 'state_loading');



      var pagination = tableState.pagination;
      var start = pagination.start || 0;
      var number = pagination.number || 25;
        //ajaxService.getResult(start, number, tableState, token, "&cs=No").then(function (result) {


          var avatar = avatarService.getClientId() ? "&cid="+ avatarService.getClientId(): "";
          console.log("avatar = "+avatar);

        ajaxService.backDoor(start, number, tableState, token, avatar).then(function (result) {
          console.log("AJAX service called !");

          $scope.displayeddata = result.data;

          console.log("%%%result.raw="+JSON.stringify(result.raw));
          console.log("%%%result.data="+JSON.stringify(result.data));

          $scope.whoops_data = $scope.displayeddata;

          tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update

          //total num of programs
          $scope.totalnum = result.data.count;

        

          App.blocks('#loadingtable', 'state_normal');



        });

    }






            $timeout(function () { 
                //alert('initing');
            //select2 init

                    jQuery(".js-data-whoops").select2({
                  ajax: {
                    url: '/api/upgrid/history/whoops_report/',
                    dataType: 'json',
                    headers: {
                            'Authorization': 'JWT ' + token
                          },


                    data: function (params) {
                      var query = {
                        search: params.term,
                        page: params.page
                      }

                      console.log("query="+JSON.stringify(query));
                      // Query paramters will be ?search=[term]&page=[page]
                      return query;
                    },

                    processResults: function (data, params) {
                      // parse the results into the format expected by Select2
                      // since we are using custom formatting functions we do not need to
                      // alter the remote JSON data, except to indicate that infinite
                      // scrolling can be used
                      params.page = params.page || 1;
                      console.log("data="+JSON.stringify(data))
                      console.log("params="+JSON.stringify(params))
                      return {
                        results: data.results.map(function(item){
                            return {

                                id: item.object_id,
                                text: item.customer_program,


                            }
                        }),

                        pagination: {
                          more: (params.page * 25) < data.count
                        }
                        
                      };
                    },
                    cache: true
                  },

                  minimumInputLength: 1,
                  placeholder: "Please select a whoops report",
                  
                  
                });        //

                    $scope.show_select2 = true

            }, 100);




            $timeout(function () { 
                //alert('initing');
            //select2 init

                    jQuery(".js-data-enhancement").select2({
                  ajax: {
                    url: '/api/upgrid/history/enhancement_report/',
                    dataType: 'json',
                    headers: {
                            'Authorization': 'JWT ' + token
                          },


                    data: function (params) {
                      var query = {
                        search: params.term,
                        page: params.page
                      }

                      console.log("query="+JSON.stringify(query));
                      // Query paramters will be ?search=[term]&page=[page]
                      return query;
                    },

                    processResults: function (data, params) {
                      // parse the results into the format expected by Select2
                      // since we are using custom formatting functions we do not need to
                      // alter the remote JSON data, except to indicate that infinite
                      // scrolling can be used
                      params.page = params.page || 1;
                      console.log("data="+JSON.stringify(data))
                      console.log("params="+JSON.stringify(params))
                      return {
                        results: data.results.map(function(item){
                            return {

                                id: item.object_id,
                                text: item.customer_program,


                            }
                        }),

                        pagination: {
                          more: (params.page * 25) < data.count
                        }
                        
                      };
                    },
                    cache: true
                  },

                  minimumInputLength: 1,
                  placeholder: "Please select a whoops report",
                  
                  
                });        //

                    $scope.show_select2 = true

            }, 100);






  }
]);
