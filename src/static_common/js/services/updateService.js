angular.module('myApp')
  .factory('updateService', function($filter) {

    
    var updateEnhancement = function(raw_data, user, order) {

            var e_show_update = {};


            if(user === 'client'){
              var e_raw = raw_data.existing_report.program.concat(raw_data.existing_report.competing_programs);
              var e_update_diff = raw_data.prev_diff;
              var ver = 'old'
            } else if (user === 'admin'){
              var e_raw = raw_data.existing_or_cache_report.program.concat(raw_data.existing_or_cache_report.competing_programs);
              var e_update_diff = raw_data.initial_diff;
              var ver = 'new'

            }

            console.log("raw_data="+JSON.stringify(raw_data))

            console.log("e_update_diff= "+JSON.stringify(e_update_diff))
           
            angular.forEach(order, function(value, key) {


                // University school (university_school.university)
                if(((((e_update_diff||{})[value]||{})['program_detail']||{}).university_school||{}).hasOwnProperty('university')){

                  create_array(e_show_update,'university', order);

                  e_show_update['university'][key] = e_update_diff[value]['program_detail'].university_school.university;
                  
                  set_null(e_show_update,'university', key)
                }


                // School name (university_school.school)
                if(((((e_update_diff||{})[value]||{})['program_detail']||{}).university_school||{}).hasOwnProperty('school')){
                  
                  create_array(e_show_update,'school', order);

                  e_show_update['school'][key] = e_update_diff[value]['program_detail'].university_school.school;
                  
                  set_null(e_show_update,'school', key)
                }

                // Program (program_name)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('program_name')){
                  
                  create_array(e_show_update,'program_name', order);

                  e_show_update['program_name'][key] = e_update_diff[value]['program_detail'].program_name;
                  
                  set_null(e_show_update,'program_name', key)
                }

                // Degree (degree.name)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('degree')){
                  
                  create_array(e_show_update,'degree', order);

                  e_show_update['degree'][key] = e_update_diff[value]['program_detail'].degree.name;
                  
                  set_null(e_show_update,'degree', key)
                  
                }


                // Department (department)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('department')){

                  create_array(e_show_update,'department', order);

                  e_show_update['department'][key] = e_update_diff[value]['program_detail'].department;

                  set_null(e_show_update,'department', key)
                  
                }
                  
                // Specialization (specialization)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('specialization')){

                  console.log("specialization value="+value);
                  console.log("specialization value from ..."+JSON.stringify(e_update_diff));
                  create_array(e_show_update,'specialization', order);

                  e_show_update['specialization'][key] = e_update_diff[value]['program_detail'].specialization;
                  
                  set_null(e_show_update,'specialization', key)
                  
                }

                // Highlights (highlights)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('highlights')){
                  
                  create_array(e_show_update,'highlights', order);

                  e_show_update['highlights'][key] = e_update_diff[value]['program_detail'].highlights;
                 
                  set_null(e_show_update,'highlights', key)
                }



                // Program objectives (audience)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('audience')){

                  console.log("audience value = "+value+ " key = "+key);
                  create_array(e_show_update,'audience', order);

                  e_show_update['audience'][key] = e_update_diff[value]['program_detail'].audience;
                  
                  set_null(e_show_update,'audience', key)
                }


                // Job placement (job_placement)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('job_placement') 
                   
                  ){

                  create_array(e_show_update,'job_placement', order);

                  e_show_update['job_placement'][key] = e_update_diff[value]['program_detail'].job_placement;
                  
                  set_null(e_show_update,'job_placement', key)
                }


                // Job placement url (job_placement url)
                if(
                    (((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('job_placement_url')
                  ){

                  create_array(e_show_update,'job_placement_url', order);

                  e_show_update['job_placement_url'][key] = e_update_diff[value]['program_detail'].job_placement_url;
                  
                  set_null(e_show_update,'job_placement_url', key)

                }



                // Online program (online_program)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('online_program')){

                  create_array(e_show_update,'online_program', order);

                  e_show_update['online_program'][key] = e_update_diff[value]['program_detail'].online_program;
                  
                  set_null(e_show_update,'online_program', key)
                }

                // Handbook (additional_url)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('additional_url')){

                  create_array(e_show_update,'additional_url', order);

                  e_show_update['additional_url'][key] = e_update_diff[value]['program_detail'].additional_url;
                  
                  set_null(e_show_update,'additional_url', key)

                }

                // FAQ (program_faq_url) 
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('program_faq_url')){

                  console.log("e_update_diff^="+JSON.stringify(e_update_diff));
                  create_array(e_show_update,'program_faq_url', order);

                  e_show_update['program_faq_url'][key] = e_update_diff[value]['program_detail'].program_faq_url;
                  
                  set_null(e_show_update,'program_faq_url', key)
                  
                }

                // Admissions statistics (stats_profile_url)
                if((((e_update_diff||{})[value]||{})['program_detail']||{}).hasOwnProperty('stats_profile_url')){

                  create_array(e_show_update,'stats_profile_url', order);

                  e_show_update['stats_profile_url'][key] = e_update_diff[value]['program_detail'].stats_profile_url;
                  
                  set_null(e_show_update,'stats_profile_url', key)

                }

                // Full-time (full_part_time)
                if((((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('full_part_time')){

                  create_array(e_show_update,'full_part_time', order);

                  e_show_update['full_part_time'][key] = e_update_diff[value]['duration'].full_part_time;

                  if(e_show_update['full_part_time']){
                    if(e_show_update['full_part_time'] === "F"){
                      e_show_update['full_part_time'] = "Yes";
                    }
                    if(e_show_update['full_part_time'] === "P"){
                      e_show_update['full_part_time'] = "No";
                    }
                  }

                  set_null(e_show_update,'full_part_time', key)

                }

                // Part-time (part_time)
                if((((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('part_time')){

                  create_array(e_show_update,'part_time', order);

                  e_show_update['part_time'][key] = e_update_diff[value]['duration'].part_time;
                 

                  if(e_show_update['part_time']){
                    if(e_show_update['part_time'] === true){
                      e_show_update['part_time'] = "Yes";
                    }
                    if(e_show_update['part_time'] === false){
                      e_show_update['part_time'] = "No";
                    }

                  }

                  set_null(e_show_update,'part_time', key)

                }

                // Program duration
                if(
                  (((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('duration_min') || 
                  (((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('duration_max') ||
                  (((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('duration_conj') ||
                  (((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('duration_unit') ||
                  (((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('duration_addl') ||
                  (((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('duration_addl_unit')
                  )
                {
                  

                  create_array(e_show_update,'program_duration', order);

                  var program_duration_duration_min = (((e_update_diff||{})[value]||{})['duration']||{}).duration_min;
                  var program_duration_duration_max = (((e_update_diff||{})[value]||{})['duration']||{}).duration_max;
                  var program_duration_duration_conj = (((e_update_diff||{})[value]||{})['duration']||{}).duration_conj;
                  var program_duration_duration_unit = (((e_update_diff||{})[value]||{})['duration']||{}).duration_unit;
                  var program_duration_duration_addl = (((e_update_diff||{})[value]||{})['duration']||{}).duration_addl;
                  var program_duration_duration_addl_unit = (((e_update_diff||{})[value]||{})['duration']||{}).duration_addl_unit;


                    e_show_update['program_duration'][key] 
                    = (program_duration_duration_min ? e_update_diff[value]['duration'].duration_min : e_raw[key]['duration'].duration_min)
                      ? 
                      (
                        (program_duration_duration_min ? e_update_diff[value]['duration'].duration_min : e_raw[key]['duration'].duration_min)
                      + ((program_duration_duration_max ? e_update_diff[value]['duration'].duration_max : e_raw[key]['duration'].duration_max) 
                        !== (program_duration_duration_min ? e_update_diff[value]['duration'].duration_min : e_raw[key]['duration'].duration_min) 
                        ? ' - ' + (program_duration_duration_max ? (e_update_diff[value]['duration'].duration_max || "") : (e_raw[key]['duration'].duration_max || "")) : "")

                      + (program_duration_duration_conj ? (e_update_diff[value]['duration'].duration_conj ? (" " + e_update_diff[value]['duration'].duration_conj) : "") : (e_raw[key]['duration'].duration_conj ? (" " + e_raw[key]['duration'].duration_conj) : ""))
                      + (program_duration_duration_unit ? (e_update_diff[value]['duration'].duration_unit ? (" " + e_update_diff[value]['duration'].duration_unit.name) : "") : (e_raw[key]['duration'].duration_unit ? (" " + e_raw[key]['duration'].duration_unit.name) : ""))
                      + (program_duration_duration_addl ? (e_update_diff[value]['duration'].duration_addl ? (" " + e_update_diff[value]['duration'].duration_addl) : "") : (e_raw[key]['duration'].duration_addl ? (" " + e_raw[key]['duration'].duration_addl) : ""))
                      + (program_duration_duration_addl_unit ? (e_update_diff[value]['duration'].duration_addl_unit ? (" " + e_update_diff[value]['duration'].duration_addl_unit.name) : "") : (e_raw[key]['duration'].duration_addl_unit ? (" " + e_raw[key]['duration'].duration_addl_unit.name) : ""))
                      )
                    : "N/A";


                }

                //Duration time limit
                if(
                  (((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('durationtime_limit') || 
                  (((e_update_diff||{})[value]||{})['duration']||{}).hasOwnProperty('duration_unit') 
                  )
                {

                  create_array(e_show_update,'durationtime_limit', order);

                  var durationtime_limit_durationtime_limit = (((e_update_diff||{})[value]||{})['duration']||{}).durationtime_limit;
                  var durationtime_limit_duration_unit = (((e_update_diff||{})[value]||{})['duration']||{}).duration_unit;

                  e_show_update['durationtime_limit'][key] 
                  = 
                  (durationtime_limit_durationtime_limit ? e_update_diff[value]['duration'].durationtime_limit : e_raw[key]['duration'].durationtime_limit)
                  ?
                  ((durationtime_limit_durationtime_limit ? e_update_diff[value]['duration'].durationtime_limit : e_raw[key]['duration'].durationtime_limit)
                  + (durationtime_limit_duration_unit ? (e_update_diff[value]['duration'].duration_unit ? e_update_diff[value]['duration'].duration_unit.name : "") : (e_raw[key]['duration'].duration_unit ? e_raw[key]['duration'].duration_unit.name : "")))
                  : "N/A"


                }

                // Required curriculum units
                if(
                  (((e_update_diff||{})[value]||{})['curriculum']||{}).hasOwnProperty('min_total_unit') || 
                  (((e_update_diff||{})[value]||{})['curriculum']||{}).hasOwnProperty('curriculum_unit') 
                  ){

                  create_array(e_show_update,'min_total_unit', order);

                  var min_total_unit_min_total_unit = (((e_update_diff||{})[value]||{})['curriculum']||{}).min_total_unit;
                  var min_total_unit_curriculum_unit = (((e_update_diff||{})[value]||{})['curriculum']||{}).curriculum_unit;

                  e_show_update['min_total_unit'][key] 
                  = (min_total_unit_min_total_unit ? e_update_diff[value]['curriculum'].min_total_unit : e_raw[key]['curriculum'].min_total_unit)
                    ? ((min_total_unit_min_total_unit ? e_update_diff[value]['curriculum'].min_total_unit : e_raw[key]['curriculum'].min_total_unit)
                       + (min_total_unit_curriculum_unit ? (e_update_diff[value]['curriculum'].curriculum_unit ? e_update_diff[value]['curriculum'].curriculum_unit.name : "") : (e_raw[key]['curriculum'].curriculum_unit ? e_raw[key]['curriculum'].curriculum_unit.name : ""))
                    ) : "N/A"

                }

                // Max transfer units
                if(
                  (((e_update_diff||{})[value]||{})['curriculum']||{}).hasOwnProperty('max_transfer_unit') || 
                  (((e_update_diff||{})[value]||{})['curriculum']||{}).hasOwnProperty('curriculum_unit')
                  ){

                  create_array(e_show_update,'max_transfer_unit', order);

                  var max_transfer_unit_max_transfer_unit = (((e_update_diff||{})[value]||{})['curriculum']||{}).max_transfer_unit;
                  var max_transfer_unit_curriculum_unit = (((e_update_diff||{})[value]||{})['curriculum']||{}).curriculum_unit;

                  e_show_update['max_transfer_unit'][key] 
                  = (max_transfer_unit_max_transfer_unit ? e_update_diff[value]['curriculum'].max_transfer_unit : e_raw[key]['curriculum'].max_transfer_unit) 
                    ? ((max_transfer_unit_max_transfer_unit ? e_update_diff[value]['curriculum'].max_transfer_unit : e_raw[key]['curriculum'].max_transfer_unit)
                    + (max_transfer_unit_curriculum_unit ? (e_update_diff[value]['curriculum'].curriculum_unit ? e_update_diff[value]['curriculum'].curriculum_unit.name : "") : (e_raw[key]['curriculum'].curriculum_unit ? e_raw[key]['curriculum'].curriculum_unit.name : ""))
                    ) : "N/A"


                }

                //Master thesis or equivalent
                if(
                  (((e_update_diff||{})[value]||{})['curriculum']||{}).hasOwnProperty('master_thesis_or_equivalent') 
                 ){

                  create_array(e_show_update,'master_thesis_or_equivalent', order);

                  e_show_update['master_thesis_or_equivalent'][key] 
                    = e_update_diff[value]['curriculum'].master_thesis_or_equivalent


                  if(e_show_update['master_thesis_or_equivalent']){
                    if(e_show_update['master_thesis_or_equivalent'] === 'Y'){
                      e_show_update['master_thesis_or_equivalent'] = "Yes";
                    }
                    if(e_show_update['master_thesis_or_equivalent'] === 'N'){
                      e_show_update['master_thesis_or_equivalent'] = "No";
                    }

                    if(e_show_update['master_thesis_or_equivalent'] === 'O'){
                      e_show_update['master_thesis_or_equivalent'] = "Optional";
                    }

                  }

                  set_null(e_show_update,'master_thesis_or_equivalent', key)

                }


                // Thesis notes
                if(
                  (((e_update_diff||{})[value]||{})['curriculum']||{}).hasOwnProperty('thesis_notes') 
                 ){

                  create_array(e_show_update,'thesis_notes', order);

                  e_show_update['thesis_notes'][key] 
                    = e_update_diff[value]['curriculum'].thesis_notes

                  set_null(e_show_update,'thesis_notes', key)


                }

                // Doctorate dissertation or equivalent
                if(
                  (((e_update_diff||{})[value]||{})['curriculum']||{}).hasOwnProperty('doctorate_dissertation_or_equivalent') 
                 ){

                  create_array(e_show_update,'doctorate_dissertation_or_equivalent', order);

                  e_show_update['doctorate_dissertation_or_equivalent'][key] 
                    = e_update_diff[value]['curriculum'].doctorate_dissertation_or_equivalent

                  if(e_show_update['doctorate_dissertation_or_equivalent']){
                    if(e_show_update['doctorate_dissertation_or_equivalent'] === 'Y'){
                      e_show_update['doctorate_dissertation_or_equivalent'] = "Yes";
                    }
                    if(e_show_update['doctorate_dissertation_or_equivalent'] === 'N'){
                      e_show_update['doctorate_dissertation_or_equivalent'] = "No";
                    }

                    if(e_show_update['doctorate_dissertation_or_equivalent'] === 'O'){
                      e_show_update['doctorate_dissertation_or_equivalent'] = "Optional";
                    }

                  }

                  set_null(e_show_update,'doctorate_dissertation_or_equivalent', key)

                }

                // Dissertation notes
                if(
                  (((e_update_diff||{})[value]||{})['curriculum']||{}).hasOwnProperty('dissertation_notes') 
                 ){

                  create_array(e_show_update,'dissertation_notes', order);

                  e_show_update['dissertation_notes'][key] 
                    = e_update_diff[value]['curriculum'].dissertation_notes

                  set_null(e_show_update,'dissertation_notes', key)


                }

                // Curriculums
                if(
                  (((e_update_diff||{})[value]||{})['curriculum']||{}).hasOwnProperty('curriculum_url') 
                 ){

                  create_array(e_show_update,'curriculum_url', order);

                  e_show_update['curriculum_url'][key] 
                    = e_update_diff[value]['curriculum'].curriculum_url

                  set_null(e_show_update,'curriculum_url', key)

                }

                // Tuition (in state)
                if(
                  (((e_update_diff||{})[value]||{})['tuition']||{}).hasOwnProperty('tuition_per_unit') || 
                  (((e_update_diff||{})[value]||{})['tuition']||{}).hasOwnProperty('tuition_unit') 
                 ){


                  if((((e_update_diff||{})[value]||{})['tuition']||{}).tuition_per_unit || e_raw[key]['tuition'].tuition_per_unit) {
                    create_array(e_show_update,'tuition_per_unit', order);

                    var tuition_per_unit_tuition_per_unit = (((e_update_diff||{})[value]||{})['tuition']||{}).tuition_per_unit;
                    var tuition_per_unit_tuition_unit = (((e_update_diff||{})[value]||{})['tuition']||{}).tuition_unit;

                    e_show_update['tuition_per_unit'][key] 
                    = 
                      (tuition_per_unit_tuition_per_unit ? e_update_diff[value]['tuition'].tuition_per_unit : e_raw[key]['tuition'].tuition_per_unit)
                      ? ($filter('currency')(tuition_per_unit_tuition_per_unit ? e_update_diff[value]['tuition'].tuition_per_unit : e_raw[key]['tuition'].tuition_per_unit, 
                      '$')
                      + ' per ' 
                      + (tuition_per_unit_tuition_unit ? (e_update_diff[value]['tuition'].tuition_unit ? e_update_diff[value]['tuition'].tuition_unit.name : "") : (e_raw[key]['tuition'].tuition_unit ? e_raw[key]['tuition'].tuition_unit.name : ""))
                      ) : "N/A"
                  }

                }

              //  Tuition (out of state)
              if(
                  (((e_update_diff||{})[value]||{})['tuition']||{}).hasOwnProperty('tuition_per_unit_out_state') || 
                  (((e_update_diff||{})[value]||{})['tuition']||{}).hasOwnProperty('tuition_unit') 
                 ){


                  if((((e_update_diff||{})[value]||{})['tuition']||{}).tuition_per_unit_out_state || e_raw[key]['tuition'].tuition_per_unit_out_state) {
                    create_array(e_show_update,'tuition_per_unit_out_state', order);

                    var tuition_per_unit_out_state_tuition_per_unit_out_state = (((e_update_diff||{})[value]||{})['tuition']||{}).tuition_per_unit_out_state;
                    var tuition_per_unit_out_state_tuition_unit = (((e_update_diff||{})[value]||{})['tuition']||{}).tuition_unit;

                    e_show_update['tuition_per_unit_out_state'][key] 
                    = 
                      (tuition_per_unit_out_state_tuition_per_unit_out_state ? e_update_diff[value]['tuition'].tuition_per_unit_out_state : e_raw[key]['tuition'].tuition_per_unit_out_state)
                      ? ($filter('currency')(tuition_per_unit_out_state_tuition_per_unit_out_state ? e_update_diff[value]['tuition'].tuition_per_unit_out_state : e_raw[key]['tuition'].tuition_per_unit_out_state, 
                      '$')
                      + ' per ' 
                      + (tuition_per_unit_out_state_tuition_unit ? (e_update_diff[value]['tuition'].tuition_unit ? e_update_diff[value]['tuition'].tuition_unit.name : "") : (e_raw[key]['tuition'].tuition_unit ? e_raw[key]['tuition'].tuition_unit.name : ""))
                      )
                      : "N/A"
                  }
                  


                }


                // Tuition url
                if(
                  (((e_update_diff||{})[value]||{})['tuition']||{}).hasOwnProperty('school_cost_url') || 
                  (((e_update_diff||{})[value]||{})['tuition']||{}).hasOwnProperty('university_cost_url') 
                 ){


                
                    create_array(e_show_update,'tuition_url', order);

                    var tuition_per_unit_school_cost_url = (((e_update_diff||{})[value]||{})['tuition']||{}).school_cost_url;
                    var tuition_per_unit_university_cost_url = (((e_update_diff||{})[value]||{})['tuition']||{}).university_cost_url;

                    e_show_update['tuition_url'][key] 
                    = (tuition_per_unit_school_cost_url ? e_update_diff[value]['tuition'].school_cost_url : e_raw[key]['tuition'].school_cost_url ) 
                    ? (tuition_per_unit_school_cost_url ? e_update_diff[value]['tuition'].school_cost_url : e_raw[key]['tuition'].school_cost_url )
                    : (tuition_per_unit_university_cost_url ? e_update_diff[value]['tuition'].university_cost_url : e_raw[key]['tuition'].university_cost_url )


                      set_null(e_show_update,'tuition_url', key)

                }


                // Other fees included
                if(
                  (((e_update_diff||{})[value]||{})['tuition']||{}).hasOwnProperty('fee_included') 
                 ){

                  create_array(e_show_update,'fee_included', order);

                  e_show_update['fee_included'][key] 
                    = e_update_diff[value]['tuition'].fee_included


                  if(e_show_update['fee_included']){
                    if(e_show_update['fee_included'] === true) {
                      e_show_update['fee_included'] = 'Yes';
                    }
                    if(e_show_update['fee_included'] === false) {
                      e_show_update['fee_included'] = 'No';
                    }
                  }

                  set_null(e_show_update,'fee_included', key)

                }


                // Application deadlines link 
                if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('deadline_url') 
                 ){

                  create_array(e_show_update,'deadline_url', order);

                  e_show_update['deadline_url'][key] 
                    = e_update_diff[value]['deadline'].deadline_url

                  set_null(e_show_update,'deadline_url', key)

                }

                // Deadline - Fall, early
                if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_fall_early_month_display') ||
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_fall_early_day_display') 
                 ){

                  create_array(e_show_update,'deadline_fall_early', order);

                  var deadline_fall_early_get_deadline_fall_early_month_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_fall_early_month_display
                  var deadline_fall_early_get_deadline_fall_early_day_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_fall_early_day_display 

                  // e_show_update['deadline_fall_early'][key] 
                  // = ((deadline_fall_early_get_deadline_fall_early_month_display ? e_update_diff[value]['deadline'].get_deadline_fall_early_month_display : e_raw[key]['deadline'].get_deadline_fall_early_month_display)
                  //   ? (deadline_fall_early_get_deadline_fall_early_month_display ? e_update_diff[value]['deadline'].get_deadline_fall_early_month_display : e_raw[key]['deadline'].get_deadline_fall_early_month_display)
                  //   : "")
                  // + ' '
                  // + ((deadline_fall_early_get_deadline_fall_early_day_display ? e_update_diff[value]['deadline'].get_deadline_fall_early_day_display : e_raw[key]['deadline'].get_deadline_fall_early_day_display)
                  //   ? (deadline_fall_early_get_deadline_fall_early_day_display ? e_update_diff[value]['deadline'].get_deadline_fall_early_day_display : e_raw[key]['deadline'].get_deadline_fall_early_day_display)
                  //   : "")

                  e_show_update['deadline_fall_early'][key] 
                  = (deadline_fall_early_get_deadline_fall_early_month_display ? e_update_diff[value]['deadline'].get_deadline_fall_early_month_display : '')
                  + ' '
                  + (deadline_fall_early_get_deadline_fall_early_day_display ? e_update_diff[value]['deadline'].get_deadline_fall_early_day_display : '')
                    

                  if(e_show_update['deadline_fall_early'][key]===' '){
                    e_show_update['deadline_fall_early'][key] = 'N/A'
                  }
                  
                  set_null(e_show_update,'deadline_fall_early', key)

                }


                // Deadline - Fall, late
                if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_fall_late_month_display') || 
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_fall_late_day_display') 
                 ){

                  create_array(e_show_update,'deadline_fall_late', order);

                  var deadline_fall_late_get_deadline_fall_late_month_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_fall_late_month_display
                  var deadline_fall_late_get_deadline_fall_late_day_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_fall_late_day_display 


                  // e_show_update['deadline_fall_late'][key] 
                  // = ((deadline_fall_late_get_deadline_fall_late_month_display ? e_update_diff[value]['deadline'].get_deadline_fall_late_month_display : e_raw[key]['deadline'].get_deadline_fall_late_month_display)
                  //   ? (deadline_fall_late_get_deadline_fall_late_month_display ? e_update_diff[value]['deadline'].get_deadline_fall_late_month_display : e_raw[key]['deadline'].get_deadline_fall_late_month_display)
                  //   : "")
                  // + ' '
                  // + ((deadline_fall_late_get_deadline_fall_late_day_display ? e_update_diff[value]['deadline'].get_deadline_fall_late_day_display : e_raw[key]['deadline'].get_deadline_fall_late_day_display)
                  //   ? (deadline_fall_late_get_deadline_fall_late_day_display ? e_update_diff[value]['deadline'].get_deadline_fall_late_day_display : e_raw[key]['deadline'].get_deadline_fall_late_day_display)
                  //   : "")

                  e_show_update['deadline_fall_late'][key] 
                  = (deadline_fall_late_get_deadline_fall_late_month_display ? e_update_diff[value]['deadline'].get_deadline_fall_late_month_display : '')
                  + ' '
                  + (deadline_fall_late_get_deadline_fall_late_day_display ? e_update_diff[value]['deadline'].get_deadline_fall_late_day_display : '')
                   
                  if(e_show_update['deadline_fall_late'][key]===' '){
                    e_show_update['deadline_fall_late'][key] = 'N/A'
                  }

                  set_null(e_show_update,'deadline_fall_late', key)

                }


               // Deadline - Spring, early
              if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_spring_early_month_display') || 
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_spring_early_day_display') 
                 ){

                  create_array(e_show_update,'deadline_spring_early', order);

                  var deadline_spring_early_get_deadline_spring_early_month_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_spring_early_month_display
                  var deadline_spring_early_get_deadline_spring_early_day_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_spring_early_day_display 


                  // e_show_update['deadline_spring_early'][key] 
                  // = ((deadline_spring_early_get_deadline_spring_early_month_display ? e_update_diff[value]['deadline'].get_deadline_spring_early_month_display : e_raw[key]['deadline'].get_deadline_spring_early_month_display)
                  //   ? (deadline_spring_early_get_deadline_spring_early_month_display ? e_update_diff[value]['deadline'].get_deadline_spring_early_month_display : e_raw[key]['deadline'].get_deadline_spring_early_month_display)
                  //   : "")
                  // + ' '
                  // + ((deadline_spring_early_get_deadline_spring_early_day_display ? e_update_diff[value]['deadline'].get_deadline_spring_early_day_display : e_raw[key]['deadline'].get_deadline_spring_early_day_display)
                  //   ? (deadline_spring_early_get_deadline_spring_early_day_display ? e_update_diff[value]['deadline'].get_deadline_spring_early_day_display : e_raw[key]['deadline'].get_deadline_spring_early_day_display)
                  //   : "")
                  e_show_update['deadline_spring_early'][key] 
                  = (deadline_spring_early_get_deadline_spring_early_month_display ? e_update_diff[value]['deadline'].get_deadline_spring_early_month_display : '')
                  + ' '
                  + (deadline_spring_early_get_deadline_spring_early_day_display ? e_update_diff[value]['deadline'].get_deadline_spring_early_day_display : '')
                    

                  if(e_show_update['deadline_spring_early'][key]===' '){
                    e_show_update['deadline_spring_early'][key] = 'N/A'
                  }


                  set_null(e_show_update,'deadline_spring_early', key)

                }


                // Deadline - Spring, late
                if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_spring_late_month_display') || 
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_spring_late_day_display') 
                 ){

                  create_array(e_show_update,'deadline_spring_late', order);

                  var deadline_spring_late_get_deadline_spring_late_month_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_spring_late_month_display
                  var deadline_spring_late_get_deadline_spring_late_day_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_spring_late_day_display 


                  // e_show_update['deadline_spring_late'][key] 
                  // = ((deadline_spring_late_get_deadline_spring_late_month_display ? e_update_diff[value]['deadline'].get_deadline_spring_late_month_display : e_raw[key]['deadline'].get_deadline_spring_late_month_display)
                  //   ? (deadline_spring_late_get_deadline_spring_late_month_display ? e_update_diff[value]['deadline'].get_deadline_spring_late_month_display : e_raw[key]['deadline'].get_deadline_spring_late_month_display)
                  //   : "")
                  // + ' '
                  // + ((deadline_spring_late_get_deadline_spring_late_day_display ? e_update_diff[value]['deadline'].get_deadline_spring_late_day_display : e_raw[key]['deadline'].get_deadline_spring_late_day_display)
                  //   ? (deadline_spring_late_get_deadline_spring_late_day_display ? e_update_diff[value]['deadline'].get_deadline_spring_late_day_display : e_raw[key]['deadline'].get_deadline_spring_late_day_display)
                  //   : "")
                  e_show_update['deadline_spring_late'][key] 
                  = (deadline_spring_late_get_deadline_spring_late_month_display ? e_update_diff[value]['deadline'].get_deadline_spring_late_month_display : '')
                  + ' '
                  + (deadline_spring_late_get_deadline_spring_late_day_display ? e_update_diff[value]['deadline'].get_deadline_spring_late_day_display : '')
                    

                  if(e_show_update['deadline_spring_late'][key]===' '){
                    e_show_update['deadline_spring_late'][key] = 'N/A'
                  }


                  set_null(e_show_update,'deadline_spring_late', key)

                }

                // Deadline - summer, early
              if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_summer_early_month_display') || 
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_summer_early_day_display') 
                 ){

                  create_array(e_show_update,'deadline_summer_early', order);

                  var deadline_summer_early_get_deadline_summer_early_month_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_summer_early_month_display
                  var deadline_summer_early_get_deadline_summer_early_day_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_summer_early_day_display 


                  // e_show_update['deadline_summer_early'][key] 
                  // = ((deadline_summer_early_get_deadline_summer_early_month_display ? e_update_diff[value]['deadline'].get_deadline_summer_early_month_display : e_raw[key]['deadline'].get_deadline_summer_early_month_display)
                  //   ? (deadline_summer_early_get_deadline_summer_early_month_display ? e_update_diff[value]['deadline'].get_deadline_summer_early_month_display : e_raw[key]['deadline'].get_deadline_summer_early_month_display)
                  //   : "")
                  // + ' '
                  // + ((deadline_summer_early_get_deadline_summer_early_day_display ? e_update_diff[value]['deadline'].get_deadline_summer_early_day_display : e_raw[key]['deadline'].get_deadline_summer_early_day_display)
                  //   ? (deadline_summer_early_get_deadline_summer_early_day_display ? e_update_diff[value]['deadline'].get_deadline_summer_early_day_display : e_raw[key]['deadline'].get_deadline_summer_early_day_display)
                  //   : "")
                  e_show_update['deadline_summer_early'][key] 
                  = (deadline_summer_early_get_deadline_summer_early_month_display ? e_update_diff[value]['deadline'].get_deadline_summer_early_month_display : '')
                  + ' '
                  + (deadline_summer_early_get_deadline_summer_early_day_display ? e_update_diff[value]['deadline'].get_deadline_summer_early_day_display : '')
                    

                  if(e_show_update['deadline_summer_early'][key]===' '){
                    e_show_update['deadline_summer_early'][key] = 'N/A'
                  }

                  set_null(e_show_update,'deadline_summer_early', key)

                }


                // Deadline - summer, late
                if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_summer_late_month_display') || 
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_deadline_summer_late_day_display') 
                 ){

                  create_array(e_show_update,'deadline_summer_late', order);

                  var deadline_summer_late_get_deadline_summer_late_month_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_summer_late_month_display
                  var deadline_summer_late_get_deadline_summer_late_day_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_deadline_summer_late_day_display 


                  // e_show_update['deadline_summer_late'][key] 
                  // = ((deadline_summer_late_get_deadline_summer_late_month_display ? e_update_diff[value]['deadline'].get_deadline_summer_late_month_display : e_raw[key]['deadline'].get_deadline_summer_late_month_display)
                  //   ? (deadline_summer_late_get_deadline_summer_late_month_display ? e_update_diff[value]['deadline'].get_deadline_summer_late_month_display : e_raw[key]['deadline'].get_deadline_summer_late_month_display)
                  //   : "")
                  // + ' '
                  // + ((deadline_summer_late_get_deadline_summer_late_day_display ? e_update_diff[value]['deadline'].get_deadline_summer_late_day_display : e_raw[key]['deadline'].get_deadline_summer_late_day_display)
                  //   ? (deadline_summer_late_get_deadline_summer_late_day_display ? e_update_diff[value]['deadline'].get_deadline_summer_late_day_display : e_raw[key]['deadline'].get_deadline_summer_late_day_display)
                  //   : "")

                  e_show_update['deadline_summer_late'][key] 
                  = (deadline_summer_late_get_deadline_summer_late_month_display ? e_update_diff[value]['deadline'].get_deadline_summer_late_month_display : '')
                  + ' '
                  + (deadline_summer_late_get_deadline_summer_late_day_display ? e_update_diff[value]['deadline'].get_deadline_summer_late_day_display : '')
                    

                  if(e_show_update['deadline_summer_late'][key]===' '){
                    e_show_update['deadline_summer_late'][key] = 'N/A'
                  }


                  

                  set_null(e_show_update,'deadline_summer_late', key)

                }


               // Rolling deadline
               if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('deadline_rolling') 
                 ){

                  create_array(e_show_update,'deadline_rolling', order);

                  e_show_update['deadline_rolling'][key] 
                    = e_update_diff[value]['deadline'].deadline_rolling

                 
                  if(e_show_update['deadline_rolling']){
                    if(e_show_update['deadline_rolling'] === true) {
                      e_show_update['deadline_rolling'] = 'Yes';
                    }
                    if(e_show_update['deadline_rolling'] === false) {
                      e_show_update['deadline_rolling'] = 'No';
                    }
                  }

                  set_null(e_show_update,'deadline_rolling', key)

                }

                // Scholarship deadline
                if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('scholarship_deadline_month') || 
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('scholarship_deadline_day') 
                 ){

                  create_array(e_show_update,'scholarship_deadline', order);

                  var scholarship_deadline_scholarship_deadline_month = (((e_update_diff||{})[value]||{})['deadline']||{}).scholarship_deadline_month
                  var scholarship_deadline_scholarship_deadline_day = (((e_update_diff||{})[value]||{})['deadline']||{}).scholarship_deadline_day 

                  e_show_update['scholarship_deadline'][key] 
                  = (scholarship_deadline_scholarship_deadline_month ? e_update_diff[value]['deadline'].scholarship_deadline_month : '')
                  + '/'
                  + (scholarship_deadline_scholarship_deadline_day ? e_update_diff[value]['deadline'].scholarship_deadline_day : '')

                  if(e_show_update['scholarship_deadline'][key] === '/') {
                    e_show_update['scholarship_deadline'][key] = 'N/A'
                  }

                  set_null(e_show_update,'scholarship_deadline', key)

                }


                // international deadline
                if(
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_international_deadline_month_display') || 
                  (((e_update_diff||{})[value]||{})['deadline']||{}).hasOwnProperty('get_international_deadline_day_display') 
                 ){

                  create_array(e_show_update,'international_deadline', order);

                  var international_deadline_get_international_deadline_month_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_international_deadline_month_display
                  var international_deadline_get_international_deadline_day_display = (((e_update_diff||{})[value]||{})['deadline']||{}).get_international_deadline_day_display 


                  e_show_update['international_deadline'][key] 
                  = (international_deadline_get_international_deadline_month_display ? e_update_diff[value]['deadline'].get_international_deadline_month_display : '')
                  + ' '
                  + (international_deadline_get_international_deadline_day_display ? e_update_diff[value]['deadline'].get_international_deadline_day_display : '')
                  
                  if(e_show_update['international_deadline'][key] = ' '){
                    e_show_update['international_deadline'][key] = 'N/A'
                  }

                  set_null(e_show_update,'international_deadline', key)

                }



                // Special requirements (special_reqs)
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('special_reqs') 
                 ){

                  create_array(e_show_update,'special_reqs', order);

                  e_show_update['special_reqs'][key] 
                    = e_update_diff[value]['requirement'].special_reqs

                  set_null(e_show_update,'special_reqs', key)
                }


                // Online Application - apply_online
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('apply_online') 
                 ){

                  create_array(e_show_update,'apply_online', order);

                  e_show_update['apply_online'][key] 
                    = e_update_diff[value]['requirement'].apply_online


                  if(e_show_update['apply_online']){
                    if(e_show_update['apply_online'] === true) {
                      e_show_update['apply_online'] = 'Yes';
                    }
                    if(e_show_update['apply_online'] === false) {
                      e_show_update['apply_online'] = 'No';
                    }
                  }

                  set_null(e_show_update,'apply_online', key)

                }


                // Application fee
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('application_fee') 
                 ){

                  create_array(e_show_update,'application_fee', order);

                  e_show_update['application_fee'][key] 
                    = $filter('currency')(e_update_diff[value]['requirement'].application_fee, '$')


                  if(!e_show_update['application_fee']){
                    e_show_update['application_fee'] = "N/A";
                  }

                  set_null(e_show_update,'application_fee', key)

                }


                // Application fee waiver
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('application_fee_waiver') 
                 ){
                  create_array(e_show_update,'application_fee_waiver', order);

                  e_show_update['application_fee_waiver'][key] 
                    = e_update_diff[value]['requirement'].application_fee_waiver


                  if(e_show_update['application_fee_waiver']){
                    if(e_show_update['application_fee_waiver'] === true) {
                      e_show_update['application_fee_waiver'] = 'Yes';
                    }
                    if(e_show_update['application_fee_waiver'] === false) {
                      e_show_update['application_fee_waiver'] = 'No';
                    }
                  }

                  set_null(e_show_update,'application_fee_waiver', key)

                }


                // Application fee waiver notes
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('application_fee_waiver_notes') 
                 ){
                  create_array(e_show_update,'application_fee_waiver_notes', order);

                  e_show_update['application_fee_waiver_notes'][key] 
                    = e_update_diff[value]['requirement'].application_fee_waiver_notes

                  set_null(e_show_update,'application_fee_waiver_notes', key)

                }

                // Transcripts required for application
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('transcript_for_application') 
                 ){

                  create_array(e_show_update,'transcript_for_application', order);

                  e_show_update['transcript_for_application'][key] 
                    = e_update_diff[value]['requirement'].transcript_for_application

                  if(e_show_update['transcript_for_application']){
                    if(e_show_update['transcript_for_application'] === 'Y') {
                      e_show_update['transcript_for_application'] = 'Yes';
                    }
                    if(e_show_update['transcript_for_application'] === 'N') {
                      e_show_update['transcript_for_application'] = 'No';
                    }
                  }

                  set_null(e_show_update,'transcript_for_application', key)

                }


                // Transcripts required for enrollment
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('official_transcript_for_enrollment') 
                 ){

                  create_array(e_show_update,'official_transcript_for_enrollment', order);

                  e_show_update['official_transcript_for_enrollment'][key] 
                    = e_update_diff[value]['requirement'].official_transcript_for_enrollment

                  if(e_show_update['official_transcript_for_enrollment']){
                    if(e_show_update['official_transcript_for_enrollment'] === 'Y') {
                      e_show_update['official_transcript_for_enrollment'] = 'Yes';
                    }
                    if(e_show_update['official_transcript_for_enrollment'] === 'N') {
                      e_show_update['official_transcript_for_enrollment'] = 'No';
                    }
                  }

                  set_null(e_show_update,'official_transcript_for_enrollment', key)

                }

                // Required admissions exam
                if(
                  (((e_update_diff||{})[value]||{}).hasOwnProperty('required_exam')) 
                 ){

                  create_array(e_show_update,'required_admissions_exam', order);

                   var exams = [];
                  
                    for(var k=0; k< (e_update_diff[value]['required_exam']||[]).length; k++){
                      exams.push(e_update_diff[value]['required_exam'][k].name)
                    }

                    e_show_update['required_admissions_exam'][key] 
                    = exams.join(", ")

                  set_null(e_show_update,'required_admissions_exam', key)

                }


                // Personal statement or equivalent
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('essays') 
                 ){

                  create_array(e_show_update,'essays', order);

                  e_show_update['essays'][key] 
                    = e_update_diff[value]['requirement'].essays

                  set_null(e_show_update,'essays', key)

                }

                // Letters of recommendation
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('recommendation') 
                 ){

                  create_array(e_show_update,'recommendation', order);

                  e_show_update['recommendation'][key] 
                    = e_update_diff[value]['requirement'].recommendation

                  set_null(e_show_update,'recommendation', key)

                }

                // Minimum GPA
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('gpa_minimum') || 
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('gpa_minimum_letter') 
                 ){

                  create_array(e_show_update,'gpa_minimum', order);

                  var gpa_minimum_gpa_minimum = (((e_update_diff||{})[value]||{})['requirement']||{}).gpa_minimum
                  var gpa_minimum_gpa_minimum_letter = (((e_update_diff||{})[value]||{})['requirement']||{}).gpa_minimum_letter 

                  e_show_update['gpa_minimum'][key] 
                  
                  = (gpa_minimum_gpa_minimum ? e_update_diff[value]['requirement'].gpa_minimum : e_raw[key]['requirement'].gpa_minimum)

                  ? ((gpa_minimum_gpa_minimum ? e_update_diff[value]['requirement'].gpa_minimum : e_raw[key]['requirement'].gpa_minimum)

                  + ((gpa_minimum_gpa_minimum_letter ? e_update_diff[value]['requirement'].gpa_minimum_letter : e_raw[key]['requirement'].gpa_minimum_letter)
                    ? ("/" + (gpa_minimum_gpa_minimum_letter ? e_update_diff[value]['requirement'].gpa_minimum_letter : e_raw[key]['requirement'].gpa_minimum_letter))
                    : ""
                    )
                  ) : 
                  ((gpa_minimum_gpa_minimum_letter ? e_update_diff[value]['requirement'].gpa_minimum_letter : e_raw[key]['requirement'].gpa_minimum_letter)
                    ? (gpa_minimum_gpa_minimum_letter ? e_update_diff[value]['requirement'].gpa_minimum_letter : e_raw[key]['requirement'].gpa_minimum_letter)
                    : ""
                  )

                  set_null(e_show_update,'gpa_minimum', key)

                }


                // Average GPA
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('gpa_average') || 
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('gpa_average_letter') 
                 ){

                  create_array(e_show_update,'gpa_average', order);

                  var gpa_average_gpa_average = (((e_update_diff||{})[value]||{})['requirement']||{}).gpa_average
                  var gpa_average_gpa_average_letter = (((e_update_diff||{})[value]||{})['requirement']||{}).gpa_average_letter 

                  e_show_update['gpa_average'][key] 
                  
                  = (gpa_average_gpa_average ? e_update_diff[value]['requirement'].gpa_average : e_raw[key]['requirement'].gpa_average)

                  ? ((gpa_average_gpa_average ? e_update_diff[value]['requirement'].gpa_average : e_raw[key]['requirement'].gpa_average)

                  + ((gpa_average_gpa_average_letter ? e_update_diff[value]['requirement'].gpa_average_letter : e_raw[key]['requirement'].gpa_average_letter)
                    ? ("/" + (gpa_average_gpa_average_letter ? e_update_diff[value]['requirement'].gpa_average_letter : e_raw[key]['requirement'].gpa_average_letter))
                    : ""
                    )
                  ) : 
                  ((gpa_average_gpa_average_letter ? e_update_diff[value]['requirement'].gpa_average_letter : e_raw[key]['requirement'].gpa_average_letter)
                    ? (gpa_average_gpa_average_letter ? e_update_diff[value]['requirement'].gpa_average_letter : e_raw[key]['requirement'].gpa_average_letter)
                    : ""
                  )

                  set_null(e_show_update,'gpa_average', key)

                }

                // Suggested GPA
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('gpa_suggested') || 
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('gpa_suggested_letter') 
                 ){

                  create_array(e_show_update,'gpa_suggested', order);

                  var gpa_suggested_gpa_suggested = (((e_update_diff||{})[value]||{})['requirement']||{}).gpa_suggested
                  var gpa_suggested_gpa_suggested_letter = (((e_update_diff||{})[value]||{})['requirement']||{}).gpa_suggested_letter 

                  e_show_update['gpa_suggested'][key] 
                  
                  = (gpa_suggested_gpa_suggested ? e_update_diff[value]['requirement'].gpa_suggested : e_raw[key]['requirement'].gpa_suggested)

                  ? ((gpa_suggested_gpa_suggested ? e_update_diff[value]['requirement'].gpa_suggested : e_raw[key]['requirement'].gpa_suggested)

                  + ((gpa_suggested_gpa_suggested_letter ? e_update_diff[value]['requirement'].gpa_suggested_letter : e_raw[key]['requirement'].gpa_suggested_letter)
                    ? ("/" + (gpa_suggested_gpa_suggested_letter ? e_update_diff[value]['requirement'].gpa_suggested_letter : e_raw[key]['requirement'].gpa_suggested_letter))
                    : ""
                    )
                  ) : 
                  ((gpa_suggested_gpa_suggested_letter ? e_update_diff[value]['requirement'].gpa_suggested_letter : e_raw[key]['requirement'].gpa_suggested_letter)
                    ? (gpa_suggested_gpa_suggested_letter ? e_update_diff[value]['requirement'].gpa_suggested_letter : e_raw[key]['requirement'].gpa_suggested_letter)
                    : ""
                  )

                  set_null(e_show_update,'gpa_suggested', key)

                }

                // School interview
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('school_interview') 
                 ){

                  create_array(e_show_update,'school_interview', order);

                  e_show_update['school_interview'][key] 
                    = e_update_diff[value]['requirement'].school_interview

                  if(e_show_update['school_interview']){
                    if(e_show_update['school_interview'] === true) {
                      e_show_update['school_interview'] = 'Yes';
                    }
                    if(e_show_update['school_interview'] === false) {
                      e_show_update['school_interview'] = 'No';
                    }
                  }

                  set_null(e_show_update,'school_interview', key)

                }

                // Résumé/ Curriculum Vitae
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('resume') 
                 ){

                  create_array(e_show_update,'resume', order);

                  e_show_update['resume'][key] 
                    = e_update_diff[value]['requirement'].resume


                  if(e_show_update['resume']){
                    if(e_show_update['resume'] === 'Y') {
                      e_show_update['resume'] = 'Yes';
                    }
                    if(e_show_update['resume'] === 'N') {
                      e_show_update['resume'] = 'No';
                    }
                    if(e_show_update['resume'] === 'O') {
                      e_show_update['resume'] = 'Optional';
                    }
                  }

                  set_null(e_show_update,'resume', key)

                }

                // Writing sample

                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('sup_mat_writing_sample') 
                 ){

                  create_array(e_show_update,'sup_mat_writing_sample', order);

                  e_show_update['sup_mat_writing_sample'][key] 
                    = e_update_diff[value]['requirement'].sup_mat_writing_sample

                  if(e_show_update['sup_mat_writing_sample']){
                    if(e_show_update['sup_mat_writing_sample'] === 'Y') {
                      e_show_update['sup_mat_writing_sample'] = 'Yes';
                    }
                    if(e_show_update['sup_mat_writing_sample'] === 'N') {
                      e_show_update['sup_mat_writing_sample'] = 'No';
                    }
                    if(e_show_update['sup_mat_writing_sample'] === 'O') {
                      e_show_update['sup_mat_writing_sample'] = 'Optional';
                    }
                  }

                  set_null(e_show_update,'sup_mat_writing_sample', key)

                }

                // Writing sample notes

                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('sup_mat_writing_sample_notes') 
                 ){

                  create_array(e_show_update,'sup_mat_writing_sample_notes', order);

                  e_show_update['sup_mat_writing_sample_notes'][key] 
                    = e_update_diff[value]['requirement'].sup_mat_writing_sample_notes

                  set_null(e_show_update,'sup_mat_writing_sample_notes', key)

                }

                // Portfolio
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('sup_mat_portfolio') 
                 ){

                  create_array(e_show_update,'sup_mat_portfolio', order);

                  e_show_update['sup_mat_portfolio'][key] 
                    = e_update_diff[value]['requirement'].sup_mat_portfolio

                  if(e_show_update['sup_mat_portfolio']){
                    if(e_show_update['sup_mat_portfolio'] === 'Y') {
                      e_show_update['sup_mat_portfolio'] = 'Yes';
                    }
                    if(e_show_update['sup_mat_portfolio'] === 'N') {
                      e_show_update['sup_mat_portfolio'] = 'No';
                    }
                    if(e_show_update['sup_mat_portfolio'] === 'O') {
                      e_show_update['sup_mat_portfolio'] = 'Optional';
                    }
                  }

                  set_null(e_show_update,'sup_mat_portfolio', key)

                }

                // Portfolio notes
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('sup_mat_portfolio_notes') 
                 ){

                  create_array(e_show_update,'sup_mat_portfolio_notes', order);

                  e_show_update['sup_mat_portfolio_notes'][key] 
                    = e_update_diff[value]['requirement'].sup_mat_portfolio_notes

                  if(!e_show_update['sup_mat_portfolio_notes']){
                    e_show_update['sup_mat_portfolio_notes'] = "N/A";
                  }

                  set_null(e_show_update,'sup_mat_portfolio_notes', key)

                }


                // Additional admissions requirements
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('program_req_url') || 
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('school_req_url') 
                 ){

                  create_array(e_show_update,'additional_admissions_requirements', order);

                  var additional_admissions_requirements_program_req_url = (((e_update_diff||{})[value]||{})['requirement']||{}).program_req_url
                  var additional_admissions_requirements_school_req_url = (((e_update_diff||{})[value]||{})['requirement']||{}).school_req_url

                  e_show_update['additional_admissions_requirements'][key] 
                  = (additional_admissions_requirements_program_req_url ? e_update_diff[value]['requirement'].program_req_url : e_raw[key]['requirement'].program_req_url ) 
                    ? (additional_admissions_requirements_program_req_url ? e_update_diff[value]['requirement'].program_req_url : e_raw[key]['requirement'].program_req_url )
                    : (additional_admissions_requirements_school_req_url ? e_update_diff[value]['requirement'].school_req_url : e_raw[key]['requirement'].school_req_url )

                  set_null(e_show_update,'additional_admissions_requirements', key)

                }

                // International transcript
                if(
                  (((e_update_diff||{})[value]||{}).hasOwnProperty('intl_transcript')) 
                 ){

                  create_array(e_show_update,'intl_transcript', order);

                   var tests = [];
                  
                    for(var k=0; k< (e_update_diff[value]['intl_transcript']||[]).length; k++){
                      tests.push(e_update_diff[value]['intl_transcript'][k].name + ' : ' + e_update_diff[value]['intl_transcript'][k].description)
                    }

                    e_show_update['intl_transcript'][key] 
                    = tests.join("/ ")

                  set_null(e_show_update,'intl_transcript', key)

                }


                // Foreign language waiver
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('intl_lang_waiver') 
                 ){

                  create_array(e_show_update,'intl_lang_waiver', order);

                  e_show_update['intl_lang_waiver'][key] 
                    = e_update_diff[value]['requirement'].intl_lang_waiver

                  if(e_show_update['intl_lang_waiver']){
                    if(e_show_update['intl_lang_waiver'] === true) {
                      e_show_update['intl_lang_waiver'] = 'Yes';
                    }
                    if(e_show_update['intl_lang_waiver'] === false) {
                      e_show_update['intl_lang_waiver'] = 'No';
                    }
                  }

                  set_null(e_show_update,'intl_lang_waiver', key)

                }

                // Foreign language waiver notes
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('intl_lang_waiver_conditions') 
                 ){
                  create_array(e_show_update,'intl_lang_waiver_conditions', order);

                  e_show_update['intl_lang_waiver_conditions'][key] 
                    = e_update_diff[value]['requirement'].intl_lang_waiver_conditions

                  set_null(e_show_update,'intl_lang_waiver_conditions', key)

                }

                // English language test required (Non-native speakers)
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('intl_english_test_required') 
                 ){
                  create_array(e_show_update,'intl_english_test_required', order);

                  e_show_update['intl_english_test_required'][key] 
                    = e_update_diff[value]['requirement'].intl_english_test_required

                  if(e_show_update['intl_english_test_required']){
                    if(e_show_update['intl_english_test_required'] === true) {
                      e_show_update['intl_english_test_required'] = 'Yes';
                    }
                    if(e_show_update['intl_english_test_required'] === false) {
                      e_show_update['intl_english_test_required'] = 'No';
                    }
                  }

                  set_null(e_show_update,'intl_english_test_required', key)

                }

                // English language test
                if(
                  (((e_update_diff||{})[value]||{}).hasOwnProperty('intl_eng_test')) 
                 ){

                  
                  create_array(e_show_update,'intl_eng_test', order);

                   var eng_tests = [];
                  
                    for(var k=0; k< (e_update_diff[value]['intl_eng_test']||[]).length; k++){
                      eng_tests.push(e_update_diff[value]['intl_eng_test'][k].name)
                    }

                    console.log("xxxxxx eng_tests="+JSON.stringify(eng_tests, null, 4))

                    e_show_update['intl_eng_test'][key] 
                    = eng_tests.join(", ")

                   
                  set_null(e_show_update,'intl_eng_test', key)

                }


                // TOEFL iBT
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('toefl_ibt') 
                 ){
                  create_array(e_show_update,'toefl_ibt', order);

                  e_show_update['toefl_ibt'][key] 
                    = e_update_diff[value]['requirement'].toefl_ibt

                  set_null(e_show_update,'toefl_ibt', key)

                }

                // TOEFL iBT reading /listening /speaking /writing Scores
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('toefl_ibt_reading') || 
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('toefl_ibt_listening') ||
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('toefl_ibt_speaking') ||
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('toefl_ibt_writing') 
                 ){

                  create_array(e_show_update,'toefl_ibt_scores', order);

                  var toefl_ibt_scores_toefl_ibt_reading = (((e_update_diff||{})[value]||{})['requirement']||{}).toefl_ibt_reading
                  var toefl_ibt_scores_toefl_ibt_listening = (((e_update_diff||{})[value]||{})['requirement']||{}).toefl_ibt_listening
                  var toefl_ibt_scores_toefl_ibt_speaking = (((e_update_diff||{})[value]||{})['requirement']||{}).toefl_ibt_speaking
                  var toefl_ibt_scores_toefl_ibt_writing = (((e_update_diff||{})[value]||{})['requirement']||{}).toefl_ibt_writing 

                  e_show_update['toefl_ibt_scores'][key] 
                  = ((toefl_ibt_scores_toefl_ibt_reading ? e_update_diff[value]['requirement'].toefl_ibt_reading : e_raw[key]['requirement'].toefl_ibt_reading) 
                    ? (toefl_ibt_scores_toefl_ibt_reading ? e_update_diff[value]['requirement'].toefl_ibt_reading : e_raw[key]['requirement'].toefl_ibt_reading) 
                    : '-')
                  + '/'
                  + ((toefl_ibt_scores_toefl_ibt_listening ? e_update_diff[value]['requirement'].toefl_ibt_listening : e_raw[key]['requirement'].toefl_ibt_listening) 
                    ? (toefl_ibt_scores_toefl_ibt_listening ? e_update_diff[value]['requirement'].toefl_ibt_listening : e_raw[key]['requirement'].toefl_ibt_listening) 
                    : '-')
                  + '/'
                  + ((toefl_ibt_scores_toefl_ibt_speaking ? e_update_diff[value]['requirement'].toefl_ibt_speaking : e_raw[key]['requirement'].toefl_ibt_speaking) 
                    ? (toefl_ibt_scores_toefl_ibt_speaking ? e_update_diff[value]['requirement'].toefl_ibt_speaking : e_raw[key]['requirement'].toefl_ibt_speaking) 
                    : '-')
                  + '/'
                  + ((toefl_ibt_scores_toefl_ibt_writing ? e_update_diff[value]['requirement'].toefl_ibt_writing : e_raw[key]['requirement'].toefl_ibt_writing) 
                    ? (toefl_ibt_scores_toefl_ibt_writing ? e_update_diff[value]['requirement'].toefl_ibt_writing : e_raw[key]['requirement'].toefl_ibt_writing) 
                    : '-')
                  

                  if(e_show_update['toefl_ibt_scores']==='-/-/-/-'){
                    e_show_update['toefl_ibt_scores'] = "N/A";
                  }

                }


                // TOEFL PBT
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('toefl_pbt') 
                 ){
                  create_array(e_show_update,'toefl_pbt', order);

                  e_show_update['toefl_pbt'][key] 
                    = e_update_diff[value]['requirement'].toefl_pbt

                  set_null(e_show_update,'toefl_pbt', key)

                }


                // TOEFL TWE
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('toefl_twe') 
                 ){
                  create_array(e_show_update,'toefl_twe', order);

                  e_show_update['toefl_twe'][key] 
                    = e_update_diff[value]['requirement'].toefl_twe

                  set_null(e_show_update,'toefl_twe', key)

                }

                // TOEFL TSE
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('toefl_tse') 
                 ){
                  create_array(e_show_update,'toefl_tse', order);

                  e_show_update['toefl_tse'][key] 
                    = e_update_diff[value]['requirement'].toefl_tse

                  set_null(e_show_update,'toefl_tse', key)

                }


                // TOEFL CBT

                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('toefl_cbt') 
                 ){

                  create_array(e_show_update,'toefl_cbt', order);
                  e_show_update['toefl_cbt'][key] 
                    = e_update_diff[value]['requirement'].toefl_cbt

                  set_null(e_show_update,'toefl_cbt', key)

                }

                // IELTS requirements
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('intl_ielts_reqs') 
                 ){
                  create_array(e_show_update,'intl_ielts_reqs', order);

                  e_show_update['intl_ielts_reqs'][key] 
                    = e_update_diff[value]['requirement'].intl_ielts_reqs

                  set_null(e_show_update,'intl_ielts_reqs', key)

                }


                // Misc. /other international notes
                if(
                  (((e_update_diff||{})[value]||{})['requirement']||{}).hasOwnProperty('intl_other') 
                 ){
                  create_array(e_show_update,'intl_other', order);

                  e_show_update['intl_other'][key] 
                    = e_update_diff[value]['requirement'].intl_other

                  set_null(e_show_update,'intl_other', key)

                }


                // Fully funded
                if(
                  (((e_update_diff||{})[value]||{})['scholarship']||{}).hasOwnProperty('fully_funded') 
                 ){
                  create_array(e_show_update,'fully_funded', order);

                  e_show_update['fully_funded'][key] 
                    = e_update_diff[value]['scholarship'].fully_funded

                  if(e_show_update['fully_funded']){
                    if(e_show_update['fully_funded'] === true) {
                      e_show_update['fully_funded'] = 'Yes';
                    }
                    if(e_show_update['fully_funded'] === false) {
                      e_show_update['fully_funded'] = 'No';
                    }
                  }

                  set_null(e_show_update,'fully_funded', key)

                }


                // Notes regarding full funding
                if(
                  (((e_update_diff||{})[value]||{})['scholarship']||{}).hasOwnProperty('fully_funded_notes') 
                 ){
                  create_array(e_show_update,'fully_funded_notes', order);

                  e_show_update['fully_funded_notes'][key] 
                    = e_update_diff[value]['scholarship'].fully_funded_notes

                  set_null(e_show_update,'fully_funded_notes', key)

                }


                // Scholarship
                if(
                  (((e_update_diff||{})[value]||{})['scholarship']||{}).hasOwnProperty('scholarship_avail') 
                 ){
                  create_array(e_show_update,'scholarship_avail', order);

                  e_show_update['scholarship_avail'][key] 
                    = e_update_diff[value]['scholarship'].scholarship_avail

                  if(e_show_update['scholarship_avail']){
                    if(e_show_update['scholarship_avail'] === true) {
                      e_show_update['scholarship_avail'] = 'Yes';
                    }
                    if(e_show_update['scholarship_avail'] === false) {
                      e_show_update['scholarship_avail'] = 'No';
                    }
                  }

                  set_null(e_show_update,'scholarship_avail', key)

                }


                // Scholarship notes
                if(
                  (((e_update_diff||{})[value]||{})['scholarship']||{}).hasOwnProperty('scholarship_notes') 
                 ){
                  create_array(e_show_update,'scholarship_notes', order);

                  e_show_update['scholarship_notes'][key] 
                    = e_update_diff[value]['scholarship'].scholarship_notes

                  set_null(e_show_update,'scholarship_notes', key)

                }

                // Scholarship url
                if(
                  (((e_update_diff||{})[value]||{})['scholarship']||{}).hasOwnProperty('scholarship_program_specific_url') ||
                  (((e_update_diff||{})[value]||{})['scholarship']||{}).hasOwnProperty('scholarship_general_url')  
                 ){

                  create_array(e_show_update,'scholarship_url', order);
                  var scholarship_url_scholarship_program_specific_url = (((e_update_diff||{})[value]||{})['scholarship']||{}).scholarship_program_specific_url
                  var scholarship_url_scholarship_general_url = (((e_update_diff||{})[value]||{})['scholarship']||{}).scholarship_general_url 

                  e_show_update['scholarship_url'][key] 
                  = (scholarship_url_scholarship_program_specific_url ? e_update_diff[value]['scholarship'].scholarship_program_specific_url : e_raw[key]['scholarship'].scholarship_program_specific_url)
                    ? (scholarship_url_scholarship_program_specific_url ? e_update_diff[value]['scholarship'].scholarship_program_specific_url : e_raw[key]['scholarship'].scholarship_program_specific_url)
                    : (scholarship_url_scholarship_general_url ? e_update_diff[value]['scholarship'].scholarship_general_url : e_raw[key]['scholarship'].scholarship_general_url)


                  set_null(e_show_update,'scholarship_url', key)

                }

                


                console.log("key="+key+" "+"value = "+value)
                
            });



            console.log("e_show_update = "+JSON.stringify(e_show_update));


      return e_show_update;

    };


    var create_array = function(e_show_update, name, order) {

      if(!e_show_update[name]){
          e_show_update[name] = [];
          for(var i=0; i<order.length; i++){
            e_show_update[name].push(null);
          }
      }
      console.log('create_array=' + name + ' ' +JSON.stringify(e_show_update));

    }

    var set_null = function(e_show_update, name, key){
      if(!e_show_update[name][key]){
        e_show_update[name][key] = "N/A";
      }
    }


    return {
      updateEnhancement : updateEnhancement,

    };

  });
