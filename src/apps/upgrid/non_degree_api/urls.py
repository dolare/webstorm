from django.conf.urls import url

from .views import UniversitySchoolListAPI, ReleaseReportAPI, ReleaseReportListAPI, ReleaseReportCreateAPI, \
    ReportOverview

urlpatterns = [

    # api
    url(r'^schools$', UniversitySchoolListAPI.as_view(), name="schools"),
    url(r'^release_reports$', ReleaseReportListAPI.as_view(), name="release_reports"),
    url(r'^release_report/(?P<object_id>[0-9a-fA-F\-]+)$', ReleaseReportAPI.as_view(), name="release_report"),
    url(r'^release_report$', ReleaseReportCreateAPI.as_view(), name="create_release_report"),
    url(r'^release_report/over_view/(?P<new_report_id>[0-9a-fA-F\-]+)/(?P<old_report_id>[0-9a-fA-F\-]+)$',
        ReportOverview.as_view(), name="release_report_overview"),

]

