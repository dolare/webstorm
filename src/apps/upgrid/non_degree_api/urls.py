from django.conf.urls import url

from .views import UniversitySchoolListAPI, UniversitySchoolDetailAPI, ReportAPI, ReportCreateListAPI, ReportOverview, \
    ReportOverviewLatest, SharedReportCreateAPI, SharedReportAPI, CourseURLListAPI, AMPReportListAPI, \
    AMPReportDetailAPI, UniversitySchoolClientAPI, UniversitySchoolCategoryAPI, UniversitySchoolCategoryCourseAPI, \
    NonDegreeWhoopsReportListAPI, NonDegreeWhoopsReportUpdateAPI, UniversitySchoolCourseAPI, CategoryAPI, CourseAPI, \
    CourseCountAPI

from .api_send_email import SendNotification, PreviewNotification, SendEmailHistory
urlpatterns = [

    # send email
    url(r'^send_notification$', SendNotification.as_view(), name="notification"),
    url(r'^preview_notification$', PreviewNotification.as_view(), name="schools"),
    url(r'^sent_email_history$', SendEmailHistory.as_view(), name="schools"),

    # api
    url(r'^schools$', UniversitySchoolListAPI.as_view(), name="schools"),
    url(r'^schools/(?P<object_id>[0-9a-fA-F\-]+)$', UniversitySchoolDetailAPI.as_view(), name="school_detail"),
    url(r'^schools/(?P<object_id>[0-9a-fA-F\-]+)/clients$', UniversitySchoolClientAPI.as_view(), name="school_client"),
    url(r'^schools/(?P<school_id>[0-9a-fA-F\-]+)/categories$', UniversitySchoolCategoryAPI.as_view(),
        name="school_categories"),
    url(r'^schools/(?P<school_id>[0-9a-fA-F\-]+)/categories/(?P<category_id>[0-9a-fA-F\-]+)/courses$',
        UniversitySchoolCategoryCourseAPI.as_view(), name="school_category_courses"),
    url(r'^reports$', ReportCreateListAPI.as_view(), name="reports"),
    url(r'^reports/(?P<object_id>[0-9a-fA-F\-]+)$', ReportAPI.as_view(), name="report"),
    url(r'^reports/overview/(?P<new_report_id>[0-9a-fA-F\-]+)/(?P<old_report_id>[0-9a-fA-F\-]+)$',
        ReportOverview.as_view(), name="report_overview"),
    url(r'^reports/overview/latest/(?P<school_id>[0-9a-fA-F\-]+)$',
        ReportOverviewLatest.as_view(), name="report_overview_latest"),
    url(r'^shared_reports$', SharedReportCreateAPI.as_view(), name="create_shared_report"),
    url(r'^shared_reports/(?P<object_id>[0-9a-fA-F\-]+)/(?P<access_token>[0-9a-fA-F\-]+)$',
        SharedReportAPI.as_view(), name="shared_report"),

    url(r'^schools/(?P<school_id>[0-9a-fA-F\-]+)/courses$', UniversitySchoolCourseAPI.as_view(), name="school_courses"),
    url(r'^schools/(?P<school_id>[0-9a-fA-F\-]+)/courses/(?P<course_id>[0-9a-fA-F\-]+)/urls$',
        CourseURLListAPI.as_view(), name="school_course_urls"),
    url(r'^schools/(?P<school_id>[0-9a-fA-F\-]+)/courses/(?P<course_id>[0-9a-fA-F\-]+)/urls/'
        r'(?P<url_id>[0-9a-fA-F\-]+)/amp_reports$', AMPReportListAPI.as_view(), name="amp_reports"),
    url(r'^schools/(?P<school_id>[0-9a-fA-F\-]+)/courses/(?P<course_id>[0-9a-fA-F\-]+)/urls/'
        r'(?P<url_id>[0-9a-fA-F\-]+)/amp_reports/(?P<object_id>[0-9a-fA-F\-]+)$', AMPReportDetailAPI.as_view(),
        name="amp_report_detail"),
    url(r'^whoops_reports$', NonDegreeWhoopsReportListAPI.as_view(), name="whoops_reports"),
    url(r'^whoops_reports/(?P<object_id>[0-9a-fA-F\-]+)$', NonDegreeWhoopsReportUpdateAPI.as_view(),
        name="whoops_report"),
    url(r'^categories$', CategoryAPI.as_view(), name="categories"),
    url(r'^courses$', CourseAPI.as_view(), name="courses"),
    url(r'^courses/count$', CourseCountAPI.as_view(), name="courses_count"),
]

