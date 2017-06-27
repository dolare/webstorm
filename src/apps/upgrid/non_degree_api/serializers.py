from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ceeb_program.models import UniversitySchool, NonDegreeCategory, NonDegreeCourse, NonDegreeCourseDate

from ..models import NonDegreeReleaseReport


class UniversitySchoolListSerializer(ModelSerializer):
    university = SerializerMethodField()

    class Meta:
        model = UniversitySchool
        fields = ('object_id', 'ceeb', 'school', 'university',)

    def get_university(self, obj):
        return obj.university


class ReleaseReportListSerializer(ModelSerializer):
    class Meta:
        model = NonDegreeReleaseReport
        fields = ('object_id', 'school', 'date_created')


class ReleaseReportSerializer(ModelSerializer):
    class Meta:
        model = NonDegreeReleaseReport
        fields = ('object_id', 'school', 'date_created', 'report', )


class ReleaseReportCreateSerializer(ModelSerializer):
    """ Create release report serializer"""
    school_name = SerializerMethodField()

    class Meta:
        model = NonDegreeReleaseReport
        fields = ('school_name', 'school', 'report')

    def get_school_name(self, obj):
        return obj.school.school


class CourseDateSerializer(ModelSerializer):
    class Meta:
        model = NonDegreeCourseDate
        fields = ('object_id', 'start_date', 'end_date', )


class CourseSerializer(ModelSerializer):
    course_dates = SerializerMethodField()

    class Meta:
        model = NonDegreeCourse
        fields = ('object_id', 'name', 'date_modified', 'type', 'currency', 'tuition_number', 'Repeatable',
                  'course_dates',)

    def get_course_dates(self, obj):
        dates = NonDegreeCourseDate.objects.filter(course=obj)
        return CourseDateSerializer(dates, many=True).data


class CategorySerializer(ModelSerializer):
    courses = SerializerMethodField()

    class Meta:
        model = NonDegreeCategory
        fields = ('object_id', 'name', 'date_modified', 'courses',)

    def get_courses(self, obj):
        courses = NonDegreeCourse.objects.filter(category=obj)
        return CourseSerializer(courses, many=True).data
