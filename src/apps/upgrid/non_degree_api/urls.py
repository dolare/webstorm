from django.conf.urls import url

from .views import UniversitySchoolListAPI, UniversitySchoolDetailAPI, ReportAPI, ReportCreateListAPI, ReportOverview, \
    ReportOverviewLatest, SharedReportCreateAPI, SharedReportAPI

urlpatterns = [

    # api
    url(r'^schools$', UniversitySchoolListAPI.as_view(), name="schools"),
    url(r'^schools/(?P<object_id>[0-9a-fA-F\-]+)$', UniversitySchoolDetailAPI.as_view(), name="school_detail"),
    url(r'^reports$', ReportCreateListAPI.as_view(), name="reports"),
    url(r'^reports/(?P<object_id>[0-9a-fA-F\-]+)$', ReportAPI.as_view(), name="report"),
    url(r'^reports/overview/(?P<new_report_id>[0-9a-fA-F\-]+)/(?P<old_report_id>[0-9a-fA-F\-]+)$',
        ReportOverview.as_view(), name="report_overview"),
    url(r'^reports/overview/latest/(?P<school_id>[0-9a-fA-F\-]+)$',
        ReportOverviewLatest.as_view(), name="report_overview_latest"),
    url(r'^shared_reports$', SharedReportCreateAPI.as_view(), name="create_shared_report"),
    url(r'^shared_reports/(?P<object_id>[0-9a-fA-F\-]+)/(?P<access_token>[0-9a-fA-F\-]+)$',
        SharedReportAPI.as_view(), name="shared_report"),
]

