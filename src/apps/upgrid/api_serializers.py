# System lib

from django.utils.translation import ugettext_lazy as _
import base64
import zlib

# 3rd party lib
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.parsers import JSONParser
from django.utils.six import BytesIO
from rest_framework import serializers
from rest_framework.serializers import *
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.serializers import RefreshJSONWebTokenSerializer
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_get_username_from_payload = api_settings.JWT_PAYLOAD_GET_USERNAME_HANDLER

# our lib
from ceeb_program.models import Program, UniversitySchool, ExpertAdditionalNote
from ..record_management.models import ProgramAssignment, ProgramProof
# lib in same project
from .models import *
# from apps.upgrid.forms import ChangePasswordForm

#CustomerProgram

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
                msg = ('Email is not correct!')
                raise serializers.ValidationError(msg)

    def validate(self, attrs):

        username = self.get_username(attrs)
        password = base64.b64decode(attrs.get('password'))
        if username:
            user = UpgridBaseUser.objects.get(username=username)
            if user.check_password(password):
                if not user.is_active:
                    msg = ('User account is disabled.')
                    raise serializers.ValidationError(msg)

                payload = jwt_payload_handler(user)

                return {
                        'token': jwt_encode_handler(payload),
                        'user': user
                        }

            else:
                msg = ('Unable to login with provided credentials.')
                raise serializers.ValidationError(msg)

        else:
            msg = ('Must include "email" and "password".')
            raise serializers.ValidationError(msg)


class RefreshJWTSerializer(RefreshJSONWebTokenSerializer):
    def _check_user(self, payload):
        username = jwt_get_username_from_payload(payload)

        if not username:
            msg = ('Invalid payload.')
            raise serializers.ValidationError(msg)

        # Make sure user exists
        try:
            user = UpgridBaseUser.objects.get_by_natural_key(username)
        except UpgridBaseUser.DoesNotExist:
            msg = ("User doesn't exist.")
            raise serializers.ValidationError(msg)

        if not user.is_active:
            msg = ('User account is disabled.')
            raise serializers.ValidationError(msg)

        return user


# -------------------------User API Serializers------------------------------------

class UnivCustomerProgramSerializer(serializers.ModelSerializer):
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()
    has_expert_notes = SerializerMethodField()
    enhancement_update = SerializerMethodField()
    whoops_update = SerializerMethodField()

    class Meta:
        model = UniversityCustomerProgram
        fields = ('object_id', 'program_name', 'program_degree', 
                  'whoops_final_release', 'enhancement_final_release', 'customer_confirmation',
                  'has_expert_notes', 'enhancement_update', 'whoops_update')

    def get_program_name(self, obj):
        return obj.program.program_name

    def get_program_degree(self, obj):
        return obj.program.degree.name

    def get_has_expert_notes(self, obj):
        try:
            update_report = WhoopsUpdate.objects.get(customer=obj.customer, customer_program=obj, most_recent=True)
            print('univ customer lise')
            print(update_report.initial_diff)
            print(update_report.existing_report)
            print(update_report.cache_report)
            if update_report.initial_diff is None and update_report.existing_report is None:
                expert_notes = False
            elif not update_report.initial_diff is None and update_report.cache_report is None:
                expert_notes = False
            else:
                expert_notes = True
        except:
            expert_notes = False

        return expert_notes

    def get_enhancement_update(self, obj):
        try:
            eu = EnhancementUpdate.objects.get(customer=obj.customer, customer_program=obj, most_recent='True')
            serializer = ClientEnhancementUpdateNumberSerializer(eu)
            return serializer.data
        except:
            return 0

    def get_whoops_update(self, obj):
        try:
            wu = WhoopsUpdate.objects.get(customer=obj.customer, customer_program=obj, most_recent='True')
            serializer = ClientWhoopsUpdateNumberSerializer(wu)
            return serializer.data
        except:
            return 0


class EnhancementReleasedListSerializer(serializers.ModelSerializer):
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()

    class Meta:
        model = UniversityCustomerProgram
        fields = ('object_id', 'program_degree', 'program_name', 'enhancement_final_release_time')

    def get_program_name(self, obj):
            return obj.program.program_name

    def get_program_degree(self, obj):
            return obj.program.degree.name


class WhoopsReleasedListSerializer(serializers.ModelSerializer):
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()
    has_expert_notes = SerializerMethodField()

    class Meta:
        model = UniversityCustomerProgram
        fields = ('object_id', 'program_degree', 'program_name', 'whoops_final_release_time', 'has_expert_notes')

    def get_program_name(self, obj):
            return obj.program.program_name

    def get_program_degree(self, obj):
            return obj.program.degree.name

    def get_has_expert_notes(self, obj):
        try:
            print(obj.customer)
            print(obj)
            update_report = WhoopsUpdate.objects.get(customer=obj.customer, customer_program=obj, most_recent=True)
            print('whoos released list')
            print(update_report.initial_diff)
            print(update_report.existing_report)
            print(update_report.cache_report)
            if update_report.initial_diff is None and update_report.existing_report is None:
                expert_notes = False
            elif not update_report.initial_diff is None and update_report.cache_report is None:
                expert_notes = False
            else:
                expert_notes = True
        except:
            expert_notes = False

        return expert_notes

class EnhancementUpdateSerializer(serializers.ModelSerializer):
    customer_program_id = SerializerMethodField()
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()

    class Meta:
        model = EnhancementUpdate
        fields = ('customer_program_id', 'program_name', 'program_degree', 'last_edit_time')

    def get_customer_program_id(self, obj):
        return obj.customer_program.object_id

    def get_program_name(self, obj):
        return obj.customer_program.program.program_name

    def get_program_degree(self, obj):
        return obj.customer_program.program.degree.name


class WhoopsUpdateSerializer(serializers.ModelSerializer):
    customer_program_id = SerializerMethodField()
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()
    has_expert_notes = SerializerMethodField()

    class Meta:
        model = WhoopsUpdate
        fields = ('customer_program_id', 'program_name', 'program_degree', 'last_edit_time', 'has_expert_notes')

    def get_customer_program_id(self, obj):
        return obj.customer_program.object_id

    def get_program_name(self, obj):
        return obj.customer_program.program.program_name

    def get_program_degree(self, obj):
        return obj.customer_program.program.degree.name

    def get_has_expert_notes(self, obj):
        try:
            print('whoops update list ===================================================================================')
            print(obj.customer)
            update_report = obj
            print(update_report)
            print(update_report.initial_diff)
            print(update_report.existing_report)
            print(update_report.cache_report)
            if update_report.initial_diff is None and update_report.existing_report is None:
                expert_notes = False
                print('1')
            elif not update_report.initial_diff is None and update_report.cache_report is None:
                expert_notes = False
                print('2')
            else:
                expert_notes = True
        except Exception as e:
            print('3')
            print(e)
            expert_notes = False

        return expert_notes



class CompetingProgramSerializer(serializers.ModelSerializer):

    program_id = SerializerMethodField()
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()
    university = SerializerMethodField()
    school = SerializerMethodField()

    class Meta:
        model = CustomerCompetingProgram
        fields = ('object_id', 'program_id', 'program_name', 'program_degree', 'university',
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


class ManagerUseCompetingProgramSerializer(serializers.ModelSerializer):
    program = SerializerMethodField()

    class Meta:
        model = CustomerCompetingProgram
        fields = ('object_id', 'program', 'order', 'enhancement_status')

    def get_program(self, obj):
        serializer = CustomerAndCompetingProgramSerializer(obj.program)
        return serializer.data


class UniversityAndSchoolSerializer(serializers.ModelSerializer):
    university_school = SerializerMethodField()

    class Meta:
        model = UniversitySchool
        fields = ('object_id', 'university_school',)

    def get_university_school(self, obj):
        return '{0} : {1} -- {2}'.format(obj.ceeb, obj.university_foreign_key, obj.school)


# Used for main user get all his subuser detail

class SubuserListSerializer(serializers.ModelSerializer):
    customer_program = SerializerMethodField()
    university = SerializerMethodField()
    school = SerializerMethodField()

    class Meta:
        model = UniversityCustomer
        fields = ('username', 'id', 'is_active', 'email', 'can_ccemail', 'title', 'department',
                  'contact_name', 'position', 'phone', 'customer_program', 'university', 'school', 'account_type')

    def get_customer_program(self, obj):
        program_list = ClientAndProgramRelation.objects.filter(client=obj).values('client_program')
        programs = UniversityCustomerProgram.objects.filter(object_id__in=program_list)
        serializer = ClientProgramSerializer(programs, many=True)
        return serializer.data

    def get_university(self, obj):
        return obj.Ceeb.university_foreign_key.name

    def get_school(self, obj):
        return obj.Ceeb.school


class MainUserDetailSerializer(serializers.ModelSerializer):
    competing_schools = SerializerMethodField()
    non_degree_schools = SerializerMethodField()
    university = SerializerMethodField()
    school = SerializerMethodField()
    
    class Meta:
        model = UniversityCustomer
        fields = ('username', 'is_demo', 'Ceeb', 'university', 'school', 'service_level', 'service_until',
                  'account_type', 'position', 'contact_name', 'email', 'competing_schools', 'non_degree_schools',)

    def get_competing_schools(self, obj):
        serializer = UniversityAndSchoolSerializer(obj.competing_schools, many=True)
        return serializer.data

    def get_non_degree_schools(self, obj):
        serializer = UniversityAndSchoolSerializer(obj.non_degree_schools, many=True)
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
    non_degree_schools = SerializerMethodField()
    
    class Meta:
        model = UniversityCustomer
        fields = ('main_user_info', 'can_ccemail', 'is_demo', 'Ceeb', 'university', 'school', 'service_until',
                  'account_type', 'position', 'contact_name', 'email', 'non_degree_schools', )

    def get_main_user_info(self, obj):
        main_user = UniversityCustomer.objects.get(Ceeb=obj.Ceeb, account_type="main", id=obj.main_user_id)
        return MainuserInfoSerializer(main_user).data

    def get_university(self, obj):
        return obj.Ceeb.university_foreign_key.name

    def get_school(self, obj):
        return obj.Ceeb.school

    def get_non_degree_schools(self, obj):
        serializer = UniversityAndSchoolSerializer(obj.non_degree_schools, many=True)
        return serializer.data


class ClientAndProgramRelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientAndProgramRelation
        fields = ['object_id', 'client', 'client_program']


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
        fields = ('id', 'is_demo', 'contact_name', 'is_active', 'university', 'department', 'email', 'account_type',
                  'main_user_id',)

    def get_university(self, obj):
        return '{0} - {1}'.format(obj.Ceeb.university_foreign_key, obj.Ceeb.school,)


class ClientProgramSerializer(serializers.ModelSerializer):
    program = SerializerMethodField()
    competing_program = SerializerMethodField()

    class Meta:
        model = UniversityCustomerProgram
        fields = ('object_id', 'program', 'whoops_status', 'whoops_final_release', 'enhancement_final_release',
                  'customer_confirmation', 'competing_program')

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
    features = SerializerMethodField()

    class Meta:
        model = UniversityCustomer
        fields = ('username', 'id', 'is_demo', 'email', 'title', 'contact_name', 'position', 'position_level',
                  'phone', 'Ceeb', 'CeebID', 'department', 'account_type', 'service_level', 'service_until',
                  'competing_schools', 'customer_program', 'is_active','features')

    def get_Ceeb(self, obj):
        return '{0} - {1} - {2}'.format(obj.Ceeb.ceeb, obj.Ceeb.university_foreign_key, obj.Ceeb.school,)

    def get_CeebID(self, obj):
        return obj.Ceeb.object_id

    def get_competing_schools(self, obj):

        return UniversityAndSchoolSerializer(obj.competing_schools, many=True).data

    def get_customer_program(self, obj):
        programs = UniversityCustomerProgram.objects.filter(customer=obj)
        serializer = ClientProgramSerializer(programs, many=True)
        return serializer.data

    def get_features(self,obj):
        CustomerFeatureMapping.objects.filter(customer = obj)
        features = {'whoops':None,'enhancement':None,'non-degree':None,'AMP':None}

        for feature in features:
            if feature.name in features.keys():
                features['feature.name'] = True

        return features



class SubClientDetailSerializer(serializers.ModelSerializer):
    Ceeb = SerializerMethodField()
    CeebID = SerializerMethodField()
    competing_schools = SerializerMethodField()
    customer_program = SerializerMethodField()

    class Meta:
        model = UniversityCustomer
        fields = ('username', 'id', 'email', 'can_ccemail', 'is_active', 'title', 'contact_name', 'position',
                  'position_level', 'phone', 'Ceeb', 'CeebID', 'department', 'account_type', 'main_user_id',
                  'service_level', 'service_until', 'competing_schools', 'customer_program')

    def get_Ceeb(self, obj):
        return '{0} - {1} - {2}'.format( obj.Ceeb.ceeb, obj.Ceeb.university_foreign_key, obj.Ceeb.school,)

    def get_CeebID(self, obj):
        return obj.Ceeb.object_id

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
        return "{0} -- {1} -- {2}".format(obj.university_school, obj.program_name, obj.degree.name)

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
                  'program_university', 'program_school', 'program_name', 'program_degree','department')

    def get_program_university(self, obj):
        return obj.university_school.university_foreign_key.name

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
            assignment_object = ProgramAssignment.objects.get(program=obj)
            if assignment_object.status == 'Done':
                assign_status = 'Done'
            else:
                assign_status = 'In_Progress'
            return assign_status
        except ProgramAssignment.DoesNotExist:
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


# -----------------------------Update Serializers--------------------------------
class ManagerUpdateDashBoardSerializer(serializers.ModelSerializer):
    university = SerializerMethodField()
    has_update = SerializerMethodField()

    class Meta:
        model = UniversityCustomer
        fields = ('id', 'contact_name', 'email', 'has_update', 'university', 'department')

    def get_university(self, obj):
        return '{0} - {1}'.format(obj.Ceeb.university_foreign_key, obj.Ceeb.school,)

    def get_has_update(self, obj):
        eus = EnhancementUpdate.objects.filter(customer=obj, most_recent=True).exclude(initial_diff__isnull=True)
        wus = WhoopsUpdate.objects.filter(customer=obj, most_recent=True).exclude(initial_diff__isnull=True)
        context = {"enhancement_update": len(eus), "whoops_update": len(wus)}
        return context


class ManagerEnhancementUpdateNumberSerializer(serializers.ModelSerializer):
    update_nums = SerializerMethodField()
    customer_program = SerializerMethodField()
    customer_program_id = SerializerMethodField()

    class Meta:
        model = EnhancementUpdate
        fields = ('update_nums', 'customer_program', 'customer_program_id')

    def get_update_nums(self, obj):
        if obj.initial_diff is None:
            return 0
        else:
            print('111')
            json_string = zlib.decompress(obj.initial_diff)
            json_string = BytesIO(json_string)
            res = JSONParser().parse(json_string)
            print('diff_count')
            print(res)
            length = res['diff_count']
            return length

    def get_customer_program(self, obj):
        serializer = ProgramSerializer(obj.customer_program.program)
        return serializer.data
    
    def get_customer_program_id(self, obj):
        return obj.customer_program.object_id


class ManagerWhoopsUpdateNumberSerializer(serializers.ModelSerializer):
    update_nums = SerializerMethodField()
    customer_program = SerializerMethodField()
    customer_program_id = SerializerMethodField()

    class Meta:
        model = WhoopsUpdate
        fields = ('update_nums', 'customer_program', 'customer_program_id')

    def get_update_nums(self, obj):

        if not obj.initial_diff:
            return 0
        else:
            json_string = zlib.decompress(obj.initial_diff)
            json_string = BytesIO(json_string)
            res = JSONParser().parse(json_string)
            length = 0
            for v in res["new"]:
                length += 1
            return length

    def get_customer_program(self, obj):
        serializer = ProgramSerializer(obj.customer_program.program)
        return serializer.data

    def get_customer_program_id(self, obj):
        return obj.customer_program.object_id


class ClientEnhancementUpdateNumberSerializer(serializers.ModelSerializer):
    update_nums = SerializerMethodField()

    class Meta:
        model = EnhancementUpdate
        fields = ('update_nums', )

    def get_update_nums(self, obj):
        if obj.confirmed_diff is None:
            return 0
        else:
            json_string = zlib.decompress(obj.confirmed_diff)
            json_string = BytesIO(json_string)
            res = JSONParser().parse(json_string)
            length = 0
            print(res)
            length = res['diff_count']
            print(length)
            return length


class ClientWhoopsUpdateNumberSerializer(serializers.ModelSerializer):
    update_nums = SerializerMethodField()

    class Meta:
        model = WhoopsUpdate
        fields = ('update_nums',)

    def get_update_nums(self, obj):

        if not obj.update_diff:
            return 0
        else:
            json_string = zlib.decompress(obj.update_diff)
            json_string = BytesIO(json_string)
            res = JSONParser().parse(json_string)
            length = 0
            for v in res["new"]:
                length += 1
            return length






class UnconfirmedProgramsSerializer(serializers.ModelSerializer):
    program_name = SerializerMethodField()
    program_degree = SerializerMethodField()
    has_expert_notes = SerializerMethodField()
    enhancement_update = SerializerMethodField()
    whoops_update = SerializerMethodField()
    has_competing = SerializerMethodField()

    class Meta:
        model = UniversityCustomerProgram
        fields = ('object_id', 'program_name', 'program_degree', 
                  'whoops_final_release', 'enhancement_final_release', 'customer_confirmation',
                  'has_expert_notes', 'enhancement_update', 'whoops_update','has_competing')
    
    def get_has_competing(self,obj):
        return CustomerCompetingProgram.objects.filter(customer_program = obj.object_id).exists()
        

    def get_program_name(self, obj):
        return obj.program.program_name

    def get_program_degree(self, obj):
        return obj.program.degree.name

    def get_has_expert_notes(self, obj):
        try:
            update_report = WhoopsUpdate.objects.get(customer=obj.customer, customer_program=obj, most_recent=True)
            print('unconfirmed program list')
            print(update_report.initial_diff)
            print(update_report.existing_report)
            print(update_report.cache_report)
            if update_report.initial_diff is None and update_report.existing_report is None:
                expert_notes = False
            elif not update_report.initial_diff is None and update_report.cache_report is None:
                expert_notes = False
            else:
                expert_notes = True
        except:
            expert_notes = False

        return expert_notes


    def get_enhancement_update(self, obj):
        try:
            eu = EnhancementUpdate.objects.get(customer=obj.customer, customer_program=obj, most_recent='True')
            serializer = ClientEnhancementUpdateNumberSerializer(eu)
            return serializer.data
        except EnhancementUpdate.DoesNotExist:
            return 0

    def get_whoops_update(self, obj):
        try:
            wu = WhoopsUpdate.objects.get(customer=obj.customer, customer_program=obj, most_recent='True')
            serializer = ClientWhoopsUpdateNumberSerializer(wu)
            return serializer.data
        except WhoopsUpdate.DoesNotExist:
            return 0
