import django_filters
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework.filters import FilterSet

from ceeb_program.models import UniversitySchool, NonDegreeCategory, NonDegreeCourse, NonDegreeRepeatDate
from ..models import NonDegreeReleaseReport


class UniversitySchoolFilter(FilterSet):
    university_id = django_filters.UUIDFilter(name="university_foreign_key__object_id")
    is_non_degree = django_filters.BooleanFilter(method="non_degree_filter")

    class Meta:
        model = UniversitySchool
        fields = ['university_id', ]

    def non_degree_filter(self, queryset, name, value):
        if value is True:
            return queryset.filter(nondegreecategory__isnull=False)
        return queryset
    

class ReleaseReportFilter(FilterSet):

    class Meta:
        model = NonDegreeReleaseReport
        fields = ['school', ]
