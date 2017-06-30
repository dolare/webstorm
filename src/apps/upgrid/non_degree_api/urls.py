from django.conf.urls import url

from .views import UniversitySchoolListAPI, ReleaseReportAPI, ReleaseReportCreateListAPI, ReportOverview

urlpatterns = [

    # api
    url(r'^schools$', UniversitySchoolListAPI.as_view(), name="schools"),
    url(r'^release_reports$', ReleaseReportCreateListAPI.as_view(), name="release_reports"),
    url(r'^release_reports/(?P<object_id>[0-9a-fA-F\-]+)$', ReleaseReportAPI.as_view(), name="release_report"),
    url(r'^release_reports/over_view/(?P<new_report_id>[0-9a-fA-F\-]+)/(?P<old_report_id>[0-9a-fA-F\-]+)$',
        ReportOverview.as_view(), name="release_report_overview"),

]

