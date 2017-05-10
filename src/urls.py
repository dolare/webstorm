
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

from adminplus.sites import AdminSitePlus
# from rest_framework_swagger.views import get_swagger_view

# adminplus monkey patch admin page
admin.site = AdminSitePlus()
admin.sites.site = admin.site
admin.autodiscover()

# schema_view = get_swagger_view(title='ProjectX API')

urlpatterns = [
    # upgrid API
    # url(r'^_nested_admin/',include('nested_admin.urls')),
    url(r'^', include('apps.upgrid.urls', namespace='upgrid'),),
    url(r'^upgrid-admin/', include(admin.site.urls)),

    # documentation
    # url(r'^api/docs/', schema_view),
]

# Override Django admin page template header and title
admin.site.site_header = 'Upgrid Management'
admin.site.site_title = 'Upgrid'
