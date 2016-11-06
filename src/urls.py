
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

from adminplus.sites import AdminSitePlus

# adminplus monkey patch admin page
admin.site = AdminSitePlus()
admin.sites.site = admin.site
admin.autodiscover()

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name="index.html")),

    #upgrid API
    url(r'^_nested_admin/',include('nested_admin.urls')),
    url(r'^',include('apps.upgrid.urls', namespace = 'upgrid'),),

    url(r'^upgrid-admin/', include(admin.site.urls)),
]

# Override Django admin page template header and title
admin.site.site_header = 'Upgrid Management'
admin.site.site_title = 'Upgrid'
