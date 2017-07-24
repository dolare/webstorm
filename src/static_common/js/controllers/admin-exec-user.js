angular.module('myApp').controller('AdminExecUserController',
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

        $scope.deactivate = function(id, index, subindex, val) {

            console.log("index = "+index)
            console.log("subindex = "+subindex)
            
            $http({
                url: '/api/upgrid/accountmanager/client/',
                method: 'PUT',
                data: {
                    'client_id': id,
                    'is_active': val
                },
                headers: {
                    'Authorization': 'JWT ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(function(response) {



                console.log("deleted!" + JSON.stringify(response));


                if(subindex !== null){
                    $scope.client_data[index].subuser[subindex].is_active = val;
                } else {
                    $scope.client_data[index].is_active = val;
                }

                
                var show_message = val ? 'The client has been re-activated.' : 'The client has been deactivated.'

                $.notify({

                    // options
                    icon: "fa fa-check",
                    message: show_message
                }, {
                    // settings
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "center"
                    },
                    z_index: 1999,
                });

            }).
            catch(function(error) {
                console.log('an error occurred...' + JSON.stringify(error));

            });

        }

        $scope.verifying = false;

        $scope.verify_email = function(email) {

            $scope.verifying = true;

            $http({
                url: '/api/upgrid/user/sent_verify_email/',
                method: 'POST',
                data: {
                    'email': email,
                },
                headers: {
                    'Authorization': 'JWT ' + token,
                }
            }).then(function(response) {

                
                $.notify({

                    // options
                    icon: "fa fa-check",
                    message: "The verification email has been sent."
                }, {
                    // settings
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "center"
                    },
                    z_index: 1999,
                });

                $scope.verifying = false;
                console.log("email sent data =" + JSON.stringify(response.data));


            }).
            catch(function(error) {
                console.log('an error occurred...' + JSON.stringify(error));
                $scope.verifying = false;
            });
        }


        $scope.impersonate = function(id) {
            console.log("id = " + id);
            avatarService.register(id);
            console.log("avatarService.getClientId" + avatarService.getClientId());

            $http({
                url: '/api/upgrid/user/dashboard/' + avatarService.getClientId(),
                method: 'GET',

                headers: {
                    'Authorization': 'JWT ' + token,
                }
            }).then(function(response) {

                profile = response.data;

                console.log("Impersonate into Johns =" + JSON.stringify(profile));


            }).
            catch(function(error) {
                console.log('an error occurred...' + JSON.stringify(error));

            });

            $state.go('dashboard');

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
            $scope.competing_school_to_add = null;



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
                      placeholder: "Please select the competing schools",
                      
                      
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



        $scope.editold = function(Id) {

                $timeout(function () { jQuery('#myTab1 a:first').tab('show');  }, 100);

                App.blocks('#client_block2', 'state_loading');
                
                $scope.modaltitle = "Edit a client";
                $scope.generate_or_add = "Add program(s)"
                $scope.pwhide = Id;
                console.log("pwhide Id = " + Id);

                $scope.editing_new = false

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
                $scope.selected_customprogram = [];
                $scope.put_customer_program_array = [];
                $scope.put_competing_program_array = [];
                $scope.delete_competing_program_array = [];
                $scope.delete_customer_program_string = "";
                $scope.post_competing_program_array = [];

                $scope.additional_program = null 

                $scope.showtable = true;
               
                $scope.competing_school_to_add = null;


                $timeout(function () {
                //alert('initing');
            //select2 init

                    jQuery(".js-data-ceeb-for-competing").select2({
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
                      placeholder: "Please select the competing schools",
                      
                      
                    });        //

                        $scope.show_select2 = true

                }, 100);



                    $scope.showtable = false;


                    //**************************get user info******************************
                 $http({
                        url: '/api/upgrid/accountmanager/client/' + Id,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token
                        }

                  
                }).then(function(response) {
                    console.log("client is = " + JSON.stringify(response));

                    //get info
                    $scope.account_name = response.data.username;
                    $scope.email = response.data.email;
                    $scope.ceeb = response.data.CeebID;
                    $scope.account_type = response.data.account_type;
                    $scope.title = response.data.title;
                    $scope.client_name = response.data.contact_name;
                    $scope.is_demo = response.data.is_demo;
                    $scope.position = response.data.position;
                    $scope.position_level = response.data.position_level;
                    $scope.phone = response.data.phone;
                    $('#datepicker1').datepicker('setDate', new Date(response.data.service_until.split('T')[0].split('-')[0], response.data.service_until.split('T')[0].split('-')[1] - 1, response.data.service_until.split('T')[0].split('-')[2]));
                    //$scope.expiration_date = response.data.service_until.split('-')[1]+'/'+response.data.service_until.split('T')[0].split('-')[2]+'/'+response.data.service_until.split('-')[0].slice(-2);
                    $scope.department = response.data.department;
                    $scope.service_level = response.data.service_level;
                    $scope.competing_edit = response.data.competing_schools
                    $scope.customer_program = response.data.customer_program;


                    $timeout(function () {
                //alert('initing');
            //select2 init


                    jQuery(".js-get-ceeb-program").select2({
                              ajax: {
                                url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.ceeb,
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

                                            id: item.object_id + '|' + item.program_name + '|' + item.program_degree,
                                            text: item.program_name + ' (' +item.program_degree + ') ' + '[ Department:' + ' ' + (item.department ? item.department : 'Other')  +' ]',


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
                              placeholder: "Search for the program in the Ceeb",
                              
                              
                            });        //

                                $scope.show_select2 = true

                        }, 100);




                    if (!$scope.is_demo) {
                        $scope.is_demo = false
                    }

                    console.log("editold $scope.is_demo" + $scope.is_demo);

                    console.log("competing_edit= " + JSON.stringify($scope.competing_edit));

                    console.log("edit customer program = " + JSON.stringify($scope.customer_program));


                    //generate selected_customprogram list
                    $scope.selected_customprogram = [];

                    for (i = 0; i < $scope.customer_program.length; i++) {

                        console.log("i=" + i)

                        $scope.selected_customprogram.push({
                            "customer_program_id": $scope.customer_program[i].object_id,
                            "program_id": $scope.customer_program[i].program.object_id,
                            "university": $scope.customer_program[i].program.program_display.split('--')[0].split('-')[0].split(':')[1],
                            "school": $scope.customer_program[i].program.program_display.split('--')[0].split('-')[1],
                            "program_name": $scope.customer_program[i].program.program_display.split('--')[1],
                            "program_degree": $scope.customer_program[i].program.program_display.split('--')[2],
                            "assignment_status": $scope.customer_program[i].program.assignment_status,
                            "review_status": $scope.customer_program[i].program.review_status,
                            "whoops_status": $scope.customer_program[i].whoops_status,
                            "whoops_final_release": $scope.customer_program[i].whoops_final_release,
                            "enhancement_final_release": $scope.customer_program[i].enhancement_final_release,
                            
                            "customerconfirmation_status": $scope.customer_program[i].customer_confirmation,
                            "competing_program": (function() {
                                var programs = [];
                                //to fix
                                for (j = 0; j < $scope.customer_program[i].competing_program.length; j++) {
                                    programs[j] = {
                                        "object_id": $scope.customer_program[i].competing_program[j].object_id,
                                        "program_id": $scope.customer_program[i].competing_program[j].program_id,
                                        "university": $scope.customer_program[i].competing_program[j].university,
                                        "school": $scope.customer_program[i].competing_program[j].school,
                                        "program_name": $scope.customer_program[i].competing_program[j].program_name,
                                        "program_degree": $scope.customer_program[i].competing_program[j].program_degree,
                                        "order": $scope.customer_program[i].competing_program[j].order,
                                        "enhancement_status": $scope.customer_program[i].competing_program[j].enhancement_status
                                    }

                                }

                                programs.sort(function(a, b) {
                                    return parseInt(a.order) - parseInt(b.order);
                                });

                                if (programs.length === 0) {
                                    programs.push({
                                        "object_id": null,
                                        "program_id": null,
                                        "university": null,
                                        "school": null,
                                        "program_name": null,
                                        "program_degree": null,
                                        "order": 1,
                                        "enhancement_status": "in progress"

                                    })
                                }

                                // programs.sort(function(a, b) {
                                //   return (a.order.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
                                // });
                                return programs;

                            })(),

                        });

                    }

                    console.log("selected program is " + JSON.stringify($scope.selected_customprogram));

                     return $http({
                        url: '/api/upgrid/accountmanager/ceebs/?object_id=' + $scope.ceeb,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token
                        }
                    })
                 }).then(function(response) {


                    $scope.ceeb_to_school = response.data.results[0].university_school
                    console.log("ceeb name = "+JSON.stringify(response.data.results[0].university_school))


                    //*****************************GET DEPARTMENT LIST***********************************

                    return $http({
                        url: '/api/upgrid/accountmanager/department/' + $scope.ceeb,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token
                        }
                    })
                }).then(function(response) {


                    //append
                    response.data.unshift({
                        "department": "All"
                    });

                    response.data.push({
                        "department": "Other"
                    });


                    console.log("all_depart" + JSON.stringify(response.data));

                    $scope.get_departments = response.data;

                    $scope.all_programs = [];


                    $scope.competing_string = "";

                    
                    for (i = 0; i < $scope.competing_edit.length; i++) {
                        $scope.competing_string = $scope.competing_string +  $scope.competing_edit[i].object_id + '/';
                    }

                    console.log('/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.competing_string.slice(0, -1));
                    


                    $timeout(function () {
                //alert('initing');
            //select2 init


                    jQuery(".js-data-example-ajax").select2({
                  ajax: {
                    url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.competing_string.slice(0, -1),
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
                                text: item.program_name + ' (' +item.program_degree + ') ' + '[ '+item.program_university +' - '+ item.program_school +' ]',


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
                  placeholder: "Select a competing program",

                  
                  
                });        //

                    $scope.show_select2 = true

            }, 100);
                
                    App.blocks('#client_block2', 'state_normal');

                }).catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));

                });


            } //end of editold


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
                        "non_degree_schools": competing_schools_obj,
                        "isDemo": $scope.is_demo
                    },
                    headers: {
                        'Authorization': 'JWT ' + token,
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {


                    $scope.success_client_id = response.data.client_id;

                    apiService.getExecClient(token).then(function (result) {
            
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

            console.log("$scope.competing_school_to_add="+JSON.stringify($scope.competing_school_to_add));

            if($scope.competing_school_to_add){


                $scope.competing_edit.push({
                    "object_id": $scope.competing_school_to_add.split('|')[0],
                    "university_school": $scope.competing_school_to_add.split('|')[1] + '-' + $scope.competing_school_to_add.split('|')[2]+ ' | ' +$scope.competing_school_to_add.split('|')[3]
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


        $scope.delete_competing_school = function(id){

            $scope.competing_edit.splice(id, 1);

        }


        $scope.submit_edit = function() {
            $scope.editing_new = true;



            var competing_schools_obj = [];
            for (i=0; i< $scope.competing_edit.length; i++){

                competing_schools_obj.push({
                    "object_id": $scope.competing_edit[i].object_id
                })
                

            }

                console.log("editing");


                console.log("$scope.is_demo = " + $scope.is_demo);

                //PUT general data
                $http({
                    url: '/api/upgrid/accountmanager/client/',
                    method: 'PUT',
                    data: {

                        "client_id": $scope.pwhide,
                        "main_user_id": null,
                        "username": $scope.account_name,
                        "email": $scope.email,
                        "Ceeb": $scope.ceeb,
                        "account_type": $scope.account_type,
                        "title": $scope.title,
                        "contact_name": $scope.client_name,
                        "position": $scope.position,
                        "position_level": $scope.position_level,
                        "phone": $scope.phone,
                        "service_until": '20' + $scope.expiration_date.split('/')[2] + '-' + $scope.expiration_date.split('/')[0] + '-' + $scope.expiration_date.split('/')[1] + 'T00:00:00+00:00',
                        "department": $scope.department,
                        "service_level": $scope.service_level,
                        "competing_schools": competing_schools_obj,
                        "is_demo": $scope.is_demo

                    },
                    headers: {
                        'Authorization': 'JWT ' + token,
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {



                    $scope.competing_string = "";

                    
                    for (i = 0; i < $scope.competing_edit.length; i++) {
                        $scope.competing_string = $scope.competing_string +  $scope.competing_edit[i].object_id + '/';
                    }

                    console.log("Updated the competing list");


                    $timeout(function () {
                        //alert('initing');
                    //select2 init


                            jQuery(".js-data-example-ajax").select2({
                          ajax: {
                            url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.competing_string.slice(0, -1),
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
                                        text: item.program_name + ' (' +item.program_degree + ') ' + '[ '+item.program_university +' - '+ item.program_school +' ]',


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
                          placeholder: "Select a competing program",
                          
                          
                        });        //

                            $scope.show_select2 = true

                    }, 100);



                     $.notify({

                        // options
                        icon: "fa fa-check",
                        message: 'The client has been updated.'
                    }, {
                        // settings
                        type: 'success',
                        placement: {
                            from: "top",
                            align: "center"
                        },
                        z_index: 1999,
                    });



                     apiService.getExecClient(token).then(function (result) {
            
                            console.log("$scope.success_client_id="+$scope.success_client_id)
                                  
                            console.log("result===="+JSON.stringify(result))
                            //$scope.client_data = result;
                            $scope.client_data = tableDataService.getClientList(result);
                         
                    });
                         
                    $scope.editing_new = false
                    //console.log("submit program list = "+JSON.stringify($scope.selected_customprogram));
                }).
                catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));
                    $scope.editing_new = false

                });


        }



        $scope.checkvalue = function() {
            console.log("tryit=" + $scope.tryit);
        }



        //put competing programs
        $scope.put_competing = function(obj, cid, pro, order, estatus) {
           /* if($scope.isChange == true){
                $scope.isChange = false;
                return;
            }*/
            
            console.log("changing competing+++++++++++++++++");

            //existing competing has obj
            $scope.put_competing_program_array = [];
            

                console.log('details-------='+ obj + ' ' + cid + ' ' + pro + ' ' + order + ' ' + estatus);

               
                    $scope.put_competing_program_array.push({
                        'program_id': pro,
                        'customer_program_id': cid,
                        'object_id': obj,
                        'order': order,
                        'enhancement_status': estatus,
                    })
                


                console.log("$scope.put_competing_program_array=" + JSON.stringify($scope.put_competing_program_array));

                


               $http({

                        url: '/api/upgrid/accountmanager/client/competing_program/',
                        method: 'PUT',
                        headers: {
                            'Authorization': 'JWT ' + token,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'customer_competing_program': $scope.put_competing_program_array
                        }

             }).then(function (response) {

               console.log("successfully put competing")
               
            }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });



        }


        $scope.delete_competing = function(obj, Pid, id) {
            if(obj){
                    $scope.delete_competing_program_array = [];
                    
                   $scope.delete_competing_program_array.push({
                    "object_id": obj
                   })

                            $http({
                                url: '/api/upgrid/accountmanager/client/competing_program/',
                                method: 'DELETE',
                                headers: {
                                    'Authorization': 'JWT ' + token,
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    'competing_program_id': $scope.delete_competing_program_array
                                }

                            }).then(function(response) {

                                console.log("success detele competing program" + JSON.stringify(response));

                              



                            }).
                            catch(function(error) {
                                console.log('an error occurred...' + JSON.stringify(error));

                            });

           } else {

                $scope.selected_customprogram[Pid].competing_program.splice(id, 1)

           }

        }

        $scope.add_competing_line = function(Pid, id) {

            $scope.show_select2 = false

            //order after, +1 respectively
            for (var i = id + 1; i < $scope.selected_customprogram[Pid].competing_program.length; i++) {

                $scope.selected_customprogram[Pid].competing_program[i].order = $scope.selected_customprogram[Pid].competing_program[i].order + 1;

                //if existing
                if ($scope.selected_customprogram[Pid].competing_program[i].object_id) {

                    $scope.put_competing($scope.selected_customprogram[Pid].competing_program[i].object_id, $scope.selected_customprogram[Pid].customer_program_id, $scope.selected_customprogram[Pid].competing_program[i].program_id, $scope.selected_customprogram[Pid].competing_program[i].order, $scope.selected_customprogram[Pid].competing_program[i].enhancement_status);

                }

            }

            $scope.selected_customprogram[Pid].competing_program.splice(id + 1, 0, {
                "object_id": null,
                "program_id": null,
                "order": $scope.selected_customprogram[Pid].competing_program[id].order + 1,
                "enhancement_status": "in progress"
            });



            $timeout(function () {
                //alert('initing');
            //select2 init


                    jQuery(".js-data-example-ajax").select2({
                  ajax: {
                    url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.competing_string.slice(0, -1),
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
                                text: item.program_name + ' (' +item.program_degree + ') ' + '[ '+item.program_university +' - '+ item.program_school +' ]',


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
                  placeholder: "Select a competing program",
                  
                  
                });        //

                    $scope.show_select2 = true

            }, 100);



        }


        $scope.post_customer_program = function (added){


            $scope.additional_program = null 
            $scope.add_edit_program = [];

            $scope.add_edit_program.push({
                    "program_id": added.split('|')[0],
                    "program_name": added.split('|')[1],
                    "program_degree": added.split('|')[2],
                    "assignment_status": null,
                    "review_status": null,
                    "whoops_status": "in progress",
                    "whoops_final_release": "False",
                    "enhancement_final_release": "False",

                    "competing_program": (function() {
                        var programs = [];
                        for (var j = 0; j < 1; j++) {
                            programs[j] = {

                                "object_id": "",
                                "order": j + 1,
                                "enhancement_status": "in progress"
                            }

                        }
                       
                       
                        return programs;

                    })(),

                });


            
                 $http({
                        url: '/api/upgrid/accountmanager/client/customer_program/',
                        method: 'POST',
                        data: {
                            'client_id': $scope.pwhide,
                            "selected_customer_program": $scope.add_edit_program
                        },
                        headers: {
                            'Authorization': 'JWT ' + token
                        }
                  
                }).then(function(response) {


                    console.log("success add customer program" + JSON.stringify(response));


                }).
                catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));

                });

        }




        $scope.put_customer_program = function(index) {
            

            $scope.put_customer_program_array.push({
                'program_id': $scope.selected_customprogram[index].program_id,
                'customer_program_id': $scope.selected_customprogram[index].customer_program_id,
                'whoops_status': $scope.selected_customprogram[index].whoops_status,
                'whoops_final_release': $scope.selected_customprogram[index].whoops_final_release,
                'enhancement_final_release': $scope.selected_customprogram[index].enhancement_final_release,
                'customer_confirmation': $scope.selected_customprogram[index].customerconfirmation_status,
            })
        
            console.log("$scope.put_customer_program_array="+JSON.stringify($scope.put_customer_program_array));

            $http({

                url: '/api/upgrid/accountmanager/client/customer_program/',
                method: 'PUT',
                headers: {
                    'Authorization': 'JWT ' + token
                },
                data: {
                    "client_id": $scope.pwhide,
                    'selected_customer_program': $scope.put_customer_program_array
                }

            }).then(function (response) {

               console.log("return data"+ JSON.stringify(response.data));
               
            }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });

        }


        $scope.ondemand_single = function(type, index) {


            if(type==='whoops') {

                $http({
                  url: '/api/upgrid/update/whoops/ondemand/',
                  method: 'PUT',
                  data: {
                    "customer_program_id": $scope.selected_customprogram[index].customer_program_id,
                    "client_id": $scope.pwhide
                  },
                  headers: {
                    'Authorization': 'JWT ' + token
                  }
                }).then(function (response) {
                   console.log(i + ' ' + 'Whoops released')

                }).
                 catch(function(error){
                    console.log('an error occurred...'+JSON.stringify(error));

                 });

            }


            if(type==='enhancement') {

                $http({
                  url: '/api/upgrid/update/enhancement/ondemand/',
                  method: 'PUT',
                  data: {
                    "customer_program_id": $scope.selected_customprogram[index].customer_program_id,
                    "client_id": $scope.pwhide
                  },
                  headers: {
                    'Authorization': 'JWT ' + token
                  }
                }).then(function (response) {
                    console.log($scope.selected_customprogram[index].customer_program_id + '$scope.selected_customprogram[index].customer_program_id')
                    console.log(i + ' ' + 'Enhancement released')

                }).
                 catch(function(error){
                    console.log('an error occurred...'+JSON.stringify(error));

                 });


            }


        }


        $scope.delete_customer_program = function (index) {

            App.blocks('#client_block2', 'state_loading');
            

            $scope.delete_customer_program_string = $scope.selected_customprogram[index].customer_program_id

            $http({
                url: '/api/upgrid/accountmanager/client/customer_program/',
                method: 'DELETE',
                headers: {
                    'Authorization': 'JWT ' + token,
                    'Content-Type': 'application/json'
                },
                data: {
                    'client_id': $scope.pwhide,
                    'customer_program_id': $scope.delete_customer_program_string
                }

            }).then(function(response) {

                console.log("success delete customer program" + JSON.stringify(response));


                    $scope.customer_program = response.data.customer_program;
                    

                    return $http({
                        url: '/api/upgrid/accountmanager/client/' + $scope.pwhide,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token
                        }

                
                    })
                }).then(function(response) {


                    $scope.customer_program = response.data.customer_program;
                    console.log("$scope.customer_program="+JSON.stringify($scope.customer_program));

                //generate selected_customprogram list
                    $scope.selected_customprogram = [];

                    for (i = 0; i < $scope.customer_program.length; i++) {

                        console.log("i=" + i)

                        $scope.selected_customprogram.push({
                            "customer_program_id": $scope.customer_program[i].object_id,
                            "program_id": $scope.customer_program[i].program.object_id,
                            "university": $scope.customer_program[i].program.program_display.split('--')[0].split('-')[0].split(':')[1],
                            "school": $scope.customer_program[i].program.program_display.split('--')[0].split('-')[1],
                            "program_name": $scope.customer_program[i].program.program_display.split('--')[1],
                            "program_degree": $scope.customer_program[i].program.program_display.split('--')[2],
                            "assignment_status": $scope.customer_program[i].program.assignment_status,
                            "review_status": $scope.customer_program[i].program.review_status,
                            "whoops_status": $scope.customer_program[i].whoops_status,
                            "whoops_final_release": $scope.customer_program[i].whoops_final_release,
                            "enhancement_final_release": $scope.customer_program[i].enhancement_final_release,
                           
                            "customerconfirmation_status": $scope.customer_program[i].customer_confirmation,
                            "competing_program": (function() {
                                var programs = [];
                                //to fix
                                for (j = 0; j < $scope.customer_program[i].competing_program.length; j++) {
                                    programs[j] = {
                                        "object_id": $scope.customer_program[i].competing_program[j].object_id,
                                        "program_id": $scope.customer_program[i].competing_program[j].program_id,
                                        "university": $scope.customer_program[i].competing_program[j].university,
                                        "school": $scope.customer_program[i].competing_program[j].school,
                                        "program_name": $scope.customer_program[i].competing_program[j].program_name,
                                        "program_degree": $scope.customer_program[i].competing_program[j].program_degree,
                                        "order": $scope.customer_program[i].competing_program[j].order,
                                        "enhancement_status": $scope.customer_program[i].competing_program[j].enhancement_status
                                    }

                                }


                                programs.sort(function(a, b) {
                                    return parseInt(a.order) - parseInt(b.order);
                                });

                                if (programs.length === 0) {
                                    programs.push({
                                        "object_id": null,
                                        "program_id": null,
                                        "order": 1,
                                        "enhancement_status": "in progress"

                                    })
                                }

                                // programs.sort(function(a, b) {
                                //   return (a.order.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
                                // });
                                return programs;

                            })(),

                        });

                    }

                    App.blocks('#client_block2', 'state_normal');



        }).
        catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));
            App.blocks('#client_block2', 'state_normal');

        });

    }



        $scope.post_competing_program = function(parentId, Id, order) {

            $scope.post_competing_program_array = [];
            $scope.post_competing_program_array.push({
                                'customer_program_id': parentId,
                                'program_id': Id,
                                'order': order,
                                'enhancement_status': 'in progress',

            })


            console.log(' $scope.post_competing_program_array = '+ JSON.stringify($scope.post_competing_program_array));
            
                 $http({
                        url: '/api/upgrid/accountmanager/client/competing_program/',
                        method: 'POST',
                        headers: {
                            'Authorization': 'JWT ' + token,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'customer_competing_program': $scope.post_competing_program_array
                        }

                   
                }).then(function(response) {

                        console.log("success add")

                        $timeout(function () {
                //alert('initing');
            //select2 init


                    jQuery(".js-data-example-ajax").select2({
                              ajax: {
                                url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.competing_string.slice(0, -1),
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
                                            text: item.program_name + ' (' +item.program_degree + ') ' + '[ '+item.program_university +' - '+ item.program_school +' ]',


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
                              placeholder: "Select a competing program",
                              
                              
                            });        //

                                $scope.show_select2 = true

                        }, 100);



                    }).
                    catch(function(error) {
                        console.log('an error occurred...' + JSON.stringify(error));

                    });




        }


         $scope.update_list = function(Id) {

                $http({
                        url: '/api/upgrid/accountmanager/client/' + Id,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token
                        }

                  
               

                }).then(function(response) {


                    $scope.customer_program = response.data.customer_program;
                    console.log("$scope.customer_program="+JSON.stringify($scope.customer_program));

                //generate selected_customprogram list
                    $scope.selected_customprogram = [];
                    

                    for (i = 0; i < $scope.customer_program.length; i++) {

                        console.log("i=" + i)

                        $scope.selected_customprogram.push({
                            "customer_program_id": $scope.customer_program[i].object_id,
                            "program_id": $scope.customer_program[i].program.object_id,
                            "university": $scope.customer_program[i].program.program_display.split('--')[0].split('-')[0].split(':')[1],
                            "school": $scope.customer_program[i].program.program_display.split('--')[0].split('-')[1],
                            "program_name": $scope.customer_program[i].program.program_display.split('--')[1],
                            "program_degree": $scope.customer_program[i].program.program_display.split('--')[2],
                            "assignment_status": $scope.customer_program[i].program.assignment_status,
                            "review_status": $scope.customer_program[i].program.review_status,
                            "whoops_status": $scope.customer_program[i].whoops_status,
                            "whoops_final_release": $scope.customer_program[i].whoops_final_release,
                            "enhancement_final_release": $scope.customer_program[i].enhancement_final_release,
                           
                            "customerconfirmation_status": $scope.customer_program[i].customer_confirmation,
                            "competing_program": (function() {
                                var programs = [];
                                //to fix
                                for (j = 0; j < $scope.customer_program[i].competing_program.length; j++) {
                                    programs[j] = {
                                        "object_id": $scope.customer_program[i].competing_program[j].object_id,
                                        "program_id": $scope.customer_program[i].competing_program[j].program_id,
                                        "university": $scope.customer_program[i].competing_program[j].university,
                                        "school": $scope.customer_program[i].competing_program[j].school,
                                        "program_name": $scope.customer_program[i].competing_program[j].program_name,
                                        "program_degree": $scope.customer_program[i].competing_program[j].program_degree,
                                        "order": $scope.customer_program[i].competing_program[j].order,
                                        "enhancement_status": $scope.customer_program[i].competing_program[j].enhancement_status
                                    }

                                }



                                programs.sort(function(a, b) {
                                    return parseInt(a.order) - parseInt(b.order);
                                });

                                if (programs.length === 0) {
                                    programs.push({
                                        "object_id": null,
                                        "program_id": null,
                                        "order": 1,
                                        "enhancement_status": "in progress"

                                    })
                                }

                                // programs.sort(function(a, b) {
                                //   return (a.order.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
                                // });
                                return programs;

                            })(),

                        });

                    }


                    $timeout(function () {
                //alert('initing');
            //select2 init


                    jQuery(".js-data-example-ajax").select2({
                              ajax: {
                                url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.competing_string.slice(0, -1),
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
                                            text: item.program_name + ' (' +item.program_degree + ') ' + '[ '+item.program_university +' - '+ item.program_school +' ]',


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
                              placeholder: "Select a competing program",
                              
                              
                            });        //

                                $scope.show_select2 = true

                        }, 100);


                    console.log("$scope.selected_customprogram="+JSON.stringify($scope.selected_customprogram));



        }).
        catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

        });

    }


    });


// loading of ceeb
// loading of competing
// 2 hrs token