from rest_framework.serializers import ModelSerializer, SerializerMethodField
from ceeb_program.models import UniversitySchool, NonDegreeCategory, NonDegreeCourse, NonDegreeCourseDate, \
    NonDegreeUrl, NonDegreeUrlTypeRef, NonDegreeCourseURL, NonDegreeAMPReport
from webtracking.models import WebPage, WebPageScan

from ..models import NonDegreeReport, NonDegreeSharedReport


class UniversitySchoolListSerializer(ModelSerializer):
    university = SerializerMethodField()

    class Meta:
        model = UniversitySchool
        fields = ('object_id', 'ceeb', 'school', 'university',)

    def get_university(self, obj):
        return obj.university_foreign_key.name


class UniversitySchoolDetailSerializer(ModelSerializer):
    university = SerializerMethodField()
    categories = SerializerMethodField()

    class Meta:
        model = UniversitySchool
        fields = ('object_id', 'ceeb', 'school', 'university', 'categories')

    def get_university(self, obj):
        return obj.university_foreign_key.name

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
    currency = SerializerMethodField()
    url = SerializerMethodField()

    class Meta:
        model = NonDegreeCourse
        fields = ('object_id', 'name', 'date_modified', 'type', 'currency', 'tuition_number', 'Repeatable',
                  'course_dates', 'url', 'location_info', )

    def get_course_dates(self, obj):
        dates = NonDegreeCourseDate.objects.filter(course=obj)
        return CourseDateSerializer(dates, many=True).data

    def get_currency(self, obj):
        if getattr(obj, 'currency', None) is not None:
            return obj.currency.name
        return None

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


class CourseListSerializer(ModelSerializer):

    class Meta:
        model = NonDegreeCourse
        fields = ('object_id', 'name',)


class CourseURLListSerializer(ModelSerializer):
    amp_report_released_date = SerializerMethodField()
    type = SerializerMethodField()

    class Meta:
        model = NonDegreeCourseURL
        fields = ('object_id', 'url', 'amp_report_released_date', 'type', 'note',)

    def get_amp_report_released_date(self, obj):
        amp_reports = NonDegreeAMPReport.objects.filter(webpage=obj.webpage).order_by('-date_created')
        if not amp_reports:
            return None
        return amp_reports.first().date_created

    def get_type(self, obj):
        return obj.type.name


class AMPReportListSerializer(ModelSerializer):

    class Meta:
        model = NonDegreeAMPReport
        fields = ('object_id', 'date_created',)


class WebPageSerializer(ModelSerializer):

    class Meta:
        model = WebPage
        fields = ('object_id', 'url', 'last_check_date', 'last_change_date', )


class WebPageScanDetailSerializer(ModelSerializer):
    raw_contents = SerializerMethodField()
    text_contents = SerializerMethodField()

    class Meta:
        model = WebPageScan
        fields = ("object_id", "date_modified", "http_code", 'raw_contents', 'text_contents', )

    def get_raw_contents(self, obj):
        return obj.get_raw_content()

    def get_text_contents(self, obj):
        return obj.get_text_content()


class AMPReportDetailSerializer(ModelSerializer):
    webpage = SerializerMethodField()
    start_scan = SerializerMethodField()
    end_scan = SerializerMethodField()

    class Meta:
        model = NonDegreeAMPReport
        fields = ('webpage', 'start_scan', 'end_scan')

    def get_webpage(self, obj):
        web_page = obj.webpage
        return WebPageSerializer(web_page).data

    def get_start_scan(self, obj):
        start_scan = getattr(obj, 'start_scan', None)
        if start_scan is not None:
            return WebPageScanDetailSerializer(start_scan).data
        return None

    def get_end_scan(self, obj):
        end_scan = getattr(obj, 'end_scan', None)
        if end_scan is not None:
            return WebPageScanDetailSerializer(end_scan).data
        return None
