# System lib
from django.utils.translation import ugettext_lazy as _
import base64
# 3rd party lib
from rest_framework import serializers
from rest_framework.serializers import *
from rest_framework_jwt.settings import api_settings
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

# our lib
from ceeb_program.models import Program, UniversitySchool, ExpertAdditionalNote
from ..record_management.models import ProgramAssignment, ProgramProof
# lib in same project
from .models import *
# from apps.upgrid.forms import ChangePasswordForm


# ----------------------------Login Serializer---------------------------------


class Login2Serializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    @property
    def object(self):
        return self.validated_data

    def get_username(self, attrs):
        e = attrs.get('email')

        try:
            user = UniversityCustomer.objects.get(email=e)
            return user.username
        except UniversityCustomer.DoesNotExist:
            try:
                user = UpgridAccountManager.objects.get(email=e)
                return user.username
            except UpgridAccountManager.DoesNotExist:
                msg = _('Email is not correct!')
                raise serializers.ValidationError(msg)

    def validate(self, attrs):

        username = self.get_username(attrs)
        password = base64.b64decode(attrs.get('password'))

        if username:
            user = UpgridBaseUser.objects.get(username=username)
            if user.check_password(password):
                if not user.is_active:
                    msg = _('User account is disabled.')
                    raise serializers.ValidationError(msg)

                payload = jwt_payload_handler(user)

                return {
                        'token': jwt_encode_handler(payload),
                        'user': user
                        }

            else:
                msg = _('Unable to login with provided credentials.')
                raise serializers.ValidationError(msg)

        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg)


# -------------------------User API Serializers------------------------------------

class UnivCustomerProgramSerializer(serializers.ModelSerializer):
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()
    has_expert_notes = SerializerMethodField()

    class Meta:
        model = UniversityCustomerProgram
        fields = ('object_id', 'program_name', 'program_degree', 
                  'whoops_final_release', 'enhancement_final_release','customer_confirmation',
                  'has_expert_notes')

    def get_program_name(self, obj):
        return obj.program.program_name

    def get_program_degree(self, obj):
        return obj.program.degree.name

    def get_has_expert_notes(self, obj):
        origin_program = Program.objects.get(object_id=obj.program.object_id)
        qs = ExpertAdditionalNote.objects.filter(program=origin_program)
        
        expert_notes = ""
        if len(qs) == 0:
            expert_notes = False
        else:
            expert_notes = True

        return expert_notes


class CompetingProgramSerializer(serializers.ModelSerializer):

    program_id = SerializerMethodField()
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()
    university = SerializerMethodField()
    school = SerializerMethodField()

    class Meta:
        model = CustomerCompetingProgram
        fields = ('object_id','program_id', 'program_name', 'program_degree', 'university',
                  'school', 'order', 'enhancement_status')

    def get_program_id(self, obj):
        return obj.program.object_id

    def get_program_name(self, obj):
        return obj.program.program_name

    def get_program_degree(self, obj):
        return obj.program.degree.name

    def get_university(self,  obj):
        return obj.program.university_school.university_foreign_key.name

    def get_school(self, obj):
        return obj.program.university_school.school


class CustomerCompetingProgramSerializer(serializers.ModelSerializer):
    competing_program = SerializerMethodField()

    class Meta:
        model = UniversityCustomerProgram
        fields = ('competing_program',)

    def get_competing_program(self, obj):
        qs = CustomerCompetingProgram.objects.filter(customer_program=obj)
        return CompetingProgramSerializer(qs, many=True).data         


class UniversityAndSchoolSerializer(serializers.ModelSerializer):
    university_school = SerializerMethodField()

    class Meta:
        model = UniversitySchool
        fields = ('object_id','university_school',)

    def get_university_school(self, obj):
        return '{0} : {1} - {2}'.format(obj.ceeb, obj.university_foreign_key, obj.school)

# Used for main user get all his subuser detail


class SubuserListSerializer(serializers.ModelSerializer):
    customer_program = SerializerMethodField()

    class Meta:
        model = UniversityCustomer
        fields = ('id', 'email', 'title',
                  'contact_name', 'position', 'phone', 'customer_program')

    def get_customer_program(self, obj):
        program_list = ClientAndProgramRelation.objects.filter(client=obj).values('client_program')
        programs = UniversityCustomerProgram.objects.filter(object_id__in = program_list)
        serializer = ClientProgramSerializer(programs, many=True)
        return serializer.data

class MainUserDetailSerializer(serializers.ModelSerializer):
    sub_user_list = SerializerMethodField()
    competing_schools=SerializerMethodField()
    university = SerializerMethodField()
    school = SerializerMethodField()
    
    class Meta:
        model = UniversityCustomer
        fields = ('username', 'Ceeb', 'university', 'school', 'service_level', 'service_until',
                  'account_type', 'position', 'contact_name',
                  'email', 'competing_schools', 'sub_user_list')

    def get_sub_user_list(self, obj):
        sub_user_list = UniversityCustomer.objects.filter(Ceeb=obj.Ceeb, account_type='sub')
        return SubuserListSerializer(sub_user_list, many=True).data

    def get_competing_schools(self,obj):
        serializer = UniversityAndSchoolSerializer(obj.competing_schools, many=True)
        return serializer.data

    def get_university(self, obj):
        return obj.Ceeb.university_foreign_key.name

    def get_school(self, obj):
        return obj.Ceeb.school

# Used for subuser get main user information


class MainuserInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = UniversityCustomer
        fields = ('email', 'position', 'contact_name',
                  'phone')


class SubUserDetailSerializer(serializers.ModelSerializer):
    main_user_info = SerializerMethodField()
    university = SerializerMethodField()
    school = SerializerMethodField()
    
    class Meta:
        model = UniversityCustomer
        fields = ('main_user_info', 'Ceeb', 'university', 'school', 'service_until',
                  'account_type', 'position', 'contact_name', 'email',)

    def get_main_user_info(self, obj):
        main_user = UniversityCustomer.objects.get(Ceeb=obj.Ceeb, account_type="main", id=obj.main_user_id)
        return MainuserInfoSerializer(main_user).data
        
    def get_university(self, obj):
        return obj.Ceeb.university_foreign_key.name

    def get_school(self, obj):
        return obj.Ceeb.school

# ----------------------------------Account Manager Serializer----------------------------------


class AccountManagerSerializer(serializers.ModelSerializer):
    client_list = SerializerMethodField()
    
    class Meta:
        model = UpgridAccountManager
        fields = ('username', 'id', 'client_list')

    def get_client_list(self, obj):
        client_list = UniversityCustomer.objects.filter(account_manager=obj)
        serializer = ClientListSerializer(client_list, many=True)
        return serializer.data


class ClientListSerializer(serializers.ModelSerializer):
    university = SerializerMethodField()

    class Meta:
        model = UniversityCustomer
        fields = ('id', 'contact_name', 'is_active', 'university', 'department', 'email')

    def get_university(self, obj):
        return '{0} - {1}'.format(obj.Ceeb.university_foreign_key, obj.Ceeb.school,)


class ClientProgramSerializer(serializers.ModelSerializer):
    program = SerializerMethodField()
    competing_program = SerializerMethodField()

    class Meta:
        model = UniversityCustomerProgram
        fields = ('object_id', 'program', 'whoops_status', 'whoops_final_release', 'enhancement_final_release',
                  'customer_confirmation','competing_program')

    def get_program(self, obj):
    
        return ProgramSerializer(obj.program).data

    def get_competing_program(self, obj):
        cps = CustomerCompetingProgram.objects.filter(customer_program=obj)
        serializer = CompetingProgramSerializer(cps, many=True)
        return serializer.data     

class MainClientDetailSerializer(serializers.ModelSerializer):
    Ceeb = SerializerMethodField()
    CeebID = SerializerMethodField()
    competing_schools = SerializerMethodField()
    customer_program = SerializerMethodField()

    class Meta:
        model = UniversityCustomer
        fields = ('username', 'id', 'email', 'title', 'contact_name', 'position', 'position_level',
                  'phone', 'Ceeb', 'CeebID', 'department', 'account_type','service_level', 'service_until',
                  'competing_schools', 'customer_program')

    def get_Ceeb(self, obj):
        return '{0} - {1} - {2}'.format( obj.Ceeb.ceeb, obj.Ceeb.university_foreign_key, obj.Ceeb.school,)

    def get_CeebID(self, obj):
        return obj.Ceeb.object_id

    def get_competing_schools(self, obj):

        return UniversityAndSchoolSerializer(obj.competing_schools, many=True).data

    def get_customer_program(self, obj):
        programs = UniversityCustomerProgram.objects.filter(customer=obj)
        serializer = ClientProgramSerializer(programs, many=True)
        return serializer.data


class SubClientDetailSerializer(serializers.ModelSerializer):
    Ceeb = SerializerMethodField()
    competing_schools = SerializerMethodField()
    customer_program = SerializerMethodField()

    class Meta:
        model = UniversityCustomer
        fields = ('username', 'id','email', 'title', 'contact_name', 'position', 'position_level',
                  'phone', 'Ceeb', 'department', 'account_type', 'main_user_id','service_level', 'service_until',
                  'competing_schools', 'customer_program')

    def get_Ceeb(self, obj):
        return '{0} - {1} - {2}'.format( obj.Ceeb.ceeb, obj.Ceeb.university_foreign_key, obj.Ceeb.school,)

    def get_competing_schools(self, obj):

        return UniversityAndSchoolSerializer(obj.competing_schools, many=True).data

    def get_customer_program(self, obj):
        program_list = ClientAndProgramRelation.objects.filter(client=obj).values('client_program')
        programs = UniversityCustomerProgram.objects.filter(object_id__in = program_list)
        serializer = ClientProgramSerializer(programs, many=True)
        return serializer.data


class ProgramSerializer(serializers.ModelSerializer):
    program_display = SerializerMethodField()
    Ceeb = SerializerMethodField()

    class Meta:
        model = Program
        fields = ('object_id', 'Ceeb', 'program_display', 'department')

    def get_program_display(self, obj):
        return "{0} -- {1} -- {2}".format(obj.university_school, obj.program_name, obj.degree)

    def get_Ceeb(self, obj):
        return obj.university_school.ceeb


class CustomerAndCompetingProgramSerializer(serializers.ModelSerializer):
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()
    program_university = SerializerMethodField()
    program_school = SerializerMethodField()
    Ceeb = SerializerMethodField()
    assignment_status = SerializerMethodField()
    review_status = SerializerMethodField()

    class Meta:
        model = Program
        fields = ('object_id', 'Ceeb', 'assignment_status', 'review_status',
                  'program_university', 'program_school', 'program_name', 'program_degree')

    def get_program_university(self, obj):
        return obj.university_school.university

    def get_program_school(self, obj):
        return obj.university_school.school

    def get_program_name(self, obj):
        return obj.program_name

    def get_program_degree(self, obj):
        return obj.degree.name

    def get_Ceeb(self, obj):
        return obj.university_school.ceeb

    def get_assignment_status(self, obj):
        try:
            assignee = ProgramAssignment.objects.get(program=obj)
            if assignee.status == 'Done':
                assign_status = 'Done'
            else:
                assign_status = 'In_Progress'
            return assign_status
        except ObjectDoesNotExist:
            return 'In_Progress'

    def get_review_status(self, obj):
        try:
            program_proof = ProgramProof.objects.get(program=obj)
            if program_proof.status == 'Done':
                proof_status = 'Done'
            else:
                proof_status = 'In_Progress'
            return proof_status
        except ObjectDoesNotExist:
            return 'In_Progress'


