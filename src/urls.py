
from django.conf.urls import include, url
from django.contrib import admin

from adminplus.sites import AdminSitePlus

# adminplus monkey patch admin page
admin.site = AdminSitePlus()
admin.sites.site = admin.site
admin.autodiscover()


urlpatterns = [
    # upgrid API
    url(r'^', include('apps.upgrid.urls', namespace='upgrid'),),
    url(r'^upgrid-admin/', include(admin.site.urls)),

    # documentation
    url(r'^api/docs/', include('rest_framework_docs.urls')),
]

# Override Django admin page template header and title
admin.site.site_header = 'Upgrid Management'
admin.site.site_title = 'Upgrid'
