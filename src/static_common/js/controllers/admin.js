angular.module('myApp').controller('AdminMainController',
    function(apiService, tableDataService, $sce, $timeout, $state, avatarService, Client, $http, authenticationSvc, $scope, $window) {

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

        //For stats
        $scope.active_num = 0;
        $scope.client_num = Client.length;
        for (var i = 0; i < Client.length; i++) {
            if (Client[i].is_active === true) {
                $scope.active_num++;
            }
        }

        var initWizardSimple = function() {
            jQuery('.js-wizard-simple').bootstrapWizard({
                'tabClass': '',
                'firstSelector': '.wizard-first',
                'previousSelector': '.wizard-prev',
                'nextSelector': '.wizard-next',
                'lastSelector': '.wizard-last',
                'onTabShow': function(tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var percent = (current / total) * 100;

                    // Get vital wizard elements
                    var wizard = navigation.parents('.block');
                    var progress = wizard.find('.wizard-progress > .progress-bar');
                    var btnPrev = wizard.find('.wizard-prev');
                    var btnNext = wizard.find('.wizard-next');
                    var btnFinish = wizard.find('.wizard-finish');

                    // Update progress bar if there is one
                    if (progress) {
                        progress.css({
                            width: percent + '%'
                        });
                    }

                    // If it's the last tab then hide the last button and show the finish instead
                    if (current >= total) {
                        btnNext.hide();
                        btnFinish.show();
                    } else {
                        btnNext.show();
                        btnFinish.hide();
                    }
                }
            });

        };

        // Init wizards with validation, for more examples you can check out http://vadimg.com/twitter-bootstrap-wizard-example/
        var initWizardValidation = function() {
            // Get forms
            var form1 = jQuery('.js-form1');

            // Prevent forms from submitting on enter key press
            form1.on('keyup keypress', function(e) {
                var code = e.keyCode || e.which;

                if (code === 13) {
                    e.preventDefault();
                    return false;
                }
            });

            // Init form validation on classic wizard form
            var validator1 = form1.validate({
                errorClass: 'help-block text-center animated fadeInUp',
                errorElement: 'div',
                errorPlacement: function(error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function(e) {
                    jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                success: function(e) {
                    jQuery(e).closest('.form-group').removeClass('has-error');
                    jQuery(e).closest('.help-block').remove();
                },
                rules: {
                    'simple-classic-progress-account-name': {
                        required: true,
                        minlength: 5
                    },
                    'validation-classic-lastname': {
                        required: true,
                        minlength: 2
                    },
                    'validation-classic-email': {
                        required: true,
                        email: true
                    },
                    'validation-classic-details': {
                        required: true,
                        minlength: 5
                    },
                    'validation-classic-city': {
                        required: true
                    },
                    'validation-classic-skills': {
                        required: true
                    },
                    'validation-classic-terms': {
                        required: true
                    }
                },
                messages: {
                    'simple-classic-progress-account-name': {
                        required: 'Please enter a name',
                        minlength: 'The name must consist of at least 5 characters'
                    },
                    'validation-classic-lastname': {
                        required: 'Please enter a lastname',
                        minlength: 'Your lastname must consist of at least 2 characters'
                    },
                    'validation-classic-email': 'Please enter a valid email address',
                    'validation-classic-details': 'Let us know a few thing about yourself',
                    'validation-classic-skills': 'Please select a skill!',
                    'validation-classic-terms': 'You must agree to the service terms!'
                }
            });

            // Init classic wizard with validation
            jQuery('.js-wizard-simple').bootstrapWizard({
                'tabClass': '',
                'previousSelector': '.wizard-prev',
                'nextSelector': '.wizard-next',
                'onTabShow': function(tab, nav, index) {
                    var total = nav.find('li').length;
                    var current = index + 1;

                    // Get vital wizard elements
                    var wizard = nav.parents('.block');
                    var btnNext = wizard.find('.wizard-next');
                    var btnFinish = wizard.find('.wizard-finish');

                    // If it's the last tab then hide the last button and show the finish instead
                    if (current >= total) {
                        btnNext.hide();
                        btnFinish.show();
                    } else {
                        btnNext.show();
                        btnFinish.hide();
                    }
                },
                'onNext': function(tab, navigation, index) {
                    var valid = form1.valid();

                    if (!valid) {
                        validator1.focusInvalid();

                        return false;
                    }
                },
                onTabClick: function(tab, navigation, index) {
                    return false;
                }
            });

        };

        //get ceebs
        $http({
          url: '/api/upgrid/accountmanager/ceebs/',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function (response) {

           $scope.get_ceebs = response.data;
           console.log("ceebs got")
        }).
         catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));

         });


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


        // $scope.removeItem = function(index) {
        //     if ($scope.pwhide) {

        //         for (var i = 0; i < $scope.put_customer_program_array.length; i++) {

        //             if ($scope.selected_customprogram[index].customer_program_id === $scope.put_customer_program_array[i].customer_program_id) {
        //                 $scope.put_customer_program_array.splice(i, 1)
        //                 break;
        //             }

        //         }


        //         for (var i = 0; i < $scope.put_competing_program_array.length; i++) {

        //             if ($scope.selected_customprogram[index].customer_program_id === $scope.put_competing_program_array[i].customer_program_id) {
        //                 $scope.put_competing_program_array.splice(i, 1)

        //             }

        //         }


        //         $scope.delete_customer_program_string = $scope.delete_customer_program_string + $scope.selected_customprogram[index].customer_program_id + '/'
        //         $scope.selected_customprogram.splice(index, 1)



        //     } else {
        //         $scope.selected_customprogram.splice(index, 1)
        //         console.log("index=" + index);
        //         console.log("creating user")
        //     }

        // }



         //for add and edit
        $scope.addnew = function(Id) {

            $scope.show_program = false
            $scope.success_client_id = null;

            $scope.adding_new = false;
            //$scope.success_client_id = "ec77b4dd-d80f-4ee1-9ed3-df826ce37749";

            $scope.pwhide = Id;
            console.log("pwhide Id= " + Id)
            App.blocks('#client_block', 'state_loading');
            $scope.modaltitle = "Add a new client";
            $scope.generate_or_add = "Generate program(s)";

            // Init simple wizard
            initWizardSimple();

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
            $scope.dep_pro_table = null;
            $scope.account_type = "main";

            //tab 2
            ///load for ceeb and competing schools
            $http({
                url: '/',
                method: 'GET',
                
            }).then(function(response) {

               
                // $scope.listbox = $('#competingschools').bootstrapDualListbox({
                //     nonSelectedListLabel: 'Available competing schools',
                //     selectedListLabel: 'Chosen competing schools',
                //     preserveSelectionOnMove: 'moved',
                //     moveOnSelect: false,
                //     infoText: 'Total: {0}',
                //     selectorMinimalHeight: 200

                // });

                $scope.listbox = $('#competingschools1').bootstrapDualListbox({
                    nonSelectedListLabel: 'Available competing schools',
                    selectedListLabel: 'Chosen competing schools',
                    preserveSelectionOnMove: 'moved',
                    moveOnSelect: false,
                    infoText: 'Total: {0}',
                    selectorMinimalHeight: 200

                });

                //  $scope.listbox.find('option').remove();
                // $scope.listbox.bootstrapDualListbox('refresh', true);



                var competing_schools_options = "";
                //get competing school list e.g. format: <option value='5e7a795b-2ee2-49dd-9a08-60c48d76f27b'>2120: None - School of Journalism</option>
                for (i = 0; i < $scope.get_ceebs.length; i++) {
                    competing_schools_options = competing_schools_options + "<option value='" + $scope.get_ceebs[i].object_id + "'>" + $scope.get_ceebs[i].university_school + "</option>";
                }
                console.log("competing_schools_options = "+competing_schools_options)

                $scope.listbox.find('option').remove().end().append(competing_schools_options);
                $scope.listbox.bootstrapDualListbox('refresh', true);

                jQuery('.js-wizard-simple').bootstrapWizard('first');
                App.blocks('#client_block', 'state_normal');
                // jQuery('.js-wizard-simple').find("a[href*='simple-classic-progress-step1']").trigger('click');
            }).
            catch(function(error) {
                console.log('an error occurred...' + JSON.stringify(error));

            });

        }



        $scope.editold = function(Id) {

                App.blocks('#client_block', 'state_loading');
                $scope.modaltitle = "Edit a client";
                $scope.generate_or_add = "Add program(s)"
                $scope.pwhide = Id;
                console.log("pwhide Id = " + Id);

                $scope.editing_new = false
                // Init simple wizard
                initWizardSimple();

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

                $scope.showtable = true;
                $scope.dep_pro_table = null;

                //***************************get ceebs****************************
             

                    //init duallistbox
                    $scope.listbox = $('#competingschools2').bootstrapDualListbox({
                        nonSelectedListLabel: 'Available competing schools',
                        selectedListLabel: 'Chosen competing schools',
                        preserveSelectionOnMove: 'moved',
                        moveOnSelect: false,
                        infoText: 'Total: {0}',
                        selectorMinimalHeight: 200

                    });


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


                    if (!$scope.is_demo) {
                        $scope.is_demo = false
                    }

                    console.log("editold $scope.is_demo" + $scope.is_demo);

                    console.log("competing_edit= " + JSON.stringify($scope.competing_edit));

                    //select the ceeb
                    for (i = 0; i < $scope.get_ceebs.length; i++) {
                        $scope.get_ceebs[i].selected = false;

                        for (j = 0; j < $scope.competing_edit.length; j++) {
                            if ($scope.get_ceebs[i].object_id === $scope.competing_edit[j].object_id) {
                                $scope.get_ceebs[i].selected = true;
                                break;
                            }
                        }

                    }

                    console.log("edit customer program = " + JSON.stringify($scope.customer_program));

                    console.log("$scope.get_ceebs" + JSON.stringify($scope.get_ceebs));


                    //select competing schools for duallistbox
                    var competing_schools_options = "";
                    //get competing school list e.g. format: <option value='5e7a795b-2ee2-49dd-9a08-60c48d76f27b'>2120: None - School of Journalism</option>

                    for (i = 0; i < $scope.get_ceebs.length; i++) {
                        if ($scope.get_ceebs[i].selected) {
                            competing_schools_options = competing_schools_options + "<option value='" + $scope.get_ceebs[i].object_id + "' selected>" + $scope.get_ceebs[i].university_school + "</option>";
                        } else {
                            competing_schools_options = competing_schools_options + "<option value='" + $scope.get_ceebs[i].object_id + "'>" + $scope.get_ceebs[i].university_school + "</option>";
                        }

                    }

                    $scope.listbox.find('option').remove().end().append(competing_schools_options);
                    $scope.listbox.bootstrapDualListbox('refresh', true);


                    //generate selected_customprogram list
                    $scope.selected_customprogram = [];
                    $scope.selected_customprogram_copy = [];

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



                    console.log("$scope.selected_customprogram="+JSON.stringify($scope.selected_customprogram));

                    //only using for compare in submit to check new program
                    for (i = 0; i < $scope.customer_program.length; i++) {

                        console.log("i=" + i)

                        $scope.selected_customprogram_copy.push({
                            "customer_program_id": $scope.customer_program[i].object_id,
                            "program_id": $scope.customer_program[i].program.object_id,
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

                    console.log("selected program is " + JSON.stringify($scope.selected_customprogram));


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

                    //creating table for department table (tab 3)
                    $scope.dep_pro_table = [];


                    for (i = 1; i < $scope.get_departments.length; i++) {


                        $scope.dep_pro_table.push($scope.get_departments[i]);

                    }

                    for (i = 0; i < $scope.dep_pro_table.length; i++) {
                        $scope.dep_pro_table[i].isTrue = false;
                    }



                    $scope.unselected_programs = [];
                    $scope.all_programs = [];


                    console.log("edit $scope.dep_pro_table=" + JSON.stringify($scope.dep_pro_table));

                    //$scope.dep_pro_table is the loaded dep lost. i.e. [{"department":"Applied Physics and Applied Mathematics","isTrue":false},{"department":"Computer Science","isTrue":false},{"department":"Other","isTrue":false}]
                    angular.forEach($scope.dep_pro_table, function(value, index) {
                        var dep = value.department;
                        var depTemp = dep.replace('&', '!')
                        console.log("value=" + value.department)

                        console.log('/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.ceeb + ((depTemp === 'All') ? '' : ('&dep=' + (depTemp === 'Other' ? 'Others' : depTemp))))
                        $http({
                            url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.ceeb + ((depTemp === 'All') ? '' : ('&dep=' + (depTemp === 'Other' ? 'Others' : depTemp))),
                            method: 'GET',
                            headers: {
                                'Authorization': 'JWT ' + token
                            }
                        }).then(function(response) {
                            console.log("response = " + JSON.stringify(response))
                            console.log("custom programs=" + JSON.stringify(response.data));
                            console.log("value=" + JSON.stringify(value));

                            ///////filter the selected programs

                            console.log("each dep programs = " + JSON.stringify(response.data))

                            for (var i = 0; i < response.data.results.length; i++)
                            {

                                $scope.all_programs.push(response.data.results[i])

                                // var exist_in_selected = false
                                // for (var j = 0; j < $scope.selected_customprogram.length; j++) {
                                //     if (response.data[i].object_id === $scope.selected_customprogram[j].program_id) {
                                //         exist_in_selected = true;
                                //         break;
                                //     }
                                // }

                                // if (exist_in_selected === false) {
                                //     response.data[i].department = dep;
                                //     $scope.unselected_programs.push(response.data[i]);
                                // }


                                    response.data.results[i].department = dep;
                                    $scope.unselected_programs.push(response.data.results[i]);
                                console.log("$scope.unselected_programs="+JSON.stringify($scope.unselected_programs));

                            }

                            
                            console.log("edit dep = " + dep);
                            //console.log("exist $scope.unselected_programs = " + JSON.stringify($scope.unselected_programs));
                            /////////


                            var raw_programs = response.data;

                            for (i = 0; i < raw_programs.length; i++) {
                                raw_programs[i].isTrue = false;
                            }



                            $scope.dep_pro_table[index].programs = raw_programs;


                            console.log("Final dep_pro = " + JSON.stringify($scope.dep_pro_table));

                        }).
                        catch(function(error) {
                            console.log('an error occurred...' + JSON.stringify(error));

                        });

                    });






                    //////


                    $scope.competing_string = "";

                    var competing_list = document.getElementById("bootstrap-duallistbox-selected-list_");
                    for (i = 0; i < competing_list.options.length; i++) {
                        $scope.competing_string = $scope.competing_string + competing_list.options[i].value + '/';
                    }

                    console.log('/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.competing_string.slice(0, -1));
                    


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
                                text: item.program_name + '(' +item.program_degree + ')'+ '['+item.program_university +'-'+ item.program_school +']',


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
                  
                  
                });        //
                

                    jQuery('.js-wizard-simple').bootstrapWizard('first');
                    App.blocks('#client_block', 'state_normal');

                }).catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));

                });


            } //end of editold




        $scope.add_in = function(added) {
            console.log("added = " + JSON.stringify(added));


            if (added) {

                $scope.selected_customprogram.push({
                    "program_id": added.object_id,
                    "program_name": added.program_name,
                    "program_degree": added.program_degree,
                    "assignment_status": added.assignment_status,
                    "review_status": added.review_status,
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


            }

            $scope.unselected_programs = [];

            for (var i = 0; i < $scope.all_programs.length; i++)

            {

                var exist_in_selected = false
                for (var j = 0; j < $scope.selected_customprogram.length; j++) {
                    if ($scope.all_programs[i].object_id === $scope.selected_customprogram[j].program_id) {
                        exist_in_selected = true;
                        break;
                    }
                }

                if (exist_in_selected === false) {
                    $scope.unselected_programs.push($scope.all_programs[i])
                }

            }

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

                $scope.details = response.data;



                response.data.unshift({
                    "department": "All"
                });

                response.data.push({
                    "department": "Other"
                });


                console.log("all_depart" + JSON.stringify(response.data));

                $scope.get_departments = response.data;


                //for creating programs for department list
                // angular.forEach()
                // pro_dep()
                $scope.dep_pro_table = [];


                for (var i = 1; i < $scope.get_departments.length; i++) {


                    $scope.dep_pro_table.push($scope.get_departments[i]);

                }

                for (var i = 0; i < $scope.dep_pro_table.length; i++) {
                    $scope.dep_pro_table[i].isTrue = false;
                }


                angular.forEach($scope.dep_pro_table, function(value, index) {
                    var dep = value.department;
                    console.log("value=" + value.department)
                    depTemp = dep.replace('&', '!')
                    $http({
                        url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.ceeb + ((depTemp === 'All') ? '' : ('&dep=' + (depTemp === 'Other' ? 'Others' : depTemp))),
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token
                        }
                    }).then(function(response) {
                        console.log("response = " + JSON.stringify(response))
                        console.log("custom programs=" + JSON.stringify(response.data));
                        console.log("value=" + JSON.stringify(value));

                        var raw_programs = response.data;

                        for (var i = 0; i < raw_programs.length; i++) {
                            raw_programs[i].isTrue = false;
                        }

                        $scope.dep_pro_table[index].programs = raw_programs;


                        console.log("Final dep_pro = " + JSON.stringify($scope.dep_pro_table));


                    }).
                    catch(function(error) {
                        console.log('an error occurred...' + JSON.stringify(error));

                    });

                });


            }).
            catch(function(error) {
                console.log('an error occurred...' + JSON.stringify(error));

            });



        }



        $scope.submit_add = function() {

            $scope.adding_new = true;
            var competing_array = [];
            var competing_list = document.getElementById("bootstrap-duallistbox-selected-list_");
            for (i = 0; i < competing_list.options.length; i++) {
                competing_array.push(competing_list.options[i].value);
            }
            console.log("competing_array=" + JSON.stringify(competing_array));

            var competing_schools_obj = [];
            for (i = 0; i < competing_array.length; i++) {
                competing_schools_obj.push({
                    "object_id": competing_array[i]
                })
            }

            console.log("competing_schools_obj" + JSON.stringify(competing_schools_obj));




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
                        "isDemo": $scope.is_demo
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

                    $.notify({

                        // options
                        icon: "fa fa-check",
                        message: 'The client has been created.'
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



        $scope.observe_checkbox = function(Pid, Id) {
            console.log(Pid + ' ' + Id);
            $scope.dep_pro_table[Pid].isTrue = true;
            for (var i = 0; i < $scope.dep_pro_table[Pid].programs.length; i++) {
                if ($scope.dep_pro_table[Pid].programs[i].isTrue === false) {
                    $scope.dep_pro_table[Pid].isTrue = false;
                    break;
                }

            }
        }


        $scope.checkmaster = function(value) {
            console.log(value);
            for (var i = 0; i < $scope.dep_pro_table.length; i++) {
                $scope.dep_pro_table[i].isTrue = value;
                for (j = 0; j < $scope.dep_pro_table[i].programs.length; j++) {
                    $scope.dep_pro_table[i].programs[j].isTrue = value;
                }
            }
        }


        $scope.client_programs = [];
        $scope.print = function(Pid, Id, program, isTrue) {
            console.log(Pid + ' ' + Id + ' ' + "value= " + isTrue);
            console.log("program is " + JSON.stringify(program));
            // if(isTrue){
            //   $scope.client_programs.push(program)
            //   console.log("index in array is"+ $scope.client_programs.indexOf(program));
            // }

            console.log("Final dep_pro = " + JSON.stringify($scope.dep_pro_table));
        }

        $scope.check_all = function(index) {
            //alert("index= "+index)

            for (var i = 0; i < $scope.dep_pro_table[index].programs.length; i++) {
                $scope.dep_pro_table[index].programs[i].isTrue = $scope.dep_pro_table[index].isTrue;
            }


            console.log("Final dep_pro = " + JSON.stringify($scope.dep_pro_table));


        }

        $scope.showtable = true;

        //create programs on creating
        $scope.generate_table = function() {
            $scope.showtable = false;


            $scope.rowCollection_new = [];

            for (var i = 0; i < $scope.dep_pro_table.length; i++) {

                for (j = 0; j < $scope.dep_pro_table[i].programs.length; j++) {
                    if ($scope.dep_pro_table[i].programs[j].isTrue === true) {
                        $scope.rowCollection_new.push($scope.dep_pro_table[i].programs[j]);
                    }
                }

            }


            console.log("$scope.rowCollection_new = " + JSON.stringify($scope.rowCollection_new));



            $scope.selected_customprogram = [];

            for (i = 0; i < $scope.rowCollection_new.length; i++) {

                console.log("i=" + i)
                    //"customerconfirmation_status": "",
                $scope.selected_customprogram.push({
                    "program_id": $scope.rowCollection_new[i].object_id,
                    "program_name": $scope.rowCollection_new[i].program_name,
                    "program_degree": $scope.rowCollection_new[i].program_degree,
                    "assignment_status": $scope.rowCollection_new[i].assignment_status,
                    "review_status": $scope.rowCollection_new[i].review_status,
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
                        // programs.sort(function(a, b) {
                        //   return (a.programName.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
                        // });
                        return programs;

                    })(),

                });

            }

        }


        $scope.submit_edit = function() {
            $scope.editing_new = true;


            var competing_array = [];
            var competing_list = document.getElementById("bootstrap-duallistbox-selected-list_");
            for (i = 0; i < competing_list.options.length; i++) {
                competing_array.push(competing_list.options[i].value);
            }
            console.log("competing_array=" + JSON.stringify(competing_array));

            var competing_schools_obj = [];
            for (i = 0; i < competing_array.length; i++) {
                competing_schools_obj.push({
                    "object_id": competing_array[i]
                })
            }

            console.log("competing_schools_obj" + JSON.stringify(competing_schools_obj));


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
                         
                    $scope.editing_new = false
                    //console.log("submit program list = "+JSON.stringify($scope.selected_customprogram));
                }).
                catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));
                    $scope.editing_new = false

                });

            


        }






        $scope.generate_table_add = function() {

            $scope.showtable = false;


            $scope.rowCollection_new = [];

            for (var i = 0; i < $scope.dep_pro_table.length; i++) {

                for (j = 0; j < $scope.dep_pro_table[i].programs.length; j++) {
                    if ($scope.dep_pro_table[i].programs[j].isTrue === true) {
                        $scope.rowCollection_new.push($scope.dep_pro_table[i].programs[j]);
                    }
                }

            }


            console.log("$scope.rowCollection_new = " + JSON.stringify($scope.rowCollection_new));



            $scope.selected_customprogram = [];

            for (i = 0; i < $scope.rowCollection_new.length; i++) {

                console.log("i=" + i)
                    //"customerconfirmation_status": "",
                $scope.selected_customprogram.push({
                    "program_id": $scope.rowCollection_new[i].object_id,
                    "program_name": $scope.rowCollection_new[i].program_name,
                    "program_degree": $scope.rowCollection_new[i].program_degree,
                    "assignment_status": $scope.rowCollection_new[i].assignment_status,
                    "review_status": $scope.rowCollection_new[i].review_status,
                    "whoops_status": "in progress",
                    "whoops_final_release": "False",
                    "enhancement_final_release": "False",

                    "competing_program": (function() {
                        var programs = [];
                        for (var j = 0; j < 1; j++) {
                            programs[j] = {

                                "object_id": "",
                                "order": j + 1,
                                "university": null,
                                "school": null,
                                "program_name": null,
                                "program_degree": null,
                                "enhancement_status": "in progress"
                            }

                        }
                        // programs.sort(function(a, b) {
                        //   return (a.programName.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
                        // });
                        return programs;

                    })(),

                });

            } // end of loop


            console.log("$scope.selected_customprogram="+JSON.stringify($scope.selected_customprogram));

               $http({
                        url: '/api/upgrid/accountmanager/client/customer_program/',
                        method: 'POST',
                        data: {
                            'client_id': $scope.success_client_id,
                            "selected_customer_program": $scope.selected_customprogram
                        },
                        headers: {
                            'Authorization': 'JWT ' + token
                        }
                    

                }).then(function(response) {


                    
                   console.log("programsadded....")

                   return  $http({
                        url: '/api/upgrid/accountmanager/client/' + $scope.success_client_id,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token
                        }

                  
                     });

                }).then(function(response) {


                    $scope.customer_program = response.data.customer_program;
                    console.log("$scope.customer_program="+JSON.stringify($scope.customer_program));

                //generate selected_customprogram list
                    $scope.selected_customprogram = [];
                    $scope.selected_customprogram_copy = [];

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


                    console.log("$scope.selected_customprogram="+JSON.stringify($scope.selected_customprogram));




                }).
                catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));

                });




        }


        var flag = true;
        //generate competing program list on table row click
        $scope.load_competing = function() {

            if (flag == false) {
                flag = !flag;
                return;
            }
            flag = !flag;
            var temp = JSON.stringify($scope.selected_customprogram);
            // alert(JSON.stringify(temp));
            var competing_string = "";

            var competing_list = document.getElementById("bootstrap-duallistbox-selected-list_");
            for (i = 0; i < competing_list.options.length; i++) {
                competing_string = competing_string + competing_list.options[i].value + '/';
            }

            //console.log("competing_string=" + JSON.stringify(competing_string));
            $scope.competing_program_array = [];
            //alert(JSON.stringify($scope.selected_customprogram));
            //if competing school has selection
            if (competing_string !== "") {
                // alert('start');
                console.log("competing_string now = " + JSON.stringify(competing_string.slice(0, -1)));
                $http({
                    url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + competing_string.slice(0, -1),
                    method: 'GET',
                    headers: {
                        'Authorization': 'JWT ' + token
                    }
                }).then(function(response) {
                    //console.log("competing_programs" + JSON.stringify(response.data));
                    var temp1 = JSON.stringify(response.data);
                    var load_competing_programs = JSON.parse(temp1);
                    //alert(JSON.stringify($scope.selected_customprogram));
                    for (var i = 0; i < load_competing_programs.length; i++) {
                        $scope.competing_program_array.push({
                            "object_id": load_competing_programs[i].object_id,
                            "display": load_competing_programs[i].Ceeb + " - " + load_competing_programs[i].program_university + " - " + load_competing_programs[i].program_school + " - " + load_competing_programs[i].program_name + " - " + load_competing_programs[i].program_degree
                        })
                    }

                    $scope.isChange = true;
                    //alert(JSON.stringify($scope.selected_customprogram));
                    $scope.selected_customprogram = JSON.parse(temp);
                    // alert(JSON.stringify($scope.displayeddata1));
                    console.log("load_competing_programs now=" + JSON.stringify(load_competing_programs));
                    console.log("competing_program_array now=" + JSON.stringify($scope.competing_program_array));

                }).
                catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));

                });

            } else {

                $scope.competing_program_array = [];
            }

        }

        $scope.checkvalue = function() {
            console.log("tryit=" + $scope.tryit);
        }


        $scope.send_competing = function(pid, cid) {
            console.log("pid cid" + pid + ' ' + cid);
            //console.log("result = "+this.row1.selectedName);

            //$scope.selected_customprogram[pid].competing_program[cid].object_id = this.row1.selectedName;
            console.log("selected_customprogram=" + JSON.stringify($scope.selected_customprogram));

        }


        // $scope.put_customer_program = function(index) {
        //     if ($scope.pwhide) {
        //         console.log("changed program is " + JSON.stringify($scope.selected_customprogram[index]))


        //         var isInArray = false;



        //         for (var i = 0; i < $scope.put_customer_program_array.length; i++) {

        //             if ($scope.selected_customprogram[index].customer_program_id === $scope.put_customer_program_array[i].customer_program_id) {
        //                 isInArray = true;
        //                 break;
        //             }

        //         }

        //         console.log("i=" + i)

        //         if (isInArray) {
        //             $scope.put_customer_program_array[i] = {
        //                 'program_id': $scope.selected_customprogram[index].program_id,
        //                 'customer_program_id': $scope.selected_customprogram[index].customer_program_id,
        //                 'whoops_status': $scope.selected_customprogram[index].whoops_status,
        //                 'whoops_final_release': $scope.selected_customprogram[index].whoops_final_release,
        //                 'enhancement_final_release': $scope.selected_customprogram[index].enhancement_final_release,
        //                 'customer_confirmation': $scope.selected_customprogram[index].customerconfirmation_status,
        //             }

        //         } else {
        //             $scope.put_customer_program_array.push({
        //                 'program_id': $scope.selected_customprogram[index].program_id,
        //                 'customer_program_id': $scope.selected_customprogram[index].customer_program_id,
        //                 'whoops_status': $scope.selected_customprogram[index].whoops_status,
        //                 'whoops_final_release': $scope.selected_customprogram[index].whoops_final_release,
        //                 'enhancement_final_release': $scope.selected_customprogram[index].enhancement_final_release,
        //                 'customer_confirmation': $scope.selected_customprogram[index].customerconfirmation_status,
        //             })
        //         }


        //         // if(put_customer_program_array)

        //         // $scope.put_customer_program_array.push()
        //         console.log("put_customer_program_array= " + JSON.stringify($scope.put_customer_program_array));


        //     } else {
        //         console.log("creating user")
        //     }
        // }


        $scope.submit = function() {

            console.log("$$$$$$$$");

            var competing_array = [];
            var competing_list = document.getElementById("bootstrap-duallistbox-selected-list_");
            for (i = 0; i < competing_list.options.length; i++) {
                competing_array.push(competing_list.options[i].value);
            }
            console.log("competing_array=" + JSON.stringify(competing_array));

            var competing_schools_obj = [];
            for (i = 0; i < competing_array.length; i++) {
                competing_schools_obj.push({
                    "object_id": competing_array[i]
                })
            }

            console.log("competing_schools_obj" + JSON.stringify(competing_schools_obj));



            if ($scope.pwhide) {

                console.log("editing");

                //create post_competing-program_array
                for (var i = 0; i < $scope.selected_customprogram.length; i++) {

                    for (var j = 0; j < $scope.selected_customprogram[i].competing_program.length; j++) {
                        if (!$scope.selected_customprogram[i].competing_program[j].object_id && $scope.selected_customprogram[i].competing_program[j].program_id) {
                            $scope.post_competing_program_array.push({
                                'customer_program_id': $scope.selected_customprogram[i].customer_program_id,
                                'program_id': $scope.selected_customprogram[i].competing_program[j].program_id,
                                'order': $scope.selected_customprogram[i].competing_program[j].order,
                                'enhancement_status': $scope.selected_customprogram[i].competing_program[j].enhancement_status,

                            })
                        }
                    }

                }

                $scope.add_edit_program = [];



                console.log("$scope.selected_customprogram = " + JSON.stringify($scope.selected_customprogram));

                //for adding new programs
                for (var i = 0; i < $scope.selected_customprogram.length; i++) {

                    var exist_in_copy = false;

                    for (var j = 0; j < $scope.selected_customprogram_copy.length; j++) {

                        console.log("$scope.selected_customprogram[i].program_id = " + $scope.selected_customprogram[i].program_id)
                        console.log("$scope.selected_customprogram_copy[j].program_id" + $scope.selected_customprogram_copy[j].program_id)

                        if ($scope.selected_customprogram[i].program_id === $scope.selected_customprogram_copy[j].program_id) {
                            exist_in_copy = true;
                            break;
                        }
                    }

                    console.log("exist_in_copy = " + exist_in_copy);

                    if (exist_in_copy === false) {
                        $scope.add_edit_program.push({
                            "program_id": $scope.selected_customprogram[i].program_id,
                            "program_name": $scope.selected_customprogram[i].program_name,
                            "program_degree": $scope.selected_customprogram[i].program_degree,
                            "assignment_status": $scope.selected_customprogram[i].assignment_status,
                            "review_status": $scope.selected_customprogram[i].review_status,
                            "whoops_status": "in progress",
                            "whoops_final_release": "False",
                            "enhancement_final_release": "False",

                            "competing_program": (function() {
                                var programs = [];
                                for (var k = 0; k < 1; k++) {
                                    programs[k] = {

                                        "object_id": "",
                                        "order": k + 1,
                                        "enhancement_status": "in progress"
                                    }

                                }
                                // programs.sort(function(a, b) {
                                //   return (a.programName.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
                                // });
                                return programs;

                            })(),

                        });


                    }

                }

                console.log("$scope.add_edit_program = " + JSON.stringify($scope.add_edit_program));


                console.log("################Editing#####################");


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


                    //POST customer programs for users
                    return $http({
                        url: '/api/upgrid/accountmanager/client/customer_program/',
                        method: 'POST',
                        data: {
                            'client_id': $scope.pwhide,
                            "selected_customer_program": $scope.add_edit_program
                        },
                        headers: {
                            'Authorization': 'JWT ' + token
                        }
                    });


                }).then(function(response) {

                    console.log("successfully added customer programs");

                    //PUT customer programs for main and sub user
                    if ($scope.account_type === 'main') {

                        return $http({

                            url: '/api/upgrid/accountmanager/client/customer_program/',
                            method: 'PUT',
                            headers: {
                                'Authorization': 'JWT ' + token
                            },
                            data: {
                                "client_id": $scope.pwhide,
                                'selected_customer_program': $scope.put_customer_program_array
                            }

                        });

                    } else if ($scope.account_type === 'sub') {

                        return $http({

                            url: '/api/upgrid/accountmanager/client/customer_program/',
                            method: 'PUT',
                            headers: {
                                'Authorization': 'JWT ' + token
                            },
                            data: {
                                "client_id": $scope.pwhide,
                                'sub_client_program': $scope.put_customer_program_array
                            }

                        });
                    }



                }).then(function(response) {
                    console.log("successfully edit customer programs")

                    //POST competing
                    return $http({
                        url: '/api/upgrid/accountmanager/client/competing_program/',
                        method: 'POST',
                        headers: {
                            'Authorization': 'JWT ' + token,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'customer_competing_program': $scope.post_competing_program_array
                        }

                    });
                }).then(function(response) {

                    console.log("successfully added competing programs");

                    console.log("PUT competing array = "+JSON.stringify($scope.put_competing_program_array))
                    //PUT competing
                    return $http({

                        url: '/api/upgrid/accountmanager/client/competing_program/',
                        method: 'PUT',
                        headers: {
                            'Authorization': 'JWT ' + token,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            'customer_competing_program': $scope.put_competing_program_array
                        }

                    });

                }).then(function(response) {


                    console.log("client_data= " + JSON.stringify($scope.client_data));

                    for (var i = 0; i < $scope.client_data.length; i++) {
                        if ($scope.client_data[i].id === $scope.pwhide) {
                            console.log("found it");
                            $scope.client_data[i].contact_name = $scope.client_name;
                            $scope.client_data[i].department = $scope.department;
                            $scope.client_data[i].email = $scope.email;
                            break;
                        }
                    }


                    //no delete action
                    if ($scope.delete_customer_program_string === "" && $scope.delete_competing_program_array.length === 0) {
                        console.log("success" + JSON.stringify(response));

                        jQuery('#modal-large').modal('toggle');
                        $.notify({

                            // options
                            icon: "fa fa-check",
                            message: 'The client has been edited.'
                        }, {
                            // settings
                            type: 'success',
                            placement: {
                                from: "top",
                                align: "center"
                            },
                            z_index: 1999,
                        });


                    //delete action into 3 situations
                    } else {

                        //has delete competing but no customer delete
                        if ($scope.delete_customer_program_string === "" && $scope.delete_competing_program_array.length !== 0) {


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

                                jQuery('#modal-large').modal('toggle');
                                $.notify({

                                    // options
                                    icon: "fa fa-check",
                                    message: 'The client has been edited.'
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


                        //has delete customer but no need delete competing
                        if ($scope.delete_customer_program_string !== "" && $scope.delete_competing_program_array.length === 0) {

                            $http({
                                url: '/api/upgrid/accountmanager/client/customer_program/',
                                method: 'DELETE',
                                headers: {
                                    'Authorization': 'JWT ' + token,
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    'client_id': $scope.pwhide,
                                    'customer_program_id': $scope.delete_customer_program_string.slice(0, -1)
                                }

                            }).then(function(response) {

                                console.log("success delete customer program" + JSON.stringify(response));

                                jQuery('#modal-large').modal('toggle');
                                $.notify({

                                    // options
                                    icon: "fa fa-check",
                                    message: 'The client has been edited.'
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


                        //delete program and competing
                        if ($scope.delete_customer_program_string !== "" && $scope.delete_competing_program_array.length !== 0) {

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

                                return $http({
                                    url: '/api/upgrid/accountmanager/client/customer_program/',
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': 'JWT ' + token,
                                        'Content-Type': 'application/json'
                                    },
                                    data: {
                                        'client_id': $scope.pwhide,
                                        'customer_program_id': $scope.delete_customer_program_string.slice(0, -1)
                                    }

                                })

                            }).then(function(response) {

                                console.log("success detele all" + JSON.stringify(response));

                                jQuery('#modal-large').modal('toggle');
                                $.notify({

                                    // options
                                    icon: "fa fa-check",
                                    message: 'The client has been edited.'
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


                    } //end of else



                    //on demand for a single report
                  

                    angular.forEach($scope.selected_customprogram, function(value, index) {

                        if ($scope.selected_customprogram[index].whoops_final_release_alias === 'False' && $scope.selected_customprogram[index].whoops_final_release === 'True') {

                            console.log('num = ' + index + 'whoops customer_program_id=' + $scope.selected_customprogram[index].customer_program_id)


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
                            }).then(function(response) {
                                console.log(index + ' ' + 'Whoops released')

                            }).
                            catch(function(error) {
                                console.log('an error occurred...' + JSON.stringify(error));

                            });

                        }


                        if ($scope.selected_customprogram[index].enhancement_final_release_alias === 'False' && $scope.selected_customprogram[index].enhancement_final_release === 'True') {

                            console.log('num = ' + index + 'enhancement customer_program_id=' + $scope.selected_customprogram[index].customer_program_id)


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
                            }).then(function(response) {
                                console.log(index + ' ' + 'Enhancement released')

                            }).
                            catch(function(error) {
                                console.log('an error occurred...' + JSON.stringify(error));

                            });

                        }

                    });

                    //console.log("submit program list = "+JSON.stringify($scope.selected_customprogram));
                }).
                catch(function(error) {
                    console.log('an error occurred...' + JSON.stringify(error));

                });

            } else {

                /////////////////////////////////////////////////////////////////////

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
                        "isDemo": $scope.is_demo
                    },
                    headers: {
                        'Authorization': 'JWT ' + token,
                        'Content-Type': 'application/json'
                    }
                }).then(function(response) {


                    console.log("success create" + JSON.stringify(response));
                    console.log("submit selected_program = " + JSON.stringify($scope.selected_customprogram));
                    var success_client_id = response.data.client_id;
                    return $http({
                        url: '/api/upgrid/accountmanager/client/customer_program/',
                        method: 'POST',
                        data: {
                            'client_id': success_client_id,
                            "selected_customer_program": $scope.selected_customprogram
                        },
                        headers: {
                            'Authorization': 'JWT ' + token
                        }
                    });

                }).then(function(response) {


                    
                    apiService.getClient(token).then(function (result) {
          
                          
                    console.log("result===="+JSON.stringify(result))
                    //$scope.client_data = result;
                    $scope.client_data = tableDataService.getClientList(result);
                        //$scope.() = [].concat($scope.selected_customprogram);
                    //$scope.$broadcast('refreshProducts');

                    //jQuery('#modal-large').modal('toggle');

                    $.notify({

                        // options
                        icon: "fa fa-check",
                        message: 'The client has been created.'
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

        }

        //put competing programs
        $scope.put_competing = function(obj, cid, pro, order, estatus) {
           /* if($scope.isChange == true){
                $scope.isChange = false;
                return;
            }*/
            
            console.log("changing competing+++++++++++++++++");

            //existing competing has obj
            if ($scope.pwhide && obj) { 

                console.log('details-------='+ obj + ' ' + cid + ' ' + pro + ' ' + order + ' ' + estatus);

                var isInCompeting = false;

                //check if put already has the input cid and id  
                for (var i = 0; i < $scope.put_competing_program_array.length; i++) {

                    if ($scope.put_competing_program_array[i].customer_program_id === cid && $scope.put_competing_program_array[i].object_id === obj) {
                        isInCompeting = true;
                        break;
                    }
                }

                if (isInCompeting) {
                    $scope.put_competing_program_array[i] = {
                        'program_id': pro,
                        'customer_program_id': cid,
                        'object_id': obj,
                        'order': order,
                        'enhancement_status': estatus,
                    }

                } else {
                    $scope.put_competing_program_array.push({
                        'program_id': pro,
                        'customer_program_id': cid,
                        'object_id': obj,
                        'order': order,
                        'enhancement_status': estatus,
                    })
                }


                console.log("$scope.put_competing_program_array=" + JSON.stringify($scope.put_competing_program_array));

            } else {
                console.log("creating user")
            }

        }


        $scope.delete_competing = function(obj, Pid, id) {

            if ($scope.pwhide && obj) {

                $scope.delete_competing_program_array.push({
                    "object_id": obj
                })

                console.log("pushed into delete competing array");

            }

            //manually trigger put_competing to update order
            for (var i = id + 1; i < $scope.selected_customprogram[Pid].competing_program.length; i++) {
                alert(i);
                $scope.selected_customprogram[Pid].competing_program[i].order = $scope.selected_customprogram[Pid].competing_program[i].order - 1;
                if ($scope.selected_customprogram[Pid].competing_program[i].object_id) {

                    $scope.put_competing($scope.selected_customprogram[Pid].competing_program[i].object_id, $scope.selected_customprogram[Pid].customer_program_id, $scope.selected_customprogram[Pid].competing_program[i].program_id, $scope.selected_customprogram[Pid].competing_program[i].order, $scope.selected_customprogram[Pid].competing_program[i].enhancement_status);

                }
            }

            $scope.selected_customprogram[Pid].competing_program.splice(id, 1)

        }


        $scope.insert_competing = function(Pid, id) {
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

        }


        $scope.post_customer_program = function (added){

            $scope.add_edit_program = [];

            $scope.add_edit_program.push({
                    "program_id": added.object_id,
                    "program_name": added.program_name,
                    "program_degree": added.program_degree,
                    "assignment_status": added.assignment_status,
                    "review_status": added.review_status,
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


            // $scope.add_edit_program.push({
            //                 "program_id": $scope.selected_customprogram[i].program_id,
            //                 "program_name": $scope.selected_customprogram[i].program_name,
            //                 "program_degree": $scope.selected_customprogram[i].program_degree,
            //                 "assignment_status": $scope.selected_customprogram[i].assignment_status,
            //                 "review_status": $scope.selected_customprogram[i].review_status,
            //                 "whoops_status": "in progress",
            //                 "whoops_final_release": "False",
            //                 "enhancement_final_release": "False",

            //                 "competing_program": (function() {
            //                     var programs = [];
            //                     for (var k = 0; k < 1; k++) {
            //                         programs[k] = {

            //                             "object_id": "",
            //                             "order": k + 1,
            //                             "enhancement_status": "in progress"
            //                         }

            //                     }
            //                     // programs.sort(function(a, b) {
            //                     //   return (a.programName.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
            //                     // });
            //                     return programs;

            //                 })(),

            //             });


            
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


            return  $http({
                        url: '/api/upgrid/accountmanager/client/' + $scope.pwhide,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token
                        }

                  
                     });

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


                    console.log("$scope.selected_customprogram="+JSON.stringify($scope.selected_customprogram));



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

               $scope.details = response.data;

               console.log("return data"+ JSON.stringify(response.data));
               
            }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });

        }



        $scope.delete_customer_program = function (index) {

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


            return  $http({
                        url: '/api/upgrid/accountmanager/client/' + $scope.pwhide,
                        method: 'GET',
                        headers: {
                            'Authorization': 'JWT ' + token
                        }

                  
                     });

                }).then(function(response) {


                    $scope.customer_program = response.data.customer_program;
                    console.log("$scope.customer_program="+JSON.stringify($scope.customer_program));

                //generate selected_customprogram list
                    $scope.selected_customprogram = [];
                    $scope.selected_customprogram_copy = [];

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


                    console.log("$scope.selected_customprogram="+JSON.stringify($scope.selected_customprogram));



        }).
        catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

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


            console.log("parentId="+parentId+' '+'Id='+Id);
            
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
                    }).
                    catch(function(error) {
                        console.log('an error occurred...' + JSON.stringify(error));

                    });




        }


    });


// loading of ceeb
// loading of competing
// 2 hrs token