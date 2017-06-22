from django.conf.urls import url

from .views import UniversitySchoolListAPI, ReleaseReportAPI, ReleaseReportListAPI, ReleaseReportCreateAPI

urlpatterns = [

    # api
    url(r'^schools$', UniversitySchoolListAPI.as_view(), name="schools"),
    url(r'^release_reports$', ReleaseReportListAPI.as_view(), name="release_reports"),
    url(r'^release_report/(?P<object_id>[0-9a-fA-F\-]+)$', ReleaseReportAPI.as_view(), name="release_report"),
    url(r'^release_report$', ReleaseReportCreateAPI.as_view(), name="create_release_report"),

]

