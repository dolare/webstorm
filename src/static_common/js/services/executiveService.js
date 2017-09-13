//from username, to get the ceeb, program, and degree respectively

angular.module('myApp')
  .factory('executiveService',['orderByFilter', '$sce', 'avatarService', '$http', '$q', 'authenticationSvc', function(orderByFilter, $sce, avatarService, $http, $q, authenticationSvc) {
    
    var getCurrencySymbols = function() {
      return {
        'USD': '$', // US Dollar
        'EUR': '€', // Euro
        'CRC': '₡', // Costa Rican Colón
        'GBP': '£', // British Pound Sterling
        'ILS': '₪', // Israeli New Sheqel
        'INR': '₹', // Indian Rupee
        'JPY': '¥', // Japanese Yen
        'KRW': '₩', // South Korean Won
        'NGN': '₦', // Nigerian Naira
        'PHP': '₱', // Philippine Peso
        'PLN': 'zł', // Polish Zloty
        'PYG': '₲', // Paraguayan Guarani
        'THB': '฿', // Thai Baht
        'UAH': '₴', // Ukrainian Hryvnia
        'VND': '₫', // Vietnamese Dong
        'CNY': '¥', // Chinese Yuan
        'SGD': 'S$', // Singapore Dollar
        'BRL': 'R$', // Brazilian Real
        'CHF': 'CHF', // Swiss Franc
        'null': '$', // The default currency sign is USD
      };
    };

    var updatedReport = function(old_data_raw, new_data_raw) {

      var school_data = angular.copy(new_data_raw);
      var school_data_old = angular.copy(old_data_raw);
      var school_cat_data = school_data.categories;

      var new_ids = _.pluck(new_data_raw.categories, 'object_id');
      var old_ids = _.pluck(old_data_raw.categories, 'object_id');

      var old_data = old_data_raw.categories;
      var new_data = new_data_raw.categories;


      
      console.log('Start loop old');

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
      console.log('Start loop new');

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

            console.log("changed school name")
            //history time
            school_data['date_created_old'] = school_data_old.date_created

          }

            //same name(no update on category)
            //check update on courses
            //school_cat_data[i]["updated"] = null;
            var course_data_copy = school_cat_data[i].courses
            var new_course_data = angular.copy(school_cat_data[i].courses)
            var old_course_data = angular.copy(_.findWhere(old_data, {"object_id": school_cat_data[i].object_id}).courses)


            console.log("new_course_data= "+JSON.stringify(new_course_data));
            console.log("old_course_data= "+JSON.stringify(old_course_data));

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
                
                //history time
                school_data['date_created_old'] = school_data_old.date_created
              }

              //updated url
              if(course_data_copy[j].url !== old_course_copy.url){
                course_data_copy[j]["url_old"] = old_course_copy.url ? old_course_copy.url : 'N/A';
                
                //history time
                school_data['date_created_old'] = school_data_old.date_created
              }

              // //updated repeatable
              // if(course_data_copy[j].Repeatable !== old_course_copy.Repeatable){
              //   course_data_copy[j]["Repeatable_old"] = old_course_copy.Repeatable ? old_course_copy.Repeatable : 'N/A';
                
              //   //history time
              //   school_data['date_created_old'] = school_data_old.date_created
              // }

              var date_new = _.filter(course_data_copy[j].course_dates, function(num){ return num.end_date > course_data_copy[j].date_modified; });
              var date_old = _.filter(old_course_copy.course_dates, function(num){ return num.end_date > old_course_copy.date_modified; });

              // Since it could happen that only one of date_new and date_old holds the new property "duration", which leads to showing update even the dates are the same, here we first create a copy of both date_new and date_old, remove the "duration" property of these 2 copies and then use them to do the comparison.
              var date_newWithoutDuration = angular.copy(date_new);
              angular.forEach(date_newWithoutDuration, function(date, index) {
                if (date.hasOwnProperty('duration'))
                  delete date.duration;
              });

              var date_oldWithoutDuration = angular.copy(date_old);
              angular.forEach(date_oldWithoutDuration, function(date, index) {
                if (date.hasOwnProperty('duration'))
                  delete date.duration;
              });

              //course_date
              if(!_.isEqual(date_newWithoutDuration, date_oldWithoutDuration)){

                console.log("old_course_copy.course_dates="+JSON.stringify(old_course_copy.course_dates));

                if(old_course_copy.course_dates.length !== 0){

                  // if(old_course_copy.course_dates.length===1){
                  //   course_data_copy[j]["course_dates_old"] = moment(old_course_copy.course_dates[0].start_date).format('MMM DD, YYYY') + '-' + moment(old_course_copy.course_dates[0].end_date).format('MMM DD, YYYY');
                  // } else {

                  //   old_course_copy.course_dates = orderByFilter(old_course_copy.course_dates, 'start_date');

                  //   for(var k=0; k<old_course_copy.course_dates.length; k++){
                  //     console.log("k="+k);
                  //     course_data_copy[j]["course_dates_old"] = (course_data_copy[j]["course_dates_old"] || '') + moment(old_course_copy.course_dates[k].start_date).format('MMM DD, YYYY') + '-' + moment(old_course_copy.course_dates[k].end_date).format('MMM DD, YYYY');

                  //     console.log("format = "+moment().format('MMM DD, YYYY'))

                  //     if(k < old_course_copy.course_dates.length - 1){
                  //       course_data_copy[j]["course_dates_old"] = course_data_copy[j]["course_dates_old"] + '; '
                  //     }

                  //     console.log("time = "+course_data_copy[j]["course_dates_old"]);
                  //   }

                  // }

                  course_data_copy[j]["course_dates_old"] = old_course_copy.course_dates

                } else {
                  course_data_copy[j]["course_dates_old"] = 'N/A'
                }

                //course_data_copy[j]["course_dates_old"] = old_course_copy.course_dates.length !== 0 ? old_course_copy.course_dates : 'N/A';
                
                //history time
                school_data['date_created_old'] = school_data_old.date_created
              }

              //updated currency
              if(course_data_copy[j].currency !== old_course_copy.currency){
                course_data_copy[j]["currency_old"] = old_course_copy.currency ? old_course_copy.currency : 'N/A';
              
                //history time
                school_data['date_created_old'] = school_data_old.date_created
              }

              //updated type
              if(course_data_copy[j].type !== old_course_copy.type){
                course_data_copy[j]["type_old"] = old_course_copy.type ? old_course_copy.type : 'N/A';
              
                //history time
                school_data['date_created_old'] = school_data_old.date_created
              }

              //updated tuition
              if(course_data_copy[j].tuition_number !== old_course_copy.tuition_number){
                course_data_copy[j]["tuition_number_old"] = old_course_copy.tuition_number ? old_course_copy.tuition_number : 'N/A';
                
                //history time
                school_data['date_created_old'] = school_data_old.date_created

              }

              }
            }
         
        }
      }

      console.log('Comparison finished!');
      return school_data
    };

    var schools = [
        {
            "object_id": "58aaefe8-7c58-454b-aeb9-b59f7e3decda",
            "ceeb": "1565_SMGT",
            "school": "Kellogg School of Management",
            "university": "Northwestern University",
            "logo": "http://mbafair.org.il/wp-content/uploads/2016/05/kellogg-logo.png"
        },
        {
            "object_id": "1b36a9bf-d84d-45c6-8938-63889f02f0b7",
            "ceeb": "1832_SBUS",
            "school": "Booth School of Business",
            "university": "University of Chicago",
            "logo": "http://www.iedp.com/media/2935/chicago-booth.jpg"
        },
        {
            "object_id": "284cc3cd-af08-43e5-822c-b46ca3b5df7f",
            "ceeb": "2174",
            "school": "Business School",
            "university": "Columbia University",
            "logo": "http://www.macandrewsandforbes.com/wp-content/uploads/2013/05/columbia-gsb.jpg"
        },
        {
            "object_id": "69cf9a6f-9fcc-46ff-a1b8-f463bf4d9db0",
            "ceeb": "2582",
            "school": "Leonard N. Stern School of Business",
            "university": "New York University",
            "logo": "http://about.eloquens.com/wp-content/uploads/2016/07/NYU-Stern-School-of-Business.png"
        },
        {
            "object_id": "7d8bd8f0-90f1-4149-befd-ee4a97f6cf77",
            "ceeb": "2926_BUS",
            "school": "Wharton School",
            "university": "University of Pennsylvania",
            "logo": "https://www.mbamission.com/blog/wp-content/uploads/2017/07/wharton-320x320.png"
        },
        {
            "object_id": "fb5fe7fe-8944-45c8-91b4-ea186ab66f8e",
            "ceeb": "3427",
            "school": "Business School",
            "university": "Harvard University",
            "logo": "https://pbs.twimg.com/profile_images/636927904983728129/lu-cT116.jpg"
        },
        {
            "object_id": "94594fd2-c2cd-41e2-92b0-0a378fa036be",
            "ceeb": "3514_SMGT",
            "school": "Sloan School of Management",
            "university": "Massachusetts Institute of Technology",
            "logo": "http://www.best-masters.com/assets/img/logo_ecole/556.png"
        },
        {
            "object_id": "9af319fd-f54a-474d-a74e-bf2c709ef63c",
            "ceeb": "3987_SMGT",
            "school": "School of Management",
            "university": "Yale University",
            "logo": "http://ycdmultimedia.com/uploads/ysm-logo-recreated.png"
        },
        {
            "object_id": "ad0ae299-9a8f-46fc-9ba0-9b3804ab9e9f",
            "ceeb": "4704_GSB",
            "school": "Graduate School of Business",
            "university": "Stanford University",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/6/64/Stanford_GSB_Logo.jpg"
        },
        {
            "object_id": "428dc1aa-a9f8-49dc-8ef8-6b99c26e33fd",
            "ceeb": "4833_HSB",
            "school": "Haas School of Business",
            "university": "University of California - Berkeley",
            "logo": "https://media.licdn.com/mpr/mpr/shrink_200_200/p/7/005/0b2/329/3547f96.png"
        },
        {
            "object_id": "298c92d3-4eb3-4b75-a273-88d26b727ba1",
            "ceeb": "6666",
            "school": "London Business School",
            "university": "London Business School",
            "logo": "https://upload.wikimedia.org/wikipedia/commons/7/74/LBS_logo_.png"
        },
        {
            "object_id": "66938b15-c75b-4ce6-8412-ff5222a8807c",
            "ceeb": "8888",
            "school": "INSEAD - Institut Européen d'Administration des Affaires",
            "university": "INSEAD",
            "logo": "http://worldscholarshipforum.com/wp-content/uploads/2017/04/INSEAD-Alumni-Fund-IAF-Diversity-Scholarships.png"
        },
        {
            "object_id": "aa6916a1-60d9-40ba-b2ce-df3c9acf96e6",
            "ceeb": "1111",
            "school": "International Institute for Management Development",
            "university": "IMD",
            "logo": "http://www.imd.org/uupload/images/imd-logo-brands-of-the-world-200x200.jpg"
        },
        {
            "object_id": "21f0c4fd-c064-4897-b1d7-115d7c4e55c6",
            "ceeb": "1839_SBUS",
            "school": "Ross School of Business",
            "university": "University of Michigan - Ann Arbor",
            "logo": "https://i.forbesimg.com/media/lists/colleges/university-of-michigan-ann-arbor/stephen-m-ross-school-of-business_200x200.jpg"
        },
        {
            "object_id": "cb0ce0af-8466-41e8-bf21-ad61bf2f89a6",
            "ceeb": "2222",
            "school": "IESE Business School",
            "university": "University of Navarra",
            "logo": "https://i.forbesimg.com/media/lists/colleges/university-of-navarra/iese-business-school_416x416.jpg"
        },
        {
            "object_id": "3cd83956-1f7a-4a62-9cf0-9f287813495b",
            "ceeb": "3333",
            "school": "Center for Creative Leadership",
            "university": "CCL",
            "logo": "https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAKnAAAAJDM2YmNjNmJkLTA1YmQtNDJiMy1iZmFjLTg2YzE0YWYxMDNmMQ.png"
        },
        {
            "object_id": "4ccd5f19-fd95-479a-9445-ac97051d7893",
            "ceeb": "4007_SBUS",
            "school": "Thunderbird School Of Global Management",
            "university": "Arizona State University",
            "logo": "http://www.best-masters.com/assets/img/logo_ecole/570.gif"
        },
        {
            "object_id": "2df0ae88-09ba-49b3-89b4-15d7fa1cd2f8",
            "ceeb": "4832_CMGT",
            "school": "Eller College of Management",
            "university": "University of Arizona",
            "logo": "https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAASPAAAAJGVlNTllZDcwLTZhZjktNGMzNC04MTg0LTg2ODZkOTUyMzQ5Yw.png"
        },
        {
            "object_id": "30cbd322-aa7a-47d1-b56f-8724e0d4da7e",
            "ceeb": "4837_SMGT",
            "school": "Anderson School of Management",
            "university": "University of California - Los Angeles",
            "logo": "https://media.licdn.com/mpr/mpr/shrink_200_200/p/7/005/036/391/3f2be2a.png"
        },
        {
            "object_id": "c7fa2e7f-d443-46b6-89c8-dd7f9c34442b",
            "ceeb": "5816_SBUS",
            "school": "Kenan-Flagler Business School",
            "university": "The University of North Carolina at Chapel Hill",
            "logo": "https://i.forbesimg.com/media/lists/colleges/university-of-north-carolina-at-chapel-hill/kenan-flagler-business-school_200x200.jpg"
        },
        {
            "object_id": "d9dbfe31-ac96-4b18-bf5d-d354e7928814",
            "ceeb": "5820_SBUS",
            "school": "Darden School of Business",
            "university": "University of Virginia",
            "logo": "https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAhTAAAAJDk2OTlmM2U0LTJmOTktNGE1NC04ZThiLWIyZDk0ODQ2NTNjNA.png"
        },
    ];

    var default_school_logo = "/static/img/school_default_logo.png";

    var getLogoById = function(schoolId) {
      var result = schools.filter(function(school) {
        return school.object_id == schoolId;
      })
      if (result.length == 0)
        return default_school_logo;
      else
        return result[0].logo;
    };

    var getLogoBySchoolName = function(schoolName, uniName) {
      var result = schools.filter(function(school) {

        return school.school === schoolName && school.university === uniName;
      })
      if (result.length == 0)
        return default_school_logo;
      else
        return result[0].logo;
    };

    return {
      getCurrencySymbols: getCurrencySymbols,
      updatedReport: updatedReport,
      getLogoById: getLogoById,
      getLogoBySchoolName: getLogoBySchoolName
    };

  }]);