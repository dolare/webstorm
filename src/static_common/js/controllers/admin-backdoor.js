angular.module('myApp').controller('AdminBackdoorController', ['$timeout', 'authenticationSvc', '$http', '$scope', '$state', '$stateParams', '$localStorage', '$window',
  function($timeout, authenticationSvc, $http, $scope, $state, $stateParams, $localStorage, $window) {

    var token = authenticationSvc.getUserInfo().accessToken;



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
