angular.module('myApp').
controller('ProfileController',
  function(apiService, SUB, $log, avatarService, $timeout, ajaxService, $filter, tableDataService, List, $scope, $location, $window, $http, authenticationSvc, $state) {

    var token = authenticationSvc.getUserInfo().accessToken;
    $scope.username = List.profile.email;

    console.log("List is "+JSON.stringify(List));
    console.log("email = "+$scope.username);

    // Create Base64 Object
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    var client_id = avatarService.getClientId() ? avatarService.getClientId() : "";

    console.log("client_id in profile="+client_id);
    console.log("SUB="+JSON.stringify(SUB));
    //api/upgrid/user/university_customer/
    $scope.subusers = SUB;

    $log.debug("haha");

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
  var avatar = avatarService.getClientId() ? "&cid="+ avatarService.getClientId(): "";

      $http({
          url: '/api/upgrid/user/program/?&order=oname'+avatar,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       $scope.details = response.data;

       console.log("firstpage"+ JSON.stringify(tableDataService.getWhoops(response.data.results)));
        $scope.program_permission = tableDataService.getWhoops(response.data.results);
        console.log("$scope.program_permission+"+JSON.stringify($scope.program_permission))

        // if(response.status === 204){
        //   console.log("===204");
        // }
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });


    // ajaxService.getResult(start, number, tableState, token, "").then(function (result) {
    //       console.log("AJAX service called !");

          
    //       console.log("&&&result.data="+JSON.stringify(result.data));
    //       //console.log("ajaxService.getResult = "+JSON.stringify(result));

    //       $scope.program_permission = tableDataService.getWhoops(result.data);
    //       console.log("program_permission = "+JSON.stringify($scope.selecteddata))


    //     }).
    //        catch(function(error){
    //           console.log('an error occurred...'+JSON.stringify(error));

    //   });
// // Define the string
// var string = 'Hello World!';

// // Encode the String
// var encodedString = Base64.encode(string);
// console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"

// // Decode the String
// var decodedString = Base64.decode(encodedString);
// console.log(decodedString); // Outputs: "Hello World!"


    console.log("The profile list is..." + JSON.stringify(List));
    $scope.data = tableDataService.getProfile(List);
    console.log("Profile Info= " + JSON.stringify($scope.data));
    $scope.itemsByPage1 = 25;

    var date = new Date();
        
    console.log(date);
    
    $scope.subusertime = $filter('date')(new Date(), 'yyyyMMddhhmmssa');
    
    //console.log("***data is ="+$scope.subusertime);

    
   
    /*$scope.subusertime1 = $filter('date')(new Date(), 'yyyyMMddhhmmssa');*/

    // console.log("***data is ="+$scope.subusertime1);
     $scope.programpipe = function(tableState){
      $scope.displayeddata = [];
      // $scope.isLoading = true;
      console.log("******");
      console.log("~~~tableState= "+JSON.stringify(tableState));
      App.blocks('#profileloadingtable', 'state_loading');


      var pagination = tableState.pagination;
      var start = pagination.start || 0;
      var number = pagination.number || 25;
        //ajaxService.getResult(start, number, tableState, token, "&cs=No").then(function (result) {
        var avatar = avatarService.getClientId() ? "&cid="+ avatarService.getClientId(): "";
        ajaxService.getResult(start, number, tableState, token, "", avatar).then(function (result) {
          console.log("AJAX service called !");

          $scope.displayeddata = result.data;
          console.log("&&&result.data="+JSON.stringify(result.data));
          //console.log("ajaxService.getResult = "+JSON.stringify(result));

          $scope.selecteddata = tableDataService.getWhoops($scope.displayeddata);
          console.log("selecteddata = "+JSON.stringify($scope.selecteddata))
          tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
          
          // $scope.isLoading = false;

          App.blocks('#profileloadingtable', 'state_normal');

        }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });

    }


    //regex for validating the form of user email address 
    //console.log("@@@@@@@@@@"+$scope.username.split("@")[1].split(".")[$scope.username.split("@")[1].split(".").length-2]);
    var patt = new RegExp('^[a-zA-Z0-9._-]+@' + $scope.username.split("@")[1].split(".")[$scope.username.split("@")[1].split(".").length - 2] + '.' + $scope.username.split("@")[1].split(".")[$scope.username.split("@")[1].split(".").length - 1] + '$', 'i');
    console.log("patt=" + patt);
    console.log("value= " + patt.test("jjsk@gmail.com"));

    $.validator.addMethod("emailz", function(value, element) {
      return this.optional(element) || patt.test(value);
    }, 'Only email containing ' + $scope.username.split("@")[1].split(".")[$scope.username.split("@")[1].split(".").length - 2] + '.' + $scope.username.split("@")[1].split(".")[$scope.username.split("@")[1].split(".").length - 1] + ' is acceptable');
    ////////

    //subuser form validation
    var validator = jQuery('.js-validation-bootstrap').validate({
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
        },
        'val-email': {
          emailz: true,
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
        'val-title': {
          required: true,
        },
        'val-phone': {
          required: true,
        },

      },
      messages: {
        'val-username': {
          required: 'Please provide a name',
        },
        'val-email': {

          required: 'Please enter a valid email address',
          email: 'Please enter a valid email address',
          emailz: 'Only email containing ' + $scope.username.split("@")[1].split(".")[$scope.username.split("@")[1].split(".").length - 2] + '.' + $scope.username.split("@")[1].split(".")[$scope.username.split("@")[1].split(".").length - 1] + ' is acceptable',



        },
        'val-password': {
          required: 'Please provide a password',
          minlength: 'Your password must be at least 5 characters long'
        },
        'val-confirm-password': {
          required: 'Please provide a password',
          minlength: 'Your password must be at least 5 characters long',
          equalTo: 'Please enter the same password as above'
        },
        'val-title': {
          required: 'Please provide a title',
        },
        'val-phone': {
          required: 'Please provide a telephone number',
        },

      }
    });

    //end subuser form validation


    //service until settings

    $scope.set_permission = {};
    $scope.serviceUntilDate = $scope.data.serviceUntil;

    
    //for test
    //console.log('List= '+JSON.stringify(List));

    $scope.hidden = true;
    $scope.messageHid = true;
    $scope.changepw = function() {
      $scope.oldpw = "";
      $scope.newpw1 = "";
      $scope.newpw2 = "";
    }

    $scope.subuser = {};
    $scope.prefix = ["Master", "Mr", "Miss", "Ms", "Mrs", "Mx", "Dr"];

    //init subuser form
    $scope.triggersubuser = function() {
      // $scope.subuser.password1 = null;
      // $scope.subuser.password2 = null;
      
      if($scope.subusers.length < 10) {
        jQuery('#myModalSubuser').modal('toggle');
      } else {
        $.notify({

          // options
          icon: "fa fa-warning",
          message: 'You can only add up to 10 colleagues.'
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

      


      console.log($filter('date')(new Date(), 'yyyyMMddhhmmssa'));

      $scope.subuser = null;
      //$scope.set_permission = null;
      $scope.set_permission = {};
      console.log("clean adding subuser modal")

      angular.element(document.getElementById("subuserform").getElementsByClassName("form-group")).removeClass('has-error');
      angular.element(document.getElementById("subuserform").getElementsByClassName("help-block")).remove();

      // elem.closest('.form-group').removeClass('has-error');
      //          elem.closest('.help-block').remove();

    }


    $scope.checkvalue = function () {

      console.log("check set_permission = "+JSON.stringify($scope.set_permission));
      

      var object_ids = "";
      for(var key in $scope.set_permission){

                if($scope.set_permission[key].checked) {
                    object_ids = object_ids + key + '/';
                }
        }

        console.log("object_ids="+object_ids);

    }


    $scope.createsubuser = function() {
      console.log("subuser is " + JSON.stringify($scope.subuser));
      if ($scope.subuser) {
        if (patt.test($scope.subuser.email) && $scope.subuser.email && $scope.subuser.password1 && $scope.subuser.password2 && $scope.subuser.name && $scope.subuser.title && $scope.subuser.tel) {

          App.blocks('#addsubuser', 'state_loading');
          var subNum = null;
          
          console.log("set_permission="+JSON.stringify($scope.set_permission));
          var object_ids = "";
            for(var key in $scope.set_permission){

                      if($scope.set_permission[key].checked) {
                          object_ids = object_ids + key + '/';
                      }
              }

              console.log("object_ids="+object_ids);

          

            
            var subusertimestamp = $filter('date')(new Date(), 'yyyyMMddhhmmssa');
            console.log("subusertimestamp"+subusertimestamp);
            console.log("subuserNum="+subNum);
        $http({
              url: '/api/upgrid/user/subuser',
              method: 'POST',
              data: {
                "username": $scope.data.username.split('@')[0] + "@S" + subusertimestamp,
                "password": Base64.encode($scope.subuser.password2),
                "email": $scope.subuser.email,
                "Ceeb": $scope.data.ceeb,
                // "contract_prefix": $scope.subuser.form_contract_prefix,
                "title": ($scope.subuser.form_contract_prefix === undefined)? "":$scope.subuser.form_contract_prefix,
                "contact_name": $scope.subuser.name,
                "position": $scope.subuser.title,
                "position_level": $scope.data.contractLevel,
                "phone": $scope.subuser.tel,
                "customer_programs": object_ids.slice(0,-1),
                "main_user_id": client_id
               
              },
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function(response) {

              console.log("prefix value= "+$scope.subuser.form_contract_prefix);
            if($scope.subuser.form_contract_prefix===undefined){
              console.log("confirm undefined");
            }

            console.log("subuser data title = "+JSON.stringify($scope.subuser.title));
            console.log('success create!');
            console.log("&^&^&^confirm the timestamp"+subusertimestamp);

            //reload subuser list
            apiService.getSubuser(token, client_id).then(function (result) {
          
                $scope.subusers = result;
                
               
            });



            $scope.data.subuser.push({
                "id": null,
                "is_active": true,
              
                        
                "email": $scope.subuser.email,
               
                "title": ($scope.subuser.form_contract_prefix === undefined)? "":$scope.subuser.form_contract_prefix,
                "contact_name": $scope.subuser.name,
                "position": $scope.subuser.title,
                "position_level": $scope.data.contractLevel,
                "phone": $scope.subuser.tel,


            });



            
            // $timeout(function() {
            //      jQuery('#myModalSubuser').modal('toggle');
            // }, 1000);
           
            jQuery('#myModalSubuser').modal('toggle');
            $.notify({

              // options
              icon: "fa fa-check",
              message: 'The user has been created.'
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


          }).finally(function(){
            App.blocks('#addsubuser', 'state_normal');
          });

          

        }

      }

    }

    $scope.viewsubuser = function(id) {

      App.blocks('#load_subuser', 'state_loading');
        
      console.log("ID+++"+id)
      // console.log("user is "+JSON.stringify( $scope.data.subuser[$index]));
      // $scope.subuserdetail = {
      //   "login_email": $scope.data.subuser[$index].email,
      //   "contract_prefix": $scope.data.subuser[$index].title,
      //   "contract_name": $scope.data.subuser[$index].contact_name,
      //   "contract_title": $scope.data.subuser[$index].position,
      //   "contract_tel": $scope.data.subuser[$index].phone,
      //   "customer_programs": $scope.data.subuser[$index].customer_program
      // }

      // console.log("subuser detail..." + JSON.stringify($scope.subuserdetail));

      apiService.getSubuser(token, client_id, id).then(function (result) {
          
          $scope.subuser_raw = result;

          App.blocks('#load_subuser', 'state_normal');

          $scope.title_readonly = true;
          $scope.contact_name_readonly = true;
          $scope.position_readonly = true;
          $scope.phone_readonly = true;

          $scope.subuser_title_old = $scope.subuser_raw[0].title
          $scope.subuser_contact_name_old = $scope.subuser_raw[0].contact_name
          $scope.subuser_position_old = $scope.subuser_raw[0].position
          $scope.subuser_phone_old = $scope.subuser_raw[0].phone

          $scope.subuser_programs_old = {};
          for(var i=0; i<$scope.subuser_raw[0].customer_program.length; i++){
            //$scope.subuser_programs_old.push($scope.subuser_raw[0].customer_program[i].object_id)
            $scope.subuser_programs_old[$scope.subuser_raw[0].customer_program[i].object_id] = true;
          }
          console.log("$scope.subuser_programs_old="+JSON.stringify($scope.subuser_programs_old));
         
      });



    }

    $scope.editsubuser = function($index) {

      
      $scope.subuserdetail = {
        "login_email": $scope.data.subuser[$index].email,
        "contract_prefix": $scope.data.subuser[$index].title,
        "contract_name": $scope.data.subuser[$index].contact_name,
        "contract_title": $scope.data.subuser[$index].position,
        "contract_tel": $scope.data.subuser[$index].phone
      }

      console.log("subuser detail..." + JSON.stringify($scope.subuserdetail));

    }




    console.log("@@@subuser ... "+JSON.stringify($scope.data.subuser));

    $scope.removesubuser = function($index) {
      console.log("index is " + $index);

      $http({
        url: '/api/upgrid/user/subuser',
        method: 'PUT',
        data: {
          'sub_user_id': $scope.data.subuser[$index].id,
          'is_active':'False',
          'main_user_id': client_id
          
        },
        headers: {
          'Authorization': 'JWT ' + token
        }

      }).then(function(response) {
        console.log('success deactivate!');

        $scope.data.subuser.splice($index, 1);

        //update data
        $scope.data = tableDataService.getProfile(List);

        apiService.getSubuser(token, client_id).then(function (result) {
          
                $scope.subusers = result;
                
               
        });



        $.notify({

          // options
          icon: "fa fa-check",
          message: 'The user has been successfully deleted.'
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

$scope.submitpassword = function() {

    console.log("username: " + $scope.username);
      console.log("password: " + $scope.oldpw);

      $scope.dataLoading = true;


      if($scope.newpw1 !== $scope.newpw2) {
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

        if($scope.newpw2 === $scope.oldpw){
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

        }else{

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

  }


  });
