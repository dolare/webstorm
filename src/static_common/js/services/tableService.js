angular.module('myApp')
  .factory('tableDataService', function() {


    var getWhoops = function(List) {


      var data = [];

      /////////////
      

      console.log("whoops List ="+JSON.stringify(List));

      for (i = 0; i < List.length; i++) {

        data[i] = {
          "objectId": List[i].object_id,
          "programName": List[i].program_name,
          "degreeName": List[i].program_degree,
          "notes": List[i].has_expert_notes,
          "whoops_status": List[i].whoops_final_release,
          "enhancement_status": List[i].enhancement_final_release,
          "confirm": List[i].customer_confirmation,
          "updated": List[i].whoops_update.update_nums>0?true:false,

        };

      }

      console.log("table service data="+JSON.stringify(data));
      //sorting in alphabetical order
      // data.sort(function(a, b) {
      //   return (a.programName.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
      // });

      // List.programs.program.sort(function(a, b) {
      //   return (a.program_name.toLowerCase() > b.program_name.toLowerCase()) ? 1 : ((b.program_name.toLowerCase() > a.program_name.toLowerCase()) ? -1 : 0);
      // });
      //console.log("raw program is = "+JSON.stringify(List.programs.program));

      //push non-duplicate program data into data array
      // for (i = 0; i < List.programs.program.length; i++) 
      // {
      //   var exists = false;
      //   for (j = 0; j < data.length; j++) {
      //     if (List.programs.program[i].object_id === data[j].programId) {
      //       exists = true;
      //       break;
      //     }
      //   }

      //   if (!exists) {
      //     data.push({
      //       "programId": List.programs.program[i].object_id,
      //       "programName": List.programs.program[i].program_name,
      //       "degreeName": List.programs.program[i].degree
      //     });
      //   };

      // };

      return data;

    };

    var getEnhancement = function(List) {

      var data = [];

      console.log("getenhancement List"+JSON.stringify(List));

      for (i = 0; i < List.length; i++) {

        data[i] = {

          "objectId": List[i].object_id,
          "programName": List[i].program_name,
          "degreeName": List[i].program_degree,
          "notes": List[i].has_expert_notes,
          "whoops_status": List[i].whoops_final_release,
          "enhancement_status": List[i].enhancement_final_release,
          "confirm": List[i].customer_confirmation,
          "updated": List[i].enhancement_update.update_nums>0?true:false,
          
          
          "competing": []
          // (function() {


          //   var competingArray = [];
          //   for (j = 0; j < List[i].competingprogram.length; j++) {

          //     competingArray[j] = {
          //       "programId": List[i].competingprogram[j].program.split('#')[0],
          //       "university": List[i].competingprogram[j].program.split('#')[3],
          //       "school": List[i].competingprogram[j].program.split('#')[4],
          //       "programName": List[i].competingprogram[j].program.split('#')[1],
          //       "degreeName": List[i].competingprogram[j].program.split('#')[2],
          //       "order": List[i].competingprogram[j].order
          //     }
          //   }
          //   competingArray.sort(function(a, b) {
          //       return parseInt(a.order) - parseInt(b.order);
          //     }

          //   );

          //   return competingArray;

          // })()


        };



      }



      return data;

    };



    var getEnhancementConfirm = function(List) {

      
      var data = [];
      console.log("confirm list = "+JSON.stringify(List));

      for (i = 0; i < List.length; i++) {

        data[i] = {
          "checked": null,
          //"programId": List.customerprogram[i].program.split('#')[0],
          "programName": List[i].program_name,
          "degreeName": List[i].program_degree,
          //"status": List.customerprogram[i].FinalRelease_Status,


          "objectId": List[i].object_id,
          "competing": []
          // "confirm": List[i].customerconfirmation_status,
          //Y and N
          //"confirm": "Y",
          // "competing": (function() {


          //   var competingArray = [];
          //   for (j = 0; j < List[i].competingprogram.length; j++) {

          //     competingArray[j] = {
          //       "programId": List[i].competingprogram[j].program.split('#')[0],
          //       "university": List[i].competingprogram[j].program.split('#')[3],
          //       "school": List[i].competingprogram[j].program.split('#')[4],
          //       "programName": List[i].competingprogram[j].program.split('#')[1],
          //       "degreeName": List[i].competingprogram[j].program.split('#')[2],
          //       "order": List[i].competingprogram[j].order
          //     }
          //   }
          //   competingArray.sort(function(a, b) {
          //       return parseInt(a.order) - parseInt(b.order);
          //     }

          //   );

          //   return competingArray;

          // })()


        };



      }


      return data;

    };

    var getProfile = function(List) {

      var data = [];
      //console.log("service = "+JSON.stringify(List.customer));
      data = {
        "contractLevel": List.profile.service_level,
        "serviceUntil": List.profile.service_until.split('T')[0],
        "primaryName": List.profile.contact_name,

        "primaryPrefix": List.profile.contract_prefix,
        "primaryTitle": List.profile.contract_title,
        // "primaryLevel": List.customer.contract_Level,



        "accountType": List.profile.account_type,
        "primaryTel": List.profile.contract_tel,

        // "customerPrograms": (function() {
        //   var programs = [];
        //   for (i = 0; i < List.profile.customerprogram.length; i++) {
        //     programs[i] = {

        //       "programName": List.profile.customerprogram[i].program.split('#')[1],
        //       "degreeName": List.profile.customerprogram[i].program.split('#')[2]
        //     }

        //   }
        //   programs.sort(function(a, b) {
        //     return (a.programName.toLowerCase() > b.programName.toLowerCase()) ? 1 : ((b.programName.toLowerCase() > a.programName.toLowerCase()) ? -1 : 0);
        //   });
        //   return programs;

        // })(),
        "competingSchools": List.profile.competing_schools,
        "subuser": List.profile.sub_user_list,
        "username": List.profile.username,
        "ceeb": List.profile.Ceeb,
        // "subuserNum": List.profile.subuserNum


      }



      return data;

    };

    var getProfileProgram = function(List) {


      var data = [];

    
      for (i = 0; i < List.length; i++) {

        data[i] = {
          
          "programName": List[i].program.split('#')[1],
          "degreeName": List[i].program.split('#')[2],
          
        };

      }

      console.log("table service data="+JSON.stringify(data));
      

      return data;

    };

    var getCart = function(List) {


      var data = [];

      /////////////


      for (i = 0; i < List.length; i++) {

        data[i] = {
          "programId": List[i].program.split('#')[0],
          "programName": List[i].program.split('#')[1],
          "degreeName": List[i].program.split('#')[2],
          "status": List[i].finalrelease_status,
          "confirm": List[i].customerconfirmation_status,
          "notes": List[i].program.split('#')[3],
          "competing": (function() {


            var competingArray = [];
            for (j = 0; j < List[i].competingprogram.length; j++) {

              competingArray[j] = {
                "programId": List[i].competingprogram[j].program.split('#')[0],
                "university": List[i].competingprogram[j].program.split('#')[3],
                "school": List[i].competingprogram[j].program.split('#')[4],
                "programName": List[i].competingprogram[j].program.split('#')[1],
                "degreeName": List[i].competingprogram[j].program.split('#')[2],
                "order": List[i].competingprogram[j].order
              }
            }
            competingArray.sort(function(a, b) {
                return parseInt(a.order) - parseInt(b.order);
              }

            );

            return competingArray;

          })()
        };

      }

      
      return data;

    };



    var getClientList = function(List_raw) {


      var data = [];
      var sub_data = []
      console.log("LISTLIST="+JSON.stringify(List));
      var List = List_raw.results
      for(var i=0; i<List.length; i++){

        if(List[i].account_type === 'main'){
          data.push(List[i]);
        } else if(List[i].account_type === 'sub'){
          
          sub_data.push(List[i])
        }
      }

      //console.log("sub_data="+JSON.stringify(sub_data, null, 4));

      for(var i=0; i<data.length; i++){
        data[i].subuser = [];
      }

      for(var i=0; i<sub_data.length; i++) {

        
        for(var j=0; j<data.length; j++){
          
          if(sub_data[i].main_user_id === data[j].id){
            data[j].subuser.push(sub_data[i]);
            break;
          }
        }

      }

      console.log("client data="+JSON.stringify(data, null, 4))
      
      return data;

    };


    return {
      getWhoops: getWhoops,
      getEnhancement: getEnhancement,
      getProfile: getProfile,
      getProfileProgram: getProfileProgram,
      getCart: getCart,
      getEnhancementConfirm: getEnhancementConfirm,
      getClientList: getClientList



    };

  });