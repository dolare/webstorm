angular.module('updateServiceModule', [])
  .factory('updateService', function($filter) {


    var updateEnhancement = function(raw_data, user) {


            var e_raw = raw_data.existing_report;
            //var e_update_diff = raw_data.update_diff;

            var e_show_update = {};

            if(user === 'client'){
              var e_update_diff = raw_data.update_diff;
              var ver = 'old'
            } else if (user === 'admin'){
              var e_update_diff = raw_data.initial_diff;
              var ver = 'new'
            }



              for(i=0; i<e_raw.length; i++)
              {

                // University school (university_school.university)
                if(((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).university_school||{}).university || ((((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).university_school||{}).university){
                  e_show_update['university'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].university_school.university;
                  
                  if(!e_show_update['university'+(i===0?'':i+1)]){
                    e_show_update['university'+(i===0?'':i+1)] = "N/A";
                  }
                }


                // School name (university_school.school)
                if(((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).university_school||{}).school || ((((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).university_school||{}).school){
                  e_show_update['school'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].university_school.school;
                  
                  if(!e_show_update['school'+(i===0?'':i+1)]){
                    e_show_update['school'+(i===0?'':i+1)] = "N/A";
                  }
                }

                // Program (program_name)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).program_name || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).program_name){
                  e_show_update['program_name'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].program_name;
                  
                  if(!e_show_update['program_name'+(i===0?'':i+1)]){
                    e_show_update['program_name'+(i===0?'':i+1)] = "N/A";
                  }
                }

                // Degree (degree.name)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).degree || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).degree){
                  e_show_update['degree'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].degree.name;
                  
                  if(!e_show_update['degree'+(i===0?'':i+1)]){
                    e_show_update['degree'+(i===0?'':i+1)] = "N/A";
                  }
                }


                // Department (department)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).department || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).department){
                  e_show_update['department'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].department;
                  
                  if(!e_show_update['department'+(i===0?'':i+1)]){
                    e_show_update['department'+(i===0?'':i+1)] = "N/A";
                  }
                }
                  
                // Specialization (specialization)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).specialization || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).specialization){
                  e_show_update['specialization'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].specialization;
                  
                  if(!e_show_update['specialization'+(i===0?'':i+1)]){
                    e_show_update['specialization'+(i===0?'':i+1)] = "N/A";
                  }
                }

                // Highlights (highlights)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).highlights || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).highlights){
                  e_show_update['highlights'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].highlights;
                  
                  if(!e_show_update['highlights'+(i===0?'':i+1)]){
                    e_show_update['highlights'+(i===0?'':i+1)] = "N/A";
                  }
                }


                // Program objectives (audience)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).audience || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).audience){
                  e_show_update['audience'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].audience;
                  
                  if(!e_show_update['audience'+(i===0?'':i+1)]){
                    e_show_update['audience'+(i===0?'':i+1)] = "N/A";
                  }
                }

                // Job placement (job_placement)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).job_placement || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).job_placement){
                  e_show_update['job_placement'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].job_placement;
                  
                  if(!e_show_update['job_placement'+(i===0?'':i+1)]){
                    e_show_update['job_placement'+(i===0?'':i+1)] = "N/A";
                  }
                }

                // Online program (online_program)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).online_program || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).online_program){
                  e_show_update['online_program'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].online_program;
                  
                  if(!e_show_update['online_program'+(i===0?'':i+1)]){
                    e_show_update['online_program'+(i===0?'':i+1)] = "N/A";
                  }
                }

                // Handbook (additional_url)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).additional_url || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).additional_url){
                  e_show_update['additional_url'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].additional_url;
                  
                  if(!e_show_update['additional_url'+(i===0?'':i+1)]){
                    e_show_update['additional_url'+(i===0?'':i+1)] = "N/A";
                  }
                }

                // FAQ (program_faq_url) 
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).program_faq_url || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).program_faq_url){
                  e_show_update['program_faq_url'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].program_faq_url;
                  
                  if(!e_show_update['program_faq_url'+(i===0?'':i+1)]){
                    e_show_update['program_faq_url'+(i===0?'':i+1)] = "N/A";
                  }
                }

                // Admissions statistics (stats_profile_url)
                if((((e_update_diff||{}).old||{})['p'+(i===0?'':i+1)]||{}).stats_profile_url || (((e_update_diff||{}).new||{})['p'+(i===0?'':i+1)]||{}).stats_profile_url){
                  e_show_update['stats_profile_url'+(i===0?'':i+1)] = e_update_diff[ver]['p'+(i===0?'':i+1)].stats_profile_url;
                  
                  if(!e_show_update['stats_profile_url'+(i===0?'':i+1)]){
                    e_show_update['stats_profile_url'+(i===0?'':i+1)] = "N/A";
                  }
                }

                // Full-time (full_part_time)
                if((((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).full_part_time || (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).full_part_time){
                  e_show_update['full_part_time'+(i===0?'':i+1)] = e_update_diff[ver]['dura'+(i===0?'':i+1)].full_part_time;
                  
                  if(!e_show_update['full_part_time'+(i===0?'':i+1)]){
                    e_show_update['full_part_time'+(i===0?'':i+1)] = "N/A";
                  }

                  if(e_show_update['full_part_time'+(i===0?'':i+1)]){
                    if(e_show_update['full_part_time'+(i===0?'':i+1)] === "F"){
                      e_show_update['full_part_time'+(i===0?'':i+1)] = "Yes";
                    }
                    if(e_show_update['full_part_time'+(i===0?'':i+1)] === "P"){
                      e_show_update['full_part_time'+(i===0?'':i+1)] = "No";
                    }

                  }

                }

                // Part-time (part_time)
                if((((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).part_time || (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).part_time){
                  e_show_update['part_time'+(i===0?'':i+1)] = e_update_diff[ver]['dura'+(i===0?'':i+1)].part_time;
                  
                  if(!e_show_update['part_time'+(i===0?'':i+1)]){
                    e_show_update['part_time'+(i===0?'':i+1)] = "N/A";
                  }

                  if(e_show_update['part_time'+(i===0?'':i+1)]){
                    if(e_show_update['part_time'+(i===0?'':i+1)] === true){
                      e_show_update['part_time'+(i===0?'':i+1)] = "Yes";
                    }
                    if(e_show_update['part_time'+(i===0?'':i+1)] === false){
                      e_show_update['part_time'+(i===0?'':i+1)] = "No";
                    }

                  }

                }

                // Program duration
                if(
                  (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_min || 
                  (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_min ||
                  (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_max ||
                  (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_max ||
                  (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_conj ||
                  (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_conj ||
                  (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_unit ||
                  (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_unit ||
                  (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_addl ||
                  (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_addl ||
                  (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_addl_unit ||
                  (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_addl_unit
                  )
                {
                  

                    e_show_update['program_duration'+(i===0?'':i+1)] 
                    = (
                        (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_min || 
                        (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_min 
                      ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].duration_min : e_raw['dura'+(i===0?'':i+1)].duration_min
                    + ((
                        (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_max || 
                        (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_max 
                      ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].duration_max : e_raw['dura'+(i===0?'':i+1)].duration_max) 
                      !== ((
                        (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_min || 
                        (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_min 
                      ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].duration_min : e_raw['dura'+(i===0?'':i+1)].duration_min) 
                      ? ' - ' + ((
                        (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_max || 
                        (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_max 
                      ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].duration_max : e_raw['dura'+(i===0?'':i+1)].duration_max) : null
                    + (
                        (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_conj || 
                        (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_conj 
                      ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].duration_conj : e_raw['dura'+(i===0?'':i+1)].duration_conj
                    + (
                        (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_unit || 
                        (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_unit 
                      ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].duration_unit.name : e_raw['dura'+(i===0?'':i+1)].duration_unit.name
                    + (
                        (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_addl || 
                        (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_addl 
                      ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].duration_addl : e_raw['dura'+(i===0?'':i+1)].duration_addl
                    + (
                        (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_addl_unit || 
                        (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_addl_unit 
                      ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].duration_addl_unit.name : e_raw['dura'+(i===0?'':i+1)].duration_addl_unit.name

                  
                  if(!e_show_update['program_duration'+(i===0?'':i+1)]){
                    e_show_update['program_duration'+(i===0?'':i+1)] = "N/A";
                  }


                }

                //Duration time limit
                if(
                  (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).durationtime_limit || 
                  (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).durationtime_limit ||
                  (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_unit || 
                  (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_unit 
                  ){



                  e_show_update['durationtime_limit'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).durationtime_limit || 
                      (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).durationtime_limit 
                    ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].durationtime_limit : e_raw['dura'+(i===0?'':i+1)].durationtime_limit
                  + (
                      (((e_update_diff||{}).old||{})['dura'+(i===0?'':i+1)]||{}).duration_unit || 
                      (((e_update_diff||{}).new||{})['dura'+(i===0?'':i+1)]||{}).duration_unit 
                    ) ? e_update_diff[ver]['dura'+(i===0?'':i+1)].duration_unit.name : e_raw['dura'+(i===0?'':i+1)].duration_unit.name



                  if(!e_show_update['durationtime_limit'+(i===0?'':i+1)]){
                    e_show_update['durationtime_limit'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // Required curriculum units
                if(
                  (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).min_total_unit || 
                  (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).min_total_unit ||
                  (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).curriculum_unit || 
                  (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).curriculum_unit 
                  ){

                  e_show_update['min_total_unit'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).min_total_unit || 
                      (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).min_total_unit 
                    ) ? e_update_diff[ver]['c'+(i===0?'':i+1)].min_total_unit : e_raw['c'+(i===0?'':i+1)].min_total_unit
                  + (
                      (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).curriculum_unit || 
                      (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).curriculum_unit 
                    ) ? e_update_diff[ver]['c'+(i===0?'':i+1)].curriculum_unit.name : e_raw['c'+(i===0?'':i+1)].curriculum_unit.name
                  

                  if(!e_show_update['min_total_unit'+(i===0?'':i+1)]){
                    e_show_update['min_total_unit'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // Max transfer units
                if(
                  (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).max_transfer_unit || 
                  (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).max_transfer_unit ||
                  (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).curriculum_unit || 
                  (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).curriculum_unit
                  ){

                  e_show_update['max_transfer_unit'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).max_transfer_unit || 
                      (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).max_transfer_unit
                    ) ? e_update_diff[ver]['c'+(i===0?'':i+1)].max_transfer_unit : e_raw['c'+(i===0?'':i+1)].max_transfer_unit
                  + (
                      (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).curriculum_unit || 
                      (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).curriculum_unit 
                    ) ? e_update_diff[ver]['c'+(i===0?'':i+1)].curriculum_unit.name : e_raw['c'+(i===0?'':i+1)].curriculum_unit.name
                  
                  
                  if(!e_show_update['max_transfer_unit'+(i===0?'':i+1)]){
                    e_show_update['max_transfer_unit'+(i===0?'':i+1)] = "N/A";
                  }

                }

                //Master thesis or equivalent
                if(
                  (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).master_thesis_or_equivalent || 
                  (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).master_thesis_or_equivalent 
                 ){

                  e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['c'+(i===0?'':i+1)].master_thesis_or_equivalent

                  if(!e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)]){
                    e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)] = "N/A";
                  }

                  if(e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)]){
                    if(e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)] === 'Y'){
                      e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)] = "Yes";
                    }
                    if(e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)] === 'N'){
                      e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)] = "No";
                    }

                    if(e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)] === 'O'){
                      e_show_update['master_thesis_or_equivalent'+(i===0?'':i+1)] = "Optional";
                    }

                  }

                }


                // Thesis notes
                if(
                  (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).thesis_notes || 
                  (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).thesis_notes 
                 ){

                  e_show_update['thesis_notes'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['c'+(i===0?'':i+1)].thesis_notes

                  if(!e_show_update['thesis_notes'+(i===0?'':i+1)]){
                    e_show_update['thesis_notes'+(i===0?'':i+1)] = "N/A";
                  }


                }

                // Doctorate dissertation or equivalent
                if(
                  (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).doctorate_dissertation_or_equivalent || 
                  (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).doctorate_dissertation_or_equivalent 
                 ){

                  e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['c'+(i===0?'':i+1)].doctorate_dissertation_or_equivalent

                  if(!e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)]){
                    e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)] = "N/A";
                  }

                  if(e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)]){
                    if(e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)] === 'Y'){
                      e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)] = "Yes";
                    }
                    if(e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)] === 'N'){
                      e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)] = "No";
                    }

                    if(e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)] === 'O'){
                      e_show_update['doctorate_dissertation_or_equivalent'+(i===0?'':i+1)] = "Optional";
                    }

                  }

                }

                // Dissertation notes
                if(
                  (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).dissertation_notes || 
                  (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).dissertation_notes 
                 ){

                  e_show_update['dissertation_notes'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['c'+(i===0?'':i+1)].dissertation_notes

                  if(!e_show_update['dissertation_notes'+(i===0?'':i+1)]){
                    e_show_update['dissertation_notes'+(i===0?'':i+1)] = "N/A";
                  }


                }

                // Curriculums
                if(
                  (((e_update_diff||{}).old||{})['c'+(i===0?'':i+1)]||{}).curriculum_url || 
                  (((e_update_diff||{}).new||{})['c'+(i===0?'':i+1)]||{}).curriculum_url 
                 ){

                  e_show_update['curriculum_url'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['c'+(i===0?'':i+1)].curriculum_url

                  if(!e_show_update['curriculum_url'+(i===0?'':i+1)]){
                    e_show_update['curriculum_url'+(i===0?'':i+1)] = "N/A";
                  }


                }

                // Tuition (in state)
                if(
                  (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).tuition_per_unit || 
                  (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).tuition_per_unit ||
                  (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).school_cost_url || 
                  (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).school_cost_url ||
                  (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).tuition_unit || 
                  (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).tuition_unit ||
                  (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).university_cost_url || 
                  (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).university_cost_url 
                 ){

                  e_show_update['tuition_per_unit'+(i===0?'':i+1)] 
                  = $filter('currency')((
                      (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).tuition_per_unit || 
                      (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).tuition_per_unit
                    ) ? e_update_diff[ver]['t'+(i===0?'':i+1)].tuition_per_unit : e_raw['t'+(i===0?'':i+1)].tuition_per_unit, 
                    '$')
                  + ' '
                  + (
                      (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).tuition_unit || 
                      (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).tuition_unit
                    ) ? e_update_diff[ver]['t'+(i===0?'':i+1)].tuition_unit.name : e_raw['t'+(i===0?'':i+1)].tuition_unit.name

                  if(!e_show_update['tuition_per_unit'+(i===0?'':i+1)]){
                    e_show_update['tuition_per_unit'+(i===0?'':i+1)] = "N/A";
                  }


                }

              //  Tuition (out of state)
              if(
                  (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).tuition_per_unit_out_state || 
                  (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).tuition_per_unit_out_state ||
                  (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).school_cost_url || 
                  (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).school_cost_url ||
                  (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).tuition_unit || 
                  (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).tuition_unit ||
                  (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).university_cost_url || 
                  (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).university_cost_url 
                 ){

                  e_show_update['tuition_per_unit_out_state'+(i===0?'':i+1)] 
                  = $filter('currency')((
                      (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).tuition_per_unit_out_state || 
                      (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).tuition_per_unit_out_state
                    ) ? e_update_diff[ver]['t'+(i===0?'':i+1)].tuition_per_unit_out_state : e_raw['t'+(i===0?'':i+1)].tuition_per_unit_out_state, 
                    '$')
                  + ' '
                  + (
                      (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).tuition_unit || 
                      (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).tuition_unit
                    ) ? e_update_diff[ver]['t'+(i===0?'':i+1)].tuition_unit.name : e_raw['t'+(i===0?'':i+1)].tuition_unit.name

                  if(!e_show_update['tuition_per_unit_out_state'+(i===0?'':i+1)]){
                    e_show_update['tuition_per_unit_out_state'+(i===0?'':i+1)] = "N/A";
                  }


                }

                // Other fees included
                if(
                  (((e_update_diff||{}).old||{})['t'+(i===0?'':i+1)]||{}).fee_included || 
                  (((e_update_diff||{}).new||{})['t'+(i===0?'':i+1)]||{}).fee_included 
                 ){

                  e_show_update['fee_included'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['t'+(i===0?'':i+1)].fee_included

                  if(!e_show_update['fee_included'+(i===0?'':i+1)]){
                    e_show_update['fee_included'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['fee_included'+(i===0?'':i+1)]){
                    if(e_show_update['fee_included'+(i===0?'':i+1)] === true) {
                      e_show_update['fee_included'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['fee_included'+(i===0?'':i+1)] === false) {
                      e_show_update['fee_included'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }


                // Application deadlines link 
                if(
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).deadline_url || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).deadline_url 
                 ){

                  e_show_update['deadline_url'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['d'+(i===0?'':i+1)].deadline_url

                  if(!e_show_update['deadline_url'+(i===0?'':i+1)]){
                    e_show_update['deadline_url'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // Deadline - Fall, early
                if(
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_early_month_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_early_month_display ||
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_early_day_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_early_day_display 
                 ){

                  e_show_update['deadline_fall_early'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_early_month_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_early_month_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_fall_early_month_display : e_raw['d'+(i===0?'':i+1)].get_deadline_fall_early_month_display
                  + ' '
                  + (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_early_day_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_early_day_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_fall_early_day_display : e_raw['d'+(i===0?'':i+1)].get_deadline_fall_early_day_display
                  

                  if(!e_show_update['deadline_fall_early'+(i===0?'':i+1)]){
                    e_show_update['deadline_fall_early'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Deadline - Fall, late
                if(
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_late_month_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_late_month_display ||
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_late_day_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_late_day_display 
                 ){

                  e_show_update['deadline_fall_early'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_late_month_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_late_month_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_fall_late_month_display : e_raw['d'+(i===0?'':i+1)].get_deadline_fall_late_month_display
                  + ' '
                  + (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_late_day_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_fall_late_day_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_fall_late_day_display : e_raw['d'+(i===0?'':i+1)].get_deadline_fall_late_day_display
                  

                  if(!e_show_update['deadline_fall_late'+(i===0?'':i+1)]){
                    e_show_update['deadline_fall_late'+(i===0?'':i+1)] = "N/A";
                  }

                }


               // Deadline - Spring, early
              if(
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_early_month_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_early_month_display ||
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_early_day_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_early_day_display 
                 ){

                  e_show_update['deadline_spring_early'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_early_month_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_early_month_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_spring_early_month_display : e_raw['d'+(i===0?'':i+1)].get_deadline_spring_early_month_display
                  + ' '
                  + (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_early_day_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_early_day_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_spring_early_day_display : e_raw['d'+(i===0?'':i+1)].get_deadline_spring_early_day_display
                  

                  if(!e_show_update['deadline_spring_early'+(i===0?'':i+1)]){
                    e_show_update['deadline_spring_early'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Deadline - Spring, late
                if(
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_late_month_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_late_month_display ||
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_late_day_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_late_day_display 
                 ){

                  e_show_update['deadline_spring_late'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_late_month_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_late_month_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_spring_late_month_display : e_raw['d'+(i===0?'':i+1)].get_deadline_spring_late_month_display
                  + ' '
                  + (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_late_day_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_spring_late_day_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_spring_late_day_display : e_raw['d'+(i===0?'':i+1)].get_deadline_spring_late_day_display
                  

                  if(!e_show_update['deadline_spring_late'+(i===0?'':i+1)]){
                    e_show_update['deadline_spring_late'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // Deadline - Summer, early
                if(
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_early_month_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_early_month_display ||
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_early_day_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_early_day_display 
                 ){

                  e_show_update['deadline_summer_early'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_early_month_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_early_month_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_summer_early_month_display : e_raw['d'+(i===0?'':i+1)].get_deadline_summer_early_month_display
                  + ' '
                  + (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_early_day_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_early_day_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_summer_early_day_display : e_raw['d'+(i===0?'':i+1)].get_deadline_summer_early_day_display
                  

                  if(!e_show_update['deadline_summer_early'+(i===0?'':i+1)]){
                    e_show_update['deadline_summer_early'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // Deadline - Summer, late
                if(
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_late_month_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_late_month_display ||
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_late_day_display || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_late_day_display 
                 ){

                  e_show_update['deadline_summer_late'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_late_month_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_late_month_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_summer_late_month_display : e_raw['d'+(i===0?'':i+1)].get_deadline_summer_late_month_display
                  + ' '
                  + (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_late_day_display || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).get_deadline_summer_late_day_display
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].get_deadline_summer_late_day_display : e_raw['d'+(i===0?'':i+1)].get_deadline_summer_late_day_display
                  

                  if(!e_show_update['deadline_summer_late'+(i===0?'':i+1)]){
                    e_show_update['deadline_summer_late'+(i===0?'':i+1)] = "N/A";
                  }

                }

               // Rolling deadline
               if(
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).deadline_rolling || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).deadline_rolling 
                 ){

                  e_show_update['deadline_rolling'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['d'+(i===0?'':i+1)].deadline_rolling

                  if(!e_show_update['deadline_rolling'+(i===0?'':i+1)]){
                    e_show_update['deadline_rolling'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['deadline_rolling'+(i===0?'':i+1)]){
                    if(e_show_update['deadline_rolling'+(i===0?'':i+1)] === true) {
                      e_show_update['deadline_rolling'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['deadline_rolling'+(i===0?'':i+1)] === false) {
                      e_show_update['deadline_rolling'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }

                // Scholarship deadline
                if(
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).scholarship_deadline_month || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).scholarship_deadline_month ||
                  (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).scholarship_deadline_day || 
                  (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).scholarship_deadline_day 
                 ){

                  e_show_update['scholarship_deadline'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).scholarship_deadline_month || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).scholarship_deadline_month
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].scholarship_deadline_month : e_raw['d'+(i===0?'':i+1)].scholarship_deadline_month
                  + '/'
                  + (
                      (((e_update_diff||{}).old||{})['d'+(i===0?'':i+1)]||{}).scholarship_deadline_day || 
                      (((e_update_diff||{}).new||{})['d'+(i===0?'':i+1)]||{}).scholarship_deadline_day
                    ) ? e_update_diff[ver]['d'+(i===0?'':i+1)].scholarship_deadline_day : e_raw['d'+(i===0?'':i+1)].scholarship_deadline_day
                  

                  if(!e_show_update['scholarship_deadline'+(i===0?'':i+1)]){
                    e_show_update['scholarship_deadline'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Special requirements (special_reqs)
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).special_reqs || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).special_reqs 
                 ){

                  e_show_update['special_reqs'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].special_reqs

                  if(!e_show_update['special_reqs'+(i===0?'':i+1)]){
                    e_show_update['special_reqs'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Online Application - apply_online
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).apply_online || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).apply_online 
                 ){

                  e_show_update['apply_online'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].apply_online

                  if(!e_show_update['apply_online'+(i===0?'':i+1)]){
                    e_show_update['apply_online'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['apply_online'+(i===0?'':i+1)]){
                    if(e_show_update['apply_online'+(i===0?'':i+1)] === true) {
                      e_show_update['apply_online'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['apply_online'+(i===0?'':i+1)] === false) {
                      e_show_update['apply_online'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }


                // Application fee
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).application_fee || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).application_fee 
                 ){

                  e_show_update['application_fee'+(i===0?'':i+1)] 
                    = $filter('currency')(e_update_diff[ver]['r'+(i===0?'':i+1)].application_fee, '$')


                  if(!e_show_update['application_fee'+(i===0?'':i+1)]){
                    e_show_update['application_fee'+(i===0?'':i+1)] = "N/A";
                  }


                }


                // Application fee waiver
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).application_fee_waiver || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).application_fee_waiver 
                 ){

                  e_show_update['application_fee_waiver'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].application_fee_waiver

                  if(!e_show_update['application_fee_waiver'+(i===0?'':i+1)]){
                    e_show_update['application_fee_waiver'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['application_fee_waiver'+(i===0?'':i+1)]){
                    if(e_show_update['application_fee_waiver'+(i===0?'':i+1)] === true) {
                      e_show_update['application_fee_waiver'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['application_fee_waiver'+(i===0?'':i+1)] === false) {
                      e_show_update['application_fee_waiver'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }


                // Application fee waiver notes
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).application_fee_waiver_notes || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).application_fee_waiver_notes 
                 ){

                  e_show_update['application_fee_waiver_notes'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].application_fee_waiver_notes

                  if(!e_show_update['application_fee_waiver_notes'+(i===0?'':i+1)]){
                    e_show_update['application_fee_waiver_notes'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // Transcripts required for application
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).transcript_for_application || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).transcript_for_application 
                 ){

                  e_show_update['transcript_for_application'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].transcript_for_application

                  if(!e_show_update['transcript_for_application'+(i===0?'':i+1)]){
                    e_show_update['transcript_for_application'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['transcript_for_application'+(i===0?'':i+1)]){
                    if(e_show_update['transcript_for_application'+(i===0?'':i+1)] === 'Y') {
                      e_show_update['transcript_for_application'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['transcript_for_application'+(i===0?'':i+1)] === 'N') {
                      e_show_update['transcript_for_application'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }


                // Transcripts required for enrollment
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).official_transcript_for_enrollment || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).official_transcript_for_enrollment 
                 ){

                  e_show_update['official_transcript_for_enrollment'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].official_transcript_for_enrollment

                  if(!e_show_update['official_transcript_for_enrollment'+(i===0?'':i+1)]){
                    e_show_update['official_transcript_for_enrollment'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['official_transcript_for_enrollment'+(i===0?'':i+1)]){
                    if(e_show_update['official_transcript_for_enrollment'+(i===0?'':i+1)] === 'Y') {
                      e_show_update['official_transcript_for_enrollment'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['official_transcript_for_enrollment'+(i===0?'':i+1)] === 'N') {
                      e_show_update['official_transcript_for_enrollment'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }

                // Required admissions exam
                if(
                  (((e_update_diff||{}).old||{})['ex'+(i===0?'':i+1)]) || 
                  (((e_update_diff||{}).new||{})['ex'+(i===0?'':i+1)]) 
                 ){

                   var exams = [];
                  
                    for(var k=0; k< (e_update_diff[ver]['ex'+(i===0?'':i+1)]||[]).length; k++){
                      exams.push(e_update_diff[ver]['ex'+(i===0?'':i+1)][k].name)
                    }

                    e_show_update['required_admissions_exam'+(i===0?'':i+1)] 
                    = exams.join(", ")

                  if(!e_show_update['required_admissions_exam'+(i===0?'':i+1)]){
                    e_show_update['required_admissions_exam'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Personal statement or equivalent
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).essays || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).essays 
                 ){

                  e_show_update['essays'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].essays

                  if(!e_show_update['essays'+(i===0?'':i+1)]){
                    e_show_update['essays'+(i===0?'':i+1)] = "N/A";
                  }


                }

                // Letters of recommendation
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).recommendation || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).recommendation 
                 ){

                  e_show_update['recommendation'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].recommendation

                  if(!e_show_update['recommendation'+(i===0?'':i+1)]){
                    e_show_update['recommendation'+(i===0?'':i+1)] = "N/A";
                  }


                }

                // Minimum GPA
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum || 
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum_letter || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum_letter 
                 ){

                  e_show_update['gpa_minimum'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_minimum : e_raw['r'+(i===0?'':i+1)].gpa_minimum

                  + ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_minimum : e_raw['r'+(i===0?'':i+1)].gpa_minimum && (
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum_letter || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum_letter
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_minimum_letter : e_raw['r'+(i===0?'':i+1)].gpa_minimum_letter) ? '/' : ''

                  + (
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum_letter || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_minimum_letter
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_minimum_letter : e_raw['r'+(i===0?'':i+1)].gpa_minimum_letter

              
                  if(!e_show_update['gpa_minimum'+(i===0?'':i+1)]){
                    e_show_update['gpa_minimum'+(i===0?'':i+1)] = "N/A";
                  }


                }


                // Average GPA
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_average || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_average || 
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_average_letter || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_average_letter 
                 ){

                  e_show_update['gpa_average'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_average || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_average
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_average : e_raw['r'+(i===0?'':i+1)].gpa_average

                  + ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_average || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_average
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_average : e_raw['r'+(i===0?'':i+1)].gpa_average && (
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_average_letter || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_average_letter
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_average_letter : e_raw['r'+(i===0?'':i+1)].gpa_average_letter) ? '/' : ''

                  + (
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_average_letter || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_average_letter
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_average_letter : e_raw['r'+(i===0?'':i+1)].gpa_average_letter

              
                  if(!e_show_update['gpa_average'+(i===0?'':i+1)]){
                    e_show_update['gpa_average'+(i===0?'':i+1)] = "N/A";
                  }


                }

                // Suggested GPA

                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested || 
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested_letter || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested_letter 
                 ){

                  e_show_update['gpa_suggested'+(i===0?'':i+1)] 
                  = (
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_suggested : e_raw['r'+(i===0?'':i+1)].gpa_suggested

                  + ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_suggested : e_raw['r'+(i===0?'':i+1)].gpa_suggested && (
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested_letter || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested_letter
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_suggested_letter : e_raw['r'+(i===0?'':i+1)].gpa_suggested_letter) ? '/' : ''

                  + (
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested_letter || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).gpa_suggested_letter
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].gpa_suggested_letter : e_raw['r'+(i===0?'':i+1)].gpa_suggested_letter

              
                  if(!e_show_update['gpa_suggested'+(i===0?'':i+1)]){
                    e_show_update['gpa_suggested'+(i===0?'':i+1)] = "N/A";
                  }


                }

                // School interview
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).school_interview || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).school_interview 
                 ){

                  e_show_update['school_interview'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].school_interview

                  if(!e_show_update['school_interview'+(i===0?'':i+1)]){
                    e_show_update['school_interview'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['school_interview'+(i===0?'':i+1)]){
                    if(e_show_update['school_interview'+(i===0?'':i+1)] === true) {
                      e_show_update['school_interview'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['school_interview'+(i===0?'':i+1)] === false) {
                      e_show_update['school_interview'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }

                // Résumé/ Curriculum Vitae
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).resume || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).resume 
                 ){

                  e_show_update['resume'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].resume

                  if(!e_show_update['resume'+(i===0?'':i+1)]){
                    e_show_update['resume'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['resume'+(i===0?'':i+1)]){
                    if(e_show_update['resume'+(i===0?'':i+1)] === 'Y') {
                      e_show_update['resume'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['resume'+(i===0?'':i+1)] === 'N') {
                      e_show_update['resume'+(i===0?'':i+1)] = 'No';
                    }
                    if(e_show_update['resume'+(i===0?'':i+1)] === 'O') {
                      e_show_update['resume'+(i===0?'':i+1)] = 'Optional';
                    }
                  }

                }

                // Writing sample

                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).sup_mat_writing_sample || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).sup_mat_writing_sample 
                 ){

                  e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].sup_mat_writing_sample

                  if(!e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)]){
                    e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)]){
                    if(e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)] === 'Y') {
                      e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)] === 'N') {
                      e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)] = 'No';
                    }
                    if(e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)] === 'O') {
                      e_show_update['sup_mat_writing_sample'+(i===0?'':i+1)] = 'Optional';
                    }
                  }

                }

                // Writing sample notes

                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).sup_mat_writing_sample_notes || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).sup_mat_writing_sample_notes 
                 ){

                  e_show_update['sup_mat_writing_sample_notes'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].sup_mat_writing_sample_notes

                  if(!e_show_update['sup_mat_writing_sample_notes'+(i===0?'':i+1)]){
                    e_show_update['sup_mat_writing_sample_notes'+(i===0?'':i+1)] = "N/A";
                  }


                }

                // Portfolio
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).sup_mat_portfolio || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).sup_mat_portfolio 
                 ){

                  e_show_update['sup_mat_portfolio'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].sup_mat_portfolio

                  if(!e_show_update['sup_mat_portfolio'+(i===0?'':i+1)]){
                    e_show_update['sup_mat_portfolio'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['sup_mat_portfolio'+(i===0?'':i+1)]){
                    if(e_show_update['sup_mat_portfolio'+(i===0?'':i+1)] === 'Y') {
                      e_show_update['sup_mat_portfolio'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['sup_mat_portfolio'+(i===0?'':i+1)] === 'N') {
                      e_show_update['sup_mat_portfolio'+(i===0?'':i+1)] = 'No';
                    }
                    if(e_show_update['sup_mat_portfolio'+(i===0?'':i+1)] === 'O') {
                      e_show_update['sup_mat_portfolio'+(i===0?'':i+1)] = 'Optional';
                    }
                  }

                }

                // Portfolio notes
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).sup_mat_portfolio_notes || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).sup_mat_portfolio_notes 
                 ){

                  e_show_update['sup_mat_portfolio_notes'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].sup_mat_portfolio_notes

                  if(!e_show_update['sup_mat_portfolio_notes'+(i===0?'':i+1)]){
                    e_show_update['sup_mat_portfolio_notes'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Additional admissions requirements
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).program_req_url || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).program_req_url || 
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).school_req_url || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).school_req_url 
                 ){

                  e_show_update['additional_admissions_requirements'+(i===0?'':i+1)] 
                  = ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).program_req_url || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).program_req_url
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].program_req_url : e_raw['r'+(i===0?'':i+1)].program_req_url ) 
                    ? ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).program_req_url || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).program_req_url
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].program_req_url : e_raw['r'+(i===0?'':i+1)].program_req_url )
                    : ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).school_req_url || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).school_req_url
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].school_req_url : e_raw['r'+(i===0?'':i+1)].school_req_url )


                  if(!e_show_update['additional_admissions_requirements'+(i===0?'':i+1)]){
                    e_show_update['additional_admissions_requirements'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // International transcript
                if(
                  (((e_update_diff||{}).old||{})['Intl_transcript'+(i===0?'':i+1)]) || 
                  (((e_update_diff||{}).new||{})['Intl_transcript'+(i===0?'':i+1)]) 
                 ){


                   var tests = [];
                  
                    for(var k=0; k< (e_update_diff[ver]['Intl_transcript'+(i===0?'':i+1)]||[]).length; k++){
                      tests.push(e_update_diff[ver]['Intl_transcript'+(i===0?'':i+1)][k].name + ' : ' + e_update_diff[ver]['Intl_transcript'+(i===0?'':i+1)][k].description)
                    }

                    e_show_update['Intl_transcript'+(i===0?'':i+1)] 
                    = tests.join("/ ")

                  if(!e_show_update['Intl_transcript'+(i===0?'':i+1)]){
                    e_show_update['Intl_transcript'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Foreign language waiver
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).intl_lang_waiver || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).intl_lang_waiver 
                 ){

                  e_show_update['intl_lang_waiver'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].intl_lang_waiver

                  if(!e_show_update['intl_lang_waiver'+(i===0?'':i+1)]){
                    e_show_update['intl_lang_waiver'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['intl_lang_waiver'+(i===0?'':i+1)]){
                    if(e_show_update['intl_lang_waiver'+(i===0?'':i+1)] === true) {
                      e_show_update['intl_lang_waiver'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['intl_lang_waiver'+(i===0?'':i+1)] === false) {
                      e_show_update['intl_lang_waiver'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }

                // Foreign language waiver notes
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).intl_lang_waiver_conditions || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).intl_lang_waiver_conditions 
                 ){

                  e_show_update['intl_lang_waiver_conditions'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].intl_lang_waiver_conditions

                  if(!e_show_update['intl_lang_waiver_conditions'+(i===0?'':i+1)]){
                    e_show_update['intl_lang_waiver_conditions'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // English language test required (Non-native speakers)
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).intl_english_test_required || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).intl_english_test_required 
                 ){

                  e_show_update['intl_english_test_required'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].intl_english_test_required

                  if(!e_show_update['intl_english_test_required'+(i===0?'':i+1)]){
                    e_show_update['intl_english_test_required'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['intl_english_test_required'+(i===0?'':i+1)]){
                    if(e_show_update['intl_english_test_required'+(i===0?'':i+1)] === true) {
                      e_show_update['intl_english_test_required'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['intl_english_test_required'+(i===0?'':i+1)] === false) {
                      e_show_update['intl_english_test_required'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }

                // English language test
                if(
                  (((e_update_diff||{}).old||{})['Intl_eng_test'+(i===0?'':i+1)]) || 
                  (((e_update_diff||{}).new||{})['Intl_eng_test'+(i===0?'':i+1)]) 
                 ){


                   var eng_tests = [];
                  
                    for(var k=0; k< (e_update_diff[ver]['Intl_eng_test'+(i===0?'':i+1)]||[]).length; k++){
                      eng_tests.push(e_update_diff[ver]['Intl_eng_test'+(i===0?'':i+1)][k].name)
                    }

                    e_show_update['Intl_eng_test'+(i===0?'':i+1)] 
                    = eng_tests.join(", ")

                  if(!e_show_update['Intl_eng_test'+(i===0?'':i+1)]){
                    e_show_update['Intl_eng_test'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // TOEFL iBT
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt 
                 ){

                  e_show_update['toefl_ibt'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_ibt

                  if(!e_show_update['toefl_ibt'+(i===0?'':i+1)]){
                    e_show_update['toefl_ibt'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // TOEFL iBT reading /listening /speaking /writing Scores
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_reading || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_reading ||
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_listening || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_listening ||
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_speaking || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_speaking ||
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_writing || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_writing 
                 ){

                  e_show_update['toefl_ibt_scores'+(i===0?'':i+1)] 
                  = ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_reading || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_reading
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_ibt_reading : e_raw['r'+(i===0?'':i+1)].toefl_ibt_reading) 
                    ? ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_reading || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_reading
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_ibt_reading : e_raw['r'+(i===0?'':i+1)].toefl_ibt_reading) 
                    : '-'
                  + '/'
                  + ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_listening || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_listening
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_ibt_listening : e_raw['r'+(i===0?'':i+1)].toefl_ibt_listening) 
                    ? ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_listening || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_listening
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_ibt_listening : e_raw['r'+(i===0?'':i+1)].toefl_ibt_listening) 
                    : '-'
                  + '/'
                  ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_speaking || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_speaking
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_ibt_speaking : e_raw['r'+(i===0?'':i+1)].toefl_ibt_speaking) 
                    ? ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_speaking || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_speaking
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_ibt_speaking : e_raw['r'+(i===0?'':i+1)].toefl_ibt_speaking) 
                    : '-'
                  + '/'
                  ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_writing || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_writing
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_ibt_writing : e_raw['r'+(i===0?'':i+1)].toefl_ibt_writing) 
                    ? ((
                      (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_writing || 
                      (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_ibt_writing
                    ) ? e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_ibt_writing : e_raw['r'+(i===0?'':i+1)].toefl_ibt_writing) 
                    : '-'
                  

                  if(e_show_update['toefl_ibt_scores'+(i===0?'':i+1)]==='-/-/-/-'){
                    e_show_update['toefl_ibt_scores'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // TOEFL PBT
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_pbt || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_pbt 
                 ){

                  e_show_update['toefl_pbt'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_pbt

                  if(!e_show_update['toefl_pbt'+(i===0?'':i+1)]){
                    e_show_update['toefl_pbt'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // TOEFL TWE
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_twe || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_twe 
                 ){

                  e_show_update['toefl_twe'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_twe

                  if(!e_show_update['toefl_twe'+(i===0?'':i+1)]){
                    e_show_update['toefl_twe'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // TOEFL TSE
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_tse || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_tse 
                 ){

                  e_show_update['toefl_tse'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_tse

                  if(!e_show_update['toefl_tse'+(i===0?'':i+1)]){
                    e_show_update['toefl_tse'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // TOEFL CBT

                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).toefl_cbt || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).toefl_cbt 
                 ){

                  e_show_update['toefl_cbt'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].toefl_cbt

                  if(!e_show_update['toefl_cbt'+(i===0?'':i+1)]){
                    e_show_update['toefl_cbt'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // IELTS requirements
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).intl_ielts_reqs || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).intl_ielts_reqs 
                 ){

                  e_show_update['intl_ielts_reqs'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].intl_ielts_reqs

                  if(!e_show_update['intl_ielts_reqs'+(i===0?'':i+1)]){
                    e_show_update['intl_ielts_reqs'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Misc.
                if(
                  (((e_update_diff||{}).old||{})['r'+(i===0?'':i+1)]||{}).intl_other || 
                  (((e_update_diff||{}).new||{})['r'+(i===0?'':i+1)]||{}).intl_other 
                 ){

                  e_show_update['intl_other'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['r'+(i===0?'':i+1)].intl_other

                  if(!e_show_update['intl_other'+(i===0?'':i+1)]){
                    e_show_update['intl_other'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Fully funded
                if(
                  (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).fully_funded || 
                  (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).fully_funded 
                 ){

                  e_show_update['fully_funded'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['s'+(i===0?'':i+1)].fully_funded

                  if(!e_show_update['fully_funded'+(i===0?'':i+1)]){
                    e_show_update['fully_funded'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['fully_funded'+(i===0?'':i+1)]){
                    if(e_show_update['fully_funded'+(i===0?'':i+1)] === true) {
                      e_show_update['fully_funded'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['fully_funded'+(i===0?'':i+1)] === false) {
                      e_show_update['fully_funded'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }


                // Notes regarding full funding
                if(
                  (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).fully_funded_notes || 
                  (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).fully_funded_notes 
                 ){

                  e_show_update['fully_funded_notes'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['s'+(i===0?'':i+1)].fully_funded_notes

                  if(!e_show_update['fully_funded_notes'+(i===0?'':i+1)]){
                    e_show_update['fully_funded_notes'+(i===0?'':i+1)] = "N/A";
                  }

                }


                // Scholarship
                if(
                  (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).scholarship_avail || 
                  (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).scholarship_avail 
                 ){

                  e_show_update['scholarship_avail'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['s'+(i===0?'':i+1)].scholarship_avail

                  if(!e_show_update['scholarship_avail'+(i===0?'':i+1)]){
                    e_show_update['scholarship_avail'+(i===0?'':i+1)] = "N/A";
                  }


                  if(e_show_update['scholarship_avail'+(i===0?'':i+1)]){
                    if(e_show_update['scholarship_avail'+(i===0?'':i+1)] === true) {
                      e_show_update['scholarship_avail'+(i===0?'':i+1)] = 'Yes';
                    }
                    if(e_show_update['scholarship_avail'+(i===0?'':i+1)] === false) {
                      e_show_update['scholarship_avail'+(i===0?'':i+1)] = 'No';
                    }
                  }

                }


                // Scholarship notes
                if(
                  (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).scholarship_notes || 
                  (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).scholarship_notes 
                 ){

                  e_show_update['scholarship_notes'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['s'+(i===0?'':i+1)].scholarship_notes

                  if(!e_show_update['scholarship_notes'+(i===0?'':i+1)]){
                    e_show_update['scholarship_notes'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // Scholarship url
                if(
                  (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).scholarship_notes || 
                  (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).scholarship_notes 
                 ){

                  e_show_update['scholarship_notes'+(i===0?'':i+1)] 
                    = e_update_diff[ver]['s'+(i===0?'':i+1)].scholarship_notes

                  if(!e_show_update['scholarship_notes'+(i===0?'':i+1)]){
                    e_show_update['scholarship_notes'+(i===0?'':i+1)] = "N/A";
                  }

                }

                // Scholarship url
                if(
                  (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).scholarship_program_specific_url || 
                  (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).scholarship_program_specific_url ||
                  (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).scholarship_general_url || 
                  (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).scholarship_general_url  
                 ){

                  e_show_update['scholarship_url'+(i===0?'':i+1)] 
                  = ((
                       (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).scholarship_program_specific_url || 
                       (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).scholarship_program_specific_url
                    ) ? e_update_diff[ver]['s'+(i===0?'':i+1)].scholarship_program_specific_url : e_raw['s'+(i===0?'':i+1)].scholarship_program_specific_url)
                    ? ((
                       (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).scholarship_program_specific_url || 
                       (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).scholarship_program_specific_url
                    ) ? e_update_diff[ver]['s'+(i===0?'':i+1)].scholarship_program_specific_url : e_raw['s'+(i===0?'':i+1)].scholarship_program_specific_url)
                    : ((
                       (((e_update_diff||{}).old||{})['s'+(i===0?'':i+1)]||{}).scholarship_general_url || 
                       (((e_update_diff||{}).new||{})['s'+(i===0?'':i+1)]||{}).scholarship_general_url
                    ) ? e_update_diff[ver]['s'+(i===0?'':i+1)].scholarship_general_url : e_raw['s'+(i===0?'':i+1)].scholarship_general_url)


                  if(!e_show_update['scholarship_url'+(i===0?'':i+1)]){
                    e_show_update['scholarship_url'+(i===0?'':i+1)] = "N/A";
                  }

                }


            } //end of processing


      return e_show_update;

    };


    return {
      updateEnhancement : updateEnhancement,

    };

  });