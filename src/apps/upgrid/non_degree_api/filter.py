import django_filters
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework.filters import FilterSet

from ceeb_program.models import UniversitySchool, NonDegreeCategory, NonDegreeCourse, NonDegreeAMPReport, \
    NonDegreeCourseURL
from ..models import NonDegreeReport, NonDegreeWhoopsReport


class UniversitySchoolFilter(FilterSet):
    university_id = django_filters.UUIDFilter(name="university_foreign_key__object_id")
    is_non_degree = django_filters.BooleanFilter(method="non_degree_filter")
    is_AMP = django_filters.BooleanFilter(name="nondegreecategory__nondegreecourse__is_advanced_management_program",
                                          distinct=True)
    client_id = django_filters.UUIDFilter(name="non_degree_user__id")

    class Meta:
        model = UniversitySchool
        fields = ['university_id', ]

    def non_degree_filter(self, queryset, name, value):
        if value is True:
            return queryset.filter(nondegreecategory__isnull=False).distinct()
        return queryset


class ReportFilter(FilterSet):

    class Meta:
        model = NonDegreeReport
        fields = ['school', 'active', ]


class CourseFilter(FilterSet):
    is_AMP = django_filters.BooleanFilter(name="is_advanced_management_program")

    class Meta:
        model = NonDegreeCourse
        fields = ['is_AMP', 'university_school', ]


class CourseURLFilter(FilterSet):
    course_id = django_filters.UUIDFilter(name="course__object_id")
    has_AMP_report = django_filters.BooleanFilter(method="has_AMP_report_filter")

    class Meta:
        model = NonDegreeCourseURL
        fields = ['course_id', 'has_AMP_report']

    def has_AMP_report_filter(self, queryset, name, value):
        if value is True:
            return queryset.filter(webpage__nondegreeampreport__isnull=False).distinct()
        return queryset.filter(webpage__nondegreeampreport__isnull=True).distinct()


class AMPReportListFilter(FilterSet):

    class Meta:
        model = NonDegreeAMPReport
        fields = ['date_created', ]


class UniversitySchoolCategoryFilter(FilterSet):

    class Meta:
        model = NonDegreeCategory
        fields = ['active', ]


class NonDegreeWhoopsReportFilter(FilterSet):
    university_school = django_filters.UUIDFilter(name="university_school__object_id")

    class Meta:
        model = NonDegreeWhoopsReport
        fields = ['active', 'university_school', 'starred', 'completed', ]
