# System lib
####################################################
from django.shortcuts import render,get_object_or_404
from django.template import loader
#####################################################
import base64
import logging
from django.core.serializers import serialize
from django.core.mail import BadHeaderError, EmailMessage
from django.db.models import Q
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
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
from django.utils import timezone
from . import dbSerializers as dbLizer
from json import dumps, loads
from rest_framework.renderers import JSONRenderer
from django.core.exceptions import ObjectDoesNotExist

app_logger = logging.getLogger('app')
# app_logger.info("This is a INFO level message")
# app_logger.error("This is an ERROR level message")

# ----------------------Login / Password ----------------------------------------
# index
###################################################


def index(request):
    return render(request, 'upgrid/index.html')


###################################################


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
    permission_classes = (AllowAny,)

    def post(self, request):
        text = "Password Reset email has been send! If you do not receive reset email within the next 5 minutes,"
        "please check your email address if it has registered."

        try:
            user_reset = UniversityCustomer.objects.get(email=request.data['email'])
        except UniversityCustomer.DoesNotExist:
            try:
                user_reset = UpgridAccountManager.objects.get(email = request.data['email'])
            except UpgridAccountManager.DoesNotExist:
                return HttpResponse(text, HTTP_200_OK)
        if user_reset:
            payload = jwt_payload_handler(user_reset)
            token = jwt_encode_handler(payload)

            if token:
                try:
                    # username = user_reset.username
                    html_content = ("Hello, %s! <br>You're receiving this email"
                                    "because you requested a password reset for your user account"
                                    "at Upgrid!<br>Please go to the following page and choose a new"
                                    "password: https://%s/#/upgrid/reset/%s/.<br>")
                    message = EmailMessage(subject='Reset Password', body=html_content %(user_reset.username,
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
        #user.save()
        return Response({"success": _("New password has been saved.")}, status=HTTP_202_ACCEPTED)


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
        order_dict = {"oname": "program__program_name", "-oname": "-program__program_name",
                      "degree": "program__degree", "-degree": "-program__degree",
                      "cs": "customer_confirmation", "-cs": "-customer_confirmation",
                      "wfs": "whoops_final_release", "-wfs": "-whoops_final_release",
                      "efs": "enhancement_final_release", "-efs": "-enhancement_final_release"}

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
            query_list = UniversityCustomerProgram.objects.filter(customer=user).order_by(order_dict[order])
        if program_name:
            query_list = query_list.filter(
                Q(program__program_name__icontains=program_name)
                ).order_by(order_dict[order])
        if program_degree:
            query_list = query_list.filter(
                Q(program__degree__name__icontains=program_degree)
                ).order_by(order_dict[order])
        if whoops_final_release:
            query_list = query_list.filter(
                Q(whoops_final_release=whoops_final_release)
                ).order_by(order_dict[order])
        if enhancement_final_release:
            query_list = query_list.filter(
                Q(enhancement_final_release=enhancement_final_release)
                ).order_by(order_dict[order])
        if confirmation_status:
            query_list = query_list.filter(
                Q(customer_confirmation=confirmation_status)
                ).order_by(order_dict[order])
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

    def get_object(self, request, client_id):
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

        return user

    def get(self, request, client_id=None):
        customer = self.get_object(request, client_id)

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


# For User to get final released whoops and enhancement reports and time.
class ReleasedPrograms(APIView):
    def get_user(self, request, object_id):
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

    def get_released_program_list(self, customer, type):
        if type == "enhancement":
            if customer.account_type == 'sub':
                customer_programs = ClientAndProgramRelation.objects.filter(client=customer).values('client_program')
                program_list = UniversityCustomerProgram.objects.filter(customer=customer.main_user_id,
                                                                        enhancement_final_release='True',
                                                                        object_id__in=customer_programs).\
                    order_by('enhancement_final_release_time')
            else:
                program_list = UniversityCustomerProgram.objects.filter(customer=customer,
                                                                        enhancement_final_release='True').\
                    order_by('enhancement_final_release_time')
            return program_list
        else:
            if customer.account_type == 'sub':
                customer_programs = ClientAndProgramRelation.objects.filter(client=customer).values('client_program')
                program_list = UniversityCustomerProgram.objects.filter(customer=customer.main_user_id,
                                                                        whoops_final_release='True',
                                                                        object_id__in=customer_programs). \
                    order_by('whoops_final_release_time')
            else:
                program_list = UniversityCustomerProgram.objects.filter(customer=customer,
                                                                        whoops_final_release='True'). \
                    order_by('whoops_final_release_time')
            return program_list

    def get(self, request, object_id=None):
        user = self.get_user(request, object_id)
        enhancement_list = self.get_released_program_list(user, "enhancement")
        whoops_list = self.get_released_program_list(user, "whoops")
        released_enhancement_list = EnhancementReleasedListSerializer(enhancement_list, many=True)
        released_whoops_list = WhoopsReleasedListSerializer(whoops_list, many=True)

        context = {"FinalReleasedEnhancement": released_enhancement_list.data,
                   "FinalReleasedWhoops": released_whoops_list.data}
        return Response(data=context, status=HTTP_200_OK)


# For client's dashboard to display updated reports time info...
class UpdatedReportsList(APIView):
    def get_user(self, request, object_id):
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

    def get_reports_list(self, customer, type):
        if type == "enhancement":
            if customer.account_type == 'sub':
                customer_programs = ClientAndProgramRelation.objects.filter(client=customer).values('client_program')
                report_list = EnhancementUpdate.objects.filter(customer=customer.main_user_id, most_recent=True,
                                                               customer_program__in=customer_programs).\
                    order_by("last_edit_time")
            else:
                report_list = EnhancementUpdate.objects.filter(customer=customer, most_recent=True).order_by\
                        ("last_edit_time")
            return report_list

        else:
            if customer.account_type == 'sub':
                customer_programs = ClientAndProgramRelation.objects.filter(client=customer).values('client_program')
                report_list = WhoopsUpdate.objects.filter(customer=customer.main_user_id, most_recent=True,
                                                          customer_program__in=customer_programs).\
                    order_by("last_edit_time")
            else:
                report_list = WhoopsUpdate.objects.filter(customer=customer, most_recent=True).order_by\
                        ("last_edit_time")

            return report_list

    def get(self, request, object_id=None):
        user = self.get_user(request, object_id)
        wrlist = self.get_reports_list(user, "whoops")
        whoopsupdatelist = WhoopsUpdateSerializer(wrlist, many=True)
        erlist = self.get_reports_list(user, "enhancement")
        enhancementupdatelist = EnhancementUpdateSerializer(erlist, many=True)
        context = {"WhoopsUpdateList": whoopsupdatelist.data, "EnhancementUpdateList": enhancementupdatelist.data}

        return Response(context, status=HTTP_200_OK)


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
        except UniversityCustomer.DoesNotExist:
            try:
                mananger = UpgridAccountManager.objects.get(id=request.user.id)
                sub_user = UniversityCustomer.objects.get(id=request.data['sub_user_id'])
                main_user = UniversityCustomer.objects.get(id=request.data['main_user_id'])
            except UniversityCustomer.DoesNotExist or UpgridAccountManager.DoesNotExist:
                print(1111111111111111222222222222222222222222222)
                return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)

        if main_user.Ceeb == sub_user.Ceeb:
            if main_user.account_type == "main":
                if sub_user.account_type == "sub":
                    return sub_user
                else:
                    print(1111111111111111111)
                    return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
            else:
                print(22222222222222222222)
                return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        else:
            print(33333333333333333333333333333333)
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)

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
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                main_user = UniversityCustomer.objects.get(id=request.data['main_user_id'])
            except UniversityCustomer.DoesNotExist or UpgridAccountManager.DoesNotExist:
                return Response({"failed": _("Permission Denied.")}, status=HTTP_403_FORBIDDEN)
        
        sub_service_until = main_user.service_until
        university_school = UniversitySchool.objects.get(ceeb=main_user.Ceeb.ceeb)
        decoded_new_password = self.validate(self.request.data['password'])
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
            service_until=sub_service_until,
            password=decoded_new_password)

        #user.set_password(decoded_new_password)
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
                    user = UniversityCustomer.objects.get(id=request.data['client_id'], account_manager=manager)
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

    def get_whoops_object(self, object_id, client):
        program_id = UniversityCustomerProgram.objects.get(object_id=object_id)
        program = Program.objects.get(object_id=program_id.program.object_id)

        wur = WhoopsUpdate.objects.get(customer_program=object_id, customer=client, most_recent='True')

        return wur, program

    def get_enhancement_object(self, object_id, client):
        eur = EnhancementUpdate.objects.get(customer_program=object_id, customer=client, most_recent='True')
        return eur

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
            try:
                user = UniversityCustomer.objects.get(id=request.user.id)
            except UniversityCustomer.DoesNotExist:
                user = UniversityCustomer.objects.get(id=request.data['client_id'])
            time_now = timezone.now()
            relation_ship = SharedReportsRelation.objects.create(
                created_by=request.user,
                created_time=time_now,
            )
            relation_ship.save()

            if not request.data['whoops_id'] is None:
                whoops_id_list = request.data['whoops_id'].split('/')
                for x in whoops_id_list:
                    wur, program = self.get_whoops_object(x, user)
                    if wur:
                        customer_program = UniversityCustomerProgram.objects.get(object_id=x)
                        info = {'university': program.university_school.university_foreign_key.name,
                                'school': program.university_school.school,
                                'program': program.program_name, 'degree': program.degree.name,
                                'whoops_final_release_time':customer_program.whoops_final_release_time,
                                'report_last_edit_time':wur.last_edit_time}
                        arr = JSONParser().parse(BytesIO(zlib.decompress(wur.existing_report)))
                        arr.update(info)
                        json_str = JSONRenderer().render(arr)
                        raw_data = zlib.compress(json_str)
                        w_obj = WhoopsReportsRepo(
                            wr_created=time_now,
                            wr_customer_program=customer_program,
                            wr_whoops_report=raw_data,
                            wr_share_relation=relation_ship)
                        w_obj.save()

            if not request.data['enhancement_id'] is None:
                enhancement_id_list = request.data['enhancement_id'].split('/')
                for y in enhancement_id_list:
                    eur = self.get_enhancement_object(y, user)
                    if eur:
                        customer_program = UniversityCustomerProgram.objects.get(object_id=y)
                        info = {'enhancement_final_release_time':customer_program.enhancement_final_release_time,
                                'report_last_edit_time':eur.last_edit_time}
                        arr = JSONParser().parse(BytesIO(zlib.decompress(eur.existing_report)))
                        arr.update(info)
                        json_str = JSONRenderer().render(arr)
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
        user = self.get_user(request, self.request.data['client_id'])
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


# Client CRUD
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
        decoded_new_password = self.decode_password(self.request.data['password'])
        if 'main_user_id' in self.request.POST:
            main_user = UniversityCustomer.objects.get(object_id=request.data['main_user_id'])
            university_school = UniversitySchool.objects.get(object_id=main_user.Ceeb.object_id)
            client = UniversityCustomer.objects.create(
                is_demo=self.request.data['isDemo'],
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
                password=decoded_new_password
                )
        # create main client object
        else:
            university_school = UniversitySchool.objects.get(object_id=self.request.data['ceeb'])
            client = UniversityCustomer.objects.create(
                is_demo=self.request.data['isDemo'],
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
                password=decoded_new_password
                )

        # decoded_new_password = self.decode_password(self.request.data['password'])
        # client.set_password(decoded_new_password)
        client.save()
        # for main user add competing_schools

        for cp in self.request.data['competing_schools']:
            school = UniversitySchool.objects.get(object_id=cp.get('object_id'))
            client.competing_schools.add(school)
        return Response({'client_id': client.id}, status=HTTP_201_CREATED)

    def put(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)

        if not self.request.data['main_user_id'] is None:
            main_user = UniversityCustomer.objects.get(object_id=request.data['main_user_id'])
            university_school = UniversitySchool.objects.get(object_id=self.request.data['ceeb'])
            client = UniversityCustomer.objects.filter(id=self.request.data['client_id'])
            client.update(
                is_demo=self.request.data['isDemo'],
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

        else:
            university_school = UniversitySchool.objects.get(object_id=self.request.data['ceeb'])
            client = UniversityCustomer.objects.filter(id=self.request.data['client_id'])
            client.update(
                is_demo=self.request.data['isDemo'],
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

        client[:1].get().competing_schools.clear()
        for cp in self.request.data['competing_schools']:
            school = UniversitySchool.objects.get(object_id=cp['object_id'])
            client[:1].get().competing_schools.add(school)
        return Response({"success": _("User has been modified.")}, status=HTTP_202_ACCEPTED)

    def delete(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        try:
            client = UniversityCustomer.objects.get(id=request.data['client_id'])
            client.is_active = False
            client.save()
            return Response({"Success": _("User deleted!")}, status=HTTP_204_NO_CONTENT)
        except UniversityCustomer.DoesNotExist:
            return Response({"Failed": _("User doesn't exists!")}, status=HTTP_403_FORBIDDEN)


class UniversityCustomerProgramCRUD(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request, object_id):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        try:
            client = UniversityCustomer.objects.get(id=object_id)
        except UniversityCustomer.DoesNotExist:
            return Response({"Failed": _("Can not find client with provided id.")}, status=HTTP_403_FORBIDDEN)
        customer_program_list = UniversityCustomerProgram.objects.filter(customer=client)
        serializer = UnivCustomerProgramSerializer(customer_program_list, many=True)
        return Response(serializer.data)

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
                if p.get('whoops_final_release') == 'True':
                    customer_program.whoops_final_release_time = timezone.now()
                if p.get('enhancement_final_release') == 'True':
                    customer_program.enhancement_final_release_time = timezone.now()

                customer_program.save()
                # create competing program of each customer program for main user
                # if p.get('competing_program')[0]['object_id'] != "":
                for cp in p.get('competing_program'):
                    if cp.get('object_id') == "":
                        continue
                    else:
                        competing_program = Program.objects.filter(object_id=cp.get('object_id'))
                        if competing_program.exists():
                            competing_program_obj = competing_program.first()
                            print(competing_program)
                            new_cp = CustomerCompetingProgram.objects.create(
                                customer_program=customer_program,
                                program=competing_program_obj,
                                order=cp.get('order'),
                                enhancement_status=cp.get('enhancement_status'),
                            )
                            new_cp.save()

            return Response({"success": _(" User programs has been created.")}, status=HTTP_201_CREATED)

    def put(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        client = UniversityCustomer.objects.get(id=request.data['client_id'])
        if client.account_type == 'sub':
            print(request.data['sub_client_program'])
            if request.data['sub_client_program']:
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
                customer_program = UniversityCustomerProgram.objects.filter(object_id=p.get('customer_program_id'))
                customer_program.update(
                    customer=client,
                    program=program,
                    whoops_status=p.get('whoops_status'),
                    whoops_final_release=p.get('whoops_final_release'),
                    enhancement_final_release=p.get('enhancement_final_release'),
                    customer_confirmation=p.get('customer_confirmation'),
                )
                customer_program_object = UniversityCustomerProgram.objects.get(object_id=p.get('customer_program_id'))
                print(customer_program_object.enhancement_final_release)
                if customer_program_object.whoops_final_release_time is None and customer_program_object.whoops_final_release == 'True':
                    customer_program_object.whoops_final_release_time = timezone.now()
                if customer_program_object.enhancement_final_release_time is None and customer_program_object.enhancement_final_release == 'True':
                    customer_program_object.enhancement_final_release_time = timezone.now()
                    print(customer_program_object.enhancement_final_release_time)

                customer_program_object.save()
                # customer_program.save()
            return Response({"success": _("User programs has been modified.")}, status=HTTP_202_ACCEPTED)

    def delete(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        client = UniversityCustomer.objects.get(id=request.data['client_id'])
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

    def get(self, request, object_id):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        competing_programs = CustomerCompetingProgram.objects.filter(customer_program=object_id)
        serializer = ManagerUseCompetingProgramSerializer(competing_programs, many=True)
        return Response(serializer.data)

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
            ccp = CustomerCompetingProgram.objects.filter(object_id=p.get('object_id'))
            ccp.update(
                customer_program=UniversityCustomerProgram.objects.get(object_id=p.get('customer_program_id')),
                program=Program.objects.get(object_id=p.get('program_id')),
                order=p.get('order'),
                enhancement_status=p.get('enhancement_status')
            )

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
            #.exclude(department__isnull=True).exclude(department__exact="").order_by().distinct()
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
    # pagination_class = CustomerPageNumberPagination

    def is_manager(self, request):
        try:   
            UpgridAccountManager.objects.get(id=request.user.id)
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
                if department == 'Others':
                    query_list = query_list.filter(Q(department="") | Q(department__isnull=True))
                    print(query_list)
                else:
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
                return user
            except ObjectDoesNotExist:
                return False
        else:
            try:
                UniversityCustomerProgram.objects.get(object_id=object_id, customer=user,
                                                      whoops_final_release='True')
                return user
            except UniversityCustomerProgram.DoesNotExist:
                return False

    def get_object(self, object_id, client):

        wur = WhoopsUpdate.objects.get(customer_program=object_id, customer=client, most_recent='True')
        cp = UniversityCustomerProgram.objects.get(object_id=object_id)
        if wur.existing_report:
            existing_report = JSONParser().parse(BytesIO(zlib.decompress(wur.existing_report)))
        else:
            existing_report = "None"
        if wur.update_diff:
            update_diff = JSONParser().parse(BytesIO(zlib.decompress(wur.update_diff)))
            print(update_diff)
        else:
            update_diff = "None"
        context = {'existing_report': existing_report, 'update_diff': update_diff,
                   'whoops_released_time':cp.whoops_final_release_time,
                   'report_last_edit_time':wur.last_edit_time}
        return context

    def get(self, request, object_id, client_id=None):
        user = self.check_permission(request, object_id, client_id)
        if user:
            context = self.get_object(object_id, user)
            return Response(context, status=HTTP_200_OK)

        else:
            return Response({"Failed": _("Permission denied!")}, status=HTTP_403_FORBIDDEN)


class EnhancementWebReports(APIView):
    def get_user(self, request, client_id):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
            return user
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                print(123)
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

    def get_object(self, object_id, client):
        eur = EnhancementUpdate.objects.get(customer_program=object_id, customer=client, most_recent='True')
        cp = UniversityCustomerProgram.objects.get(object_id=object_id)
        if eur.existing_report:
            existing_report = JSONParser().parse(BytesIO(zlib.decompress(eur.existing_report)))
        else:
            existing_report = "None"
        if eur.update_diff:
            update_diff = JSONParser().parse(BytesIO(zlib.decompress(eur.update_diff)))
            print(update_diff)
        else:
            update_diff = "None"
        context = {'existing_report': existing_report, 'update_diff': update_diff,
                   'enhancement_released_time': cp.enhancement_final_release_time,
                   'report_last_edit_time': eur.last_edit_time}
        return context

    def get(self, request, object_id, client_id=None):
        perm = self.check_permission(request, object_id, client_id)
        if perm:
            user = self.get_user(request, client_id)
            context = self.get_object(object_id, user)
            return Response(context, status=HTTP_200_OK)

        else:
            return Response({"Failed": _("Permission denied!")}, status=HTTP_403_FORBIDDEN)


class WhoopsReportsUpdateAPI(APIView):

    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_object(self, request, customer_program):
        if customer_program is None:
            program_id = UniversityCustomerProgram.objects.get(object_id=request.data['customer_program_id'])
        else:
            program_id = customer_program
        program = Program.objects.get(object_id=program_id.program.object_id)
        ean = program.expertadditionalnote_set.all()
        return ean, program

    def get_programs_data(self, request, customer_program=None):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission denied!")}, status=HTTP_403_FORBIDDEN)
        else:
            ean, program = self.get_object(request, customer_program)

            # print(ean[0]._meta.get_fields())
            # print (model_to_dict(ean[0]))
            if not len(ean) == 0:
                json_data = {
                    'dead_link': None, 'typo': None, 'outdated_information': None,
                    'data_discrepancy': None, 'sidebars': None,
                    'infinite_loop': None, 'floating_page': None,
                    'confusing': None, 'other_expert_note': None
                }
                query_fields = ('additional_note_type', 'additional_note_url',
                                'additional_note_url2', 'additional_note_url3', 'additional_note')
                # database data=>json string stored in json_data dict
                print("#####eam type####", type(ean))
                for k, v in json_data.items():
                    query_set = ean.filter(additional_note_type=k)
                    json_data[k] = serialize("json", query_set, fields=query_fields)
                # json_data=>python dict
                obj_data = json_data
                for k, v in obj_data.items():  # you can print it to see its structure
                    record = loads(v)
                    new_list = []
                    for field_dict_idx in range(len(record)):
                        new_list.append(
                            record[field_dict_idx].get('fields'))  # if get failed, None value would be return
                    obj_data[k] = new_list
                return obj_data
            else:
                return None

    @classmethod
    def compare_whoops_report(cls, a, b):
        """a is old report, b is new report"""

        def compare(a, b):
            diff = {}
            old_diff = {}
            new_diff = {}
            diff["old"] = old_diff
            diff["new"] = new_diff
            if not a or not b:
                return None
            if len(a) == len(b) and len(a) == 0:
                return None
            if isinstance(a, dict) and isinstance(b, dict):
                for k, v in a.items():
                    if not b.get(k):
                        old_diff[k] = v
                        new_diff[k] = None
                    elif v != b[k]:
                        old_diff[k] = v
                        new_diff[k] = b[k]
                for k, v in b.items():
                    if not a.get(k):
                        old_diff[k] = None
                        new_diff[k] = v
                for k, v in a.items():
                    if (not v or len(v) == 0) and (not b.get(k) or len(b.get(k)) == 0):
                        del old_diff[k]
                        del new_diff[k]

                return diff

        res_dict = compare(a, b)
        if res_dict:
            for _, v in res_dict.items():
                if len(v) != 0:
                    return res_dict
        else:
            return None  # return None if no difference

    def whoops_compare_process(self, wru, raw_new_whoops_report, new_whoops_report_dict):
        if raw_new_whoops_report is None and new_whoops_report_dict is None:
            wru.existing_report = None
            wru.save()
        else:
            if wru.existing_report is None and wru.cache_report is None:  # For the very first WhoopsUpdate object
                wru.existing_report = raw_new_whoops_report  # raw binary data
            elif wru.cache_report is None:
                binary_data = zlib.decompress(wru.existing_report)
                whoops_json_string = BytesIO(binary_data)
                existing_report_dict = JSONParser().parse(whoops_json_string)
                diff = WhoopsReportsUpdateAPI.compare_whoops_report(existing_report_dict, new_whoops_report_dict)

                if diff:
                    diff = zlib.compress(JSONRenderer().render(diff))
                    wru.initial_diff = diff
            else:
                binary_data = zlib.decompress(wru.cache_report)
                whoops_json_string = BytesIO(binary_data)
                cache_report_dict = JSONParser().parse(whoops_json_string)
                diff = WhoopsReportsUpdateAPI.compare_whoops_report(cache_report_dict, new_whoops_report_dict)
                if diff:
                    diff = zlib.compress(JSONRenderer().render(diff))
                    wru.initial_diff = diff
            wru.save()

    def whoops_schedule_compare(self, request):
        """call this method each day at 04:00 or any other time, update WhoopsReports each day for all users"""
        customer_program_id = request.POST.get('customer_program_id', 0)
        print(customer_program_id)
        if customer_program_id != 0:  # Account Manager on demand compare
            # print(request.user.id)
            # print(UniversityCustomer.objects.get(id=request.user.id))
            print(1234567)
            customer_program = UniversityCustomerProgram.objects.get(object_id=request.data['customer_program_id'])
            wru, created = WhoopsUpdate.objects.get_or_create(customer_program=customer_program,
                                                              customer=UniversityCustomer.objects.
                                                              get(id=request.data['client_id']), most_recent=True)
            # customer = UniversityCustomer.objects.get(id=request.user.id)
            new_whoops_report_dict = self.get_programs_data(request)  # dict
            if new_whoops_report_dict is not None:
                json_str = JSONRenderer().render(new_whoops_report_dict)  # render to bytes with utf-8 encoding
                raw_new_whoops_report = zlib.compress(json_str)
            else:
                raw_new_whoops_report = None
            self.whoops_compare_process(wru, raw_new_whoops_report, new_whoops_report_dict)
        else:
            users = UniversityCustomer.objects.filter(account_type='main')
            print(12356)
            for user in users:
                print(user)
                # login_time = user.last_login_time # get latest login time
                customer_whoops_programs = UniversityCustomerProgram.objects.all().\
                    filter(customer=user, whoops_final_release='True')
                for customer_program in customer_whoops_programs:
                    eru, created = WhoopsUpdate.objects.get_or_create(customer_program=customer_program,
                                                                      customer=user, most_recent=True)
                    print('second test')
                    new_whoops_report_dict = self.get_programs_data(request,customer_program)
                    if new_whoops_report_dict is not None:
                        json_str = JSONRenderer().render(new_whoops_report_dict)  # render to bytes with utf-8 encoding
                        raw_new_whoops_report = zlib.compress(json_str)
                        self.whoops_compare_process(eru, raw_new_whoops_report, new_whoops_report_dict)

    def put(self, request):
        if not self.is_manager(request):
            raise Http404("Permission denied!")
        else:
            self.whoops_schedule_compare(request)
            # p = WhoopsUpdate.objects.get(customer_program=request.data['customer_program_id'], most_recent=True)
            # # print(p.initial_diff)
            # if p.initial_diff is None:

            #     print(p.initial_diff)
            # else:
            #     json_string = zlib.decompress(p.initial_diff)
            #     json_string = BytesIO(json_string)
            #     res = JSONParser().parse(json_string)
        return Response("Ok", HTTP_200_OK)


class ManagerWhoopsDiffConfirmation(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request, customer_program_id, client_id):
        """
        Get Initial Whoops diff and report for a customer program.
        """
        perm = self.is_manager(request)
        if not perm:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        update_report = WhoopsUpdate.objects.get(customer=client_id, customer_program=customer_program_id, most_recent=True)
        if update_report.initial_diff is not None:
            initial_diff = zlib.decompress(update_report.initial_diff)
            initial_diff = BytesIO(initial_diff)
            initial_diff = JSONParser().parse(initial_diff)
        else:
            initial_diff = None
        if update_report.existing_report is not None:
            existing_report = zlib.decompress(update_report.existing_report)
            existing_report = BytesIO(existing_report)
            existing_report = JSONParser().parse(existing_report)
        else:
            existing_report = None
        if update_report.confirmed_diff is not None:
            confirmed_diff = zlib.decompress(update_report.confirmed_diff)
            confirmed_diff = BytesIO(confirmed_diff)
            confirmed_diff = JSONParser().parse(confirmed_diff)
        else:
            confirmed_diff = None
        result = {"initial_diff": initial_diff, "confirmed_diff": confirmed_diff, "existing_report": existing_report}
        return Response(result, HTTP_200_OK)

    def put(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        wru = WhoopsUpdate.objects.get(customer_program=request.data['customer_program_id'],
                                       most_recent=True)
        wru.cache_report = zlib.compress(JSONRenderer().render(request.data['cache_report']))

        update_diff = WhoopsReportsUpdateAPI.\
            compare_whoops_report(JSONParser().parse(BytesIO(zlib.decompress(wru.existing_report))),
                                       request.data['cache_report'])
        wru.update_diff = zlib.compress(JSONRenderer().render(update_diff))
        wru.confirmed_diff = zlib.compress(JSONRenderer().render(request.data['confirmed_diff']))
        wru.last_edit_time = timezone.now()
        wru.save()

        return Response({"success": _("Confirmed diff!")}, status=HTTP_202_ACCEPTED)


class ClientViewWhoopsUpdate(APIView):

    def get_user(self, request, object_id, client_id):
        
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            user = UniversityCustomer.objects.get(id=client_id)
        except UpgridAccountManager.DoesNotExist:
            try:
                user = UniversityCustomer.objects.get(id=request.user.id)
            except UniversityCustomer.DoesNotExist:
                return False
        if user.account_type == 'sub':
            try:
                ClientAndProgramRelation.objects.get(client=user, client_program=object_id)
                return UniversityCustomer.objects.get(id=user.main_user_id)
            except ClientAndProgramRelation.DoesNotExist:
                return False
        return user

    def get(self, request, object_id=None, client_id=None):
        print(object_id)
        print(client_id)
        user = self.get_user(request, object_id, client_id)
        print(user)
        cust_pro = UniversityCustomerProgram.objects.get(object_id=object_id)
        if not user:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        try:
            update_report = WhoopsUpdate.objects.get(customer_program=object_id, customer=user, most_recent=True)
        except WhoopsUpdate.DoesNotExist:
            return Response({"failed": _("No WhoopsReportsViewUpdate matches the given query.")},
                            status=HTTP_403_FORBIDDEN)
        if update_report.cache_report and not client_id: #only account manager view report will pass client_id
            update_report.existing_report = update_report.cache_report
            update_report.most_recent = False
            update_report.save()
            new_wru = WhoopsUpdate.objects.create(
                customer_program=cust_pro,
                customer=user,
                most_recent=True,
                existing_report=update_report.existing_report,
                prev_diff=update_report.update_diff,
                last_edit_time=update_report.last_edit_time)
            new_wru.save()
            print(update_report.existing_report)
            if new_wru.existing_report:
                existing_report = JSONParser().parse(BytesIO(zlib.decompress(new_wru.existing_report)))
            else:
                existing_report = "None"
            if new_wru.prev_diff:
                update_diff = JSONParser().parse(BytesIO(zlib.decompress(new_wru.prev_diff)))
            else:
                update_diff = "None"
        else:
            print('if2')
            if update_report.existing_report:
                print('1')
                existing_report = JSONParser().parse(BytesIO(zlib.decompress(update_report.existing_report)))
                print(existing_report)
            else:
                print('2')
                existing_report = "None"
            if update_report.update_diff and client_id:
                update_diff = JSONParser().parse(BytesIO(zlib.decompress(update_report.update_diff)))
            elif update_report.prev_diff:
                print('end1')
                print(zlib.decompress(update_report.prev_diff))
                print(BytesIO(zlib.decompress(update_report.prev_diff)))
                if not zlib.decompress(update_report.prev_diff) == b'':
                    update_diff = JSONParser().parse(BytesIO(zlib.decompress(update_report.prev_diff)))
                else:
                    update_diff = '' 
            else:
                print('end2')
                update_diff = "None"

        print('end3')
        # context = "{'existing_report': {0}, 'update_diff':{1}".format(existing_report, update_diff)
        context = {'existing_report': existing_report, 'update_diff': update_diff,
                   'university': cust_pro.program.university_school.university_foreign_key.name,
                   'school': cust_pro.program.university_school.school,
                   'program': cust_pro.program.program_name, 'degree': cust_pro.program.degree.name,
                   'whoops_final_release_time': cust_pro.whoops_final_release_time,
                   'report_last_edit_time': update_report.last_edit_time}
        print(context)
        return Response(context, HTTP_200_OK)


class EnhancementReportsUpdateAPI(APIView):
    def get_user(self, request):
        try:
            return UniversityCustomer.objects.get(id=self.request.user.id, account_type='main')
        except UniversityCustomer.DoesNotExist:
            return False

    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_programs(self, customer_program_id):
        """
        get customer program and competing Program
           return: object list
        """
        program_list = []
        customer_program = UniversityCustomerProgram.objects.select_related('program').get(object_id=customer_program_id)
        self_program = Program.objects.get(object_id=customer_program.program.object_id)
        program_list.append(self_program)
        competing_programs = customer_program.customercompetingprogram_set.all().select_related('program').order_by(
            'order')
        for cp in competing_programs:
            program = Program.objects.get(object_id=cp.program.object_id)
            program_list.append(program)
        return program_list

    def get_programs_data(self, object_id):
        """
        get customer program and competing program
           return: dictionary
        """
        total_program = self.get_programs(object_id)
        length = len(total_program)
        res_obj = {}
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
                dura_value = empty
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

            res_obj[program] = p_value.data  # return unordered map if empty would be a empty list
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

        return res_obj

    @classmethod
    def compare_enhancement_report(cls, a, b):
        fk_list = ['ex', 'ex2', 'ex3', 'ex4', 'ex5',  # top level list in format of [{name,date}]
                   'Intl_eng_test', 'Intl_eng_test2', 'Intl_eng_test3', 'Intl_eng_test4', 'Intl_eng_test5',
                   # top level list
                   'Intl_transcript', 'Intl_transcript2', 'Intl_transcript3', 'Intl_transcript4', 'Intl_transcript5',
                   # top level list
                   ]
        fk_dict = ['curriculum_unit',  # second level dict{name,date} in c,c2,c3,c4,c5
                   'degree',  # second level dict in format of {name,date} in p, p2,p3,p4,p5
                   'tuition_unit',  # second level dict{name,date} in t,t2,t3,t4,t5
                   'university_school',  # second level dict{university,school,date} in p,p2,p3,p4,p5
                   ]
        ignore = ['date_modified']

        def compare(a, b):
            diff = {}
            new_diff = {}
            old_diff = {}
            diff["new"] = new_diff
            diff["old"] = old_diff
            # base case
            # if not a or not b:
            #     return None
            if isinstance(a, dict) and isinstance(b, dict):
                #print(a)
                #print(b)
                print('if')
                print(len(a) == len(b))
                print(a.keys())
                print('...................')
                print(b.keys())
                print('...................')
                for k, v in a.items():  # top level
                    if k in b.keys():
                        v_of_b = b[k]

                    # 3 list
                    if (k in fk_list) and (v != v_of_b):  # if top is in fk_list, all 3 list handled here
                        if v == '' and v_of_b is None:
                            continue
                        if v is None and v_of_b == '':
                            continue
                        new_diff[k] = v_of_b  # top level
                        old_diff[k] = v
                    # dictionary
                    elif isinstance(v, dict):  # if top is dict
                        new_diff[k] = {}
                        old_diff[k] = {}
                        for k2, v2 in v.items():
                            if v2 != v_of_b[k2]:  # compare two small dict or simple str value of given key
                                if v2 == '' and v_of_b[k2] is None:
                                    continue
                                if v2 is None and v_of_b[k2] == '':
                                    continue
                                new_diff[k][k2] = v_of_b[k2]
                                old_diff[k][k2] = v[k2]
                        if len(new_diff[k]) == 0 and len(old_diff[k]) == 0:
                            new_diff.pop(k, None)
                            old_diff.pop(k, None)
                    # other list and simple <key,value> pair
                    else:
                        if v != b[k]:
                            if v == '' and b[k] is None:
                                continue
                            if v is None and b[k] == '':
                                continue
                            new_diff[k] = v_of_b
                            old_diff[k] = v
                return diff

        res_dict = compare(a, b)
        if res_dict:
            for _, v in res_dict.items():
                if len(v) != 0:
                    return res_dict
        else:
            return None  # return None if no difference

    def compare_enhancement_process(self, eru, raw_new_enhancement_report, new_enhancement_report_dict):
        if eru.existing_report is None and eru.cache_report is None:  # For the very first EnhancementUpdate object
            eru.existing_report = raw_new_enhancement_report  # raw binary data
        elif eru.cache_report is None:
            binary_data = zlib.decompress(eru.existing_report)
            enhancement_json_string = BytesIO(binary_data)
            existing_report_dict = JSONParser().parse(enhancement_json_string)
            diff = EnhancementReportsUpdateAPI.compare_enhancement_report(existing_report_dict,
                                                                          new_enhancement_report_dict)

            if diff:
                diff = zlib.compress(JSONRenderer().render(diff))
                eru.initial_diff = diff
        else:
            binary_data = zlib.decompress(eru.cache_report)
            enhancement_json_string = BytesIO(binary_data)
            cache_report_dict = JSONParser().parse(enhancement_json_string)
            diff = EnhancementReportsUpdateAPI.compare_enhancement_report(cache_report_dict,
                                                                          new_enhancement_report_dict)
            if diff:
                diff = zlib.compress(JSONRenderer().render(diff))
                eru.initial_diff = diff
        eru.save()

    def enhancement_schedule_compare(self, request):
        """call this method each day at 04:00 or any other time, update EnhancementReports each day for all users"""

        university_customer_program = request.POST.get('customer_program_id', 0)
        if university_customer_program != 0:  # Account Manager on demand compare
            # print(request.user.id)
            # print(UniversityCustomer.objects.get(id=request.user.id))
            customer_program = UniversityCustomerProgram.objects.get(object_id=university_customer_program)
            eru, created = EnhancementUpdate.objects.get_or_create(customer_program=customer_program,
                                                                   customer=UniversityCustomer.objects.
                                                                   get(id=request.data['client_id']), most_recent=True)
            # customer = UniversityCustomer.objects.get(id=request.user.id)
            new_enhancement_report_dict = self.get_programs_data(university_customer_program)  # dict
            json_str = JSONRenderer().render(new_enhancement_report_dict)  # render to bytes with utf-8 encoding
            raw_new_enhancement_report = zlib.compress(json_str)
            self.compare_enhancement_process(eru, raw_new_enhancement_report, new_enhancement_report_dict)
        else:
            users = UniversityCustomer.objects.filter(account_type='main')
            for user in users:
                print("enhancement:")
                print(user)
                # login_time = user.last_login_time # get latest login time
                customer_enhancement_programs = UniversityCustomerProgram.objects.all().\
                    filter(customer=user, enhancement_final_release='True', customer_confirmation='Yes')
                for customer_program in customer_enhancement_programs:
                    eru, created = EnhancementUpdate.objects.get_or_create(customer_program=customer_program,
                                                                           customer=user, most_recent=True)
                    new_enhancement_report_dict = self.get_programs_data(customer_program.object_id)
                    json_str = JSONRenderer().render(new_enhancement_report_dict)  # render to bytes with utf-8 encoding
                    raw_new_enhancement_report = zlib.compress(json_str)
                    self.compare_enhancement_process(eru, raw_new_enhancement_report, new_enhancement_report_dict)

    def put(self, request):
        if not self.is_manager(request):
            raise Http404("Permission denied!")
        else:
            self.enhancement_schedule_compare(request)
        return Response("Ok", HTTP_200_OK)


class ManagerUpdateDashBoardAPI(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request):
        """
        GET If Clients under a Account Manager has whoops or enhancement updates
        """
        perm = self.is_manager(request)
        if not perm:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        user = UpgridAccountManager.objects.get(id=request.user.id)
        clients = UniversityCustomer.objects.filter(account_manager=user)
        serializer = ManagerUpdateDashBoardSerializer(clients, many=True)
        return Response(serializer.data, HTTP_200_OK)


class ManagerUpdateProgramListAPI(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request, client_id):
        """
        GET returns the University customer program list which has updates.
        """
        perm = self.is_manager(request)
        if not perm:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        client = UniversityCustomer.objects.get(id=client_id)
        enhancement_programs_id = EnhancementUpdate.objects.filter(customer=client, most_recent=True)\
            .exclude(initial_diff__isnull=True)
        eur = ManagerEnhancementUpdateNumberSerializer(enhancement_programs_id, many=True)

        whoops_programs_id = WhoopsUpdate.objects.filter(customer=client, most_recent=True)\
            .exclude(initial_diff__isnull=True)
        wur = ManagerWhoopsUpdateNumberSerializer(whoops_programs_id, many=True)

        context = {"enhancement_update": eur.data, "whoops_update": wur.data}
        return Response(context, status=HTTP_200_OK)


class ManagerEnhancementDiffConfirmation(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request, customer_program_id, client_id):
        """
        Get Initial diff and report for a customer program.
        """
        perm = self.is_manager(request)
        # perm = True
        if not perm:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        update_report = EnhancementUpdate.objects.get(customer=client_id, customer_program=customer_program_id,
                                                      most_recent=True)
        if update_report.initial_diff is not None:
            initial_diff = zlib.decompress(update_report.initial_diff)
            initial_diff = BytesIO(initial_diff)
            initial_diff = JSONParser().parse(initial_diff)
        else:
            initial_diff = None
        if update_report.existing_report is not None:
            existing_report = zlib.decompress(update_report.existing_report)
            existing_report = BytesIO(existing_report)
            existing_report = JSONParser().parse(existing_report)
        else:
            existing_report = None
        if update_report.confirmed_diff is not None:
            confirmed_diff = zlib.decompress(update_report.confirmed_diff)
            confirmed_diff = BytesIO(confirmed_diff)
            confirmed_diff = JSONParser().parse(confirmed_diff)
        else:
            confirmed_diff = None
        result = {"initial_diff": initial_diff, "confirmed_diff": confirmed_diff, "existing_report": existing_report}

        return Response(result, HTTP_200_OK)

    def put(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        eru = EnhancementUpdate.objects.get(customer_program=request.data['customer_program_id'],
                                            customer=request.data['client_id'], most_recent=True)
        eru.cache_report = zlib.compress(JSONRenderer().render(request.data['cache_report']))

        update_diff = EnhancementReportsUpdateAPI.\
            compare_enhancement_report(JSONParser().parse(BytesIO(zlib.decompress(eru.existing_report))),
                                       request.data['cache_report'])
        eru.update_diff = zlib.compress(JSONRenderer().render(update_diff))
        eru.confirmed_diff = zlib.compress(JSONRenderer().render(request.data['confirmed_diff']))
        eru.last_edit_time = timezone.now()
        eru.save()

        return Response({"success": _("Confirmed diff!")}, status=HTTP_202_ACCEPTED)


class ClientViewEnhancementUpdate(APIView):
    def get_user(self, request, object_id, client_id):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            user = UniversityCustomer.objects.get(id=client_id)
        except UpgridAccountManager.DoesNotExist:
            try:
                user = UniversityCustomer.objects.get(id=request.user.id)
            except UniversityCustomer.DoesNotExist:
                return False
        if user.account_type == 'sub':
            try:
                ClientAndProgramRelation.objects.get(client=user, client_program=object_id)
            except ClientAndProgramRelation.DoesNotExist:
                return False
        return user

    def get(self, request, object_id=None, client_id=None):
        user = self.get_user(request, object_id, client_id)
        customer_program = UniversityCustomerProgram.objects.get(object_id=object_id)
        print (1)
        if not user:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        try:
            update_report = EnhancementUpdate.objects.get(customer_program=customer_program, customer=user,
                                                          most_recent=True)
        except EnhancementUpdate.DoesNotExist:
            return Response({"failed": _("No EnhancementReportsViewUpdate matches the given query.")},
                            status=HTTP_403_FORBIDDEN)
        if update_report.cache_report and not client_id:
            print(2)
            update_report.existing_report = update_report.cache_report
            update_report.most_recent = False
            update_report.save()
            new_eru = EnhancementUpdate.objects.create(
                customer_program=customer_program,
                customer=user,
                most_recent=True,
                existing_report=update_report.existing_report,
                prev_diff=update_report.update_diff,
                last_edit_time=update_report.last_edit_time)
            new_eru.save()
        # print(update_report.existing_report)
            if new_eru.existing_report and not zlib.decompress(new_eru.existing_report) == b'':
                existing_report = JSONParser().parse(BytesIO(zlib.decompress(new_eru.existing_report)))
            else:
                existing_report = "None"
            if new_eru.prev_diff and not zlib.decompress(new_eru.prev_diff) == b'':
                update_diff = JSONParser().parse(BytesIO(zlib.decompress(new_eru.prev_diff)))
            else:
                update_diff = "None"

        else:
            if update_report.existing_report and not zlib.decompress(update_report.existing_report) == b'':
                existing_report = JSONParser().parse(BytesIO(zlib.decompress(update_report.existing_report)))
            else:
                existing_report = "None"
            if update_report.update_diff and client_id and not zlib.decompress(update_report.update_diff)==b'':  # if manager view report before client and has updates
                update_diff = JSONParser().parse(BytesIO(zlib.decompress(update_report.update_diff)))
            elif update_report.prev_diff:
                if not zlib.decompress(update_report.prev_diff) == b'':
                    update_diff = JSONParser().parse(BytesIO(zlib.decompress(update_report.prev_diff)))
                else:
                    update_diff = ''
                print('update')
                print(update_diff)
                print('diff')
            else:
                print(3)
                update_diff = "None"

        # context = "{'existing_report': {0}, 'update_diff':{1}".format(existing_report, update_diff)
        context = {'existing_report': existing_report, 'update_diff': update_diff,
                   'enhancement_final_release_time': customer_program.enhancement_final_release_time,
                   'report_last_edit_time': update_report.last_edit_time
                   }
        return Response(context, HTTP_200_OK)


class SendEmail(APIView):
    def send_update_email(self):
        for user in UniversityCustomer.objects.filter(account_type='main'):
            total_programs = ConfirmedUpdateEmailQueue.objects.filter(customer=user).values('confirmed_program')

            if len(total_programs) != 0:
                try:
                    html_content = "Hello, %s! <br>You have several updated programs:</br> %s"
                    message = EmailMessage(subject='New Update', body=html_content%(user.contact_name, total_programs),
                                           to=user.email)
                    message.content_subtype = 'html'
                    message.send()
                    ConfirmedUpdateEmailQueue.objects.filter(customer=user).delete()
                except:
                    continue
            else:
                continue
        return HttpResponse(status=HTTP_200_OK)


class GetID(APIView):
    def get(self, request):
        res = request.user.id
        return Response(res)
