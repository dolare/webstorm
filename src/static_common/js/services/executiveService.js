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
              //var date_old = _.filter(old_course_copy.course_dates, function(num){ return num.end_date > old_course_copy.date_modified; });
              var date_old = _.filter(old_course_copy.course_dates, function(num){ return num.end_date > course_data_copy[j].date_modified; });



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

                console.log("original data="+JSON.stringify(course_data_copy[j].course_dates, null, 4))
                console.log("date_new="+JSON.stringify(date_new, null, 4))
                console.log("date_old="+JSON.stringify(date_old, null, 4))

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
              //if(course_data_copy[j].tuition_number !== old_course_copy.tuition_number){
              if(parseInt(course_data_copy[j].tuition_number) !== parseInt(old_course_copy.tuition_number)){
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
    // School logo images must be png format. The naming convention is ceeb + "_logo.png". When adding a new school logo, upload the image file to AWS S3 first and then creat the object in the following schools array with the logo URL from AWS S3.
    var schools = [
        {
            "object_id": "58aaefe8-7c58-454b-aeb9-b59f7e3decda",
            "ceeb": "1565_SMGT",
            "school": "Kellogg School of Management",
            "university": "Northwestern University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/1565_SMGT_logo.png"
        },
        {
            "object_id": "1b36a9bf-d84d-45c6-8938-63889f02f0b7",
            "ceeb": "1832_SBUS",
            "school": "Booth School of Business",
            "university": "University of Chicago",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/1832_SBUS_logo.png"
        },
        {
            "object_id": "284cc3cd-af08-43e5-822c-b46ca3b5df7f",
            "ceeb": "2174",
            "school": "Business School",
            "university": "Columbia University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/2174_logo.png"
        },
        {
            "object_id": "69cf9a6f-9fcc-46ff-a1b8-f463bf4d9db0",
            "ceeb": "2582",
            "school": "Leonard N. Stern School of Business",
            "university": "New York University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/2582_logo.png"
        },
        {
            "object_id": "7d8bd8f0-90f1-4149-befd-ee4a97f6cf77",
            "ceeb": "2926_BUS",
            "school": "Wharton School",
            "university": "University of Pennsylvania",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/2926_BUS_logo.png"
        },
        {
            "object_id": "fb5fe7fe-8944-45c8-91b4-ea186ab66f8e",
            "ceeb": "3427",
            "school": "Business School",
            "university": "Harvard University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/3427_logo.png"
        },
        {
            "object_id": "94594fd2-c2cd-41e2-92b0-0a378fa036be",
            "ceeb": "3514_SMGT",
            "school": "Sloan School of Management",
            "university": "Massachusetts Institute of Technology",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/3514_SMGT_logo.png"
        },
        {
            "object_id": "9af319fd-f54a-474d-a74e-bf2c709ef63c",
            "ceeb": "3987_SMGT",
            "school": "School of Management",
            "university": "Yale University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/3987_SMGT_logo.png"
        },
        {
            "object_id": "ad0ae299-9a8f-46fc-9ba0-9b3804ab9e9f",
            "ceeb": "4704_GSB",
            "school": "Graduate School of Business",
            "university": "Stanford University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/4704_GSB_logo.png"
        },
        {
            "object_id": "428dc1aa-a9f8-49dc-8ef8-6b99c26e33fd",
            "ceeb": "4833_HSB",
            "school": "Haas School of Business",
            "university": "University of California - Berkeley",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/4833_HSB_logo.png"
        },
        {
            "object_id": "298c92d3-4eb3-4b75-a273-88d26b727ba1",
            "ceeb": "6666",
            "school": "London Business School",
            "university": "London Business School",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/6666_logo.png"
        },
        {
            "object_id": "66938b15-c75b-4ce6-8412-ff5222a8807c",
            "ceeb": "8888",
            "school": "INSEAD - Institut Européen d'Administration des Affaires",
            "university": "INSEAD",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/8888_logo.png"
        },
        {
            "object_id": "aa6916a1-60d9-40ba-b2ce-df3c9acf96e6",
            "ceeb": "1111",
            "school": "International Institute for Management Development",
            "university": "IMD",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/1111_logo.png"
        },
        {
            "object_id": "21f0c4fd-c064-4897-b1d7-115d7c4e55c6",
            "ceeb": "1839_SBUS",
            "school": "Ross School of Business",
            "university": "University of Michigan - Ann Arbor",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/1839_SBUS_logo.png"
        },
        {
            "object_id": "cb0ce0af-8466-41e8-bf21-ad61bf2f89a6",
            "ceeb": "2222",
            "school": "IESE Business School",
            "university": "University of Navarra",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/2222_logo.png"
        },
        {
            "object_id": "3cd83956-1f7a-4a62-9cf0-9f287813495b",
            "ceeb": "3333",
            "school": "Center for Creative Leadership",
            "university": "CCL",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/3333_logo.png"
        },
        {
            "object_id": "4ccd5f19-fd95-479a-9445-ac97051d7893",
            "ceeb": "4007_SBUS",
            "school": "Thunderbird School Of Global Management",
            "university": "Arizona State University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/4007_SBUS_logo.png"
        },
        {
            "object_id": "2df0ae88-09ba-49b3-89b4-15d7fa1cd2f8",
            "ceeb": "4832_CMGT",
            "school": "Eller College of Management",
            "university": "University of Arizona",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/4832_CMGT_logo.png"
        },
        {
            "object_id": "30cbd322-aa7a-47d1-b56f-8724e0d4da7e",
            "ceeb": "4837_SMGT",
            "school": "Anderson School of Management",
            "university": "University of California - Los Angeles",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/4837_SMGT_logo.png"
        },
        {
            "object_id": "c7fa2e7f-d443-46b6-89c8-dd7f9c34442b",
            "ceeb": "5816_SBUS",
            "school": "Kenan-Flagler Business School",
            "university": "The University of North Carolina at Chapel Hill",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/5816_SBUS_logo.png"
        },
        {
            "object_id": "d9dbfe31-ac96-4b18-bf5d-d354e7928814",
            "ceeb": "5820_SBUS",
            "school": "Darden School of Business",
            "university": "University of Virginia",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/5820_SBUS_logo.png"
        },
        {
            "object_id": "84c11511-648f-473d-8deb-7fdff36f6c64",
            "ceeb": "5187_SBUS",
            "school": "Goizueta Business School",
            "university": "Emory University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/5187_SBUS_logo.png"
        },
        {
            "object_id": "73560ad0-23aa-404d-8a91-85f0d1b07752",
            "ceeb": "1871_GSM",
            "school": "Owen Graduate School of Management",
            "university": "Vanderbilt University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/1871_GSM_logo.png"
        },
        {
            "object_id": "6f673d9f-74b2-4573-aa6c-24283069aa61",
            "ceeb": "1592_CBUS",
            "school": "Fisher College of Business",
            "university": "Ohio State University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/1592_CBUS_logo.png"
        },
        {
            "object_id": "b508fbc1-a020-4e69-a00c-db0fe1c88294",
            "ceeb": "1843_CBUS",
            "school": "Haslam College of Business",
            "university": "The University of Tennessee",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/1843_CBUS_logo.png"
        },
        {
            "object_id": "1471d830-00d1-48de-8415-5ad153843334",
            "ceeb": "2098_GSM",
            "school": "Graduate School of Management",
            "university": "Cornell University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/2098_GSM_logo.png"
        },
        {
            "object_id": "f4bc5e20-a385-4c9a-9198-db0276d13278",
            "ceeb": "2660_CBUS",
            "school": "Smeal College of Business",
            "university": "Pennsylvania State University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/2660_CBUS_logo.png"
        },
        {
            "object_id": "d62eb43d-c29c-4e4e-9ea6-8f2ca6aee1cf",
            "ceeb": "2940_SBUS",
            "school": "Joseph M. Katz Graduate School of Business and College of Business Administration",
            "university": "University of Pittsburgh",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/2940_SBUS_logo.png"
        },
        {
            "object_id": "dc3c7fd5-6c49-4f7c-8aff-f9f3e0ed5fc1",
            "ceeb": "3351_SBUS",
            "school": "Tuck School of Business",
            "university": "Dartmouth College",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/3351_SBUS_logo.png"
        },
        {
            "object_id": "ec5196d6-d71f-473f-b196-c6bd592eb1c8",
            "ceeb": "5555",
            "school": "Said Business School",
            "university": "University of Oxford",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/5555_logo.png"
        },
        {
            "object_id": "42337336-84f5-404e-8cd9-f80022b7b0f9",
            "ceeb": "5813_CBUS",
            "school": "Terry College of Business",
            "university": "University of Georgia",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/5813_CBUS_logo.png"
        },
        {
            "object_id": "a71e9253-306c-4263-88a6-957ebd84fcd2",
            "ceeb": "5818_SBUS",
            "school": "Darla Moore School of Business",
            "university": "University of South Carolina",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/5818_SBUS_logo.png"
        },
        {
            "object_id": "2c95418c-8a07-4083-bfde-8dff5289a5e1",
            "ceeb": "7777",
            "school": "ESMT Berlin",
            "university": "ESMT Berlin",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/7777_logo.png"
        },
        {
            "object_id": "1c4969a9-41c4-4eec-b28a-ae187578cc14",
            "ceeb": "6609_SBUS",
            "school": "Jones Graduate School of Business",
            "university": "Rice University",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/6609_SBUS_logo.png"
        },
        {
            "object_id": "f1bd1f21-27e3-4a58-b34d-607d04124748",
            "ceeb": "6929_SBUS",
            "school": "Olin Business School",
            "university": "Washington University in St Louis",
            "logo": "https://s3.us-east-2.amazonaws.com/publicresource.upgrid/upgrid-school-logos/6929_SBUS_logo.png"
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