
angular.module('myApp').controller('xdf',
    function($scope) {
    	 
      //for exec mockup page
      $scope.school_list = [
       {
        "name": "Wharton School of the University of Pennsylvania",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 7,
        "ranking_type": true 
      },
      {
        "name": "New York University: Stern School of Business",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 1,
        "ranking_type": false
      },
     {
        "name": "Fordham University: Gabelli School of Business",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 4,
        "ranking_type": false
      },

      {
        "name": "Columbia University Business School",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 3,
        "ranking_type": false 
      },

     

      {
        "name": "MIT: Sloan School of Management",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 5,
        "ranking_type": false 
      },


      {
        "name": "Yale: School of Management",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 9,
        "ranking_type": false 
      },

      {
        "name": "London Business School",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 6,
        "ranking_type": true 
      },

      {
        "name": "Chicago: Booth School of Business",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 7,
        "ranking_type": false 
      },

      {
        "name": "Harvard Business School",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 1,
        "ranking_type": true 
      },

      {
        "name": "Stanford Graduate School of Business",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 10,
        "ranking_type": false 
      },

      {
        "name": "UC-Berkeley: Haas School of Business",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 2,
        "ranking_type": true 
      },

      {
        "name": "INSEAD",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 3,
        "ranking_type": true 
      },

      {
        "name": "Northwestern: Kellogg School of Management",
        "report_date": "2017-07-17T21:29:32.524895Z",
        "ranking": 5,
        "ranking_type": true 
      },

      
      

      ]

    	$scope.school1 = {
    		"SSAT_code": "5758",
    		"ISEE_code": "220030",
    		"TOEFL_code": "8127",
    		"SAT_code": "0156",

    		"school_name": "Phillips Academy Andover",
    		"address": "180 Main Street",
    		"address_plus": "Andover, MA, 01810",
    		"website": "http://www.andover.edu/Pages/default.aspx",
    		"establish_year": 1778,
    		"campus_size": "500 acres",
    		"student_body": "Co-ed",
    		"grades": "9-12",
    		"pg": "Y",
    		"associations": [
    		{
    			"name": "NAIS",
    			"description": "National Association of Independent Schools",
    		},
    		

    		],

    		"school_facilities": "R.S. Peabody Museum of Archaeology, Academic Skills Center, Addison Gallery of American Art",
    		"school_facilities_url": "http://www.andover.edu/About/Pages/FastFacts.aspx",
    		"school_features": "The school’s residential structure enables faculty to support students in their personal, social and intellectual development.",
    		"religion_affiliation": {
    			"text": "N/A",
    			"url": "N/A"
    		},
    		"dress_code": "N",
    		"student_club": "http://www.andover.edu/StudentLife/StudentActivities/ClubsandOrganizations/Pages/default.aspx",
    		"special_programs": ["Outreach Programs", "Andover Bread Loaf Writing Workshop", "Institute for Recruitment of Teachers","(MS)^2: Math & Science for Minority Students", "PALS Program"],
    		"special_programs_url": "http://www.andover.edu/SummerSessionOutreach/SummerSession/Pages/default.aspx",
    		"ESL": "Y",
    		"AP": "Y",
    		"summer_programs": "Y",
    		"student_number": 1150,
    		"resident_student_ratio": 73,
    		"international_student_ratio": 9,
    		"student_of_color": 46,
    		"class_size": 13,
    		"teacher_student_ratio": "1:5",
    		"teachers_advanced": 83,
    		"sat_avg_1600": {
    			"reading_writing": "690",
    			"math": "710",
    			"total": "1,400"
    		},
    		"sat_avg_2400": {
    			"reading": "704",
    			"math": "715",
    			"writing":"699",
    			"total": "2,118"
    		},
    		"sat_scale": "N/A",
    		"college_matriculation": "Carnegie Mellon, Yale University, Princeton",
    		"college_matriculation_url": "http://www.andover.edu/About/Pages/FastFacts.aspx",
    		"deadline_day": "Jan-15",
    		"deadline_boarding": "Feb-1",
    		"toefl": "Y",
    		"entrance_exam": [
    			[{"name": true}, {"name": true}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
    			[{"name": true}, {"name": true}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
    			[{"name": true}, {"name": true}, {"name": false}, {"name": true}, {"name": true}, {"name": true}],
    			[{"name": false}, {"name": false}, {"name": false}, {"name": true}, {"name": true}, {"name": true}],
    			[{"name": false}, {"name": false}, {"name": false}, {"name": true}, {"name": true}, {"name": true}],
    		],	


    		"add_adhd": "Y",
    		"on_campus_interview":"https://goblue.andover.edu/",
    		"third_party": "N/A",
    		"visit_china": "N/A",
    		"visit_china_url": "N/A",
    		"admission_phone":  "978-749-4050",
    		"admission_email": "admissions@andover.edu",
    		"admission_contacts": [
    		{"name": "Jim Ventre",
				"title": "Dean of Admission",
				"email": "skennedy@andover.edu",
				"phone": "N/A",
				"note": "N/A",

				},{

				"name": "Jill B. Thompson",
				"title": "Director of Admission",
				"email": "jthompson@andover.edu",
				"phone": "N/A",
				"note": "N/A",
				},
				{
				"name": "Kevin E. Graber",
				"title": "Senior Associate Director of Admission",
				"email": "kgraber@andover.edu",
				"phone": "N/A",
				"note": "N/A",
				},
				{
				"name": "Peter N. Dignard",
				"title": "Associate Director of Admission",
				"email": "pdignard@andover.edu",
				"phone": "N/A",
				"note": "N/A",
				},{

				"name": "Terrell L. Ivory",
				"title": "Assistant Director of Admission",
				"email": "tivory@andover.edu",
				"phone": "N/A",
				"note": "N/A",
				},
				{
				"name": "Natalie A. Wombwell",
				"title": "Associate Director of Admission",
				"email": "nwombwell@andover.edu",
				"phone": "N/A",
				"note": "N/A",
				},
				{

				"name": "Emilyn Sosa",
				"title": "Assistant Director of Admission and Coordinator of Diversity Outreach",
				"email": "esosa@andover.edu",
				"phone": "N/A",
				"note": "N/A",
				},
				{
				"name": "Kassie M. Archambault",
				"title": "Admission Officer",
				"email": "karchambault@andover.edu",
				"phone": "N/A",
				"note": "N/A",
				},
				{
				"name": "Susan Howell",
				"title": "Admission Associate",
				"email": "showell@andover.edu",
				"phone": "N/A",
				"note": "N/A",

				}
    		

    		] ,

    		"application_system": "Gateway",
    		"application_system_url": "https://enews.andover.edu/admission/howtoapply/",
    		"international_student_tuition": {
    			"Boarding student tuition": 52100,
    			"Day student tuition": 40500

    		},
    		"visit_contact": {
    			"Phone": "978-749-4000",
    			"Email":  "N/A",
    			"Link": "https://goblue.andover.edu/",

    		},

    		"visit_contact_extra": {
    		
    				"name": "Pat MacKinnon",
					"title": " Visit Coordinator",
					"email": "pmackinnon@lawrenceville.org",
					"phone": "N/A",
					"note": "N/A",
    		
    		},
    		"application_fee": 70,


    	}



    	setTimeout(function(){jQuery('.chart1').data('easyPieChart').update($scope.school1.resident_student_ratio);}, 100);
    	setTimeout(function(){jQuery('.chart2').data('easyPieChart').update($scope.school1.international_student_ratio);}, 100);
    	setTimeout(function(){jQuery('.chart3').data('easyPieChart').update($scope.school1.student_of_color);}, 100);
    	setTimeout(function(){jQuery('.chart4').data('easyPieChart').update($scope.school1.teachers_advanced);}, 100);
    	
});







angular.module('myApp').controller('xdf_2',
    function($scope) {
    	
    	$scope.school1 = {    
    	 "SSAT_code": "4564",       
    	"ISEE_code": "310680",       
    	"TOEFL_code": "9153",       
    	"SAT_code": "N/A",        
    	"school_name": "The Lawrenceville School",       
    	"address": "2500 Main Street",  
    	"address_plus": "Lawrenceville, NJ, 08648",
		"website": "https://www.lawrenceville.org",       
		"establish_year": 1810,       
		"campus_size": "700 acres",       
		"student_body": "Co-ed",       
		"grades": "9-12",       
		"pg": "Y",       
		"associations": [      
		{        
			"name": "NAIS",        
			"description": "National Association of Independent Schools",       
		},        ],        
		"school_facilities": " Indoor Track, International Squash Court, Golf Course, Tennis Courts ",
		"school_facilities_url":"https://lawrenceville.myschoolapp.com/ftpimages/928/download/download_1945408.pdf",  
		"school_features": "What's it like being a student at Lawrenceville?  It means a schedule packed full of classes,  study hours, athletic practice, rehearsals,  and time for friends, special events, eating, and sleeping.  Students learn to manage their time,  meet their commitments, and enjoy their friendships.",       
		"religion_affiliation": {        
			"text": "N/A",        
			"url": "N/A"       
		},       
		"dress_code": "N",       
		"student_club": "https://www.lawrenceville.org/page/campus-life/clubs-and-organizations",       
		"special_programs": ["Ropes Course", "Outing Club", "Outdoor Leadership","Extended Wilderness Expedition"],
		"special_programs_url": "https://www.lawrenceville.org/page/academics/experiential-education/outdoor-program",       
		"ESL": "N",       
		"AP": "N/A",       
		"summer_programs": "Y",       
		"student_number": 822,       
		"resident_student_ratio": 69,       
		"international_student_ratio": "N/A",       
		"student_of_color": 45,       
		"class_size": 12,       
		"teacher_student_ratio": "1:8",       
		"teachers_advanced": 78,       
		"sat_avg_1600": {        
			"reading_writing": "N/A",        
			"math": "N/A",        
			"total": "N/A"       
		},       
		"sat_avg_2400": 
		{        
			"reading": "700",        
			"math": "700",        
			"writing":"700",        
			"total": "2,100"       
		},       
		"sat_scale": "N/A",       
		"college_matriculation": "Princeton University, Georgetown University, New York University, Columbia University, Yale University",
		"college_matriculation_url": "https://lawrenceville.myschoolapp.com/ftpimages/928/download/download_1945408.pdf",       
		"deadline_day": "Jan-15",       
		"deadline_boarding": "Jan-15",       
		"toefl": "Y",       
		"entrance_exam": 
		[
    			
	[{"name": true}, {"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
    [{"name": true}, {"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
    [{"name": true}, {"name": false}, {"name": false}, {"name": true}, {"name": true}, {"name": true}],
    [{"name": false}, {"name": false}, {"name": false}, {"name": true}, {"name": true}, {"name": true}],
    [{"name": false}, {"name": false}, {"name": false}, {"name": true}, {"name": true}, {"name": true}],
 ],	       
 "add_adhd": "N/A",       
 "on_campus_interview":"https://www.lawrenceville.org/page/admission/application-process",       
 "third_party": "Y",       
 "visit_china": "N/A ",       
 "visit_china_url": "N/A",       
 "admission_phone":  "800-735-2030 , 609-895-2030",       
 "admission_email": "admission@lawrenceville.org",    
 "application_system_url": "https://www.lawrenceville.org/page/admission/application-process",   
 "admission_contacts": [       
 {        
 	"name": "William Richardson",        
 	"title": " Dean of Admission",        
 	"email": "wrichardson@lawrenceville.org",        
 	"phone": "N/A",        
 	"note": "N/A",       
 },       
 {        "name": "Meghan Donaldson",        "title": "Admission Interviewer",        "email": "mhdonaldson@lawrenceville.org",        "phone": "N/A",        "note": "N/A",       },       {        "name": "Cindy Ehret",        "title": "Admission Interviewer",        "email": "cehret@lawrenceville.org",        "phone": "N/A",        "note": "N/A",       },       {        "name": "Lisa Ewanchyna",        "title": " Senior Associate Dean of Admission for Recruitment",        "email": "lewanchyna@lawrenceville.org",        "phone": "N/A",        "note": "N/A",       },       {        "name": "Harry Flaherty",        "title": "Admission Interviewer; History Master",        "email": "hflaherty@lawrenceville.org",        "phone": "N/A",        "note": "N/A",       },        {        "name": "Vanessa Gieske",        "title": "Associate Dean of Admission",        "email": "vgieske@lawrenceville.org",        "phone": "N/A",        "note": "N/A",       },        {        "name": "Tracey Hazelton-Werts",        "title": "Assistant to Dean of Admission",        "email": "thazeltonwerts@lawrenceville.org",        "phone": "N/A",        "note": "N/A",       },        {        "name": "Tran Kim-Senior",        "title": "Associate Dean of Admission; Coordinator of Intercultural Programs",        "email": "tkim-senior@lawrenceville.org",        "phone": "N/A",        "note": "N/A",       },        {        "name": "Kevin Lawrence",        "title": "Associate Dean of Admission",        "email": "klawrence@lawrenceville.org",        "phone": "N/A",        "note": "N/A",       },        {        "name": " Vicky Martinez ",        "title": " ssociate Dean of Admission; Assistant Director of Multicultural Affairs ",        "email": " vmartinez@lawrenceville.org ",        "phone": "N/A",        "note": "N/A",       },        {        "name": " Grace Megaffin ",        "title": " Associate Dean of Admission ",        "email": " gmegaffin@lawrenceville.org ",        "phone": "N/A",        "note": "N/A",       },         ] ,        "application_fee": 100    ,   "application_system": "School's system or SAO (SSAT Standard Application Online)",       "international_student_tuition": {        "boarding_student_tuition": 62190,        "day_student_tuition": 51440        },       "visit_contact": {        "tel": "(800) 735-2030 / (609) 895-2030",        "email":  "admission@lawrenceville.org",        "url": "https://www.lawrenceville.org/page/admission/visit",       }        
}




    	setTimeout(function(){jQuery('.chart1').data('easyPieChart').update($scope.school1.resident_student_ratio);}, 100);
    	setTimeout(function(){jQuery('.chart2').data('easyPieChart').update($scope.school1.international_student_ratio);}, 100);
    	setTimeout(function(){jQuery('.chart3').data('easyPieChart').update($scope.school1.student_of_color);}, 100);
    	setTimeout(function(){jQuery('.chart4').data('easyPieChart').update($scope.school1.teachers_advanced);}, 100);
    	
});




angular.module('myApp').controller('xdf_3',
    function($scope) {
    	
    	$scope.school1 = {
      "SSAT_code": "7648",
      "ISEE_code": "052265",
      "TOEFL_code": "6955",
      "SAT_code": "N/A",

      "school_name": "The Thacher School",
      "address": "5025 Thacher Road",
      "address_plus": "Ojai, CA, 93023",
      "website": "https://www.thacher.org/Page/Explore",
      "establish_year": 1889,
      "campus_size": "400 acres",
      "student_body": "Co-ed",
      "grades": "9-12",
      "pg": "N",
      "associations": [
      {
       "name": "NAIS",
		"description": "National Association of Independent Schools"},
			{"name": "TABS",
       "description": "The Association of Boarding Schools"},
      ],

      "school_facilities": "N/A",
      "school_facilities_url": "N/A",
      "school_features": "Thacher gives all its students the most precious of gifts: the opportunity to discover not only who they are, but, more importantly, what they can become as they move from challenge to achievement to personal fulfillment. They are surrounded by a motivated peer group and adults who know them and care deeply for them; they are held to high standards out of this concern for their growth.",
      "religion_affiliation": {
       "text": "N/A",
       "url": "N/A"
      },
      "dress_code": "N",
      "student_club": "https://www.thacher.org/page/Community/Beyond-the-Classroom/Clubs--Organizations",
      "special_programs": ["Horse Programs", "Outdoor Program", "Athletics Program","Arts Program", "Off-Campus Study"],
      "special_programs_url": "https://www.thacher.org/page/programs",
      "ESL": "N",
      "AP": "N/A",
      "summer_programs": "N",
      "student_number": 242,
      "resident_student_ratio": 93,
      "international_student_ratio": 12,
      "student_of_color": 41,
      "class_size": 11,
      "teacher_student_ratio": "1:6",
      "teachers_advanced": 80,
      "sat_avg_1600": {

      	"reading_writing": "N/A",
    			"math": "N/A",
    			"total": "N/A"
       
      },
      "sat_avg_2400": {
       "reading": "From 650 to 740",
       "math": "From 640 to 730",
       "writing":"From 640 to 750",
       "total": "From 1930 to 2220"
      },
      "sat_scale": "N/A",
      "application_system_url": "https://www.thacher.org/page/admission/applying",
      "college_matriculation": "Stanford University, New York University, Colorado College, University of Southern California",
      "college_matriculation_url": "https://www.thacher.org/page/Academics/College-Counseling/Where-Thacher-Students-Go-to-College",
      "deadline_day": "Jan-15",
      "deadline_boarding": "Jan-15",
      "toefl": "Y",
      "entrance_exam": [
       [{"name": true}, {"name": true}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
       [{"name": true}, {"name": true}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
       [{"name": false}, {"name": false}, {"name": false}, {"name": true}, {"name": false}, {"name": false}],
       [{"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
       [{"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
      ], 


      "add_adhd": "N/A",
      "on_campus_interview": "N/A",
      "third_party": "Y",
      "visit_china": "Nov 11 Beijing, Nov 13 Shanghai, 2016",
      "visit_china_url": " https://www.thacher.org/page/Admission/On-the-Road",
      "admission_phone":  "N/A",
      "admission_email": " admission@thacher.org",
      "admission_contacts": [
      {"name": "Tim Sullivan",
    "title": "Associate Director of Admission ",
    "email": "tsullivan@thacher.org",
    "phone": "805-640-3201 x233",
    "note": "N/A",

    },{

    "name": "Kim Bastian",
    "title": "Sr. Associate Director of Admission, Director of Financial Aid, Director of Multicultural Outreach",
    "email": "kbastian@thacher.org",
    "phone": "805-640-3201 x231",
    "note": "N/A",
    },
    {
    "name": "Yung Roman",
    "title": "Admission Office Manager",
    "email": "yroman@thacher.org",
    "phone": "805-640-3201 x232",
    "note": "N/A",
    },
    {
    "name": "Megan Carney",
    "title": "Associate Director of Admission; Dorm Head: Casa",
    "email": "mcarney@thacher.org",
    "phone": "N/A",
    "note": "N/A",
    },{

    "name": "Christopher Thomas",
    "title": "Assistant Director of Admission",
    "email": "cthomas@thacher.org",
    "phone": "805-640-3201 x252",
    "note": "N/A",
    },
    
      ] ,

      "application_system": "Gateway",
      "international_student_tuition": {
       "Boarding student tuition": 57200,
       "Day student tuition": 38650

      },
      "visit_contact": {
       "Phone": "805-640-3210",
       "Email":  "admission@thacher.org",
       "Link": "https://www.thacher.org/page/admission/visiting",
      },
      "application_fee": 125


     }


    	setTimeout(function(){jQuery('.chart1').data('easyPieChart').update($scope.school1.resident_student_ratio);}, 100);
    	setTimeout(function(){jQuery('.chart2').data('easyPieChart').update($scope.school1.international_student_ratio);}, 100);
    	setTimeout(function(){jQuery('.chart3').data('easyPieChart').update($scope.school1.student_of_color);}, 100);
    	setTimeout(function(){jQuery('.chart4').data('easyPieChart').update($scope.school1.teachers_advanced);}, 100);
    	
});



angular.module('myApp').controller('xdf_4',
    function($scope) {
    	
    	$scope.school1 = {
      "SSAT_code": "N/A",
      "ISEE_code": "N/A",
      "TOEFL_code": "6425",
      "SAT_code": "N/A",
      "school_name": "Ross School",
      "address": "18 Goodfriend Drive",
      "address_plus" :"Bridgehampton, NY, 11932",
      "website": "http://www.ross.org/default.aspx ",
      "establish_year": 1991,
      "campus_size": "N/A",
      "student_body": "Co-ed",
      "grades": "PK-12",
      "pg": "Y",
      "associations": [
     {
       "name": "NAIS",
       "description": "National Association of Independent Schools",
      },
      ],
      "school_facilities": " Tennis Center, Ross Café, Large Screen Entertainment System",
      "school_facilities_url": "http://www.ross.org/tennisacademy/facilities",
      "school_features": "Ross Upper School inhabits a unique set of spaces that reflect an unparalleled educational and aesthetic standard.",
      "religion_affiliation": {
       "text": "N/A",
       "url": "N/A"
      },
      "dress_code": "N/A",
      "student_club": "N/A",
      "special_programs": ["Field Academy", "Green Initiatives", "Athletics Program ","Tennis Academy","Innovation Lab","World Travel Academy","Ross Teacher Academy"],
      "special_programs_url": "http://www.ross.org/programs",

      "ESL": "Y",
      "AP": "N/A",
      "summer_programs": "Y",
      "student_number": 486,
      "resident_student_ratio": "N/A",
      "international_student_ratio": "N/A",
      "student_of_color": "N/A",
      "class_size": "N/A",
      "teacher_student_ratio": "1:8",
      "teachers_advanced": "N/A",
      "sat_avg_1600": {
       "reading_writing": "N/A",
       "math": "N/A",
       "total": "N/A"
      },
      "sat_avg_2400": {
       "reading": "N/A",
       "math": " N/A ",
       "writing":" N/A ",
       "total": " N/A "
      },
      "sat_scale": "N/A",
      "college_matriculation": "Berklee College of Music, New York University, University of California, Berkeley", 
      "college_matriculation_url": "http://publish.ross.org/admissions/Ross_College_Acceptances_2016.pdf",
      "deadline_day": "Feb-1",
      "deadline_boarding": "Feb-1",
      "toefl": "Y",
      "entrance_exam": [
       [{"name": true}, {"name": true}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
       [{"name": true}, {"name": true}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
       [{"name": false}, {"name": false}, {"name": false}, {"name": true}, {"name": false}, {"name": false}],
       [{"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
       [{"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}, {"name": false}],
      ], 
      "add_adhd": "N/A",
      "on_campus_interview":"N/A",
      "third_party": "N/A",
      "visit_china": "N/A ",       "visit_china_url": "N/A",       "admission_phone":  " 631-907-5400 ",       "admission_email": " admissions@ross.org ",       "admission_contacts": [       {        "name": " Kristin Eberstadt ",        "title": " Executive Director ",        "email": " N/A ",        "phone": " 631-907-5205 ",        "note": "N/A",       },       {        "name": " Kathleen Lattari ",        "title": " Associate Director of Admissions ",        "email": " N/A ",        "phone": " 631-907-5381 ",        "note": "N/A",       },       {        "name": "Jiling Yang ",        "title": " Assistant Director of Admissions ",        "email": " N/A ",        "phone": " 631-907-5228 ",        "note": "N/A",       },       {        "name": " Sasha Skulsky ",        "title": " Admissions Coordinator ",        "email": "N/A",        "phone": "N/A",        "note": "N/A",       },       ] ,        "application_fee": "Y",      "application_system": "School's system or SAO (SSAT Standard Application Online)",       "international_student_tuition": {        "boarding_student_tuition": 73170,        "day_student_tuition": 52980        },       "visit_contact": {        "tel": "631-907-5400 ",        "email":  " visit@ross.org ",        "url": " http://www.ross.org/visit ",       }        }




    	setTimeout(function(){jQuery('.chart1').data('easyPieChart').update($scope.school1.resident_student_ratio);}, 100);
    	setTimeout(function(){jQuery('.chart2').data('easyPieChart').update($scope.school1.international_student_ratio);}, 100);
    	setTimeout(function(){jQuery('.chart3').data('easyPieChart').update($scope.school1.student_of_color);}, 100);
    	setTimeout(function(){jQuery('.chart4').data('easyPieChart').update($scope.school1.teachers_advanced);}, 100);



    	
});