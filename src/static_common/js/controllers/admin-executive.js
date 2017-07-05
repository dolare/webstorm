
// ********************************Executive********************************

angular.module('myApp').controller('ExecutiveController', ['$sce', '$q', '$http', '$scope', '$localStorage', '$window', 'authenticationSvc', 'updateService',
  function($sce, $q, $http, $scope, $localStorage, $window, authenticationSvc, updateService) {
    
   var token = authenticationSvc.getUserInfo().accessToken;
    $scope.emptyExecutiveLabel = "Currently there is no update of the reports."
   $http({
          url: '/api/upgrid/non_degree/schools?is_non_degree=True',
          method: 'GET',
          headers: {
            'Authorization': 'JWT ' + token
          }
    }).then(function (response) {

      $scope.non_degree_schools = response.data.results;

       console.log("return data"+ JSON.stringify(response.data.results));
       
    }).
     catch(function(error){
        console.log('an error occurred...'+JSON.stringify(error));

     });



     $scope.releaseSchool = function(Id) {

      var form = new FormData();
      form.append("school", Id);


      console.log("Id= "+Id);
         $http({
          url: '/api/upgrid/non_degree/reports',
          method: 'POST',
          data: form,
          mimeType: "multipart/form-data",
          processData: false,
          contentType: false,

          headers: {
            'Authorization': 'JWT ' + token
          }
        }).then(function (response) {

            

           console.log("return data"+ JSON.stringify(response.data));
           
        }).
         catch(function(error){
            console.log('an error occurred...'+JSON.stringify(error));

         });



     }


    //  $http({
    //       url: '/api/upgrid/non_degree/reports/32d18135-b699-4a3d-a3f2-9f142740cfd9',
    //       method: 'GET',
    //       headers: {
    //         'Authorization': 'JWT ' + token
    //       }
    // }).then(function (response) {

     

    //    console.log("return data"+ JSON.stringify(response.data));
       
    // }).
    //  catch(function(error){
    //     console.log('an error occurred...'+JSON.stringify(error));

    //  });


    $scope.schooldata_old = 
    {
    "object_id": "be9912e2-0f90-4103-8af4-2779f405bf8b",
    "school_name": "The Graduate School of Arts and Sciences–Camden",
    "university_name": "Rutgers University - Camden",
    "school": "580bbf8b-642b-4eb7-914c-03a054981719",
    "date_created": "2017-06-30T20:30:42.283374Z",
    "categories": [
        {
            "name": "category1",
            "courses": [
                {
                    "url": null,
                    "Repeatable": "Y",
                    "course_dates": [
                        {
                            "end_date": "2017-06-29",
                            "start_date": "2017-06-26",
                            "object_id": "70881026-1738-4ce1-91fd-c59530c0879e"
                        },
                        {
                            "end_date": "2017-06-13",
                            "start_date": "2017-06-06",
                            "object_id": "ebe37b70-3cd7-4e9b-87f9-5e47f8ac312b"
                        }
                    ],
                    "currency": null,
                    "name": "course1",
                    "date_modified": "2017-06-26T18:26:30.399316Z",
                    "type": "onsite",
                    "object_id": "59b0eb7e-4b83-48fe-a78c-2050d90a5ba3",
                    "tuition_number": 222
                },
                {
                    "url": null,
                    "Repeatable": "Y",
                    "course_dates": [
                        {
                            "end_date": "2017-06-26",
                            "start_date": "2017-05-23",
                            "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                        },
                        {
                            "end_date": "2017-05-26",
                            "start_date": "2017-05-17",
                            "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                        }
                    ],
                    "currency": null,
                    "name": "course2",
                    "date_modified": "2017-06-26T18:28:04.317155Z",
                    "type": "online",
                    "object_id": "cb107646-aa9e-4e79-a508-a6d425f5474b",
                    "tuition_number": 333
                },
                {
                    "url": null,
                    "Repeatable": "Y",
                    "course_dates": [
                        {
                            "end_date": "2017-06-26",
                            "start_date": "2017-05-23",
                            "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                        },
                        {
                            "end_date": "2017-05-26",
                            "start_date": "2017-05-17",
                            "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                        }
                    ],
                    "currency": null,
                    "name": "course_deleted",
                    "date_modified": "2017-06-26T18:28:04.317155Z",
                    "type": "online",
                    "object_id": "sb999999-aa9e-4e79-a508-a6d425f5474b",
                    "tuition_number": 333
                }
            ],
            "object_id": "03c655e6-3ab0-4849-85bd-3bbc5f9a2dff",
            "date_modified": "2017-06-26T18:24:48.069051Z"
        },
        {
            "name": "category2_old",
            "courses": [
                {
                    "url": null,
                    "Repeatable": "Y",
                    "course_dates": [
                        {
                            "end_date": "2017-06-26",
                            "start_date": "2017-05-23",
                            "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                        },
                        {
                            "end_date": "2017-05-26",
                            "start_date": "2017-05-17",
                            "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                        }
                    ],
                    "currency": null,
                    "name": "course2",
                    "date_modified": "2017-06-26T18:28:04.317155Z",
                    "type": "online",
                    "object_id": "cb107646-aa9e-4e79-a508-a6d425f5474b",
                    "tuition_number": 333
                }
            ],
            "object_id": "177febab-6548-42bb-ac17-988ae3dcd112",
            "date_modified": "2017-06-26T18:25:18.858474Z"
        },
        {
            "name": "category3",
            "courses": [
                {
                    "url": null,
                    "Repeatable": null,
                    "course_dates": [],
                    "currency": null,
                    "name": "course3",
                    "date_modified": "2017-06-30T04:56:39.306371Z",
                    "type": null,
                    "object_id": "3699c1e0-cd98-4d66-a254-cb769910afed",
                    "tuition_number": null
                },
                {
                    "url": null,
                    "Repeatable": null,
                    "course_dates": [],
                    "currency": null,
                    "name": "course4",
                    "date_modified": "2017-06-30T04:56:15.269661Z",
                    "type": null,
                    "object_id": "2452c3b4-5040-441e-9572-0e106316c6b7",
                    "tuition_number": null
                }
            ],
            "object_id": "ebe867a9-0a1d-4994-968b-ddd8d3a01653",
            "date_modified": "2017-06-30T04:55:21.914913Z"
        },
      

        {
            "name": "category5",
            "courses": [],
            "object_id": "x2671e12-2903-4c58-be84-07af8281bcb1",
            "date_modified": "2017-05-30T04:55:39.670543Z"
        }
    ]
}

  $scope.schooldata_new = 
    {
    "object_id": "be9912e2-0f90-4103-8af4-2779f405bf8b",
    "school_name": "The Graduate School of Arts and Sciences–Camden",
    "university_name": "Rutgers University - Camden",
    "school": "580bbf8b-642b-4eb7-914c-03a054981719",
    "date_created": "2017-06-30T20:30:42.283374Z",
    "categories": [
        {
            "name": "category1",
            "courses": [
                {
                    "url": "www.google.com",
                    "Repeatable": "N",
                    "course_dates": [
                        {
                            "end_date": "2017-05-29",
                            "start_date": "2017-06-26",
                            "object_id": "70881026-1738-4ce1-91fd-c59530c0879e"
                        },
                        {
                            "end_date": "2017-06-13",
                            "start_date": "2017-06-06",
                            "object_id": "ebe37b70-3cd7-4e9b-87f9-5e47f8ac312b"
                        }
                    ],
                    "currency": 100,
                    "name": "course1",
                    "date_modified": "2017-06-26T18:26:30.399316Z",
                    "type": "onsite",
                    "object_id": "59b0eb7e-4b83-48fe-a78c-2050d90a5ba3",
                    "tuition_number": 222
                },
                {
                    "url": null,
                    "Repeatable": "N",
                    "course_dates": [
                        {
                            "end_date": "2017-06-26",
                            "start_date": "2017-05-23",
                            "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                        },
                        {
                            "end_date": "2017-05-26",
                            "start_date": "2017-05-17",
                            "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                        }
                    ],
                    "currency": null,
                    "name": "course2",
                    "date_modified": "2017-06-26T18:28:04.317155Z",
                    "type": "online",
                    "object_id": "cb107646-aa9e-4e79-a508-a6d425f5474b",
                    "tuition_number": 333
                },

                {
                    "url": null,
                    "Repeatable": "Y",
                    "course_dates": [
                        {
                            "end_date": "2017-06-26",
                            "start_date": "2017-05-23",
                            "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                        },
                        {
                            "end_date": "2017-05-26",
                            "start_date": "2017-05-17",
                            "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                        }
                    ],
                    "currency": null,
                    "name": "course_added",
                    "date_modified": "2017-06-26T18:28:04.317155Z",
                    "type": "online",
                    "object_id": "ha997646-aa9e-4e79-a508-a6d425f5474b",
                    "tuition_number": 333
                }
            ],
            "object_id": "03c655e6-3ab0-4849-85bd-3bbc5f9a2dff",
            "date_modified": "2017-06-26T18:24:48.069051Z"
        },
        {
            "name": "category2",
            "courses": [
                {
                    "url": null,
                    "Repeatable": "Y",
                    "course_dates": [
                        {
                            "end_date": "2017-06-26",
                            "start_date": "2017-05-23",
                            "object_id": "e755ecc0-d398-4aa4-ba5f-acfa3fa21fec"
                        },
                        {
                            "end_date": "2017-05-26",
                            "start_date": "2017-05-17",
                            "object_id": "490be808-6a9c-480c-a4ed-d1a3a7565112"
                        }
                    ],
                    "currency": null,
                    "name": "course2",
                    "date_modified": "2017-06-26T18:28:04.317155Z",
                    "type": "online",
                    "object_id": "cb107646-aa9e-4e79-a508-a6d425f5474b",
                    "tuition_number": 333
                }
            ],
            "object_id": "177febab-6548-42bb-ac17-988ae3dcd112",
            "date_modified": "2017-06-26T18:25:18.858474Z"
        },
        {
            "name": "category3",
            "courses": [
                {
                    "url": null,
                    "Repeatable": null,
                    "course_dates": [],
                    "currency": null,
                    "name": "course3",
                    "date_modified": "2017-06-30T04:56:39.306371Z",
                    "type": null,
                    "object_id": "3699c1e0-cd98-4d66-a254-cb769910afed",
                    "tuition_number": null
                },
                {
                    "url": null,
                    "Repeatable": null,
                    "course_dates": [],
                    "currency": null,
                    "name": "course4",
                    "date_modified": "2017-06-30T04:56:15.269661Z",
                    "type": null,
                    "object_id": "2452c3b4-5040-441e-9572-0e106316c6b7",
                    "tuition_number": null
                }
            ],
            "object_id": "ebe867a9-0a1d-4994-968b-ddd8d3a01653",
            "date_modified": "2017-06-30T04:55:21.914913Z"
        },
        {
            "name": "category4",
            "courses": [],
            "object_id": "92671e12-2903-4c58-be84-07af8281bcb1",
            "date_modified": "2017-06-30T04:55:39.670543Z"
        }
    ]
}


    $scope.processExecutive = function(old_data, new_data) {

      var school_data = angular.copy(new_data);

      var new_ids = _.pluck(new_data, 'object_id');
      var old_ids = _.pluck(old_data, 'object_id');

      //loop old
      for(var i=0; i<old_data.length; i++){

        if(!_.contains(new_ids, old_data[i].object_id)){

          school_data.push(old_data[i]);
          school_data[school_data.length-1]["updated"]= 0 

        }

      }

      //loop new
      console.log("new_data.length"+JSON.stringify(new_data.length));

      for(var i=0; i<new_data.length; i++){

        if(!_.contains(old_ids, school_data[i].object_id)){
          
          school_data[i]["updated"]= 1 

        } else {

          //if name diff
          if(school_data[i].name !== _.findWhere(old_data, {"object_id": school_data[i].object_id}).name){
            school_data[i]["updated"] =   _.findWhere(old_data, {"object_id": school_data[i].object_id}).name

          } else {
            //same name(no update on category)
            //check update on courses
            school_data[i]["updated"] = null;
            var course_data_copy = school_data[i].courses
            var new_course_data = angular.copy(school_data[i].courses)
            var old_course_data = angular.copy(_.findWhere(old_data, {"object_id": school_data[i].object_id}).courses)

            var new_course_ids = _.pluck(school_data[i].courses, 'object_id');
            var old_course_ids = _.pluck(_.findWhere(old_data, {"object_id": school_data[i].object_id}).courses, 'object_id');

             //loop old course, deleted course
            for(var j=0; j<old_course_data.length; j++){

              if(!_.contains(new_course_ids, old_course_data[j].object_id)){

                course_data_copy.push(old_course_data[j]);
                course_data_copy[course_data_copy.length-1]["updated"]= 0 
              }

            }

            //loop new, added course
            for(var j=0; j<new_course_data.length; j++){

              if(!_.contains(old_course_ids, course_data_copy[j].object_id)){

                course_data_copy[j]["updated"]= 1 

              } else {
              //updated course, no color
              var old_course_copy =  _.findWhere(old_course_data, {"object_id": course_data_copy[j].object_id})

              //updated name
              if(course_data_copy[j].name !== old_course_copy.name){
                course_data_copy[j]["name_old"] = old_course_copy.name;
              }

              //updated url
              if(course_data_copy[j].url !== old_course_copy.url){
                course_data_copy[j]["url_old"] = old_course_copy.url;
              }

              //updated repeatable
              if(course_data_copy[j].Repeatable !== old_course_copy.Repeatable){
                course_data_copy[j]["Repeatable_old"] = old_course_copy.Repeatable;
              }

              //course_date
              if(!_.isEqual(course_data_copy[j].course_dates, old_course_copy.course_dates)){
                course_data_copy[j]["course_dates_old"] = old_course_copy.course_dates;
              }

              //updated currency
              if(course_data_copy[j].currency !== old_course_copy.currency){
                course_data_copy[j]["currency_old"] = old_course_copy.currency;
              }

              //updated type
              if(course_data_copy[j].type !== old_course_copy.type){
                course_data_copy[j]["type_old"] = old_course_copy.type;
              }

              //updated tuition
              if(course_data_copy[j].tuition_number !== old_course_copy.tuition_number){
                course_data_copy[j]["tuition_number_old"] = old_course_copy.tuition_number;
              }

              }

            }

            

          }
          
        }

      }

      console.log("school_data= "+JSON.stringify(school_data));

    }


    $scope.processExecutive($scope.schooldata_old.categories,$scope.schooldata_new.categories);
     


  }
]);