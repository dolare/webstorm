# #System lib
from django.contrib import admin, messages

# #3rd party lib

# #our lib
from ceeb_program.models import *

# #lib in same project
from .models import *














admin.site.register(UniversityCustomer)
admin.site.register(UniversityCustomerProgram)
admin.site.register(CustomerCompetingProgram)
admin.site.register(UpgridAccountManager)
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
