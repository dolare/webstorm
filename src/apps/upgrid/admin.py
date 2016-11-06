# #System lib
from django.contrib import admin, messages
from django.contrib.auth.forms import ReadOnlyPasswordHashField, UserChangeForm, UserCreationForm
from django import forms
from django.contrib.auth.admin import UserAdmin
# #3rd party lib

# #our lib
from ceeb_program.models import *

# #lib in same project
from .models import *

class AccountManagerCreationForm(UserCreationForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = UpgridAccountManager
        fields = ('username', 'email',)


class AccountManagerChangeForm(UserChangeForm):

    class Meta:
        model = UpgridAccountManager
        fields = ('username',)


class AccountManagerAdmin(UserAdmin):
    add_form = AccountManagerCreationForm
    form     = AccountManagerChangeForm

    filter_horizontal = ()
    list_display = ('username', 'email')
    list_filter = ('is_active', )
    search_fields = ('username', 'email')

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2')}
        ),)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (('Personal info'), {'fields': ('email', )}),
        (('Permissions'), {'fields': ('is_active',  )}),


    )




admin.site.register(UniversityCustomer)
admin.site.register(UniversityCustomerProgram)
admin.site.register(CustomerCompetingProgram)
admin.site.register(UpgridAccountManager, AccountManagerAdmin)
# admin.site.register(Program)
# admin.site.register(Cost)
# admin.site.register(Requirement)
# admin.site.register(Scholarship)
# admin.site.register(ExpertNotes)
admin.site.register(ExpertAdditionalNote)
# admin.site.register(UniversitySchool)
# admin.site.register(Duration)
# admin.site.register(Curriculum)
# admin.site.register(Tuition)
# admin.site.register(Deadline)
# admin.site.register(TranscriptEvaluationProvider)
