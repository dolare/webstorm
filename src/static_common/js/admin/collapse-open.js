(function($) {
    $(document).ready(function() {
        $('fieldset.collapse.open').each(function(index) {
            var fs = $(this);
            $(".collapse-toggle", fs).eq(0).click();
        });
    });
})(django.jQuery);
