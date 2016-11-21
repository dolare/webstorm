# System lib
import base64

from django.core.mail import BadHeaderError, EmailMessage
from django.db.models import Q
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _

# 3rd party lib
from rest_framework import generics
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT, HTTP_403_FORBIDDEN )
from rest_framework.views import APIView
from django.utils.six import BytesIO
from rest_framework.parsers import JSONParser

from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.views import ObtainJSONWebToken
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

import weasyprint

# Our lib
from ceeb_program.models import (
    Curriculum, Deadline, Duration, Program, Requirement, Scholarship, Tuition,
    UniversitySchool
    )

# lib in same project
from .pagination import CustomerPageNumberPagination
from .models import (
    UpgridAccountManager, UniversityCustomer, UniversityCustomerProgram,
    CustomerCompetingProgram, ClientAndProgramRelation, WhoopsReports,
    EnhancementReports)
from .api_serializers import * 

# used shared report
import zlib
from datetime import datetime
from . import dbSerializers as dbLizer

from rest_framework.renderers import JSONRenderer
from django.core.exceptions import ObjectDoesNotExist

# ----------------------Login / Password ----------------------------------------

# api/access_token/


class CustomizeJWT(ObtainJSONWebToken):
    serializer_class = Login2Serializer


# api/password/
class PasswordChangeView(generics.GenericAPIView):
    def check_old_password(self, old_password):
        decoded_old_password = base64.b64decode(old_password)
        return decoded_old_password

    def check_new_password(self, new_password):
        decoded_new_password = base64.b64decode(new_password)
        return decoded_new_password

    def put(self, request):
        username = request.user.username
        if username:
            decoded_old_password = self.check_old_password(request.data['old_password'])
            user = UpgridBaseUser.objects.get(username=username)
            if user.check_password(decoded_old_password):
                decoded_new_password = self.check_new_password(request.data['new_password'])

                user.set_password(decoded_new_password)
                user.save()
                return Response({"success": _("New password has been saved.")}, status=HTTP_202_ACCEPTED)
            return Response({"Failed": _("Please input valid old password.")}, status=HTTP_403_FORBIDDEN)
        return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)        


# api/password/reset/send_email/
class ResetPassword(generics.GenericAPIView):

    @permission_classes((AllowAny,))
    def post(self, request):
        text = "Password Reset email has been send! If you do not receive reset email within the next 5 minutes,"
        "please check your email address if it has registered."

        try:
            user_reset = UniversityCustomer.objects.get(email=request.data['email'])
        except UniversityCustomer.DoesNotExist:
            return HttpResponse(text,HTTP_200_OK)
        if user_reset:
            payload = jwt_payload_handler(user_reset)
            token = jwt_encode_handler(payload)

            if token:
                try:
                    # username = user_reset.username
                    html_content = ("Hello, %s! <br>You're receiving this email"
                                    "because you requested a password reset for your user account"
                                    "at Upgrid!<br>Please go to the following page and choose a new"
                                    "password: http://%s/static/angular-seed/app/index.html#/upgrid/reset/%s/.<br>")
                    message = EmailMessage(subject='Reset Password', body=html_content %(user_reset.contact_name,
                                           request.META['HTTP_HOST'], token), to=[request.data['email']])
                    message.content_subtype = 'html'
                    message.send()
                except BadHeaderError:
                    return HttpResponse(text, status=HTTP_200_OK)
                return HttpResponse(text, status=HTTP_200_OK)
        return HttpResponse(text, status=HTTP_200_OK)

    def validate(self, data):
        decoded_string = base64.b64decode(data)
        return decoded_string

    def put(self, request):
        user = request.user
        encoded_password = request.data['password']
        password = self.validate(encoded_password)
        user.set_password(password)
        user.save()
        return Response({"success": _("New password has been saved.")},status=HTTP_202_ACCEPTED)


# ------------------------------User API--------------------------------------------

# api/user/program
class CustomerProgram(generics.ListAPIView):
    """
    Get customer's selected program
    """
    serializer_class = UnivCustomerProgramSerializer
    pagination_class = CustomerPageNumberPagination

    def get_queryset(self, *args, **kwargs):
        program_name = self.request.GET.get("name")
        program_degree = self.request.GET.get("degree")
        whoops_final_release = self.request.GET.get("wfs")
        enhancement_final_release = self.request.GET.get("efs")
        confirmation_status = self.request.GET.get("cs")
        order = self.request.GET.get("order")
        client_id = self.request.GET.get("cid")
        if order == "oname":
            order = 'program__program_name'

        elif order == "-oname":
            order = '-program__program_name'

        elif order == "degree":
            order = 'program__degree__name'

        elif order == "-degree":
            order = '-program__degree__name'

        elif order == 'cs':
            order = 'customer_confirmation'

        elif order == '-cs':
            order = '-customer_confirmation'

        elif order == 'wfs':
            order = 'whoops_final_release'

        elif order == '-wfs':
            order = '-whoops_final_release'

        elif order == 'efs':
            order = 'enhancement_final_release'

        elif order == '-efs':
            order = '-enhancement_final_release'

        try:
            user = UniversityCustomer.objects.get(id=self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=self.request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=client_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)

        if user.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client=user).values('client_program')
            query_list = UniversityCustomerProgram.objects.filter(customer=user.main_user_id,
                                                                  object_id__in=customer_programs)
        else:
            query_list = UniversityCustomerProgram.objects.filter(customer=user).order_by(order)
        if program_name:
            query_list = query_list.filter(
                Q(program__program_name__icontains=program_name)
                ).order_by(order)
        if program_degree:
            query_list = query_list.filter(
                Q(program__degree__name__icontains=program_degree)
                ).order_by(order)
        if whoops_final_release:
            query_list = query_list.filter(
                Q(whoops_final_release=whoops_final_release)
                ).order_by(order)
        if enhancement_final_release:
            query_list = query_list.filter(
                Q(enhancement_final_release=enhancement_final_release)
                ).order_by(order)
        if confirmation_status:
            query_list = query_list.filter(
                Q(customer_confirmation=confirmation_status)
                ).order_by(order)
        return query_list
        

# api/user/competing_program
class CustomerCompetingProgramAPI(APIView):

    def get_object(self, request, object_id, client_id):

        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=client_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)

        if user.account_type == 'sub':
            program_list = UniversityCustomerProgram.objects.get(customer=user.main_user_id, object_id=object_id)
            return program_list
        else:            
            try:
                program_list = UniversityCustomerProgram.objects.get(object_id=object_id, customer=user)
                return program_list
            except UniversityCustomerProgram.DoesNotExist:
                return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)

    def get(self, request, object_id, client_id=None):
        customer_program = self.get_object(request, object_id, client_id)
        serializer = CustomerCompetingProgramSerializer(customer_program)
        return Response(data=serializer.data)


# numbers of finalreleased whoops reports
class FinalReleasedWhoops(APIView):

    def get_object(self, request, object_id):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=object_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)

        return user

    def get(self, request, object_id=None):
        customer = self.get_object(request, object_id)

        if customer.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client=customer).values('client_program')
            final_true_program = UniversityCustomerProgram.objects.filter(customer=customer.main_user_id,
                                                                          object_id__in=customer_programs,
                                                                          whoops_final_release='True').count()
        else:
            final_true_program = UniversityCustomerProgram.objects.filter(customer=customer,
                                                                          whoops_final_release='True').count()
        return Response(data=final_true_program, status=HTTP_200_OK)


# numbers of final_released enhancement reports
class FinalReleasedEnhancement(APIView):

    def get_object(self, request, object_id):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=object_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)

        return user

    def get(self, request, object_id=None):
        customer = self.get_object(request, object_id)
        if customer.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client=customer).values('client_program')
            final_true_program = UniversityCustomerProgram.objects.filter(customer=customer.main_user_id,
                                                                          object_id__in=customer_programs,
                                                                          enhancement_final_release='True').count()
        else:
            final_true_program = UniversityCustomerProgram.objects.filter(customer=customer,
                                                                          enhancement_final_release='True').count()
        return Response(data=final_true_program, status=HTTP_200_OK)


# api/upgrid/user/dashboard/    used for full fill dashboard data requirement
class DashBoardAPI(APIView):
    def get_object(self, request, object_id):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=object_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)
 
        return user

    def get_program_list(self, customer):
        if customer.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client=customer).values('client_program')
            program_list = UniversityCustomerProgram.objects.filter(customer=customer.main_user_id,
                                                                    object_id__in=customer_programs)
        else:
            program_list = UniversityCustomerProgram.objects.filter(customer=customer)
        return program_list

    def get_final_released_enhancement_nums(self, customer):
        program_list = self.get_program_list(customer)
        final_true_program = program_list.filter(enhancement_final_release='True').count()
        return final_true_program

    def get_final_released_whoops_nums(self, customer):
        program_list = self.get_program_list(customer)
        final_true_program = program_list.filter(whoops_final_release='True').count()
        return final_true_program

    def get_customer_program_nums(self, customer):
        program_list = self.get_program_list(customer)
        customer_programs = program_list.count()
        return customer_programs

# To get all the programs belongs to a Ceeb and department
    def get_ceeb_program_nums(self, customer):
        programs = Program.objects.filter(university_school=customer.Ceeb).count()
        return programs

    def get_unconfirmed_program_nums(self, customer):
        program_list = self.get_program_list(customer)
        programs = program_list.filter(customer_confirmation='No').count()
        return programs
    
    def get(self, request, object_id=None):
        customer = self.get_object(request, object_id)
        final_released_enhancement = self.get_final_released_enhancement_nums(customer)
        final_released_whoops = self.get_final_released_whoops_nums(customer)
        customer_program_nums = self.get_customer_program_nums(customer)
        ceeb_program_nums = self.get_ceeb_program_nums(customer)
        unconfirmed_program_nums = self.get_unconfirmed_program_nums(customer)
        context = {"final_released_enhancement": final_released_enhancement,
                   "final_released_whoops": final_released_whoops, "customer_program_nums": customer_program_nums,
                   "ceeb_program_nums": ceeb_program_nums, "unconfirmed_program_nums": unconfirmed_program_nums}
        return Response(context)


# Get user's basic information / 
class CustomerDetail(APIView):
    def get_object(self, request, client_id):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
            return user
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=client_id, account_manager=manager)
                    return user
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except UpgridAccountManager.DoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)

    def get(self, request, client_id=None):
        customer = self.get_object(request, client_id)
        if customer.account_type == 'main':
            serializer = MainUserDetailSerializer(customer)
            return Response(data=serializer.data)
        else:
            serializer = SubUserDetailSerializer(customer)
            return Response(data=serializer.data)


# Post create new sub_user/ Put change sub_user's is_active status
class CreateOrChangeSubUser(APIView):

    def get_subuser(self, request):
        try:
            sub_user = UniversityCustomer.objects.get(id=request.data['sub_user_id'])
            main_user = UniversityCustomer.objects.get(id=request.user.id)
            if main_user.Ceeb == sub_user.Ceeb:
                if main_user.account_type == "main":
                    if sub_user.account_type == "sub":
                        return sub_user
                    else:
                        return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
                else:
                    return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)            
            else:
                return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)

        except UniversityCustomer.DoesNotExist:
            raise Http404

    def validate(self, data):
        decoded_string = base64.b64decode(data)
        return decoded_string

    def put(self, request):
        sub_user = self.get_subuser(request)
        if request.data['is_active'] == 'False':
            sub_user.is_active = False
            sub_user.save()
            return Response({"success": _("Sub user has been deactived.")}, status=HTTP_200_OK)
        else:
            sub_user.update(
                title=request.data['title'],
                contact_name=request.data['username'],
                department=request.data['department'],
                position=request.data['position'],
                position_level=request.data['position_level'],
                phone=request.data['phone'],
            )
            sub_user.save()
            # update Client And Program relation for sub user
            ClientAndProgramRelation.objects.filter(client=sub_user).delete()
            for i in request.data['customer_program_id']:
                selected_program = ClientAndProgramRelation.objects.create(
                    client=sub_user,
                    client_program=UniversityCustomerProgram.objects.get(object_id=i)
                )
                selected_program.save()

    def post(self, request):
        try:
            main_user = UniversityCustomer.objects.get(id=request.user.id, account_type='main')
        except UniversityCustomer.DoesNotExist:
            return Response({"failed": _("Permission Denied.")}, status=HTTP_403_FORBIDDEN)
        
        sub_service_until = main_user.service_until
        university_school = UniversitySchool.objects.get(ceeb=main_user.Ceeb.ceeb)
        user = UniversityCustomer.objects.create(
            username=request.data['username'],
            email=request.data['email'],
            Ceeb=university_school,
            # department = self.request.data['department'],
            main_user_id=main_user.id,
            account_manager=main_user.account_manager,
            title=request.data['title'],
            contact_name=request.data['contact_name'],
            position=request.data['position'],
            position_level=request.data['position_level'],
            phone=request.data['phone'],
            service_until=sub_service_until)

        decoded_new_password = self.validate(self.request.data['password'])
        user.set_password(decoded_new_password)
        user.save()

        # create corresponding customer programs of subuser
        programs_id = self.request.data['customer_programs']
        customer_program_id = programs_id.split('/')
        for i in customer_program_id:
            main_customer_program = UniversityCustomerProgram.objects.get(object_id=i)
        
            sub_customer_program = ClientAndProgramRelation.objects.create(
                client=user,
                client_program=main_customer_program
                )
            sub_customer_program.save()
        return Response({"success": _("Sub user has been created.")}, status=HTTP_201_CREATED)


# ----------------------------Report API---------------------------------------------
class ShareReports(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def check_permission(self, request):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=request.GET['client_id'], account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)

        if not request.data['whoops_id'] is None:
            whoops_id = request.data['whoops_id'].split('/')
            for x in whoops_id:
                if user.account_type == 'sub':
                    try:
                        ClientAndProgramRelation.objects.get(client=user,
                                                             client_program=x)
                        UniversityCustomerProgram.objects.get(object_id=x,
                                                              customer=user.main_user_id, whoops_final_release='True')
                    except ObjectDoesNotExist:
                        return False
                else:
                    try:
                        UniversityCustomerProgram.objects.get(object_id=x,
                                                              customer=user, whoops_final_release='True')
                    except UniversityCustomerProgram.DoesNotExist:
                        return False

        if not request.data['enhancement_id'] is None:
            enhancement_id = request.data['enhancement_id'].split('/')
            for y in enhancement_id:
                if user.account_type == 'sub':
                    try:
                        ClientAndProgramRelation.objects.get(client=user,
                                                             client_program=y)
                        UniversityCustomerProgram.objects.get(object_id=y,
                                                              customer=user.main_user_id,
                                                              enhancement_final_release='True')
                    except ObjectDoesNotExist:
                        return False
                else:
                    try:
                        UniversityCustomerProgram.objects.get(object_id=y,
                                                              customer=user, enhancement_final_release='True')
                    except UniversityCustomerProgram.DoesNotExist:
                        return False
        return True

    def get_whoops_object(self, whoops_id):
        program_id = UniversityCustomerProgram.objects.get(object_id=whoops_id)
        program = Program.objects.get(object_id=program_id.program.object_id)
        ean = program.expertadditionalnote_set.all()
        return ean, program_id

    def get_enhancement_object(self, enhancement_id):
        program_list = []
        customer_program = UniversityCustomerProgram.objects.select_related('program').get(
            object_id=enhancement_id)
        self_program = Program.objects.get(object_id=customer_program.program.object_id)
        program_list.append(self_program)
        competing_program = customer_program.customercompetingprogram_set.all().select_related('program')\
            .order_by('order')
        for cp in competing_program:
            program = Program.objects.get(object_id=cp.program.object_id)
            program_list.append(program)
        return program_list

    def get(self, request, object_id, token):

        expired_period = 3600*48
        obj = get_object_or_404(SharedReportsRelation, object_id=object_id)
        if str(obj.access_token) != str(token):
            return Response("Invalid Token !", status=HTTP_403_FORBIDDEN)
        else:
            # final_res = {}
            res_whoops = []
            res_enhancement = []
            date = obj.created_time
            period = timezone.now()-date
            if period.total_seconds() > expired_period:
                return Response("Token Expired!", status=HTTP_403_FORBIDDEN)
            else:
                whoops_report_list = obj.whoopsreportsrepo_set.all().filter(wr_share_relation=object_id)
                enhancement_report_list = obj.enhancementreportsrepo_set.all().\
                    filter(er_share_relation=object_id)
                if whoops_report_list is not None:
                    for x in whoops_report_list:
                        whoops_json_string = zlib.decompress(x.wr_whoops_report)
                        whoops_json_string = BytesIO(whoops_json_string)
                        whoops_json_object = JSONParser().parse(whoops_json_string)
                        res_whoops.append(whoops_json_object)
                if enhancement_report_list is not None:
                    for y in enhancement_report_list:
                        enhancement_json_string = zlib.decompress(y.er_enhancement_report)
                        enhancement_json_string = BytesIO(enhancement_json_string)
                        enhancement_json_object = JSONParser().parse(enhancement_json_string)
                        res_enhancement.append(enhancement_json_object)

            final_res = [{'whoops': res_whoops}, {'enhancement': res_enhancement}]
            final_res = JSONRenderer().render(final_res)
            return HttpResponse(final_res, content_type="application/json")

    def post(self, request):
        perm = self.check_permission(request)
        if not perm:
            return Response({"Failed": _("Permission denied!")}, status=HTTP_403_FORBIDDEN)
        else:
            time_now = timezone.now()
            relation_ship = SharedReportsRelation.objects.create(
                created_by=request.user,
                created_time=time_now,
            )
            relation_ship.save()
            if not request.data['whoops_id'] is None:
                whoops_id_list = request.data['whoops_id'].split('/')
                for x in whoops_id_list:
                    ean, program = self.get_whoops_object(x)
                    if not len(ean) == 0:
                        info = {'university': program.program.university_school.university_foreign_key.name,
                                'school': program.program.university_school.school,
                                'program': program.program.program_name, 'degree': program.program.degree.name}
                        res = dbLizer.ExpertAdditionalNoteSerializer(ean, many=True)
                        arr = res.data
                        arr.append(info)
                        json_str = JSONRenderer().render(arr)
                        raw_data = zlib.compress(json_str)
                        w_obj = WhoopsReportsRepo(
                            wr_created=time_now,
                            wr_customer_program=program,
                            wr_whoops_report=raw_data,
                            wr_share_relation=relation_ship)
                        w_obj.save()

            if not request.data['enhancement_id'] is None:
                enhancement_id_list = request.data['enhancement_id'].split('/')
                for y in enhancement_id_list:
                    total_program = self.get_enhancement_object(y)
                    json_data = {}
                    length = len(total_program)

                    for i in range(1, length + 1):
                        program = "p" + (str(i) if i > 1 else "")
                        curriculum = "c" + (str(i) if i > 1 else "")
                        tuition = "t" + (str(i) if i > 1 else "")
                        deadline = "d" + (str(i) if i > 1 else "")
                        requirement = "r" + (str(i) if i > 1 else "")
                        required_exam = "ex" + (str(i) if i > 1 else "")
                        intl_transcript = "Intl_transcript" + (str(i) if i > 1 else "")
                        intl_eng_test = "Intl_eng_test" + (str(i) if i > 1 else "")
                        scholarship = "s" + (str(i) if i > 1 else "")
                        duration = "dura" + (str(i) if i > 1 else "")
                        empty = None
                        try:
                            p_value = total_program[i - 1]
                        except Program.DoesNotExist:
                            return HttpResponse(status=Http404)

                        try:
                            c_value = Curriculum.objects.get(program=total_program[i - 1], )
                        except ObjectDoesNotExist:
                            c_value = empty
                        try:
                            t_value = Tuition.objects.get(program=total_program[i - 1], )
                        except ObjectDoesNotExist:
                            t_value = empty
                        try:
                            d_value = Deadline.objects.get(program=total_program[i - 1], )
                        except ObjectDoesNotExist:
                            d_value = empty
                        try:
                            dura_value = Duration.objects.get(program=total_program[i - 1])
                        except Duration.DoesNotExist:
                            dura_value = "empty"
                        try:
                            r_value = Requirement.objects.get(program=total_program[i - 1], )
                        except ObjectDoesNotExist:
                            r_value = empty
                        try:
                            s_value = Scholarship.objects.get(program=total_program[i - 1], )
                        except ObjectDoesNotExist:
                            s_value = empty

                        if r_value:
                            r_e_value = r_value.exam.all()  # get django queryset
                            i_value = r_value.intl_transcript.all()
                            i_e_t_value = r_value.intl_english_test.all()
                        else:
                            r_e_value = empty
                            i_value = empty
                            i_e_t_value = empty

                        # convert db instance to serializer
                        p_value = dbLizer.ProgramSerializer(p_value)
                        c_value = dbLizer.CurriculumSerializer(c_value)
                        t_value = dbLizer.TuitionSerializer(t_value)
                        d_value = dbLizer.DeadlineSerializer(d_value)
                        r_value = dbLizer.RequirementSerializer(r_value)

                        r_e_value = dbLizer.ExamSerializer(r_e_value, many=True)
                        i_value = dbLizer.TranscriptEvaluationProviderSerializer(i_value, many=True)
                        i_e_t_value = dbLizer.InternationalEnglishTestSerializer(i_e_t_value, many=True)
                        s_value = dbLizer.ScholarshipSerializer(s_value)
                        dura_value = dbLizer.DurationSerializer(dura_value)

                        json_data[program] = p_value.data  # return unordered map if empty would be a empty list
                        json_data[curriculum] = c_value.data
                        json_data[tuition] = t_value.data
                        json_data[deadline] = d_value.data
                        json_data[requirement] = r_value.data
                        json_data[required_exam] = r_e_value.data
                        json_data[intl_transcript] = i_value.data
                        json_data[intl_eng_test] = i_e_t_value.data
                        json_data[scholarship] = s_value.data
                        json_data[duration] = dura_value.data

                    json_data["length"] = length

                    json_str = JSONRenderer().render(json_data)  # render to bytes with utf-8 encoding
                    raw_data = zlib.compress(json_str)
                    customer_program = UniversityCustomerProgram.objects.get(object_id=y)
                    e_obj = EnhancementReportsRepo.objects.create(er_customer_program=customer_program,
                                                                  er_enhancement_report=raw_data,
                                                                  er_created=time_now,
                                                                  er_share_relation=relation_ship)
                    e_obj.save()

            res = {'{0}/{1}'.format(relation_ship.object_id, relation_ship.access_token)}
            return Response(res)



# Get Ehancement Reports / Put change confirmation status of a enhancement report.
class EnhancementReportsAPI(APIView):
    def get_user(self, request, client_id=None):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
            return user
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=client_id, account_manager=manager)
                    return user
                except UniversityCustomer.DoesNotExist:
                    return False
            except ObjectDoesNotExist:
                return False

    def get_listobjects(self, request):
        total_program = request.data['object_id'].split('/')
        program_list = []
        try:
            for p in total_program:
                cp = UniversityCustomerProgram.objects.get(object_id=p)
                program_list.append(cp)
            return program_list
        except UniversityCustomerProgram.DoesNotExist:
            raise Http404

    def put(self, request):
        user = self.get_user(request)        
        if not user:
            return Response({"Failed": _("Permission Denied! ")}, status=HTTP_403_FORBIDDEN)
        
        if not user.account_type == 'main':
            return Response({"Failed": _("Only main account can make enhancement report confirmation! ")},
                            status=HTTP_403_FORBIDDEN)

        cp_list = self.get_listobjects(request)
        for p in cp_list:
            if not p.customer == user:
                    return Response({"Failed": _("You don not have access to this program.! ")},
                                    status=HTTP_403_FORBIDDEN)
            p.customer_confirmation = "Yes"
            p.save()

        return Response({"Success": _("Confirmation status has been set!")}, status=HTTP_202_ACCEPTED)

# ------------------------------------Account Manager APIs---------------------------------------
# check is_account manager


class IsAccountManager(APIView):
    def is_manager(self, request):
        try:

            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request):
        is_manager = self.is_manager(request)
        if is_manager:
            return Response("True", status=HTTP_200_OK)
        return Response("False", status=HTTP_200_OK)


# get account manager's information
class AccountManager(APIView):
    def get_object(self, request):
        try:
            return UpgridAccountManager.objects.get(id=request.user.id)
        except UpgridAccountManager.DoesNotExist:
            raise Http404

    def get(self, request):
        manager = self.get_object(request)
        serializer = AccountManagerSerializer(manager)
        if manager:
            return Response(data=serializer.data, status=HTTP_200_OK)
        else:
            return Response({"Failed": _("Pleas login first!")}, status=HTTP_403_FORBIDDEN)


#Client CRUD
class ClientCRUD(APIView):
    def check_manager_permission(self, request, object_id):
        try:
            manager = UpgridAccountManager.objects.get(id=request.user.id)
            client = UniversityCustomer.objects.select_related('account_manager').get(id=object_id)
            if manager.id == client.account_manager.id:
                return True
            else:
                return False
        except ObjectDoesNotExist:
            return False

    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    # decode password
    def decode_password(self, data):
        decoded_string = base64.b64decode(data)
        return decoded_string

    def get_object(self, object_id):
        try:
            client = UniversityCustomer.objects.get(id=object_id)
            return client
        except UniversityCustomer.DoesNotExist:
            raise Http404

    def get(self, request, object_id):
        perm = self.check_manager_permission(request, object_id)
        if not perm:
            return Response({"Failed": _("You don't have permission to see this client info!")},
                            status=HTTP_403_FORBIDDEN)

        client = self.get_object(object_id)
        if client.account_type == 'sub':
            serializer = SubClientDetailSerializer(client)
            return Response(serializer.data, status=HTTP_200_OK)
        else:
            serializer = MainClientDetailSerializer(client)
            return Response(serializer.data, status=HTTP_200_OK)

    def post(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        # create sub client object
        if 'main_user_id' in self.request.POST:
            main_user = UniversityCustomer.objects.get(object_id=request.data['main_user_id'])
            university_school = UniversitySchool.objects.get(object_id=main_user.Ceeb.object_id)
            client = UniversityCustomer.objects.create(
                username=self.request.data['username'],
                email=self.request.data['email'],
                Ceeb=university_school,
                department=self.request.data['department'],
                account_type=self.request.data['account_type'],
                service_level=main_user.service_level,
                account_manager=UpgridAccountManager.objects.get(id=main_user.account_manager),
                title=self.request.data['title'],
                contact_name=self.request.data['contact_name'],
                position=self.request.data['position'],
                position_level=self.request.data['position_level'],
                phone=self.request.data['phone'],
                service_until=main_user.service_until,
                )
        # create main client object
        else:
            university_school = UniversitySchool.objects.get(object_id=self.request.data['ceeb'])
            client = UniversityCustomer.objects.create(
                username=self.request.data['username'],
                email=self.request.data['email'],
                Ceeb=university_school,
                department=self.request.data['department'],
                account_type=self.request.data['account_type'],
                service_level=self.request.data['service_level'],
                account_manager=UpgridAccountManager.objects.get(id=self.request.user.id),
                title=self.request.data['title'],
                contact_name=self.request.data['contact_name'],
                position=self.request.data['position'],
                position_level=self.request.data['position_level'],
                phone=self.request.data['phone'],
                service_until=self.request.data['service_until'],
                )

        decoded_new_password = self.decode_password(self.request.data['password'])
        client.set_password(decoded_new_password)
        client.save()
        # for main user add competing_schools

        for cp in self.request.data['competing_schools']:
            school = UniversitySchool.objects.get(object_id=cp.get('object_id'))
            client.competing_schools.add(school)
        return Response({'client_id': client.id}, status=HTTP_201_CREATED)

    def put(self,request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)

        if 'main_user_id' in self.request.PUT:
            main_user = UniversityCustomer.objects.get(object_id=request.data['main_user_id'])
            university_school = UniversitySchool.objects.get(object_id=self.request.data['ceeb'])
            client = UniversityCustomer.objects.get(object_id=self.request.data['client_id']).update(
                username=self.request.data['username'],
                email=self.request.data['email'],
                Ceeb=university_school,
                department=self.request.data['department'],
                account_type=self.request.data['account_type'],
                account_manager=self.request.user.id,
                title=self.request.data['title'],
                contact_name=self.request.data['contact_name'],
                position=self.request.data['position'],
                position_level=self.request.data['position_level'],
                phone=self.request.data['phone'],
                service_until=main_user.service_until,
                )
            client.save()
        else:
            university_school = UniversitySchool.objects.get(object_id=self.request.data['ceeb'])
            client = UniversityCustomer.objects.get(object_id=self.request.data['client_id']).update(
                username=self.request.data['username'],
                email=self.request.data['email'],
                Ceeb=university_school,
                department=self.request.data['department'],
                account_type=self.request.data['account_type'],
                service_level=self.request.data['service_level'],
                account_manager=self.request.user.id,
                title=self.request.data['title'],
                contact_name=self.request.data['contact_name'],
                position=self.request.data['position'],
                position_level=self.request.data['position_level'],
                phone=self.request.data['phone'],
                service_until=self.request.data['service_until'],
                )
            client.save()

        client.competing_schools.clear()
        for cp in self.request.data['competing_schools']:
            school = UniversitySchool.objects.get(object_id=cp['object_id'])
            client.competing_schools.add(school)
        return Response({"success": _("User has been modified.")}, status=HTTP_202_ACCEPTED)

    def delete(self,request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        try:
            client = UniversityCustomer.objects.get(object_id=request.data['client_id'])
            client.is_active = False
            client.save()
            return Response({"Success": _("User deleted!")}, status=HTTP_204_NO_CONTENT)
        except UniversityCustomer.DoesNotExists:
            return Response({"Failed": _("User doesn't exists!")}, status=HTTP_403_FORBIDDEN)


class UniversityCustomerProgramCRUD(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def post(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        client = UniversityCustomer.objects.get(id=request.data['client_id'])
        if client.account_type == 'sub':
            sub_program_list = self.request.data['sub_client_program'].split('/')
            for cp in sub_program_list:
                ClientAndProgramRelation.objects.create(
                    client=client,
                    client_program=cp,
                    ).save()
            return Response({"success": _("User programs has been created.")}, status=HTTP_201_CREATED)
        else:
            for p in self.request.data['selected_customer_program']:
                program = Program.objects.get(object_id=p.get('program_id'))
                customer_program = UniversityCustomerProgram.objects.create(
                    customer=client,
                    program=program,
                    whoops_status=p.get('whoops_status'),
                    whoops_final_release=p.get('whoops_final_release'),
                    enhancement_final_release=p.get('enhancement_final_release'),
                    customer_confirmation='No',
                    )
                customer_program.save()
                # create competing program of each customer program for main user
                # if p.get('competing_program')[0]['object_id'] != "":
                for cp in p.get('competing_program'):
                    if cp.get('object_id') == "":
                        continue
                    else:
                        competing_program = Program.objects.get(object_id=cp.get('object_id'))
                        new_cp = CustomerCompetingProgram.objects.create(
                            customer_program=customer_program,
                            program=competing_program,
                            order=cp.get('order'),
                            enhancement_status=cp.get('enhancement_status'),
                        )
                        new_cp.save()
            return Response({"success": _(" User programs has been created.")}, status=HTTP_201_CREATED)

    def put(self,request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        client = UniversityCustomer.objects.get(id=request.data['client_id'])
        if client.account_type == 'sub':
            sub_program_list = self.request.data['sub_client_program'].split('/')
            for cp in sub_program_list:
                ClientAndProgramRelation.objects.create(
                    client=client,
                    client_program=cp,
                ).save()
            return Response({"success": _("User programs has been modified.")}, status=HTTP_202_ACCEPTED)
        else:
            for p in self.request.data['selected_customer_program']:
                program = Program.objects.get(object_id=p.get('program_id'))
                customer_program = UniversityCustomerProgram.objects.get(object_id=p.get('customer_program_id')).update(
                    customer=client,
                    program=program,
                    whoops_status=p.get('whoops_status'),
                    whoops_final_release=p.get('whoops_final_release'),
                    enhancement_final_release=p.get('enhancement_final_release'),
                    customer_confirmation=p.get('customer_confirmation'),
                )
                customer_program.save()
            return Response({"success": _("User programs has been modified.")}, status=HTTP_202_ACCEPTED)

    def delete(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        client = UniversityCustomer.objects.get(object_id=request.data['client_id'])
        if client.account_type == 'main':
            total_program = request.data['customer_program_id'].split('/')
            for i in total_program:
                CustomerCompetingProgram.objects.filter(customer_program=i).delete()
                UniversityCustomerProgram.objects.get(object_id=i).delete()
            return Response({"success": _("User programs has been deleted.")}, status=HTTP_204_NO_CONTENT)


class CustomerCompetingProgramCRUD(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def post(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        for p in request.data['customer_competing_program']:
            CustomerCompetingProgram.objects.create(
                customer_program=UniversityCustomerProgram.objects.get(object_id=p.get('customer_program_id')),
                program=Program.objects.get(object_id=p.get('program_id')),
                order=p.get('order'),
                enhancement_status=p.get('enhancement_status')
            ).save()
        return Response({"success": _("Competing programs has been created.")}, status=HTTP_201_CREATED)

    def put(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        for p in request.data['customer_competing_program']:
            CustomerCompetingProgram.objects.get(object_id=p.get('object_id')).update(
                customer_program=UniversityCustomerProgram.objects.get(object_id=p.get('customer_program_id')),
                program=Program.objects.get(object_id=p.get('program_id')),
                order=p.get('order'),
                enhancement_status=p.get('enhancement_status')
            ).save()
        return Response({"success": _("User programs has been modified.")}, status=HTTP_202_ACCEPTED)

    def delete(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        for cp in request.data['competing_program_id']:
            CustomerCompetingProgram.objects.get(object_id=cp.get('object_id')).delete()
        return Response({"success": _("User programs has been deleted.")}, status=HTTP_204_NO_CONTENT)


# Returns all the university and School in the database for Ceeb drop down menu
class UniversitySchoolAPI(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_object(self):

        return UniversitySchool.objects.all()    
    
    def get(self, request):
        is_manager = self.is_manager(request)
        if not is_manager:
            return Response({"Failed": _("You don't have permission to access.")}, status=HTTP_403_FORBIDDEN)

        ceebs = self.get_object()
        serializer = UniversityAndSchoolSerializer(ceebs, many=True)
        return Response(serializer.data, status=HTTP_200_OK)


class ProgramAPI(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_object(self):
        return Program.objects.all()

    def get(self, request):
        is_manager = self.is_manager(request)
        if not is_manager:
            return Response({"Failed": _("You don't have permission to access.")}, status=HTTP_403_FORBIDDEN)

        programs = self.get_object()
        serializer = ProgramSerializer(programs, many=True)
        return Response(serializer.data, status=HTTP_200_OK)


class DepartmentAPI(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_object(self, object_id):
        try:
            university_school = UniversitySchool.objects.get(object_id=object_id)
            programs = Program.objects.filter(university_school=university_school).values('department')\
                .exclude(department__isnull=True).exclude(department__exact="").order_by().distinct()
            return programs
        except:
            raise Http404

    def get(self, request, object_id):
        is_manager = self.is_manager(request)
        if not is_manager:
            return Response({"Failed": _("You don't have permission to access.")}, status=HTTP_403_FORBIDDEN)

        departments = self.get_object(object_id)
        # serializer = ProgramSerializer(programs, many=True)
        return Response(departments, status=HTTP_200_OK)


class CustomerAndCompetingProgramAPI(generics.ListAPIView):
    serializer_class = CustomerAndCompetingProgramSerializer
    permission_classes = ((IsAuthenticated,))
    #pagination_class = CustomerPageNumberPagination

    def is_manager(self, request):
        try:   
            UpgridAccountManager.objects.get(id = request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_queryset(self, *args, **kwargs):
        ceeb = self.request.GET.get("ceeb")
        department = self.request.GET.get("dep")

        total_ceeb = ceeb.split('/')
        if self.is_manager(self.request):
            query_list = Program.objects.all()
            if total_ceeb:
                query_list = query_list.filter(
                    Q(university_school__in=total_ceeb)
                    )
            if department:
                query_list = query_list.filter(
                    Q(department=department)
                    )
            return query_list
        else:
            return Response({"Failed": _("You don't have permission to access!")}, status=HTTP_403_FORBIDDEN)

# Get whoops reports by UniversityCustomerProgram object_id


class WhoopsWebReports(APIView):
    def check_permission(self, request, object_id, client_id):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=client_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)

        if user.account_type == 'sub':
            try:
                ClientAndProgramRelation.objects.get(client=user, client_program=object_id)
                UniversityCustomerProgram.objects.get(object_id=object_id, customer=user.main_user_id,
                                                      whoops_final_release='True')
                return True
            except ObjectDoesNotExist:
                return False
        else:
            try:
                UniversityCustomerProgram.objects.get(object_id=object_id, customer=user,
                                                      whoops_final_release='True')
                return True
            except UniversityCustomerProgram.DoesNotExist:
                return False

    def get_object(self, object_id):
        program_id = UniversityCustomerProgram.objects.get(object_id=object_id)
        program = Program.objects.get(object_id=program_id.program.object_id)
        ean = program.expertadditionalnote_set.all()
        return ean, program

    def get(self, request, object_id, client_id=None):
        perm = self.check_permission(request, object_id, client_id)
        if perm:
            ean, program = self.get_object(object_id)
            if not len(ean) == 0:
                info = {'university': program.university_school.university_foreign_key.name,
                        'school': program.university_school.school,
                        'program': program.program_name, 'degree': program.degree.name}
                res = dbLizer.ExpertAdditionalNoteSerializer(ean, many=True)
                arr = res.data
                arr.append(info)            
                return Response(arr, status=HTTP_200_OK)
            else:
                return HttpResponse(status =HTTP_204_NO_CONTENT)

        else:
            return Response({"Failed": _("Permission denied!")},status=HTTP_403_FORBIDDEN)


class EnhancementWebReports(APIView):
    def get_user(self, request, client_id):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
            return user
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=client_id, account_manager=manager)
                    return user
                except UniversityCustomer.DoesNotExist:
                    return False
            except ObjectDoesNotExist:
                return False              

    def check_permission(self, request, object_id, client_id=None):
        user = self.get_user(request, client_id)
        if not user:
            return Response({"Failed": _("Permission Denied! ")}, status=HTTP_403_FORBIDDEN)

        # check if enhancement belongs to this user
        if user.account_type == 'sub':
            try:
                ClientAndProgramRelation.objects.get(client=user, client_program=object_id)
                UniversityCustomerProgram.objects.get(object_id=object_id, customer=user.main_user_id,
                                                      enhancement_final_release='True')
                return True
            except ObjectDoesNotExist:
                return False
        else:
            try:
                UniversityCustomerProgram.objects.get(object_id=object_id, customer=user,
                                                      enhancement_final_release='True')
                return True
            except UniversityCustomerProgram.DoesNotExist:
                return False

    def get_object(self, object_id):
        program_list = []
        customer_program = UniversityCustomerProgram.objects.select_related('program').get(object_id=object_id)
        self_program = Program.objects.get(object_id=customer_program.program.object_id)
        program_list.append(self_program)
        competing_program = customer_program.customercompetingprogram_set.all().select_related('program')\
            .order_by('order')
        for cp in competing_program:
            program = Program.objects.get(object_id=cp.program.object_id)
            program_list.append(program)
        return program_list

    def get(self, request, object_id, client_id=None):
        perm = self.check_permission(request, object_id, client_id)

        if perm:
            total_program = self.get_object(object_id)

            length = len(total_program)
            res_obj = {}
            for i in range(1, length+1):
                program = "p" + (str(i) if i > 1 else "")
                curriculum = "c" + (str(i) if i > 1 else "")
                tuition = "t" + (str(i) if i > 1 else "")
                deadline = "d" + (str(i) if i > 1 else "")
                requirement = "r" + (str(i) if i > 1 else "")
                required_exam = "ex" + (str(i) if i > 1 else "")
                intl_transcript = "Intl_transcript" + (str(i) if i > 1 else "")
                intl_eng_test = "Intl_eng_test" + (str(i) if i > 1 else "")
                scholarship = "s" + (str(i) if i > 1 else "")
                duration = "dura" + (str(i) if i > 1 else "")
                empty = None
                p_value = total_program[i-1]
                try:
                    c_value = Curriculum.objects.get(program=total_program[i-1])
                except Curriculum.DoesNotExist:
                    c_value = empty

                try:
                    t_value = Tuition.objects.get(program=total_program[i-1])
                except Tuition.DoesNotExist:
                    t_value = empty

                try:    
                    d_value = Deadline.objects.get(program=total_program[i-1])
                except Deadline.DoesNotExist:
                    d_value = empty

                try:
                    r_value = Requirement.objects.get(program=total_program[i-1])
                except Requirement.DoesNotExist:
                    r_value = empty

                try:    
                    dura_value = Duration.objects.get(program=total_program[i-1])
                except Duration.DoesNotExist:
                    dura_value = empty

                if r_value:
                    r_e_value = r_value.exam.all()  # get django queryset
                    i_value = r_value.intl_transcript.all()
                    i_e_t_value = r_value.intl_english_test.all()
                else:
                    r_e_value = empty
                    i_value = empty
                    i_e_t_value = empty

                try:
                    s_value = Scholarship.objects.get(program=total_program[i-1])
                except Scholarship.DoesNotExist:
                    s_value = empty

                p_value = dbLizer.ProgramSerializer(p_value)
                c_value = dbLizer.CurriculumSerializer(c_value)
                t_value = dbLizer.TuitionSerializer(t_value)
                d_value = dbLizer.DeadlineSerializer(d_value)
                r_value = dbLizer.RequirementSerializer(r_value)
                
                r_e_value = dbLizer.ExamSerializer(r_e_value, many=True)
                i_value = dbLizer.TranscriptEvaluationProviderSerializer(i_value, many=True)
                i_e_t_value = dbLizer.InternationalEnglishTestSerializer(i_e_t_value, many=True)
                s_value = dbLizer.ScholarshipSerializer(s_value)
                dura_value = dbLizer.DurationSerializer(dura_value)

                res_obj[program] = p_value.data
                res_obj[curriculum] = c_value.data
                res_obj[tuition] = t_value.data
                res_obj[deadline] = d_value.data
                res_obj[requirement] = r_value.data
                res_obj[required_exam] = r_e_value.data
                res_obj[intl_transcript] = i_value.data
                res_obj[intl_eng_test] = i_e_t_value.data
                res_obj[scholarship] = s_value.data
                res_obj[duration] = dura_value.data

            res_obj["length"] = length
            
            return Response(res_obj, status=HTTP_200_OK)
        else:
            return Response({"Failed": _("Permission denied!")}, status=HTTP_403_FORBIDDEN)