//from username, to get the ceeb, program, and degree respectively

angular.module('myApp')
  .factory('apiService', function(avatarService, $http, $q, authenticationSvc) {



    var customer = null;
    var Ceeb = null;
    var programs = null;
    var subuser = null;
    var subuserNum = null;
    var profile = null;
    var upgridUser;


    var IfAdmin = function(token) {
      var deferred = $q.defer();
      $http({
        url: '/api/upgrid/accountmanager/is_manager/',
        method: 'GET',

        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        console.log("!!!GOT! detail=" + JSON.stringify(profile));
        if (response.data === "True") {
          upgridUser = {
            admin: true
          }

        } else {
          upgridUser = {
            admin: false
          }
        }
        deferred.resolve(upgridUser);

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        deferred.reject(error);
      });
      return deferred.promise;


    }

    var getAdmin = function() {
      return upgridUser;
    }



    //it consists of customer selected programs with customer ceeb programs
    var getList = function(email, token) {



      var promise = $http({
        url: '/api/customer/' + email,
        method: 'GET',
        //headers: {'Content-Type': 'application/json'}
        headers: {
          'Authorization': 'JWT ' + token
        }


      }).then(function(response) {

        customer = response.data;
        Ceeb = response.data.Ceeb;
        subuserNum = response.data.subuser_num;
        console.log("API DATA = " + JSON.stringify(subuserNum));


        //console.log('api got the ceeb... '+ JSON.stringify(Ceeb));
        return $http({
          url: '/api/university/' + Ceeb,
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        });

      }).then(function(response) {

        programs = response.data;

        //get the subuser list
        return $http({
          url: '/api/findSubUser/',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
        });

      }).then(function(response) {

        subuser = response.data;
        //console.log("the subuser is..."+JSON.stringify(subuser));
        return {
          customer: customer,
          programs: programs,
          subuser: subuser,
          subuserNum: subuserNum
        };
      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));


      });


      return promise;


    };

    var getReports = function(email, token) {

      var part1 = [];
      var part2 = [];
      var part3 = [];

      var deferred = $q.defer();
      $http({
        url: '/api/selected_program/?order=oname',
        method: 'GET',
        //headers: {'Content-Type': 'application/json'}
        headers: {
          'Authorization': 'JWT ' + token
        }


      }).then(function(response) {

        part1 = response.data.results;
        console.log("part1===" + JSON.stringify(part1));

        if (!response.data.next) {


          deferred.resolve(part1)
        } else {

          $http({
            url: response.data.next,
            method: 'GET',

            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(response) {

            part2 = response.data.results;
            if (!response.data.next) {
              console.log("part1+part2" + JSON.stringify(part1.concat(part2)));
              deferred.resolve(part1.concat(part2));
            } else {

              $http({
                url: response.data.next,
                method: 'GET',

                headers: {
                  'Authorization': 'JWT ' + token
                }
              }).then(function(response) {
                part3 = response.data.results;
                deferred.resolve((part1.concat(part2)).concat(part3));

              }).
              catch(function(error) {
                console.log('an error occurred...' + JSON.stringify(error));

              });


            }
          }).
          catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));

          });
        }



      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));


      });


      return deferred.promise;

    }

    var getProfileList = function(token) {

      var promise = $http({
        url: '/api/upgrid/user/' + avatarService.getClientId(),
        method: 'GET',

        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        profile = response.data;

        console.log("!!!api service GOT! detail=" + JSON.stringify(profile));
        // if(response.status === 204){
        //   console.log("===204");
        // }

        return {
          profile: response.data,
        }

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });
      return promise;


    }

    //get client list
    var getClient = function(token) {

      var promise = $http({
        //url: '/api/upgrid/user/university_customer/?is_non_degree_user=False&page_size=100',
        url: '/api/upgrid/user/university_customer/?page_size=100',
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        console.log("all client is=" + JSON.stringify(response.data));

        return response.data;

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });
      return promise;


    }


    //get exec client list
    var getExecClient = function(token) {

      var promise = $http({
        url: '/api/upgrid/user/university_customer/?is_non_degree_user=True&page_size=100',
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        console.log("all client is=" + JSON.stringify(response.data));

        return response.data.results;

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });
      return promise;


    }


    var getCustomer = function(token) {

      var deferred = $q.defer();

      $http({
        url: '/api/upgrid/accountmanager/is_manager/',
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        console.log("STEP1 =" + response.data);
        if (response.data === "True") {


          deferred.resolve(null);
        } else {
          console.log("entered client");
          $http({
            url: '/api/upgrid/user/',
            method: 'GET',

            headers: {
              'Authorization': 'JWT ' + token
            }
          }).then(function(response) {

            Ceeb = response.data.Ceeb;

            console.log("apiservice Ceeb=" + JSON.stringify(Ceeb));
            // if(response.status === 204){
            //   console.log("===204");
            // }
            deferred.resolve(Ceeb);

          }).catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));
            deferred.reject(error);
          });

        }

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));
        deferred.reject(error);
      });



      return deferred.promise;


    }

    var getReleasedWhoops = function(token) {

      var promise = $http({
        url: '/api/upgrid/user/released_whoops/' + avatarService.getClientId(),
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        console.log("released whoops=" + JSON.stringify(response.data));

        return response.data;

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });
      return promise;


    }


    var getReleasedEnhancement = function(token) {

      var promise = $http({
        url: '/api/upgrid/user/released_enhancement/' + avatarService.getClientId(),
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        console.log("released enhancement=" + JSON.stringify(response.data));

        return response.data;

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });
      return promise;


    }


    var getDashboard = function(token) {

      // alert(token)

      var promise = $http({

        url: '/api/upgrid/user/dashboard/' + avatarService.getClientId(),
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        console.log("released enhancement=" + JSON.stringify(response.data));

        return response.data;

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });
      return promise;


    }



    var getSubuser = function(token, main_user_id, id) {

      console.log("main_user_id = " + main_user_id);
      console.log("id=" + id);
      console.log('/api/upgrid/user/university_customer/?' + (main_user_id ? ('main_user_id=' + main_user_id + '&') : ('')) + (id ? ('id=' + id + '&') : ('')) + 'is_active=true')
      var promise = $http({

        url: '/api/upgrid/user/university_customer/?' + (main_user_id ? ('main_user_id=' + main_user_id + '&') : ('')) + (id ? ('id=' + id + '&') : ('')) + 'is_active=true',
        method: 'GET',
        headers: {
          'Authorization': 'JWT ' + token
        }
      }).then(function(response) {

        console.log("subuser is" + JSON.stringify(response.data));

        return response.data.results;

      }).
      catch(function(error) {
        console.log('an error occurred...' + JSON.stringify(error));

      });
      return promise;


    }


    var getCategories = function(token, school, index, selection, check_all) {

      var deferred = $q.defer();


      if (school) {

        $http({
            url: '/api/upgrid/non_degree/schools/' + school + '/categories',
            method: 'GET',
            headers: {
              'Authorization': 'JWT ' + token
            }
          })
          .then(function(categories) {

            console.log("cat are " + JSON.stringify(categories, null, 4))
            selection[index].category = []

            var temp_selection = []
            for (var k = 0; k < categories.data.length; k++) {
            
              temp_selection.push({
                'id': categories.data[k].object_id,
                'label': categories.data[k].name,
                'name': 'categories'
              })
            }

            selection[index].categories = temp_selection

            if (check_all) {

              var temp_categories = []

              for (var p = 0; p < selection[index].categories.length; p++) {
                temp_categories.push(
                  selection[index].categories[p]
                )
              }
              console.log("temp_categories=" + JSON.stringify(temp_categories, null, 4))

              selection[index].category = temp_categories

            }


            deferred.resolve(selection);


          }).catch(function(error) {
            console.log('an error occurred...' + JSON.stringify(error));
            deferred.reject(error);
          });

      } else {

        selection[index].school = null;
        selection[index].category = [];
        selection[index].categories = []

        deferred.resolve(selection);
        // bar_result[index]= 0

      }


      return deferred.promise;


    }



    return {
      getList: getList,
      getProfileList: getProfileList,
      getReports: getReports,
      getCustomer: getCustomer,
      IfAdmin: IfAdmin,
      getAdmin: getAdmin,
      getClient: getClient,
      getReleasedWhoops: getReleasedWhoops,
      getReleasedEnhancement: getReleasedEnhancement,
      getDashboard: getDashboard,
      getSubuser: getSubuser,
      getExecClient: getExecClient,
      getCategories: getCategories



    };



  });