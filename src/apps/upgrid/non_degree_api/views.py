from django.db.models import Q
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveUpdateAPIView, CreateAPIView, DestroyAPIView, \
    RetrieveAPIView
from rest_framework.filters import SearchFilter, OrderingFilter, DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT, \
    HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST

from ceeb_program.models import UniversitySchool, NonDegreeCategory, NonDegreeCourse, NonDegreeRepeatDate

from .serializers import UniversitySchoolListSerializer, ReleaseReportCreateSerializer, CategorySerializer, \
    ReleaseReportListSerializer, ReleaseReportSerializer
from .pagination import UniversitySchoolPagination, ReleaseReportPagination
from .filter import UniversitySchoolFilter, ReleaseReportFilter
from ..models import UniversityCustomer, UpgridAccountManager, NonDegreeReleaseReport


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
            university_schools = UniversitySchool.objects.filter(nondegreecategory__isnull=False)
        else:
            university_schools = UniversitySchool.objects.filter(nondegreecategory__isnull=False)\
                                                         .filter(non_degree_user=self.request.user)
        return university_schools


class ReleaseReportCreateListAPI(PermissionMixin, CreateModelMixin, ListAPIView):
    """
    Get list of user release report API
    """
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    pagination_class = ReleaseReportPagination
    filter_class = ReleaseReportFilter

    search_fields = ('school__school', 'school__ceeb',)
    ordering_fields = ('school', 'date_created')
    ordering = ('school', '-date_created')      # default ordering

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ReleaseReportListSerializer
        else:
            return ReleaseReportCreateSerializer

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            reports = NonDegreeReleaseReport.objects.all()
        else:
            reports = NonDegreeReleaseReport.objects \
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
        categories = NonDegreeCategory.objects.filter(university_school=school)
        data = JSONRenderer().render(CategorySerializer(categories, many=True).data)
        return data

    def create(self, request, *args, **kwargs):
        if not self.is_manager():
            return Response({"Failed": "Permission Denied!"}, status=HTTP_403_FORBIDDEN)
        request.data['categories'] = self.create_report(request)

        return super(ReleaseReportCreateListAPI, self).create(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ReleaseReportAPI(PermissionMixin, GenericAPIView):
    """
    Retrieve non-degree Release Report API
    """
    lookup_field = 'object_id'
    serializer_class = ReleaseReportSerializer

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            reports = NonDegreeReleaseReport.objects.all()
        else:
            reports = NonDegreeReleaseReport.objects \
                .filter(school__non_degree_user=self.request.user)
        return reports

    def retrieve(self, request, *args, **kwargs):
        new_report = self.get_object()
        new_report_data = self.get_serializer(new_report).data
        old_reports = NonDegreeReleaseReport.objects.filter(school=new_report.school)\
                                                    .filter(date_created__lt=new_report.date_created)\
                                                    .order_by('-date_created')
        if old_reports:
            old_report_data = self.get_serializer(old_reports.first()).data
        else:
            old_report_data = None
        data = {'old_report': old_report_data,
                'new_report': new_report_data}
        return Response(data)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class ReportOverview(PermissionMixin, APIView):
    """
    Get report overview: category_added, category_removed, course_added, course_removed
    """

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            reports = NonDegreeReleaseReport.objects.all()
        else:
            reports = NonDegreeReleaseReport.objects \
                .filter(school__non_degree_user=self.request.user)
        return reports

    def get(self, request, new_report_id, old_report_id):
        reports = self.get_queryset()
        new_report = get_object_or_404(reports, object_id=new_report_id)
        old_report = get_object_or_404(reports, object_id=old_report_id)
        new_report_dict = ReleaseReportSerializer(new_report).data
        old_report_dict = ReleaseReportSerializer(old_report).data
        new_report_categories = []
        new_report_courses = []
        old_report_categories = []
        old_report_courses = []
        category_added = 0
        category_removed = 0
        course_added = 0
        course_removed = 0
        for category in new_report_dict['categories']:
            new_report_categories.append(category['object_id'])
            for course in category['courses']:
                new_report_courses.append(course['object_id'])

        for category in old_report_dict['categories']:
            old_report_categories.append(category['object_id'])
            for course in category['courses']:
                old_report_courses.append(course['object_id'])

        for category_id in new_report_categories:
            if category_id not in old_report_categories:
                category_added += 1
        for category_id in old_report_categories:
            if category_id not in new_report_categories:
                category_removed += 1

        for course_id in new_report_courses:
            if course_id not in old_report_courses:
                course_added += 1
        for course_id in old_report_courses:
            if course_id not in new_report_courses:
                course_removed += 1

        return Response({'category_added': category_added,
                         'category_removed': category_removed,
                         'course_added': course_added,
                         'course_removed': course_removed})

