var admin = angular.module('myApp.admin', [])
admin.controller('AdminMainController',
  function($timeout, $state, avatarService, Client, $http, authenticationSvc, $scope, $window) {

    var token = authenticationSvc.getUserInfo().accessToken;

    $scope.itemsByPage = 25;
    
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


    $scope.addaha = function() {

      // $scope.account_name = 'haha';
      // $scope.position_level = "University";
      // $scope.ceeb="580bbf8b-642b-4eb7-914c-03a054981719"
      // console.log("$scope.expiration_date = "+$scope.expiration_date);

      //$scope.selected_customprogram.splice(-1,1)
      $scope.listbox.find('option').remove();
      $scope.listbox.bootstrapDualListbox('refresh', true);



    }


    $scope.removeItem = function(index) {
      $scope.selected_customprogram.splice(index, 1)
      console.log("index=" + index);
    }

    $scope.addnew = function(Id) {
      $scope.pwhide = Id;
      console.log("Id = " + Id);

      if (Id) {
        console.log("editing")
      } else {
        console.log("creating");
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

      // Init simple wizard
      initWizardSimple();

      jQuery('.nav-tabs>li:nth-child(2)').removeClass('active');
      jQuery('.nav-tabs>li:nth-child(3)').removeClass('active');
      jQuery('#simple-classic-progress-step2').removeClass('active in');
      jQuery('#simple-classic-progress-step3').removeClass('active in');
      jQuery('#simple-classic-progress-step1').addClass('active in');
      jQuery('.nav-tabs>li:first-child').addClass('active');
      jQuery('.progress-bar.progress-bar-info').css("width", "33.3333%");


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

        if (!Id) {

          var competing_schools_options = "";
          //get competing school list e.g. format: <option value='5e7a795b-2ee2-49dd-9a08-60c48d76f27b'>2120: None - School of Journalism</option>
          for (i = 0; i < $scope.get_ceebs.length; i++) {
            competing_schools_options = competing_schools_options + "<option value='" + $scope.get_ceebs[i].object_id + "'>" + $scope.get_ceebs[i].university_school + "</option>";
          }

          $scope.listbox.find('option').remove().end().append(competing_schools_options);
          $scope.listbox.bootstrapDualListbox('refresh', true);

        } else { //for editing
          App.blocks('#client_block', 'state_loading');
          $http({
            url: '/api/upgrid/accountmanager/client/' + Id,
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(response) {

            $scope.details = response.data;

            console.log("client is = " + JSON.stringify(response));
            App.blocks('#client_block', 'state_normal');
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
            ///for competing programs
            for (i = 0; i < $scope.get_ceebs.length; i++) {
              $scope.get_ceebs[i].selected = false;

              for (j = 0; j < $scope.competing_edit.length; j++) {
                if ($scope.get_ceebs[i].object_id === $scope.competing_edit[j].object_id) {
                  $scope.get_ceebs[i].selected = true;
                  break;
                }
              }

            }
            //new get_ceebs
            console.log("$scope.get_ceebs" + JSON.stringify($scope.get_ceebs));


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

            $scope.selected_customprogram = [];
            console.log("expiration_date_=" + $scope.expiration_date);


            //create program array

            //create array
            if ($scope.service_level === "basic") {
              $scope.subrows = [{
                "order": 1
              }];
            } else if ($scope.service_level === "silver") {
              $scope.subrows = [{
                "order": 1
              }, {
                "order": 2
              }];
            } else if ($scope.service_level === "gold") {
              $scope.subrows = [{
                "order": 1
              }, {
                "order": 2
              }, {
                "order": 3
              }];
            } else if ($scope.service_level === "platinum") {
              $scope.subrows = [{
                "order": 1
              }, {
                "order": 2
              }, {
                "order": 3
              }, {
                "order": 4
              }];
            }

            //generate selected_customprogram list
            $scope.selected_customprogram = [];

            for (i = 0; i < $scope.customer_program.length; i++) {

              console.log("i=" + i)
              
              $scope.selected_customprogram.push({
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
                  for (j = 0; j < $scope.subrows.length; j++) {
                    programs[j] = {
                      "object_id": $scope.customer_program[i].competing_program[j].object_id,
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

            console.log("selected program is "+JSON.stringify($scope.selected_customprogram));
            $scope.displayeddata1 = [].concat($scope.selected_customprogram);


            return $http({
              url: '/api/upgrid/accountmanager/department/' + $scope.ceeb,
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            });

          }).then(function(response) {
            response.data.push({
              "department": "Other"
            });
            $scope.get_departments = response.data;


          }).
          catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

          });
        }

        ////end of editing


      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });

      //$('#datepicker1').datepicker('setDate', new Date(2011,10,30));
      //console.log("UTC="+$('#datepicker1').datepicker('getDate'));


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


    $scope.generate_program = function() {
      $http({
        url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + $scope.ceeb + '&department=' + $scope.department,
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        $scope.details = response.data;

        console.log("custom programs=" + JSON.stringify(response.data.results));

        $scope.rowCollection = response.data.results;

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });
    }


    $scope.preload = function() {
      if ($scope.service_level === "basic") {
        $scope.subrows = [{
          "order": 1
        }];
      } else if ($scope.service_level === "silver") {
        $scope.subrows = [{
          "order": 1
        }, {
          "order": 2
        }];
      } else if ($scope.service_level === "gold") {
        $scope.subrows = [{
          "order": 1
        }, {
          "order": 2
        }, {
          "order": 3
        }];
      } else if ($scope.service_level === "platinum") {
        $scope.subrows = [{
          "order": 1
        }, {
          "order": 2
        }, {
          "order": 3
        }, {
          "order": 4
        }];
      }

      //console.log("rowCollection="+JSON.stringify($scope.rowCollection));
      //generate selected_customprogram list
      $scope.selected_customprogram = [];

      for (i = 0; i < $scope.rowCollection.length; i++) {

        console.log("i=" + i)
        
        $scope.selected_customprogram.push({
          "program_id": $scope.rowCollection[i].object_id,
          "program_name": $scope.rowCollection[i].program_name,
          "program_degree": $scope.rowCollection[i].program_degree,
          "assignment_status": $scope.rowCollection[i].assignment_status,
          "review_status": $scope.rowCollection[i].review_status,
          "whoops_status": "",
          "whoops_final_release": "",
          "enhancement_final_release": "",
          "customerconfirmation_status": "",
          "competing_program": (function() {
            var programs = [];
            for (j = 0; j < $scope.subrows.length; j++) {
              programs[j] = {

                "object_id": "",
                "order": j + 1,
                "enhancement_status": ""
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


  $scope.resources = {stuff: 'stuff', type:'actualtype'}
  
  $scope.resourceList = {type:[{name:'type1'}, {name: 'type2'}]}
  
  $scope.resources.type = "0688dcd5-00d4-48f5-87af-4fb224df6845";


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
          url: '/api/upgrid/accountmanager/dropdown_menu/programs/?ceeb=' + competing_string.slice(0, -1) + '&department=',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function(response) {

          $scope.competing_program_array = [];

          console.log("comepting_programs" + JSON.stringify(response.data.results));
          $scope.comepting_programs = response.data.results;

          for (i = 0; i < response.data.results.length; i++) {
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
        console.log("tryit="+$scope.tryit);
    }


    $scope.send_competing = function(pid, cid) {
      console.log("pid cid" + pid + ' ' + cid);
      //console.log("result = "+this.row1.selectedName);

      //$scope.selected_customprogram[pid].competing_program[cid].object_id = this.row1.selectedName;
      console.log("selected_customprogram=" + JSON.stringify($scope.selected_customprogram));

    }


    $scope.submit = function() {

      var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

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


      //edit user
      if($scope.pwhide){
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
            "selected_customerprogram": $scope.selected_customprogram
        }

        console.log("edit_array = "+JSON.stringify(edit_array));
        $http({
          url: '/api/upgrid/accountmanager/client/',
          method: 'PUT',
          data: {
            "client_id": $scope.pwhide,
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
            "selected_customerprogram": $scope.selected_customprogram

          },
          headers: {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
          }
        }).then(function(response) {

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



        }).
        catch(function(error) {
          console.log('an error occurred...' + JSON.stringify(error));

        });

      } else {  

        //*************************************************create user

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
            "selected_customerprogram": $scope.selected_customprogram

          },
          headers: {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
          }
        }).then(function(response) {

          $scope.details = response.data;

          console.log("success" + JSON.stringify(response));

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

  });


// admin.controller('FormController',
//   function(authenticationSvc, $scope, $http) {

//     $scope.rowCollection = [];

//        //console.log("selected_customprogram= "+JSON.stringify(selected_customprogram));



//   });

admin.controller('QuoteController', ['$scope', '$localStorage', '$window',
  function($scope, $localStorage, $window) {


    $scope.user_program = 0;
    $scope.competing_program = 0;
    $scope.programs = $scope.user_program * ($scope.competing_program + 1);
    $scope.discount = 1;
    $scope.rate = "$112";
    $scope.ApplyPromo = function() {


      if ($scope.promocode !== "ONSITE15") {
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

      } else {

        $scope.discount = 0.85;
        $.notify({

          // options
          icon: "fa fa-check",
          message: 'The discount code has been applied successfully.'
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


    }

    $scope.$watchGroup(['user_program', 'competing_program'], function(newValues, oldValues, scope) {
      //alert("changed");
      if (!isNaN($scope.user_program) && !isNaN($scope.competing_program) && $scope.user_program > 0 && $scope.user_program < 601 && $scope.competing_program > 0 && $scope.competing_program < 11) {
        $scope.programs = $scope.user_program * ($scope.competing_program + 1);
        $scope.result = $scope.programs > 300 ? 31500 + 200 * $scope.user_program : 75 * Math.ceil($scope.programs / 15) * (Math.ceil($scope.programs / 15) - 1) + (410 - 10 * Math.ceil($scope.programs / 15)) * $scope.programs;

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
                  var display = data.labels[tooltipItem[0].index] - 15 + ' ~ ' + data.labels[tooltipItem[0].index];
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