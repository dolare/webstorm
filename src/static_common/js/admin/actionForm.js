$(document).ready(function(){
    // changing form input's background color when content is not empty

    $("#change_form input, #change_form select, #change_form textarea").blur(function(){
	    if( $(this).val() ) {
	        $(this).css("background-color", "skyblue");
	    } else{
	    	$(this).css("background-color", "white");
	    }
	});

    $("#id_toefl_twe, #id_toefl_tse, #id_intl_ielts_reqs, #id_gpa_minimum, #id_gpa_average, #id_gpa_suggested").blur(function(){
    	var x = Number($(this).val());
	    if( x != "" && x >= 10) {
	    	alert("Ensure that there are no more than 1 digit before the decimal point.");
	        $(this).val("");
	        $(this).css("background-color", "white");
	    }
	});

});