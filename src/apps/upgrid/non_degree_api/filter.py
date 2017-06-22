import django_filters
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework.filters import FilterSet

from ceeb_program.models import UniversitySchool, NonDegreeCategory, NonDegreeCourse, NonDegreeRepeatDate
from ..models import NonDegreeReleaseReport


class UniversitySchoolFilter(FilterSet):
    university_id = django_filters.UUIDFilter(name="university_foreign_key__object_id")

    class Meta:
        model = UniversitySchool
        fields = ['university_id', ]


class ReleaseReportFilter(FilterSet):

    class Meta:
        model = NonDegreeReleaseReport
        fields = ['school', ]
