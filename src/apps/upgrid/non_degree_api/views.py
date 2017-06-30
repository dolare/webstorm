from django.db.models import Q
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveUpdateAPIView, CreateAPIView, DestroyAPIView, \
    RetrieveAPIView, RetrieveDestroyAPIView
from rest_framework.filters import SearchFilter, OrderingFilter, DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT, \
    HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST

from ceeb_program.models import UniversitySchool, NonDegreeCategory, NonDegreeCourse, NonDegreeRepeatDate

from .serializers import UniversitySchoolListSerializer, ReportCreateSerializer, CategorySerializer, \
    ReportListSerializer, ReportSerializer
from .pagination import UniversitySchoolPagination, ReportPagination
from .filter import UniversitySchoolFilter, ReportFilter
from ..models import UniversityCustomer, UpgridAccountManager, NonDegreeReport


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
        categories = NonDegreeCategory.objects.filter(university_school=school)
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
    def count_diff(new, old):
        new_report_categories = []
        new_report_courses = []
        old_report_categories = []
        old_report_courses = []
        category_added = 0
        category_removed = 0
        course_added = 0
        course_removed = 0
        for category in new['categories']:
            new_report_categories.append(category['object_id'])
            for course in category['courses']:
                new_report_courses.append(course['object_id'])

        for category in old['categories']:
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

        return {'category_added': category_added,
                'category_removed': category_removed,
                'course_added': course_added,
                'course_removed': course_removed}


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

