from django.db.models import Q
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveUpdateAPIView, CreateAPIView, DestroyAPIView, \
    RetrieveAPIView, RetrieveDestroyAPIView
from rest_framework.filters import SearchFilter, OrderingFilter, DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT, \
    HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST

from ceeb_program.models import UniversitySchool, NonDegreeCategory, NonDegreeCourse, NonDegreeCourseURL, \
    NonDegreeAMPReport
from webtracking.models import WebPage, WebPageScan

from .serializers import UniversitySchoolListSerializer, ReportCreateSerializer, CategorySerializer, \
    ReportListSerializer, ReportSerializer, UniversitySchoolDetailSerializer, SharedReportSerializer, \
    CourseListSerializer, CourseURLListSerializer, AMPReportListSerializer, AMPReportDetailSerializer
from .pagination import UniversitySchoolPagination, ReportPagination, BasePagination
from .filter import UniversitySchoolFilter, ReportFilter, CourseFilter, CourseURLFilter, AMPReportListFilter
from ..models import UniversityCustomer, UpgridAccountManager, NonDegreeReport, NonDegreeSharedReport


class PermissionMixin(object):
    def is_manager(self):
        manager = UpgridAccountManager.objects.filter(username=self.request.user.username)
        if manager:
            return True
        return False


class UniversitySchoolListAPI(PermissionMixin, ListAPIView):
    """
    Get list of user university school API
    """
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    serializer_class = UniversitySchoolListSerializer
    pagination_class = UniversitySchoolPagination
    filter_class = UniversitySchoolFilter

    search_fields = ('ceeb', 'school', )
    ordering_fields = ('ceeb', 'school', )
    ordering = ('ceeb', 'school', )      # default ordering

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            university_schools = UniversitySchool.objects.all()
        else:
            university_schools = UniversitySchool.objects.filter(non_degree_user=self.request.user)
        return university_schools


class UniversitySchoolDetailAPI(PermissionMixin, RetrieveAPIView):
    """
    Retrieve school detail API
    """
    lookup_field = 'object_id'
    serializer_class = UniversitySchoolDetailSerializer

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            return UniversitySchool.objects.all()
        return UniversitySchool.objects.none()


class ReportCreateListAPI(PermissionMixin, CreateModelMixin, ListAPIView):
    """
    Get list of user non-degree report API
    """
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    pagination_class = ReportPagination
    filter_class = ReportFilter

    search_fields = ('school__school', 'school__ceeb',)
    ordering_fields = ('school', 'date_created')
    ordering = ('school', '-date_created')      # default ordering

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ReportListSerializer
        else:
            return ReportCreateSerializer

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            reports = NonDegreeReport.objects.all()
        else:
            reports = NonDegreeReport.objects \
                .filter(school__non_degree_user=self.request.user)
        return reports

    @staticmethod
    def create_report(request):
        if 'school' not in request.data:
            raise ValidationError("School object_id is required.")
        try:
            school = UniversitySchool.objects.get(object_id=request.data['school'])
        except UniversitySchool.DoesNotExist:
            raise ValidationError("Can not find school with this object_id.")

        categories = NonDegreeCategory.objects.filter(university_school=school).filter(active=True)
        data = JSONRenderer().render(CategorySerializer(categories, many=True).data)
        return data

    def create(self, request, *args, **kwargs):
        if not self.is_manager():
            return Response({"Failed": "Permission Denied!"}, status=HTTP_403_FORBIDDEN)
        request.data['categories'] = self.create_report(request)

        return super(ReportCreateListAPI, self).create(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ReportAPI(PermissionMixin, RetrieveDestroyAPIView):
    """
    Retrieve non-degree Report API
    """
    lookup_field = 'object_id'
    serializer_class = ReportSerializer

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            reports = NonDegreeReport.objects.all()
        else:
            reports = NonDegreeReport.objects \
                .filter(school__non_degree_user=self.request.user)
        return reports


class ReportOverviewMixin(object):
    @staticmethod
    def count_diff(new_report, old_report):
        if old_report is None:
            return {'category_added': 0,
                    'category_removed': 0,
                    'course_added': 0,
                    'course_removed': 0}
        old_report_categories = []
        old_report_courses = []
        category_added = 0
        course_added = 0

        for category in old_report['categories']:
            old_report_categories.append(category['object_id'])
            for course in category['courses']:
                old_report_courses.append(course['object_id'])

        for category in new_report['categories']:
            if category['object_id'] not in old_report_categories:
                category_added += 1
            else:
                old_report_categories.remove(category['object_id'])
            for course in category['courses']:
                if course['object_id'] not in old_report_courses:
                    course_added += 1
                else:
                    old_report_courses.remove(course['object_id'])

        return {'category_added': category_added,
                'category_removed': len(old_report_categories),
                'course_added': course_added,
                'course_removed': len(old_report_courses)}


class ReportOverview(PermissionMixin, ReportOverviewMixin, APIView):
    """
    Get report overview: category_added, category_removed, course_added, course_removed
    """

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            reports = NonDegreeReport.objects.all()
        else:
            reports = NonDegreeReport.objects \
                .filter(school__non_degree_user=self.request.user)
        return reports

    def get(self, request, new_report_id, old_report_id):
        reports = self.get_queryset()
        new_report = get_object_or_404(reports, object_id=new_report_id)
        old_report = get_object_or_404(reports, object_id=old_report_id)
        new_report_dict = ReportSerializer(new_report).data
        old_report_dict = ReportSerializer(old_report).data
        diff_data = self.count_diff(new_report_dict, old_report_dict)

        return Response(diff_data)


class ReportOverviewLatest(PermissionMixin, ReportOverviewMixin, APIView):
    """
    Get report overview: category_added, category_removed, course_added, course_removed
    """

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            reports = NonDegreeReport.objects.all()
        else:
            reports = NonDegreeReport.objects \
                .filter(school__non_degree_user=self.request.user)
        return reports

    def get(self, request, school_id):
        reports = self.get_queryset()
        school_reports = reports.filter(school=school_id).order_by('-date_created')
        if not school_reports:
            return Response({"Failed": "Report not fund!"}, status=HTTP_400_BAD_REQUEST)
        new_report_dict = ReportSerializer(school_reports.first()).data

        try:
            old_report = school_reports[1]
            old_report_dict = ReportSerializer(old_report).data
        except IndexError:
            old_report_dict = None

        diff_data = self.count_diff(new_report_dict, old_report_dict)

        return Response(diff_data)


class SharedReportCreateAPI(PermissionMixin, CreateAPIView):
    """
    Get list of user non-degree report API
    """

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            reports = NonDegreeReport.objects.all()
        else:
            reports = NonDegreeReport.objects \
                .filter(school__non_degree_user=self.request.user)
        return reports

    def create(self, request, *args, **kwargs):
        time_now = timezone.now()
        if 'expired_day' in request.data:
            if type(request.data['expired_day']) is not int:
                return Response({"Failed": "expired_day must be integer!"}, status=HTTP_400_BAD_REQUEST)
            if request.data['expired_day'] > 30:
                return Response({"Failed": "Expired_day can not greater than 30 days."}, status=HTTP_400_BAD_REQUEST)
            else:
                expired_time = time_now + timezone.timedelta(days=request.data['expired_day'])
        else:
            expired_time = time_now + timezone.timedelta(days=2)

        if 'expired_sec' in request.data:
            if type(request.data['expired_sec']) is not int:
                return Response({"Failed": "expired_sec must be integer!"}, status=HTTP_400_BAD_REQUEST)
            if request.data['expired_sec'] > 60:
                return Response({"Failed": "Expired_sec can not greater than 60 sec."}, status=HTTP_400_BAD_REQUEST)
            else:
                expired_time = expired_time + timezone.timedelta(seconds=request.data['expired_sec'])

        if 'reports' not in request.data:
            return Response({"Failed": "Reports are required."}, status=HTTP_400_BAD_REQUEST)
        if type(request.data['reports']) is not list:
            return Response({"Failed": "reports must be a list of report id!"}, status=HTTP_400_BAD_REQUEST)
        report_list = []
        owned_reports = self.get_queryset()
        for report_id in request.data['reports']:
            try:
                report = owned_reports.get(object_id=report_id)
                report_list.append(report)
            except NonDegreeReport.DoesNotExist:
                return Response({"Failed": "Report does not exist, or you don't have permission to access report."},
                                status=HTTP_400_BAD_REQUEST)

        shared_report = NonDegreeSharedReport.objects.create(created_by=request.user,
                                                             expired_time=expired_time,)

        shared_report.save()
        shared_report.reports.add(*report_list)
        link = 'shared_reports/{0}/{1}'.format(shared_report.object_id, shared_report.access_token)
        return Response({'link': link, 'expired_time': shared_report.expired_time}, status=HTTP_201_CREATED)


class SharedReportAPI(PermissionMixin, GenericAPIView):
    """
    Retrieve SharedReport detail API
    """
    permission_classes = (AllowAny,)
    lookup_field = 'object_id'
    serializer_class = SharedReportSerializer
    queryset = NonDegreeSharedReport

    def retrieve(self, request, object_id, access_token, *args, **kwargs):
        shared_report = self.get_object()
        if access_token != str(shared_report.access_token):
            return Response({"Failed": "Permission Denied!"}, status=HTTP_403_FORBIDDEN)
        if timezone.now() > shared_report.expired_time:
            return Response({"Failed": "Token Expired!"}, status=HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(shared_report)
        return Response(serializer.data)

    def get(self, request, object_id, access_token, *args, **kwargs):
        return self.retrieve(request, object_id, access_token, *args, **kwargs)


class CourseListAPI(PermissionMixin, ListModelMixin, GenericAPIView):
    """
    Get list of user non-degree courses
    """
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    serializer_class = CourseListSerializer
    pagination_class = BasePagination
    filter_class = CourseFilter

    search_fields = ('name', )
    ordering_fields = ('name', )
    ordering = ('name', )      # default ordering

    def get_queryset(self, *args, **kwargs):
        courses = NonDegreeCourse.objects.filter(category__university_school__object_id=self.school_id).distinct()
        if not self.is_manager():
            user = UniversityCustomer.objects.get(id=self.request.user.id)
            courses = courses.filter(category__university_school__in=user.non_degree_schools.all())
        return courses

    def get(self, request, school_id, *args, **kwargs):
        self.school_id = school_id
        return self.list(request, *args, **kwargs)


class CourseURLListAPI(PermissionMixin, ListModelMixin, GenericAPIView):
    """
    Get list of user non-degree course URL
    """
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    serializer_class = CourseURLListSerializer
    pagination_class = BasePagination
    filter_class = CourseURLFilter

    search_fields = ('url', )
    ordering_fields = ('url', )
    ordering = ('url', )      # default ordering

    def get_queryset(self, *args, **kwargs):
        course_urls = NonDegreeCourseURL.objects.filter(course__object_id=self.course_id)\
            .filter(course__category__university_school__object_id=self.school_id)
        if not self.is_manager():
            user = UniversityCustomer.objects.get(id=self.request.user.id)
            course_urls = course_urls.filter(course__category__university_school__in=user.non_degree_schools.all())
        return course_urls

    def get(self, request, school_id, course_id, *args, **kwargs):
        self.school_id = school_id
        self.course_id = course_id
        return self.list(request, *args, **kwargs)


class AMPReportListAPI(PermissionMixin, ListModelMixin, GenericAPIView):
    """
    Get list of user non-degree AMP report
    """
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    serializer_class = AMPReportListSerializer
    pagination_class = BasePagination
    filter_class = AMPReportListFilter

    search_fields = ('webpage__url', )
    ordering_fields = ('webpage__url', )
    ordering = ('webpage__url', )      # default ordering

    def get_queryset(self, *args, **kwargs):
        reports = NonDegreeAMPReport.objects.filter(webpage__nondegreecourseurl__object_id=self.url_id)\
            .filter(webpage__nondegreecourseurl__course__object_id=self.course_id)\
            .filter(webpage__nondegreecourseurl__course__category__university_school__object_id=self.school_id)
        if not self.is_manager():
            user = UniversityCustomer.objects.get(id=self.request.user.id)
            reports = reports.filter(webpage__nondegreecourseurl__course__category__university_school__in
                                     =user.non_degree_schools.all())
        return reports

    def get(self, request, school_id, course_id, url_id, *args, **kwargs):
        self.school_id = school_id
        self.course_id = course_id
        self.url_id = url_id
        return self.list(request, *args, **kwargs)


class AMPReportDetailAPI(PermissionMixin, RetrieveModelMixin, GenericAPIView):
    """
    Get list of user non-degree AMP report detail
    """
    lookup_field = 'object_id'
    serializer_class = AMPReportDetailSerializer

    def get_queryset(self, *args, **kwargs):
        reports = NonDegreeAMPReport.objects.filter(webpage__nondegreecourseurl__object_id=self.url_id)\
            .filter(webpage__nondegreecourseurl__course__object_id=self.course_id)\
            .filter(webpage__nondegreecourseurl__course__category__university_school__object_id=self.school_id)
        if not self.is_manager():
            user = UniversityCustomer.objects.get(id=self.request.user.id)
            reports = reports.filter(webpage__nondegreecourseurl__course__category__university_school__in
                                     =user.non_degree_schools.all())
        return reports

    def get(self, request, school_id, course_id, url_id, *args, **kwargs):
        self.school_id = school_id
        self.course_id = course_id
        self.url_id = url_id
        return self.retrieve(request, *args, **kwargs)
