django.jQuery(document).ready(function(){
    // add toggle class and hide by default
    django.jQuery(".inline-group").each(function(index){
        var masterDiv = django.jQuery(this)
        django.jQuery('h2', masterDiv).eq(0).append(" (<a class=\"collapse-toggle\" href=\"#\">Show</a>)");
        var div = django.jQuery("div", masterDiv).eq(0)
        div.hide()
    });

    django.jQuery(".collapse-toggle").click(function(e) {
        var masterDiv = django.jQuery(this).parent().parent()
        var div = django.jQuery("div", masterDiv).eq(0)
        div.slideToggle('fast');
        var text = django.jQuery(this).html();
        if (text=='Show') {
            django.jQuery(this).html('Collapse');
            }
        else {
            django.jQuery(this).html('Show');
        };
        e.preventDefault();
    });
});