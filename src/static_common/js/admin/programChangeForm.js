(function($) {
    $(document).ready(function() {
        // for hiding and showing navigation
        $("#nav_hide").click(function(){
            var status = $(this);
            if (status.text() == "Hide"){
                status.text("Show");
                status.next().css("display","none");
            } else{
                status.text("Hide");
                status.next().css("display","block");
            }
        });

        // for hiding and showing transcript_type
        if($("#id_requirement-0-transcript_for_application").val() != "Y"){
            $(".field-transcript_type").hide();
        }
        $("#id_requirement-0-transcript_for_application").change(function(){
            var transcript = $(this);
            if (transcript.val() == "Y"){
                $(".field-transcript_type").show();
            } else{
                $(".field-transcript_type").hide();
            }
        });

        // part time auto change
        $("#id_duration-0-full_part_time").change(function(){
            if ($(this).val() == "P"){
                $("#id_duration-0-part_time").val('2');
                $("#id_duration-0-part_time").prop( "disabled", true );
            } else{
                $("#id_duration-0-part_time").prop( "disabled", false );
            }
        });

        // open url in new tab
        $(".url > a").attr("target","_blank");

    });
        
})(django.jQuery);
