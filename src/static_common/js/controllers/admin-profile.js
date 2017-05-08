// ********************************Profile********************************

angular.module('myApp').controller('AdminProfileController', ['$http', '$scope', '$localStorage', '$window', 'authenticationSvc',
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
