from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ceeb_program.models import UniversitySchool, NonDegreeCategory, NonDegreeCourse, NonDegreeCourseDate, \
    NonDegreeUrl, NonDegreeUrlTypeRef

from ..models import NonDegreeReport, NonDegreeSharedReport


class UniversitySchoolListSerializer(ModelSerializer):
    university = SerializerMethodField()

    class Meta:
        model = UniversitySchool
        fields = ('object_id', 'ceeb', 'school', 'university',)

    def get_university(self, obj):
        return obj.university


class UniversitySchoolDetailSerializer(ModelSerializer):
    university = SerializerMethodField()
    categories = SerializerMethodField()

    class Meta:
        model = UniversitySchool
        fields = ('object_id', 'ceeb', 'school', 'university', 'categories')

    def get_university(self, obj):
        return obj.university

    def get_categories(self, obj):
        categories = NonDegreeCategory.objects.filter(university_school=obj).filter(active=True)
        return CategorySerializer(categories, many=True).data


class ReportListSerializer(ModelSerializer):
    class Meta:
        model = NonDegreeReport
        fields = ('object_id', 'school', 'date_created')


class ReportSerializer(ModelSerializer):
    school_name = SerializerMethodField()
    university_name = SerializerMethodField()

    class Meta:
        model = NonDegreeReport
        fields = ('object_id', 'school_name', 'university_name', 'school', 'date_created', 'categories', )

    def get_school_name(self, obj):
        return obj.school.school

    def get_university_name(self, obj):
        return obj.school.university_foreign_key.name


class ReportCreateSerializer(ModelSerializer):
    """ Create non-degree report serializer"""
    school_name = SerializerMethodField()
    university_name = SerializerMethodField()

    class Meta:
        model = NonDegreeReport
        fields = ('school_name', 'university_name', 'school', 'categories')

    def get_school_name(self, obj):
        return obj.school.school

    def get_university_name(self, obj):
        return obj.school.university_foreign_key.name


class CourseDateSerializer(ModelSerializer):
    class Meta:
        model = NonDegreeCourseDate
        fields = ('object_id', 'start_date', 'end_date', )


class CourseSerializer(ModelSerializer):
    course_dates = SerializerMethodField()
    url = SerializerMethodField()

    class Meta:
        model = NonDegreeCourse
        fields = ('object_id', 'name', 'date_modified', 'type', 'currency', 'tuition_number', 'Repeatable',
                  'course_dates', 'url')

    def get_course_dates(self, obj):
        dates = NonDegreeCourseDate.objects.filter(course=obj)
        return CourseDateSerializer(dates, many=True).data

    def get_url(self, obj):
        url_type = NonDegreeUrlTypeRef.objects.filter(name='Main')
        if not url_type:
            return None
        url = NonDegreeUrl.objects.filter(course=obj).filter(url_type=url_type)
        if not url:
            return None
        return url.first().url


class CategorySerializer(ModelSerializer):
    courses = SerializerMethodField()

    class Meta:
        model = NonDegreeCategory
        fields = ('object_id', 'name', 'date_modified', 'courses',)

    def get_courses(self, obj):
        courses = NonDegreeCourse.objects.filter(category=obj).filter(active=True)
        return CourseSerializer(courses, many=True).data


class SharedReportSerializer(ModelSerializer):
    reports = ReportSerializer(many=True)

    class Meta:
        model = NonDegreeSharedReport
        fields = ('object_id', 'expired_time', 'reports')

