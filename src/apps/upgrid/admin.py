# #System lib
from django.contrib import admin, messages
from django.forms import Textarea, ModelForm
from django.contrib.auth import get_permission_codename
# #3rd party lib
# #our lib
from ceeb_program.models import *

# #lib in same project
from .models import *


class AutoUserModelAdmin(admin.ModelAdmin):
    formfield_overrides = {
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

        obj.save()


class SimpleObjectModelAdmin(AutoUserModelAdmin):
    readonly_fields = ('object_id', 'date_created', 'date_modified',)

    list_display = ('name', 'description',)
    list_filter = ('date_created', 'date_modified',)

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


class NonDegreeWhoopsReportAdmin(AutoUserModelAdmin):
    readonly_fields = ('object_id', 'date_created', 'date_modified',)

    list_display = ('object_id', 'active', 'university_school', 'date_created', )
    list_filter = ('date_created', 'date_modified',)

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
                'university_school',
                'active',
                'note',
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
admin.site.register(CustomerFeature)
admin.site.register(CustomerFeatureMapping)
admin.site.register(TranscriptEvaluationProvider)

admin.site.register(NonDegreeSharedReport, NonDegreeSharedReportAdmin)
admin.site.register(NonDegreeAMPReport)
admin.site.register(NonDegreeWhoopsReport, NonDegreeWhoopsReportAdmin)
