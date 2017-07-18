# #System lib
from django.contrib import admin, messages
from django.forms import Textarea, ModelForm
from django.contrib.auth import get_permission_codename
# #3rd party lib
# #our lib
from ceeb_program.models import *

# #lib in same project
from .models import *

from django.contrib.admin.options import InlineModelAdmin


class AutoUserModelAdmin(admin.ModelAdmin):
    formfield_overrides = {
        # models.CharField: {'widget': TextInput(attrs={'size':'20'})},
        models.TextField: {'widget': Textarea(attrs={'rows': 4, 'cols': 80})},
    }

    def has_change_permission(self, request, obj=None):
        opts = self.opts
        codename = get_permission_codename('view_only', opts)
        if request.user.has_perm("%s.%s" % (opts.app_label, codename)):
            return True  # allow "view_only" account to access detail page
        else:
            # otherwise fall back to default behavior
            return super(AutoUserModelAdmin, self).has_change_permission(request)

    # auto save user ID when creating/modifying
    def save_model(self, request, obj, form, change):
        opts = self.opts
        codename = get_permission_codename('view_only', opts)
        if request.user.has_perm("%s.%s" % (opts.app_label, codename)):
            # don't allow view_only account change record
            messages.add_message(request, messages.ERROR, "Cannot modify record with view_only permission")
            return

        if getattr(obj, 'created_by', None) is None:
            obj.created_by = request.user
        obj.modified_by = request.user
        obj.save()


class SimpleObjectModelAdmin(AutoUserModelAdmin):
    readonly_fields = ('object_id', 'date_created', 'date_modified', 'created_by', 'modified_by')

    list_display = ('name', 'description', 'created_by', 'modified_by')
    list_filter = ('date_created', 'date_modified', 'created_by', 'modified_by')

    search_fields = [
        'name',
        'description',
    ]

    fieldsets = [
        ('Management Record', {
            'fields': [
                'object_id',
                'date_created',
                'date_modified',
                'created_by',
                'modified_by',
            ]
        }),
        ('Details', {
            'fields': [
                'name',
                'description',
            ]
        }),
    ]


class UniversityCustomerAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'data_joined', )

    list_display = ('username', 'email', 'is_active', 'data_joined', )
    list_filter = ('is_active', 'data_joined',)

    filter_horizontal = ('competing_schools', 'non_degree_schools', )
    search_fields = [
        'username',
        'email',
    ]

    fieldsets = [
        ('Management Record', {
            'fields': [
                'id',
                'data_joined',
            ]
        }),
        ('Details', {
            'fields': [
                'username',
                'email',
                'password',
                'is_active',
                'is_demo',
                'can_ccemail',
                'Ceeb',
                'department',
                'account_manager',
            ]
        }),
        ('Sub User', {
            'fields': [
                'main_user_id',
                'service_level',
                'title',
                'contact_name',
                'position',
                'position_level',
                'phone',
                'account_type',
                'competing_schools',
                'non_degree_schools',
            ]
        }),
    ]


class NonDegreeCategoryURLInline(admin.TabularInline):
    model = NonDegreeCategoryURL
    extra = 0
    classes = ('collapse',)

    fieldsets = [
        ('Notes', {
            'classes': ('collapse', 'open'),
            'fields': [
                'type',
                'note',
                'url',
            ]
        }),
    ]


class NonDegreeCourseURLInline(admin.TabularInline):
    model = NonDegreeCourseURL
    extra = 0
    classes = ('collapse',)

    fieldsets = [
        ('Notes', {
            'classes': ('collapse', 'open'),
            'fields': [
                'type',
                'note',
                'url',
            ]
        }),
    ]


class NonDegreeCategoryURLAdmin(AutoUserModelAdmin):
    readonly_fields = ('date_created', 'date_modified', 'created_by', 'modified_by')

    list_display = ('note', 'url', 'date_created', 'date_modified', 'created_by', 'modified_by')
    list_filter = ('date_created', 'date_modified', 'created_by', 'modified_by',)

    search_fields = [
        'type__name',
        'note',
        'url',
    ]

    fieldsets = [
        ('Management Record', {
            'classes': ('collapse',),
            'fields': [
                ('date_created', 'created_by'),
                ('date_modified', 'modified_by'),
            ]
        }),
        ('URL Identity', {
            'classes': ('collapse', 'open'),
            'fields': [
                'category',
                'type',
                'note',
                'url',
                'webpage',
                'processed_scan',
            ]
        }),
    ]


class NonDegreeCourseURLAdmin(AutoUserModelAdmin):
    readonly_fields = ('date_created', 'date_modified', 'created_by', 'modified_by')

    list_display = ('note', 'url', 'date_created', 'date_modified', 'created_by', 'modified_by')
    list_filter = ('date_created', 'date_modified', 'created_by', 'modified_by',)

    search_fields = [
        'type__name',
        'note',
        'url',
    ]

    fieldsets = [
        ('Management Record', {
            'classes': ('collapse',),
            'fields': [
                ('date_created', 'created_by'),
                ('date_modified', 'modified_by'),
            ]
        }),
        ('URL Identity', {
            'classes': ('collapse', 'open'),
            'fields': [
                'course',
                'type',
                'note',
                'url',
                'webpage',
                'processed_scan',
            ]
        }),
    ]


class NonDegreeCourseDateInline(admin.TabularInline):
    model = NonDegreeCourseDate
    extra = 0
    classes = ('collapse',)

    fieldsets = [
        ('Notes', {
            'classes': ('collapse', 'open'),
            'fields': [
                'start_date',
                'end_date',
            ]
        }),
    ]


class NonDegreeCourseDateAdmin(AutoUserModelAdmin):
    readonly_fields = ('date_created', 'date_modified', 'created_by', 'modified_by')

    list_display = ('course', 'start_date', 'end_date',)
    list_filter = ('date_created', 'date_modified', 'created_by', 'modified_by',)

    search_fields = [
        'course',
        'start_date',
        'end_date',
    ]

    fieldsets = [
        ('Management Record', {
            'classes': ('collapse',),
            'fields': [
                ('date_created', 'created_by'),
                ('date_modified', 'modified_by'),
            ]
        }),
        ('CourseDate Identity', {
            'classes': ('collapse', 'open'),
            'fields': [
                'course',
                'start_date',
                'end_date',
            ]
        }),
    ]


class NonDegreeCategoryAdmin(AutoUserModelAdmin):
    save_as = True

    inlines = [
        NonDegreeCategoryURLInline,
    ]
    readonly_fields = ('object_id', 'date_created', 'date_modified', 'created_by', 'modified_by')

    list_display = ('name', 'university_school', 'date_created', 'date_modified', 'created_by', 'modified_by')
    list_filter = ('date_created', 'date_modified', 'created_by', 'modified_by',)
    ordering = ('-version', 'name',)

    search_fields = [
        'name',
        'university_school__ceeb',
        'university_school__school',
    ]

    fieldsets = [
        ('Management Record', {
            'classes': ('collapse',),
            'fields': [
                'object_id',
                ('date_created', 'created_by'),
                ('date_modified', 'modified_by'),
            ]
        }),
        ('Category Identity', {
            'classes': ('collapse', 'open'),
            'fields': [
                'name',
                'university_school',
                'active',
                'version',
                'effective_date_start',
                'effective_date_end',
            ]
        }),
    ]


class NonDegreeCourseAdmin(AutoUserModelAdmin):
    save_as = True

    inlines = [
        NonDegreeCourseDateInline,
        NonDegreeCourseURLInline,
    ]
    readonly_fields = ('object_id', 'date_created', 'date_modified', 'created_by', 'modified_by')

    list_display = ('name', 'university_school', 'active', 'version', 'type', 'date_created', 'date_modified',
                    'created_by', 'modified_by')
    list_filter = ('active', 'version', 'type', 'Repeatable', 'date_created', 'date_modified', 'created_by',
                   'modified_by',)

    filter_horizontal = ('category',)
    ordering = ('-version', 'name',)

    search_fields = [
        'name',
        'university_school__ceeb',
        'university_school__school',
    ]

    fieldsets = [
        ('Management Record', {
            'classes': ('collapse',),
            'fields': [
                'object_id',
                ('date_created', 'created_by'),
                ('date_modified', 'modified_by'),
            ]
        }),
        ('Course Identity', {
            'classes': ('collapse', 'open'),
            'fields': [
                'name',
                'university_school',
                'category',
                'active',
                'is_advanced_management_program',
                'version',
                'type',
                'tuition',
                ('currency', 'tuition_number'),
                'tuition_note',
                'Repeatable',
                'effective_date_start',
                'effective_date_end',
            ]
        }),
    ]


class NonDegreeSharedReportAdmin(AutoUserModelAdmin):
    readonly_fields = ('object_id', 'date_created', 'date_modified', 'created_by', 'access_token')

    list_display = ('object_id', 'created_by', 'expired_time')
    list_filter = ('date_created', 'date_modified',)

    filter_horizontal = ('reports',)
    fieldsets = [
        ('Management Record', {
            'classes': ('collapse',),
            'fields': [
                'object_id',
                'date_created',
                'date_modified',
            ]
        }),
        ('Detail', {
            'classes': ('collapse', 'open'),
            'fields': [
                'reports',
                'expired_time',
                'access_token',
            ]
        }),
    ]


admin.site.register(UniversityCustomer, UniversityCustomerAdmin)
admin.site.register(UniversityCustomerProgram)
admin.site.register(CustomerCompetingProgram)
admin.site.register(UpgridAccountManager)
admin.site.register(EnhancementUpdate)
admin.site.register(WhoopsUpdate)
admin.site.register(Program)
admin.site.register(ClientAndProgramRelation)
admin.site.register(Cost)
admin.site.register(Requirement)
admin.site.register(Scholarship)
admin.site.register(ExpertNotes)
admin.site.register(ExpertAdditionalNote)
admin.site.register(UniversitySchool)
admin.site.register(Duration)
admin.site.register(Curriculum)
admin.site.register(Tuition)
admin.site.register(Deadline)
admin.site.register(TranscriptEvaluationProvider)

admin.site.register(NonDegreeCategory, NonDegreeCategoryAdmin)
admin.site.register(NonDegreeCourse, NonDegreeCourseAdmin)
admin.site.register(NonDegreeCategoryURL, NonDegreeCategoryURLAdmin)
admin.site.register(NonDegreeCourseURL, NonDegreeCourseURLAdmin)
admin.site.register(NonDegreeUrlTypeRef, SimpleObjectModelAdmin)
admin.site.register(NonDegreeCourseDate, NonDegreeCourseDateAdmin)
admin.site.register(NonDegreeSharedReport, NonDegreeSharedReportAdmin)
admin.site.register(NonDegreeAMPReport)
