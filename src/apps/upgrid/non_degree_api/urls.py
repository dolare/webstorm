from django.conf.urls import url

from .views import UniversitySchoolListAPI, ReportAPI, ReportCreateListAPI, ReportOverview, ReportOverviewLatest

urlpatterns = [

    # api
    url(r'^schools$', UniversitySchoolListAPI.as_view(), name="schools"),
    url(r'^reports$', ReportCreateListAPI.as_view(), name="reports"),
    url(r'^reports/(?P<object_id>[0-9a-fA-F\-]+)$', ReportAPI.as_view(), name="report"),
    url(r'^reports/overview/(?P<new_report_id>[0-9a-fA-F\-]+)/(?P<old_report_id>[0-9a-fA-F\-]+)$',
        ReportOverview.as_view(), name="report_overview"),
    url(r'^reports/overview/latest/(?P<school_id>[0-9a-fA-F\-]+)$',
        ReportOverviewLatest.as_view(), name="report_overview_latest"),
]

