//from username, to get the ceeb, program, and degree respectively

angular.module('myApp')
  .factory('executiveService', function(avatarService, $http, $q, authenticationSvc) {
    
     var updatedReport = function(old_data_raw, new_data_raw) {

      var school_data = angular.copy(new_data_raw);
      var school_cat_data = school_data.categories;

      var new_ids = _.pluck(new_data_raw.categories, 'object_id');
      var old_ids = _.pluck(old_data_raw.categories, 'object_id');

      var old_data = old_data_raw.categories;
      var new_data = new_data_raw.categories;

      console.log("old_data="+JSON.stringify(old_data));
      console.log("new_data="+JSON.stringify(new_data));

      //loop old
      for(var i=0; i<old_data.length; i++){
        if(!_.contains(new_ids, old_data[i].object_id)){
          school_cat_data.push(old_data[i]);
          school_cat_data[school_cat_data.length-1]["updated"]= 2
          //process the courses
          for(var j=0; j<school_cat_data[school_cat_data.length-1]["courses"].length; j++){
            school_cat_data[school_cat_data.length-1]["courses"][j]["updated"] = 2;
          }
        }
      }

      //loop new
      console.log("new_data.length"+JSON.stringify(new_data.length));

      for(var i=0; i<new_data.length; i++){

        if(!_.contains(old_ids, school_cat_data[i].object_id)){
          school_cat_data[i]["updated"]= 1 

          for(var j=0; j<school_cat_data[i]["courses"].length; j++){
            school_cat_data[i]["courses"][j]["updated"] = 1;
          }


        } else {

          //if name diff
          if(school_cat_data[i].name !== _.findWhere(old_data, {"object_id": school_cat_data[i].object_id}).name){
            school_cat_data[i]["updated"] =   _.findWhere(old_data, {"object_id": school_cat_data[i].object_id}).name

          } else {
            //same name(no update on category)
            //check update on courses
            school_cat_data[i]["updated"] = null;
            var course_data_copy = school_cat_data[i].courses
            var new_course_data = angular.copy(school_cat_data[i].courses)
            var old_course_data = angular.copy(_.findWhere(old_data, {"object_id": school_cat_data[i].object_id}).courses)

            var new_course_ids = _.pluck(school_cat_data[i].courses, 'object_id');
            var old_course_ids = _.pluck(_.findWhere(old_data, {"object_id": school_cat_data[i].object_id}).courses, 'object_id');

             //loop old course, deleted course
            for(var j=0; j<old_course_data.length; j++){

              if(!_.contains(new_course_ids, old_course_data[j].object_id)){
                course_data_copy.push(old_course_data[j]);
                course_data_copy[course_data_copy.length-1]["updated"]= 2 
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
                course_data_copy[j]["name_old"] = old_course_copy.name ? old_course_copy.name : 'N/A';
              }

              //updated url
              if(course_data_copy[j].url !== old_course_copy.url){
                course_data_copy[j]["url_old"] = old_course_copy.url ? old_course_copy.url : 'N/A';
              }

              //updated repeatable
              if(course_data_copy[j].Repeatable !== old_course_copy.Repeatable){
                course_data_copy[j]["Repeatable_old"] = old_course_copy.Repeatable ? old_course_copy.Repeatable : 'N/A';
              }

              //course_date
              if(!_.isEqual(course_data_copy[j].course_dates, old_course_copy.course_dates)){
                course_data_copy[j]["course_dates_old"] = old_course_copy.course_dates.length !== 0 ? old_course_copy.course_dates : 'N/A';
              }

              //updated currency
              if(course_data_copy[j].currency !== old_course_copy.currency){
                course_data_copy[j]["currency_old"] = old_course_copy.currency ? old_course_copy.currency : 'N/A';
              }

              //updated type
              if(course_data_copy[j].type !== old_course_copy.type){
                course_data_copy[j]["type_old"] = old_course_copy.type ? old_course_copy.type : 'N/A';
              }

              //updated tuition
              if(course_data_copy[j].tuition_number !== old_course_copy.tuition_number){
                course_data_copy[j]["tuition_number_old"] = old_course_copy.tuition_number ? old_course_copy.tuition_number : 'N/A';
              }

              }
            }
          }
        }
      }

      console.log("school_data= "+JSON.stringify(school_data));
      return school_data
  }
    return {
      updatedReport: updatedReport
    };

  });
