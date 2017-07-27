angular.module('myApp').controller('AdminDashboardController',
    function($timeout, apiService, tableDataService, $sce, $timeout, $state, avatarService, Client, $http, authenticationSvc, $scope, $window) {

        var token = authenticationSvc.getUserInfo().accessToken;

        $scope.htmlPopover = $sce.trustAsHtml('1. Program can be added in editing the user.<br>2. Page added - Updates.<br>3. Competing program can be added in editing the user programs.');

        console.log("LIST==="+JSON.stringify(Client))
        $scope.itemsByPage = 25;
        $scope.orders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        $scope.client_data = tableDataService.getClientList(Client);

        //sorting in alphabetical order
        $scope.client_data.sort(function(a, b) {
            return ((a.contact_name || "").toLowerCase() > (b.contact_name || "").toLowerCase()) ? 1 : (((b.contact_name || "").toLowerCase() > (a.contact_name || "").toLowerCase()) ? -1 : 0);
        });

        console.log("CLient = = = " + JSON.stringify($scope.client_data))

        var school_list_raw_unordered = _.sortBy($scope.client_data, 'university');
        var school_list_raw = _.pluck(school_list_raw_unordered, 'university');

        $scope.school_list = _.uniq(school_list_raw);
        console.log("$scope.school_list = "+JSON.stringify($scope.school_list))

        //For stats
        $scope.active_num = 0;
        $scope.client_num = Client.length;
        for (var i = 0; i < Client.length; i++) {
            if (Client[i].is_active === true) {
                $scope.active_num++;
            }
        }

        //Watch for client change
        $scope.$watch('client_data', function() {
            $scope.active_num = 0;
            $scope.client_num = $scope.client_data.length;
            for (i = 0; i < $scope.client_data.length; i++) {
                if ($scope.client_data[i].is_active === true) {
                    $scope.active_num++;
                }
            }

        }, true);

         //for add and edit
        $scope.addnew = function(Id) {
             $timeout(function () { jQuery('#myTab a:first').tab('show') }, 100);
            
            $scope.show_program = false
            $scope.success_client_id = null;
            $scope.report_type = {
            	'whoops': false,
            	'enhancement': false,
            	'non-degree': false,
            	'AMP': false
            }
            $scope.adding_new = false;
            //$scope.success_client_id = "ec77b4dd-d80f-4ee1-9ed3-df826ce37749";

            $scope.pwhide = Id;
            console.log("pwhide Id= " + Id)
            App.blocks('#client_block', 'state_loading');
            $scope.modaltitle = "Add a new client";
            
            //init ng-model
            $scope.account_name = null;
            $scope.email = null;
            $scope.ceeb = null;
            $scope.account_type = null;
            $scope.title = null;
            $scope.client_name = null;
            $scope.position = null;
            $scope.position_level = null;
            $scope.phone = null;
            $scope.expiration_date = null;
            $scope.password = null;
            $scope.password_confirm = null;
            $scope.department = null;
            $scope.service_level = null;
            $scope.is_demo = false;
            $scope.selected_customprogram = [];

            $scope.showtable = true;
            
            $scope.account_type = "main";

            $scope.competing_edit = [];
            $scope.competing_edit1 = [];
            $scope.competing_school_to_add = null;
            $scope.competing_school_to_add1 = null;



            $timeout(function () { 
                //alert('initing');
            //select2 init

                    jQuery(".js-data-ceeb").select2({
                  ajax: {
                    url: '/api/upgrid/accountmanager/ceebs/',
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
                                text: item.university_school,


                            }
                        }),

                        pagination: {
                          more: (params.page * 10) < data.count
                        }
                        
                      };
                    },
                    cache: true
                  },

                  minimumInputLength: 1,
                  placeholder: "Please select a Ceeb",
                  
                  
                });        //

                    $scope.show_select2 = true

            }, 100);





            $timeout(function () {
                //alert('initing');
            //select2 init

                    jQuery(".js-data-ceeb-for-competing-add").select2({
                      ajax: {
                        url: '/api/upgrid/accountmanager/ceebs/',
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

                                    id: item.object_id + '|' + item.university_school,
                                    text: item.university_school,


                                }
                            }),

                            pagination: {
                              more: (params.page * 10) < data.count
                            }
                            
                          };
                        },
                        cache: true
                      },

                      minimumInputLength: 1,
                      placeholder: "Please select the competing schools",
                      
                      
                    });        //

                        $scope.show_select2 = true

                }, 100);


            //for non-degree
            $timeout(function () {
                //alert('initing');
            //select2 init

                    jQuery(".js-data-ceeb-for-competing-add1").select2({
                      ajax: {
                        url: '/api/upgrid/non_degree/schools',
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

                                    id: item.object_id + '|'+ item.ceeb + '|'+ item.school + '|' + item.university,
                                    text: item.ceeb + '-' + item.school + '|' + item.university,


                                }
                            }),

                            pagination: {
                              more: (params.page * 10) < data.count
                            }
                            
                          };
                        },
                        cache: true
                      },

                      minimumInputLength: 1,
                      placeholder: "Please select the non-degree competing schools",
                      
                      
                    });        //

                        $scope.show_select2 = true

                }, 100);


            //tab 2
            ///load for ceeb and competing schools
            $http({
                url: '/',
                method: 'GET',
                headers: {
                    'Authorization': 'JWT ' + token
                },
                
            }).then(function(response) {

                console.log("get ceebs success")

            }).
            catch(function(error) {
                console.log('an error occurred...' + JSON.stringify(error));

            });

        }

        //get depart on ceeb
        $scope.get_depart = function() {

            $http({
                url: '/api/upgrid/accountmanager/department/' + $scope.ceeb,
                method: 'GET',
                headers: {
                    'Authorization': 'JWT ' + token
                }
            }).then(function(response) {

                response.data.unshift({
                    "department": "All"
                });

                response.data.push({
                    "department": "Other"
                });

                console.log("all_depart" + JSON.stringify(response.data));

                $scope.get_departments = response.data;

            }).
            catch(function(error) {
                console.log('an error occurred...' + JSON.stringify(error));

            });

        }


        $scope.submit_add = function() {

            $scope.adding_new = true;

            var competing_schools_obj = [];
            for (i=0; i< $scope.competing_edit.length; i++){

                competing_schools_obj.push({
                    "object_id": $scope.competing_edit[i].object_id
                })
                

            }


            var competing_schools_obj1 = [];
            for (i=0; i< $scope.competing_edit1.length; i++){

                competing_schools_obj1.push({
                    "object_id": $scope.competing_edit1[i].object_id
                })
                

            }


            // adding
            var Base64 = {
                    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                    encode: function(e) {
                        var t = "";
                        var n, r, i, s, o, u, a;
                        var f = 0;
                        e = Base64._utf8_encode(e);
                        while (f < e.length) {
                            n = e.charCodeAt(f++);
                            r = e.charCodeAt(f++);
                            i = e.charCodeAt(f++);
                            s = n >> 2;
                            o = (n & 3) << 4 | r >> 4;
                            u = (r & 15) << 2 | i >> 6;
                            a = i & 63;
                            if (isNaN(r)) {
                                u = a = 64
                            } else if (isNaN(i)) {
                                a = 64
                            }
                            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
                        }
                        return t
                    },
                    decode: function(e) {
                        var t = "";
                        var n, r, i;
                        var s, o, u, a;
                        var f = 0;
                        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
                        while (f < e.length) {
                            s = this._keyStr.indexOf(e.charAt(f++));
                            o = this._keyStr.indexOf(e.charAt(f++));
                            u = this._keyStr.indexOf(e.charAt(f++));
                            a = this._keyStr.indexOf(e.charAt(f++));
                            n = s << 2 | o >> 4;
                            r = (o & 15) << 4 | u >> 2;
                            i = (u & 3) << 6 | a;
                            t = t + String.fromCharCode(n);
                            if (u != 64) {
                                t = t + String.fromCharCode(r)
                            }
                            if (a != 64) {
                                t = t + String.fromCharCode(i)
                            }
                        }
                        t = Base64._utf8_decode(t);
                        return t
                    },
                    _utf8_encode: function(e) {
                        e = e.replace(/rn/g, "n");
                        var t = "";
                        for (var n = 0; n < e.length; n++) {
                            var r = e.charCodeAt(n);
                            if (r < 128) {
                                t += String.fromCharCode(r)
                            } else if (r > 127 && r < 2048) {
                                t += String.fromCharCode(r >> 6 | 192);
                                t += String.fromCharCode(r & 63 | 128)
                            } else {
                                t += String.fromCharCode(r >> 12 | 224);
                                t += String.fromCharCode(r >> 6 & 63 | 128);
                                t += String.fromCharCode(r & 63 | 128)
                            }
                        }
                        return t
                    },
                    _utf8_decode: function(e) {
                        var t = "";
                        var n = 0;
                        var r = c1 = c2 = 0;
                        while (n < e.length) {
                            r = e.charCodeAt(n);
                            if (r < 128) {
                                t += String.fromCharCode(r);
                                n++
                            } else if (r > 191 && r < 224) {
                                c2 = e.charCodeAt(n + 1);
                                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                                n += 2
                            } else {
                                c2 = e.charCodeAt(n + 1);
                                c3 = e.charCodeAt(n + 2);
                                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                                n += 3
                            }
                        }
                        return t
                    }
                }


                console.log("is_demo=" + $scope.is_demo);
                //*************************************************create user
                //"selected_customerprogram": $scope.selected_customprogram
                $http({
                    url: '/api/upgrid/accountmanager/client/',
                    method: 'POST',
                    data: {
                        "username": $scope.account_name + "@M",
                        "email": $scope.email,
                        "ceeb": $scope.ceeb,
                        "account_type": $scope.account_type,
                        "title": $scope.title,
                        "contact_name": $scope.client_name,
                        "position": $scope.position,
                        "position_level": $scope.position_level,
                        "phone": $scope.phone,
                        "service_until": '20' + $scope.expiration_date.split('/')[2] + '-' + $scope.expiration_date.split('/')[0] + '-' + $scope.expiration_date.split('/')[1] + 'T00:00:00+00:00',
                        "password": Base64.encode($scope.password_confirm),
                        "department": $scope.department,
                        "service_level": $scope.service_level,
                        "competing_schools": competing_schools_obj,
                        "non_degree_schools": competing_schools_obj1,
                        "isDemo": $scope.is_demo,
                        'features': $scope.report_type
                    },
                    headers: {
                        'Authorization': 'JWT ' + token,
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {


                    $scope.success_client_id = response.data.client_id;

                    apiService.getClient(token).then(function (result) {
            
                            console.log("$scope.success_client_id="+$scope.success_client_id)
                                  
                            console.log("result===="+JSON.stringify(result))
                            //$scope.client_data = result;
                            $scope.client_data = tableDataService.getClientList(result);
                                //$scope.() = [].concat($scope.selected_customprogram);
                            //$scope.$broadcast('refreshProducts');

                            //jQuery('#modal-large').modal('toggle');

                            $scope.adding_new = false;

                            jQuery('#modal-large-add').modal('toggle');

                            $.notify({
                                // options
                                icon: "fa fa-check",
                                message: "The client has been created. Please modify the client program(s) in the 'Edit' window"
                            }, {
                                // settings
                                type: 'success',
                                placement: {
                                    from: "top",
                                    align: "center"
                                },
                                z_index: 1999,
                            });
                                    
                           
                    });


                }).
                catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));

                });

        }


        $scope.client_programs = [];
        
        $scope.showtable = true;

        $scope.add_competing_school = function(){


            if($scope.competing_school_to_add){


                $scope.competing_edit.push({
                    "object_id": $scope.competing_school_to_add.split('|')[0],
                    "university_school": $scope.competing_school_to_add.split('|')[1]
                });

                $scope.competing_school_to_add = null;

            } else {
                $.notify({

                        // options
                        icon: "fa fa-warning",
                        message: 'Please select a competing school.'
                    }, {
                        // settings
                        type: 'warning',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                        z_index: 1999,
                    });
            }

        }


        $scope.add_competing_school1 = function(){


            if($scope.competing_school_to_add1){


                  $scope.competing_edit1.push({
                    "object_id": $scope.competing_school_to_add1.split('|')[0],
                    "university_school": $scope.competing_school_to_add1.split('|')[1] + '-' + $scope.competing_school_to_add1.split('|')[2]+ ' | ' +$scope.competing_school_to_add1.split('|')[3]
                });

                $scope.competing_school_to_add1 = null;

            } else {
                $.notify({

                        // options
                        icon: "fa fa-warning",
                        message: 'Please select a competing school.'
                    }, {
                        // settings
                        type: 'warning',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                        z_index: 1999,
                    });
            }

        }


        $scope.delete_competing_school = function(id){

            $scope.competing_edit.splice(id, 1);

        }


        $scope.delete_competing_school1 = function(id){

            $scope.competing_edit1.splice(id, 1);

        }

        $scope.checkvalue = function() {
            console.log("tryit=" + $scope.tryit);
        }

    });


// loading of ceeb
// loading of competing
// 2 hrs token