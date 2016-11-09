#model serializer
from rest_framework import serializers, exceptions
#our lib
from ceeb_program.models import * # unsafe
#lib in same project
class AbstractSimpleObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model= AbstractSimpleObject
        fields =('name',) 
            
class DurationUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = DurationUnit
        fields = ('name',)
class DegreeRefSerializer(serializers.ModelSerializer):
    class Meta:
        model= DegreeRef
        fields =('name',) 


class CurriculumUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model= CurriculumUnit
        fields =('name',)

        
class TuitionUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model= TuitionUnit
        fields =('name',)

class UniversitySchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversitySchool
        fields = ('university','school',)
    
# Requirement.exam seiralizer
class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ('name',)


class ProgramSerializer(serializers.ModelSerializer):
    degree=DegreeRefSerializer(read_only=True,required=False,many=False)
    university_school=UniversitySchoolSerializer(read_only=True,required=False,many=False)
    class Meta:
        model = Program
        fields = ('object_id', 'url', 'university_school', 'program_name', 'degree','department',
        'specialization','highlights','audience','job_placement', 'job_placement_url','online_program', 'url', 
        'additional_url', 'program_faq_url', 'stats_profile_url')


class DurationSerializer(serializers.ModelSerializer):
    duration_unit = DurationUnitSerializer(read_only=True, required=False, many=False)
    duration_addl_unit = DurationUnitSerializer(read_only=True, required=False, many=False)
    class Meta:
        model = Duration
        fields = ('full_part_time', 'duration_unit','duration_min','duration_max','durationtime_limit',
            'duration_conj', 'duration_addl', 'duration_addl_unit')



class CurriculumSerializer(serializers.ModelSerializer):
    curriculum_unit = CurriculumUnitSerializer(read_only=True,required=False,many=False)
    class Meta:
        model = Curriculum 
        fields = ('curriculum_unit','curriculum_url','min_total_unit','max_transfer_unit','master_thesis_or_equivalent',
        'doctorate_dissertation_or_equivalent', 'dissertation_notes', 'thesis_notes',)


class CostSerializer(serializers.ModelSerializer):
    curriculum_unit = CurriculumUnitSerializer(read_only=True,required=False,many=False)
    class Meta:
        model = Cost
        fields = ('curriculum_unit','min_total_unit','max_transfer_unit','master_thesis_or_equivalent',
        'doctorate_dissertation_or_equivalent',)


class TuitionSerializer(serializers.ModelSerializer):
    tuition_unit = TuitionUnitSerializer(read_only=True,required=False,many=False)
    class Meta:
        model = Tuition
        fields = ('tuition_per_unit','tuition_unit','tuition_per_unit_out_state','fee_included',
            'university_cost_url', 'school_cost_url',)


class DeadlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deadline
        fields = ('deadline_fall_early_month','deadline_fall_early_day',
        'get_deadline_fall_early_month_display','get_deadline_fall_early_day_display',
        'deadline_fall_late_month','deadline_fall_late_day',
        'get_deadline_fall_late_month_display','get_deadline_fall_late_day_display',
        'deadline_spring_early_month','deadline_spring_early_day',
        'get_deadline_spring_early_month_display','get_deadline_spring_early_day_display',
        'deadline_spring_late_month','deadline_spring_late_day',
        'get_deadline_spring_late_month_display','get_deadline_spring_late_day_display',
        'deadline_summer_early_month','deadline_summer_early_day',
        'get_deadline_summer_early_month_display','get_deadline_summer_early_day_display',
        'deadline_summer_late_month','deadline_summer_late_day',
        'get_deadline_summer_late_month_display','get_deadline_summer_late_day_display',
        'deadline_rolling', 'deadline_url',
        'scholarship_deadline_month','scholarship_deadline_day',)
class RequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requirement
        fields = ('special_reqs','apply_online','application_fee','application_fee_waiver',
        'transcript_for_application','transcript_post_admin','official_transcript_for_enrollment',
        'essays','recommendation','gpa_minimum','gpa_minimum_letter','gpa_average','gpa_average_letter',
        'gpa_suggested','gpa_suggested_letter', 'school_interview','resume',
        'sup_mat_writing_sample','sup_mat_portfolio',
        'intl_lang_waiver','intl_english_test_required',
        'toefl_ibt','toefl_ibt_reading','toefl_ibt_listening',
        'toefl_ibt_speaking','toefl_ibt_writing',
        'toefl_pbt','toefl_twe','toefl_tse','toefl_cbt','intl_ielts_reqs', #tse cbt ?
        'intl_other', 'application_fee_waiver_notes', 'sup_mat_writing_sample_notes',
        'sup_mat_portfolio_notes', 'intl_lang_waiver_conditions', 'program_req_url', 'school_req_url',
        'intl_req_url', )


#Requirement.intl_transcript Serializers
class TranscriptEvaluationProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptEvaluationProvider
        fields = ('name','description',)


#use this to return name and description
class TranscriptEvaluationProviderField(serializers.ModelSerializer):
    repr = serializers.SerializerMethodField()
    class Meta:
        model = TranscriptEvaluationProvider 
        fields = ("repr",)
    def get_repr(self,obj):
        return "{0} - {1}".format(obj.name, obj.description)


#Requirement.intl_english_test
class InternationalEnglishTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternationalEnglishTest
        fields = ('name',)


class ScholarshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = ('fully_funded', 'fully_funded_notes', 'scholarship_avail', 'scholarship_notes',
            'scholarship_program_specific_url')


class ExpertAdditionalNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertAdditionalNote
        fields = ('additional_note_type', 'additional_note_url', 'additional_note_url2', 
            'additional_note_url3','additional_note',)