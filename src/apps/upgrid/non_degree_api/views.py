from django.db.models import Q
from django.core.exceptions import ValidationError
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
            university_schools = UniversitySchool.objects.all()
        else:
            university_schools = UniversitySchool.objects\
                .filter(non_degree_user=self.request.user)
        return university_schools


class ReleaseReportListAPI(PermissionMixin, ListAPIView):
    """
    Get list of user release report API
    """
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    serializer_class = ReleaseReportListSerializer
    pagination_class = ReleaseReportPagination
    filter_class = ReleaseReportFilter

    search_fields = ('school__school', 'school__ceeb',)
    ordering_fields = ('school', 'date_created')
    ordering = ('school', '-date_created')      # default ordering

    def get_queryset(self, *args, **kwargs):
        if self.is_manager():
            reports = NonDegreeReleaseReport.objects.all()
        else:
            reports = NonDegreeReleaseReport.objects \
                .filter(school__non_degree_user=self.request.user)
        return reports


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


class ReleaseReportCreateAPI(PermissionMixin, CreateAPIView):
    """
    Create non-degree Release Report API
    """
    serializer_class = ReleaseReportCreateSerializer

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
        request.data['report'] = self.create_report(request)

        return super(ReleaseReportCreateAPI, self).create(request, *args, **kwargs)
