var admin = angular.module('myApp.admin', [])
admin.controller('AdminMainController',
  function($sce, $timeout, $state, avatarService, Client, $http, authenticationSvc, $scope, $window) {

    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.htmlPopover = $sce.trustAsHtml('1. Edit function modified.<br>2. Competing programs can now be added, edited and deleted<br>3. Currently no limit for the number of competing programs');


    $scope.itemsByPage = 25;
    $scope.orders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.client_data = Client;
    //sorting in alphabetical order
    $scope.client_data.sort(function(a, b) {
      return (a.contact_name.toLowerCase() > b.contact_name.toLowerCase()) ? 1 : ((b.contact_name.toLowerCase() > a.contact_name.toLowerCase()) ? -1 : 0);
    });

    console.log("client_data=" + JSON.stringify($scope.client_data));
    $scope.displayeddata = [].concat($scope.client_data);

    //For stats
    $scope.active_num = 0;
    $scope.client_num = $scope.client_data.length;
    for (i = 0; i < $scope.client_data.length; i++) {
      if ($scope.client_data[i].is_active === true) {
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


    $scope.removeItem = function(index) {
      if ($scope.pwhide) {

        for (var i = 0; i < $scope.put_customer_program_array.length; i++) {

          if ($scope.selected_customprogram[index].customer_program_id === $scope.put_customer_program_array[i].customer_program_id) {
            $scope.put_customer_program_array.splice(i, 1)
            break;
          }

        }


        for (var i = 0; i < $scope.put_competing_program_array.length; i++) {

          if ($scope.selected_customprogram[index].customer_program_id === $scope.put_competing_program_array[i].customer_program_id) {
            $scope.put_competing_program_array.splice(i, 1)

          }

        }


        $scope.delete_customer_program_string = $scope.delete_customer_program_string + $scope.selected_customprogram[index].customer_program_id + '/'
        $scope.selected_customprogram.splice(index, 1)



      } else {
        $scope.selected_customprogram.splice(index, 1)
        console.log("index=" + index);
        console.log("creating user")
      }

    }



    //for add and edit
    $scope.addnew = function(Id) {
      $scope.pwhide = Id;
      console.log("pwhide Id= " + Id)
      App.blocks('#client_block', 'state_loading');
      $scope.modaltitle = "Add a new client";
      $scope.generate_or_add = "Generate program(s)";
      // angular.element(document.getElementById("client_form").getElementsByClassName("form-group")).removeClass('has-error');
      // angular.element(document.getElementById("client_form").getElementsByClassName("help-block")).remove();

      // // Init wizards with validation
      // initWizardValidation();

      // Init simple wizard
      initWizardSimple();

      //jQuery('.js-wizard-simple').find("a[href*='simple-classic-progress-step1']").trigger('click');
      //jQuery('#rootwizard').find("a[href*='tab1']").trigger('click');
      // jQuery('.nav-tabs>li:nth-child(2)').removeClass('active');
      // jQuery('.nav-tabs>li:nth-child(3)').removeClass('active');
      // jQuery('#simple-classic-progress-step2').removeClass('active in');
      // jQuery('#simple-classic-progress-step3').removeClass('active in');
      // jQuery('#simple-classic-progress-step1').addClass('active in');
      // jQuery('.nav-tabs>li:first-child').addClass('active');
      // jQuery('.progress-bar.progress-bar-info').css("width", "33.3333%");


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

      $scope.showtable = true;
      $scope.dep_pro_table = null;
      $scope.dep_pro_table_displayed = null;
      
      //angular.element(document.getElementsByClassName("nav nav-tabs nav-justified").getElementsByTagName("li")).addClass('active');


      //tab 2
      ///load for ceeb and competing schools
      $http({
        url: '/api/upgrid/accountmanager/ceebs/',
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        $scope.details = response.data;

        console.log("all_ceebs" + JSON.stringify(response.data));
        $scope.get_ceebs = response.data;

        $scope.listbox = $('#competingschools').bootstrapDualListbox({
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

        $scope.listbox.find('option').remove().end().append(competing_schools_options);
        $scope.listbox.bootstrapDualListbox('refresh', true);

        jQuery('.js-wizard-simple').bootstrapWizard('first');
        App.blocks('#client_block', 'state_normal');
        // jQuery('.js-wizard-simple').find("a[href*='simple-classic-progress-step1']").trigger('click');
      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });

      //$('#datepicker1').datepicker('setDate', new Date(2011,10,30));
      //console.log("UTC="+$('#datepicker1').datepicker('getDate'));


    }



    $scope.editold = function(Id) {

      App.blocks('#client_block', 'state_loading');
      $scope.modaltitle = "Edit a client";
      $scope.generate_or_add = "Add program(s)"
      $scope.pwhide = Id;
      console.log("pwhide Id = " + Id);
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
      $scope.dep_pro_table_displayed = null;



      //***************************get ceebs****************************
      ///load for ceeb and competing schools
      $http({
        url: '/api/upgrid/accountmanager/ceebs/',
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {
        console.log("all_ceebs" + JSON.stringify(response.data));
        $scope.get_ceebs = response.data;

        //init duallistbox
        $scope.listbox = $('#competingschools').bootstrapDualListbox({
          nonSelectedListLabel: 'Available competing schools',
          selectedListLabel: 'Chosen competing schools',
          preserveSelectionOnMove: 'moved',
          moveOnSelect: false,
          infoText: 'Total: {0}',
          selectorMinimalHeight: 200

        });


        $scope.showtable = false;


        //**************************get user info******************************
        return $http({
          url: '/api/upgrid/accountmanager/client/' + Id,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }

        })
      }).then(function(response) {
        console.log("client is = " + JSON.stringify(response));

        //get info
        $scope.account_name = response.data.username.split('@')[0];
        $scope.email = response.data.email;
        $scope.ceeb = response.data.CeebID;
        $scope.account_type = response.data.account_type;
        $scope.title = response.data.title;
        $scope.client_name = response.data.contact_name;
        $scope.position = response.data.position;
        $scope.position_level = response.data.position_level;
        $scope.phone = response.data.phone;
        $('#datepicker1').datepicker('setDate', new Date(response.data.service_until.split('T')[0].split('-')[0], response.data.service_until.split('T')[0].split('-')[1] - 1, response.data.service_until.split('T')[0].split('-')[2]));
        //$scope.expiration_date = response.data.service_until.split('-')[1]+'/'+response.data.service_until.split('T')[0].split('-')[2]+'/'+response.data.service_until.split('-')[0].slice(-2);
        $scope.department = response.data.department;
        $scope.service_level = response.data.service_level;
        $scope.competing_edit = response.data.competing_schools
        $scope.customer_program = response.data.customer_program;

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

        for (i = 0; i < $scope.customer_program.length; i++) {

          console.log("i=" + i)

          $scope.selected_customprogram.push({
            "customer_program_id": $scope.customer_program[i].object_id,
            "program_id": $scope.customer_program[i].program.object_id,
            "program_name": $scope.customer_program[i].program.program_display.split('--')[1],
            "program_degree": $scope.customer_program[i].program.program_display.split('--')[2].split('-')[0],
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
                }

              );
              // programs.sort(function(a, b) {
              //   return (a.order.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
              // });
              return programs;

            })(),

          });

        }

        console.log("selected program is " + JSON.stringify($scope.selected_customprogram));
        $scope.displayeddata1 = [].concat($scope.selected_customprogram);

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


        $scope.dep_pro_table_displayed = $scope.dep_pro_table;

        angular.forEach($scope.dep_pro_table, function(value, index) {
          var dep = value.department;
          console.log("value=" + value.department)
          console.log('dep api='+'/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.ceeb + ((dep === 'All') ? '' : ('&dep=' + (dep === 'Other' ? 'Others' : dep))));
          $http({
            url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.ceeb + ((dep === 'All') ? '' : ('&dep=' + (dep === 'Other' ? 'Others' : dep))),
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(response) {
            console.log("response = " + JSON.stringify(response))
            console.log("custom programs=" + JSON.stringify(response.data));
            console.log("value=" + JSON.stringify(value));

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

        jQuery('.js-wizard-simple').bootstrapWizard('first');
        App.blocks('#client_block', 'state_normal');

      }).catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });


    }



    //get depart on ceeb
    $scope.get_depart = function() {

      // $http({
      //       url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.ceeb,
      //       method: 'GET',
      //       headers: {
      //         'Authorization': 'JWT ' + token
      //       }
      //     }).then(function(response) {
      //       console.log("getall = " + JSON.stringify(response.data))
            
      //     }).
      //     catch(function(error) {
      //       console.log('an error occurred...' + JSON.stringify(error));

      //     });

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

        $scope.dep_pro_table_displayed = $scope.dep_pro_table;

        angular.forEach($scope.dep_pro_table, function(value, index) {
          var dep = value.department;
          console.log("value=" + value.department)
          $http({
            url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.ceeb + ((dep === 'All') ? '' : ('&dep=' + (dep === 'Other' ? 'Others' : dep))),
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
      $scope.displayeddata1 = [].concat($scope.selected_customprogram);

    }


    //generate competing program list on table row click
    $scope.load_competing = function() {

      var competing_string = "";
      var competing_list = document.getElementById("bootstrap-duallistbox-selected-list_");
      for (i = 0; i < competing_list.options.length; i++) {
        competing_string = competing_string + competing_list.options[i].value + '/';
      }
      console.log("competing_string=" + JSON.stringify(competing_string));

      if (competing_string !== "") {
        $http({
          url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + competing_string.slice(0, -1),
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function(response) {

          $scope.competing_program_array = [];

          console.log("comepting_programs" + JSON.stringify(response.data));
          $scope.comepting_programs = response.data;

          for (i = 0; i < $scope.comepting_programs.length; i++) {
            $scope.competing_program_array.push({
              "object_id": $scope.comepting_programs[i].object_id,
              "display": $scope.comepting_programs[i].Ceeb + " - " + $scope.comepting_programs[i].program_university + " - " + $scope.comepting_programs[i].program_school + " - " + $scope.comepting_programs[i].program_name + " - " + $scope.comepting_programs[i].program_degree
            })
          }

        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });

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


    $scope.put_customer_program = function(index) {
      if ($scope.pwhide) {
        console.log("changed program is " + JSON.stringify($scope.selected_customprogram[index]))


        var isInArray = false;



        for (var i = 0; i < $scope.put_customer_program_array.length; i++) {

          if ($scope.selected_customprogram[index].customer_program_id === $scope.put_customer_program_array[i].customer_program_id) {
            isInArray = true;
            break;
          }

        }

        console.log("i=" + i)

        if (isInArray) {
          $scope.put_customer_program_array[i] = {
            'program_id': $scope.selected_customprogram[index].program_id,
            'customer_program_id': $scope.selected_customprogram[index].customer_program_id,
            'whoops_status': $scope.selected_customprogram[index].whoops_status,
            'whoops_final_release': $scope.selected_customprogram[index].whoops_final_release,
            'enhancement_final_release': $scope.selected_customprogram[index].enhancement_final_release,
            'customer_confirmation': $scope.selected_customprogram[index].customerconfirmation_status,
          }

        } else {
          $scope.put_customer_program_array.push({
            'program_id': $scope.selected_customprogram[index].program_id,
            'customer_program_id': $scope.selected_customprogram[index].customer_program_id,
            'whoops_status': $scope.selected_customprogram[index].whoops_status,
            'whoops_final_release': $scope.selected_customprogram[index].whoops_final_release,
            'enhancement_final_release': $scope.selected_customprogram[index].enhancement_final_release,
            'customer_confirmation': $scope.selected_customprogram[index].customerconfirmation_status,
          })
        }


        // if(put_customer_program_array)

        // $scope.put_customer_program_array.push()
        console.log("put_customer_program_array= " + JSON.stringify($scope.put_customer_program_array));


      } else {
        console.log("creating user")
      }
    }


    $scope.submit = function() {

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

        // var competing_array = [];
        //   var competing_list = document.getElementById("bootstrap-duallistbox-selected-list_");
        //   for (i = 0; i < competing_list.options.length; i++) {
        //     competing_array.push(competing_list.options[i].value);
        //   }
        //   console.log("competing_array=" + JSON.stringify(competing_array));

        //   var competing_schools_obj = [];
        //   for (i = 0; i < competing_array.length; i++) {
        //     competing_schools_obj.push({
        //       "object_id": competing_array[i]
        //     })
        //   }

        //   console.log("competing_schools_obj" + JSON.stringify(competing_schools_obj));


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


        console.log("################Editing#####################");
        var edit_array = {
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
          "department": $scope.department,
          "service_level": $scope.service_level,
          "competing_schools": competing_schools_obj,

        }

        console.log("edit_array " + JSON.stringify(edit_array));

        $http({
          url: '/api/upgrid/accountmanager/client/',
          method: 'PUT',
          data: {

            "client_id": $scope.pwhide,
            "main_user_id": null,
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
            "department": $scope.department,
            "service_level": $scope.service_level,
            "competing_schools": competing_schools_obj,

          },
          headers: {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
          }
        }).then(function(response) {


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

        }).then(function(response) {

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


          } else {

            //has delete comepting
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


            //has delete customer
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


          }



        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });

      } else {


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


          },
          headers: {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
          }
        }).then(function(response) {


          console.log("success create" + JSON.stringify(response));
          console.log("submit selected_program = "+JSON.stringify($scope.selected_customprogram));
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



          return $http({
            url: '/api/upgrid/accountmanager/',
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          });

        }).then(function(response) {


          $scope.client_data = response.data.client_list
            //$scope.displayeddata1 = [].concat($scope.selected_customprogram);


          jQuery('#modal-large').modal('toggle');

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



        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });

      }

    }

    //put competing programs
    $scope.put_competing = function(obj, cid, pro, order, estatus) {

      console.log("changing competing");

      if ($scope.pwhide) {


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

      if($scope.pwhide&&obj){
         
          $scope.delete_competing_program_array.push({
            "object_id": obj
          })

          console.log("pushed into delete competing array");
        
      }
      


      //manually trigger put_competing to update order
      for (var i = id + 1; i < $scope.selected_customprogram[Pid].competing_program.length; i++) {

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


  });



// ********************************Quote********************************
admin.controller('QuoteController', ['$scope', '$localStorage', '$window',
  function($scope, $localStorage, $window) {


    $scope.user_program = 0;
    $scope.competing_program = 0;
    $scope.programs = $scope.user_program * ($scope.competing_program + 1);
    $scope.discount = 1;
    $scope.rate = "$112";
    $scope.ApplyPromo = function() {
      if ($scope.promocode.toUpperCase() === "ONSITE15" || $scope.promocode.toUpperCase() === 'ALMAMATER50' || $scope.promocode.toUpperCase() === 'ALMAMATER40' || $scope.promocode.toUpperCase() === 'ALMAMATER30' || $scope.promocode.toUpperCase() === 'ALMAMATER20') {


        if ($scope.promocode.toUpperCase() === 'ONSITE15') {
          $scope.discount = 0.85;
          $.notify({

            // options
            icon: "fa fa-check",
            message: 'The code has been successfully applied !'
          }, {
            // settings
            type: 'success',
            placement: {
              from: "top",
              align: "center"
            },
            z_index: 1999,
          });
        }

        if ($scope.promocode.toUpperCase() === 'ALMAMATER50') {


          if ($scope.result > 40000) {
            $scope.discount = 0.5;

            $.notify({

              // options
              icon: "fa fa-check",
              message: 'The code has been successfully applied !'
            }, {
              // settings
              type: 'success',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });



          } else {
            $scope.discount = 1;
            $.notify({

              // options
              icon: "fa fa-times",
              message: 'This code is not qualified for a quote less than $40,000'
            }, {
              // settings
              type: 'danger',
              placement: {
                from: "top",
                align: "center"
              },
            });

          }

        }

        if ($scope.promocode.toUpperCase() === 'ALMAMATER40') {


          if ($scope.result > 30000) {
            $scope.discount = 0.6;

            $.notify({

              // options
              icon: "fa fa-check",
              message: 'The code has been successfully applied !'
            }, {
              // settings
              type: 'success',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });



          } else {
            $scope.discount = 1;
            $.notify({

              // options
              icon: "fa fa-times",
              message: 'This code is not qualified for a quote less than $30,000'
            }, {
              // settings
              type: 'danger',
              placement: {
                from: "top",
                align: "center"
              },
            });


          }


        }


        if ($scope.promocode.toUpperCase() === 'ALMAMATER30') {


          if ($scope.result > 20000) {
            $scope.discount = 0.7;

            $.notify({

              // options
              icon: "fa fa-check",
              message: 'The code has been successfully applied !'
            }, {
              // settings
              type: 'success',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });



          } else {
            $scope.discount = 1;
            $.notify({

              // options
              icon: "fa fa-times",
              message: 'This code is not qualified for a quote less than $20,000'
            }, {
              // settings
              type: 'danger',
              placement: {
                from: "top",
                align: "center"
              },
            });


          }


        }


        if ($scope.promocode.toUpperCase() === 'ALMAMATER20') {


          if ($scope.result > 10000) {
            $scope.discount = 0.8;

            $.notify({

              // options
              icon: "fa fa-check",
              message: 'The code has been successfully applied !'
            }, {
              // settings
              type: 'success',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });



          } else {
            $scope.discount = 1;
            $.notify({

              // options
              icon: "fa fa-times",
              message: 'This code is not qualified for a quote less than $10,000'
            }, {
              // settings
              type: 'danger',
              placement: {
                from: "top",
                align: "center"
              },
            });


          }


        }



      } else {

        $scope.discount = 1;
        $.notify({


          // options
          icon: "fa fa-times",
          message: 'Please enter a valid code.'
        }, {
          // settings
          type: 'danger',
          placement: {
            from: "top",
            align: "center"
          },
        });
      }

    }

    $scope.$watchGroup(['user_program', 'competing_program'], function(newValues, oldValues, scope) {
      //alert("changed");
      if (!isNaN($scope.user_program) && !isNaN($scope.competing_program) && $scope.user_program > 0 && $scope.user_program < 251 && $scope.competing_program >= 0 && $scope.competing_program < 11) {
        $scope.programs = $scope.user_program * ($scope.competing_program + 1);
        $scope.result = $scope.programs > 300 ? 91500 + 200 * ($scope.programs - 300) : 75 * Math.ceil($scope.programs / 15) * (Math.ceil($scope.programs / 15) - 1) + (410 - 10 * Math.ceil($scope.programs / 15)) * $scope.programs;

      } else {
        $scope.result = 0;
      }

    });
    jQuery('.js-validation-bootstrap').validate({
      ignore: [],
      errorClass: 'help-block animated fadeInDown',
      errorElement: 'div',
      errorPlacement: function(error, e) {
        jQuery(e).parents('.form-group > div').append(error);
      },
      highlight: function(e) {
        var elem = jQuery(e);

        elem.closest('.form-group').removeClass('has-error').addClass('has-error');
        elem.closest('.help-block').remove();
      },
      success: function(e) {
        var elem = jQuery(e);

        elem.closest('.form-group').removeClass('has-error');
        elem.closest('.help-block').remove();
      },
      rules: {
        'val-username': {
          required: true,
          minlength: 3
        },
        'val-email': {
          required: true,
          email: true
        },
        'val-password': {
          required: true,
          minlength: 5
        },
        'val-confirm-password': {
          required: true,
          equalTo: '#val-password'
        },
        'val-select2': {
          required: true
        },
        'val-select2-multiple': {
          required: true,
          minlength: 2
        },
        'val-suggestions': {
          required: true,
          minlength: 5
        },
        'val-skill': {
          required: true
        },
        'val-currency': {
          required: true,
          currency: ['$', true]
        },
        'val-website': {
          required: true,
          url: true
        },
        'val-phoneus': {
          required: true,
          phoneUS: true
        },
        'val-digits': {
          required: true,
          digits: true
        },
        'val-number': {
          required: true,
          number: true
        },
        'val-range': {
          required: true,
          range: [1, 5]
        },
        'val-terms': {
          required: true
        }
      },
      messages: {
        'val-username': {
          required: 'Please enter a username',
          minlength: 'Your username must consist of at least 3 characters'
        },
        'val-email': 'Please enter a valid email address',
        'val-password': {
          required: 'Please provide a password',
          minlength: 'Your password must be at least 5 characters long'
        },
        'val-confirm-password': {
          required: 'Please provide a password',
          minlength: 'Your password must be at least 5 characters long',
          equalTo: 'Please enter the same password as above'
        },
        'val-select2': 'Please select a value!',
        'val-select2-multiple': 'Please select at least 2 values!',
        'val-suggestions': 'What can we do to become better?',
        'val-skill': 'Please select a skill!',
        'val-currency': 'Please enter a price!',
        'val-website': 'Please enter your website!',
        'val-phoneus': 'Please enter a US phone!',
        'val-digits': 'Please enter only digits!',
        'val-number': 'Please enter a number!',
        'val-range': 'Please enter a number between 1 and 5!',
        'val-terms': 'You must agree to the service terms!'
      }
    });



    // Chart.js v2 Charts, for more examples you can check out http://www.chartjs.org/docs
    var initChartsChartJSv2 = function() {
      // Set Global Chart.js configuration
      Chart.defaults.global.defaultFontColor = '#999';
      Chart.defaults.global.defaultFontFamily = 'Open Sans';
      Chart.defaults.global.defaultFontStyle = '600';
      Chart.defaults.scale.gridLines.color = "rgba(0,0,0,.05)";
      Chart.defaults.scale.gridLines.zeroLineColor = "rgba(0,0,0,.1)";
      Chart.defaults.global.elements.line.borderWidth = 2;
      Chart.defaults.global.elements.point.radius = 4;
      Chart.defaults.global.elements.point.hoverRadius = 6;
      Chart.defaults.global.tooltips.titleFontFamily = 'Source Sans Pro';
      Chart.defaults.global.tooltips.titleFontSize = 14;
      Chart.defaults.global.tooltips.bodyFontFamily = 'Open Sans';
      Chart.defaults.global.tooltips.bodyFontSize = 13;
      Chart.defaults.global.tooltips.cornerRadius = 3;
      Chart.defaults.global.tooltips.backgroundColor = "rgba(137,189,255,0.85)";
      Chart.defaults.global.legend.labels.boxWidth = 15;

      // Get Chart Containers
      //var $chart2LinesCon  = jQuery('.js-chartjs2-lines');
      var $chart2BarsCon = jQuery('.js-chartjs2-bars');

      // Set Chart and Chart Data variables
      var $chart2Lines, $chart2Bars;


      // Lines/Bar/Radar Chart Data
      var $chart2LinesBarsRadarData = {
        labels: ['15', '30', '45', '60', '75', '90', '105', '120', '135', '150', '165', '180', '195', '210', '225', '240', '255', '270', '285', '300', '315', '330', '...'],
        datasets: [

          {
            label: 'THE LADDER PRICING MODEL',
            fill: true,
            backgroundColor: 'rgba(171, 227, 125, .3)',
            borderColor: 'rgba(112,185, 235, 0.5)',
            pointBackgroundColor: 'rgba(171, 227, 125, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(171, 227, 125, 1)',
            data: [400, 390, 380, 370, 360, 350, 340, 330, 320, 310, 300, 290, 280, 270, 260, 250, 240, 230, 220, 210, 200, 200, 200]

          }
        ]
      };

      $chart2Bars = new Chart($chart2BarsCon, {
        highlightFromIndex: 3,
        type: 'bar',
        data: $chart2LinesBarsRadarData,
        options: {

          responsive: true,
          maintainAspectRatio: true,

          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'PRICE / PROGRAM'
              },

              ticks: {

                min: 150,
                beginAtZero: true,
                max: 450,
                userCallback: function(value, index, values) {
                  // Convert the number to a string and splite the string every 3 charaters from the end
                  value = value.toString();
                  value = value.split(/(?=(?:...)*$)/);

                  // Convert the array to a string and format the output
                  value = value.join('.');
                  return '$' + value;
                }
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'NUMBER OF SELECTED PROGRAMS'
              },


            }],

          },

          tooltips: {

            enabled: true,
            mode: 'single',
            callbacks: {
              title: function(tooltipItem, data) {
                if (data.labels[tooltipItem[0].index] < 315) {
                  var display = data.labels[tooltipItem[0].index] - 14 + ' ~ ' + data.labels[tooltipItem[0].index];
                } else {
                  var display = "300+";
                }

                return display + " programs";

              },
              label: function(tooltipItems, data) {
                return 'Price: ' + '$ ' + tooltipItems.yLabel + '/program';
              }
            }
          },

        }


      });
    };

    initChartsChartJSv2();


    Chart.pluginService.register({
      beforeUpdate: function(chartInstance) {
        var yvalue;
        if ($scope.programs === 0) {
          yvalue = 500
        } else if ($scope.programs <= 15) {
          yvalue = 400
        } else if ($scope.programs <= 30) {
          yvalue = 390
        } else if ($scope.programs <= 45) {
          yvalue = 380
        } else if ($scope.programs <= 60) {
          yvalue = 370
        } else if ($scope.programs <= 75) {
          yvalue = 360
        } else if ($scope.programs <= 90) {
          yvalue = 350
        } else if ($scope.programs <= 105) {
          yvalue = 340
        } else if ($scope.programs <= 120) {
          yvalue = 330
        } else if ($scope.programs <= 135) {
          yvalue = 320
        } else if ($scope.programs <= 150) {
          yvalue = 310
        } else if ($scope.programs <= 165) {
          yvalue = 300
        } else if ($scope.programs <= 180) {
          yvalue = 290
        } else if ($scope.programs <= 195) {
          yvalue = 280
        } else if ($scope.programs <= 210) {
          yvalue = 270
        } else if ($scope.programs <= 225) {
          yvalue = 260
        } else if ($scope.programs <= 240) {
          yvalue = 250
        } else if ($scope.programs <= 255) {
          yvalue = 240
        } else if ($scope.programs <= 270) {
          yvalue = 230
        } else if ($scope.programs <= 285) {
          yvalue = 220
        } else if ($scope.programs <= 300) {
          yvalue = 210
        } else if ($scope.programs > 300) {
          yvalue = 200
        }
        chartInstance.data.datasets.forEach(function(dataset) {
          dataset.backgroundColor = dataset.data.map(function(data) {


            console.log("yvalue = " + yvalue);

            return data >= yvalue ? 'rgba(112,185, 235, 0.4)' : 'rgba(243, 243, 243, 1)';
          })
        })
      }
    });



    $scope.$watch('programs', function() {
      console.log('monitoring...');
      //console.log('STORAGE in success.js= '+JSON.stringify($scope.$storage));

      //get the number of program checked and display the count on the cart icon
      //use the cartCounter service
      //$chart2Bars.update();
      initChartsChartJSv2();

    }, true);

  }
]);



// ********************************Profile********************************

admin.controller('AdminProfileController', ['$http', '$scope', '$localStorage', '$window', 'authenticationSvc',
  function($http, $scope, $localStorage, $window, authenticationSvc) {
    console.log("welcome");
    $scope.admin_email = authenticationSvc.getUserInfo().username;
    var token = authenticationSvc.getUserInfo().accessToken;

    // Create Base64 Object
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


    //reset passwords
    $scope.changepw = function() {
      $scope.oldpw = "";
      $scope.newpw1 = "";
      $scope.newpw2 = "";
    };


    $scope.submitpassword = function() {

      console.log("username: " + $scope.username);
      console.log("password: " + $scope.oldpw);

      $scope.dataLoading = true;


      if ($scope.newpw1 !== $scope.newpw2) {
        $.notify({

          // options
          icon: "fa fa-times",
          message: 'The passwords do no match, password change fail.'
        }, {
          // settings
          type: 'danger',
          placement: {
            from: "top",
            align: "center"
          },
          z_index: 1999,
        });

        //reset
        $scope.oldpw = "";
        $scope.newpw1 = "";
        $scope.newpw2 = "";


      } else {

        if ($scope.newpw2 === $scope.oldpw) {
          $.notify({

            // options
            icon: "fa fa-times",
            message: 'Please enter a different password.'
          }, {
            // settings
            type: 'danger',
            placement: {
              from: "top",
              align: "center"
            },
            z_index: 1999,
          });

          //reset
          $scope.oldpw = "";
          $scope.newpw1 = "";
          $scope.newpw2 = "";

        } else {

          $http({
            url: '/api/upgrid/user/password/',
            method: 'PUT',
            headers: {
              'Authorization': 'JWT ' + token
            },
            data: {
              "old_password": Base64.encode($scope.oldpw),
              "new_password": Base64.encode($scope.newpw2)
            }

          }).then(function(response) {

            $scope.details = response;
            console.log("GOT! detail=" + JSON.stringify($scope.details));

            $.notify({

              // options
              icon: "fa fa-check",
              message: 'Your password has been changed successfully.'
            }, {
              // settings
              type: 'success',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });

            $scope.oldpw = "";
            $scope.newpw1 = "";
            $scope.newpw2 = "";
            jQuery('#pwModal').modal('toggle');


          }).
          catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));


            $.notify({

              // options
              icon: "fa fa-times",
              message: 'Your old password is incorrect.'
            }, {
              // settings
              type: 'danger',
              placement: {
                from: "top",
                align: "center"
              },
              z_index: 1999,
            });

            //reset
            $scope.oldpw = "";
            $scope.newpw1 = "";
            $scope.newpw2 = "";
          });
        }


      }

    };

  }
]);


// ********************************Updates********************************

admin.controller('UpdatesController', ['$q', '$http', '$scope', '$localStorage', '$window', 'authenticationSvc',
  function($q, $http, $scope, $localStorage, $window, authenticationSvc) {
    console.log("welcome");
   
    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.itemsByPage = 25;
    $scope.update_client = [];
    $http({
          url: '/api/upgrid/update/dashboard/',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

      for(var i=0; i<response.data.length; i++){
        if(response.data[i].has_update.whoops_update !== 0 || response.data[i].has_update.enhancement_update !== 0)
        $scope.update_client.push(response.data[i]);
      }
       console.log("update client = "+ JSON.stringify(response.data));
        
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });

     $scope.baba=[1,2,3];


     $scope.updated_whoops = function(id) {
        $http({
          url: '/api/upgrid/update/programs/'+id,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
          }).then(function (response) {

             //$scope.update_client = response.data;

             console.log("programs =  "+ JSON.stringify(response.data.whoops_update));
             $scope.dropdown_list = response.data.whoops_update;
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });
     }


     $scope.updated_enhancement = function(id) {
        $http({
          url: '/api/upgrid/update/programs/'+id,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
          }).then(function (response) {

             //$scope.update_client = response.data;

             console.log("programs =  "+ JSON.stringify(response.data.enhancement_update));
              $scope.dropdown_list = response.data.enhancement_update;
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });
     }



     $scope.testOnDemand = function(){



      // $http({
      //     url: '/api/upgrid/update/whoops/ondemand/',
      //     method: 'PUT',
      //     data: {
      //       "customer_program_id": "5fded1bf-c005-4978-b2a3-21fe7dad6f68",
      //       "client_id": "1640b8ff-2e18-45c7-a8b1-ac7e4c3163c9"
      //     },
      //     headers: {
      //       'Authorization': 'JWT ' + token
      //     }
      //   }).then(function (response) {


      //     return $http({
      //     url: '/api/upgrid/update/enhancement/ondemand/',
      //     method: 'PUT',
      //     data: {
      //       "customer_program_id": "5fded1bf-c005-4978-b2a3-21fe7dad6f68",
      //       "client_id": "1640b8ff-2e18-45c7-a8b1-ac7e4c3163c9"
      //     },
      //     headers: {
      //       'Authorization': 'JWT ' + token
      //     }
      //   })

      //   }).then(function (response) {

      //     console.log("success ondemand");
      //   }).
      //    catch(function(error){
      //       console.log('an error occurred...'+JSON.stringify(error));

      //    });


      var customer_ids = [];
      

      for(var i=0; i<$scope.update_client.length; i++){

        customer_ids.push($scope.update_client[i].id);


      }


      angular.forEach(customer_ids, function(value, index) {

        $http({
          url: '/api/upgrid/accountmanager/client/' + value,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
 
        }).then(function(response) {
            var program_ids = [];     
            //console.log("response.is ... "+JSON.stringify(response.data.customer_program))
            for(var i=0; i<response.data.customer_program.length; i++){
              program_ids.push(response.data.customer_program[i].object_id);
            }

              if(program_ids.length!==0){
                  angular.forEach(program_ids, function(value1, index1) {
                    $http({
                      url: '/api/upgrid/update/whoops/ondemand/',
                      method: 'PUT',
                      data: {
                        "customer_program_id": value1,
                        "client_id": value
                      },
                      headers: {
                        'Authorization': 'JWT ' + token
                      }
                    }).then(function (response) {


                      return $http({
                      url: '/api/upgrid/update/enhancement/ondemand/',
                      method: 'PUT',
                      data: {
                        "customer_program_id": value1,
                        "client_id": value
                      },
                      headers: {
                        'Authorization': 'JWT ' + token
                      }
                    })

                    }).then(function (response) {

                      console.log("success ondemand");
                    }).
                     catch(function(error){
                        console.log('an error occurred...'+JSON.stringify(error));

                     });


                  })

              }
                 


        }).catch(function(error){
          console.log('an error occurred...'+JSON.stringify(error));

        });

      });

    


      // $q.all(program_ids).then(function(result) {

      //   console.log("program ids = "+JSON.stringify(program_ids));
      //     angular.forEach(program_ids, function(value, index) {
      //   $http({
      //     url: '/api/upgrid/update/whoops/ondemand/',
      //     method: 'GET',
      //     data: {
      //       "object_id": value,
      //     },
      //     headers: {
      //       'Authorization': 'JWT ' + token
      //     }
      //   }).then(function (response) {


      //     return $http({
      //     url: '/api/upgrid/update/enhancement/ondemand/',
      //     method: 'GET',
      //     data: {
      //       "object_id": value,
      //     },
      //     headers: {
      //       'Authorization': 'JWT ' + token
      //     }
      //   })

      //   }).then(function (response) {

      //     console.log("success ondemand");
      //   }).
      //    catch(function(error){
      //       console.log('an error occurred...'+JSON.stringify(error));

      //    });


      //  })
        
      // });


     }

     //end of testOnDemand

  }
]);