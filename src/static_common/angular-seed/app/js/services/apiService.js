//from username, to get the ceeb, program, and degree respectively

angular.module('apiServiceModule', [])
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
        }).then(function (response) {

           console.log("!!!GOT! detail="+ JSON.stringify(profile));
           if(response.data === "True"){
              upgridUser = {
                  admin: true
              }

           } else if (response.data === "False"){
              upgridUser = {
                  admin: false
              }
           }
           deferred.resolve(upgridUser);
           
         }).
         catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));
            deferred.reject(error);
         });
          return deferred.promise;


        }

       var getAdmin = function(){
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
        console.log("API DATA = "+JSON.stringify(subuserNum));
       

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
        console.log("part1==="+JSON.stringify(part1));

        if (!response.data.next) {

             
             deferred.resolve(part1)
        }else {

          $http({
                                    url: response.data.next,
                                    method: 'GET',

                                    headers: {
                                        'Authorization': 'JWT ' + token
                                    }
                                }).then(function(response) {

                                  part2 = response.data.results;
                                    if (!response.data.next) {
                                        console.log("part1+part2"+JSON.stringify(part1.concat(part2)));
                                        deferred.resolve(part1.concat(part2));
                                        }else {

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

      var promise =  $http({
          url: '/api/upgrid/user/'+avatarService.getClientId(),
          method: 'GET',
          
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

       profile = response.data;

       console.log("!!!GOT! detail="+ JSON.stringify(profile));
        // if(response.status === 204){
        //   console.log("===204");
        // }

        return {
                profile: response.data,
              }

    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });
    return promise;


    }

    //get client list
      var getClient = function(token) {

            var promise =  $http({
              url: '/api/upgrid/accountmanager/',
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function (response) {

               console.log("!!!GOT! detail="+ JSON.stringify(response.data.client_list));
                
               return response.data.client_list;

             }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });
            return promise;


        }


    var getCustomer = function(email, token) {

                        var deferred = $q.defer();


                       $http({
                              url: '/api/upgrid/accountmanager/is_manager/',
                              method: 'GET',
                              headers: {
                                'Authorization': 'JWT ' + token
                              }
                        }).then(function (response) {

                          console.log("STEP1 ="+response.data);
                            if(response.data === "True"){
                                

                                deferred.resolve(null);
                            }else if(response.data === "False"){
                                console.log("entered client");
                                $http({
                                    url: '/api/upgrid/user/',
                                    method: 'GET',
                                    
                                    headers: {
                                      'Authorization': 'JWT ' + token
                                    }
                              }).then(function (response) {

                                 Ceeb = response.data.Ceeb;

                                 console.log("apiservice Ceeb="+ JSON.stringify(Ceeb));
                                  // if(response.status === 204){
                                  //   console.log("===204");
                                  // }
                                  deferred.resolve(Ceeb);
                                  
                              }).catch(function(error){
                                  console.log('an error occurred...'+JSON.stringify(error));
                                  deferred.reject(error);
                               });

                            }

                        }).
                         catch(function(error){
                            console.log('an error occurred...'+JSON.stringify(error));
                            deferred.reject(error);
                         });


                        //   var promise =  $http({
                        //       url: '/api/customerDetail/',
                        //       method: 'POST',
                        //       data: {
                        //          email: email
                        //       },
                        //       headers: {
                        //         'Authorization': 'JWT ' + token
                        //       }
                        // }).then(function (response) {

                        //    Ceeb = response.data.Ceeb;

                        //    console.log("!!!GOT! from apiservice="+ JSON.stringify(Ceeb));
                        //     // if(response.status === 204){
                        //     //   console.log("===204");
                        //     // }

                        //     return {
                        //             Ceeb: Ceeb
                        //           }
                        // }).catch(function(error){
                        //     console.log('an error occurred...'+JSON.stringify(error));

                        //  });



        return deferred.promise;


    }

        var getReleasedWhoops = function(token) {

          var promise =  $http({
              url: '/api/upgrid/user/released_whoops/'+avatarService.getClientId(),
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function (response) {

               console.log("released whoops="+ JSON.stringify(response.data));
                
               return response.data;

             }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });
            return promise;


        }


        var getReleasedEnhancement = function(token) {

          var promise =  $http({
              url: '/api/upgrid/user/released_enhancement/'+avatarService.getClientId(),
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function (response) {

               console.log("released enhancement="+ JSON.stringify(response.data));
                
               return response.data;

             }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });
            return promise;


        }


        var getDashboard = function(token) {

          var promise =  $http({
              url: '/api/upgrid/user/dashboard/'+avatarService.getClientId(),
              method: 'GET',
              headers: {
                'Authorization': 'JWT ' + token
              }
            }).then(function (response) {

               console.log("released enhancement="+ JSON.stringify(response.data));
                
               return response.data;

             }).
             catch(function(error){
                console.log('an error occurred...'+JSON.stringify(error));

             });
            return promise;


        }


        var getNewWhoops = function(token) {
          var avatar = avatarService.getClientId() ? "&cid="+ avatarService.getClientId(): "";
           console.log("avatar = "+avatar);
          var promise =  $http({
                url: '/api/upgrid/user/program/?order=oname&wfs=True'+avatar,
                method: 'GET',
                
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {

                console.log("reponse="+JSON.stringify(response));
                return response.data.results
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });

            return promise;


        }


        var getNewEnhancement = function(token) {
          var avatar = avatarService.getClientId() ? "&cid="+ avatarService.getClientId(): "";
          console.log("avatar = "+avatar);
          var promise =  $http({
                url: '/api/upgrid/user/program/?order=oname&efs=True'+avatar,
                method: 'GET',
                
                headers: {
                  'Authorization': 'JWT ' + token
                }
          }).then(function (response) {
                console.log("reponse="+JSON.stringify(response));              
                return response.data.results
          }).
           catch(function(error){
              console.log('an error occurred...'+JSON.stringify(error));

           });

            return promise;


        }

        

    return {
      getList: getList,
      getProfileList:getProfileList,
      getReports:getReports,
      getCustomer: getCustomer,
      IfAdmin: IfAdmin,
      getAdmin: getAdmin,
      getClient: getClient,
      getReleasedWhoops: getReleasedWhoops,
      getReleasedEnhancement: getReleasedEnhancement,
      getDashboard: getDashboard,
      getNewWhoops: getNewWhoops,
      getNewEnhancement: getNewEnhancement


    };



  });