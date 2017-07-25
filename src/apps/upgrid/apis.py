# System lib
import os
import jwt
import logging
from django.shortcuts import render, get_object_or_404
from django.core.mail import BadHeaderError, EmailMessage
from django.db.models import Q
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from smtplib import SMTPServerDisconnected,  SMTPSenderRefused, SMTPRecipientsRefused, \
    SMTPDataError, SMTPConnectError, SMTPHeloError, SMTPAuthenticationError

# 3rd party lib
from rest_framework import generics, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.filters import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT, \
    HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework_jwt.views import ObtainJSONWebToken, RefreshJSONWebToken
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import AuthenticationFailed

# Our lib
from .models import (
    UpgridAccountManager, UniversityCustomer, UniversityCustomerProgram,
    CustomerCompetingProgram, ClientAndProgramRelation, WhoopsReports,
    EnhancementReports)

# lib in same project
from .pagination import CustomerPageNumberPagination, CompetingPageNumberPagination

from .api_serializers import *
from .filter import UniversityCustomerFilter, ClientAndProgramRelationFilter

# used shared report
from . import dbSerializers as dbLizer
from django.core.exceptions import ObjectDoesNotExist

jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
jwt_get_username_from_payload = api_settings.JWT_PAYLOAD_GET_USERNAME_HANDLER

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
app_logger = logging.getLogger('app')

# ----------------------Login / Password ----------------------------------------
# index
###################################################

try:
    cc_email = os.environ["CC_EMAIL"]
except KeyError:
    cc_email = "swang@gradgrid.com"


def index(request):
    return render(request, 'upgrid/index.html')


###################################################


# api/access_token/
class CustomizeJWT(ObtainJSONWebToken):
    serializer_class = Login2Serializer


class JWTRefresh(RefreshJSONWebToken):
    serializer_class = RefreshJWTSerializer


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

                user.password = decoded_new_password
                user.save_password()
                return Response({"success": "New password has been saved."}, status=HTTP_202_ACCEPTED)
            return Response({"Failed": "Please input valid old password."}, status=HTTP_403_FORBIDDEN)
        return Response({"Failed": "System can not identify your status. Please login first!"},
                        status=HTTP_403_FORBIDDEN)


# api/password/reset/send_email/
class ResetPassword(generics.GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        text = "Password Reset email has been send! If you do not receive reset email within the next 5 minutes,"
        "please check your email address if it has registered."
        cc_addresses = [cc_email]
        try:
            user_reset = UniversityCustomer.objects.get(email=request.data['email'])
        except UniversityCustomer.DoesNotExist:
            try:
                user_reset = UpgridAccountManager.objects.get(email=request.data['email'])
            except UpgridAccountManager.DoesNotExist:
                return HttpResponse(text, HTTP_200_OK)
        if user_reset:
            payload = jwt_payload_handler(user_reset)
            token = jwt_encode_handler(payload)

            if token:
                try:
                    # username = user_reset.username
                    # if user_reset.account_type == 'sub' and user_reset.can_ccemail == True:
                    #     main_user_query = UniversityCustomer.objects.filter(pk = user_reset.main_user_id);
                    #     if main_user_query.exists():
                    #         cc_addresses.append(main_user_query.first().email)

                    cc_addresses_tuple = tuple(cc_addresses)

                    if hasattr(request, 'is_create') and request.is_create is True:
                        html_verify = ("<div style='margin: 30px auto;max-width: 600px;'><div style='margin-bottom: 20px'>"
                                        "<img src='http://www.gridet.com/wp-content/uploads/2016/06/G-rid-6.png' "
                                        "width='150px'></div><div style='background:white; "
                                        "padding: 20px 35px;border-radius: 8px '>"
                                        "<div style='text-align: center;font-size: 30px; font-family: 'Helvetica Neue', "
                                        "Helvetica, Arial, sans-serif; color: rgb(41,61,119)'>Hello, %s! </div><div "
                                        "style='font-family: sans-serif;'><p>You account has been created in Upgrid. "
                                       "Please click <a href='https://%s/#/upgrid/verify/%s/'>here</a> "
                                        "to verify you account"
                                        "<p>If the above link does not work for"
                                        " you, please copy and paste the following into your browser address "
                                        "bar:</p><a href='https://%s/#/upgrid/verify/%s/'>"
                                        "https://%s/#/upgrid/verify/%s/</a><br><br><div>Thanks!"
                                        "</div><h3>- Gridology Tech Team</h3></div></div></div>")

                        html_content = html_verify

                        message = EmailMessage(subject='Account Verification', body=html_content % (user_reset.contact_name,
                                               request.META['HTTP_HOST'], token,  request.META['HTTP_HOST'], token,
                                                request.META['HTTP_HOST'], token), 
                                                to=[request.data['email']],bcc=cc_addresses_tuple)
                        message.content_subtype = 'html'
                        message.send()
                    else:
                        hmtl_resetPassword = ("<div style='margin: 30px auto;max-width: 600px;'><div style='margin-bottom: 20px'>"
                                        "<img src='http://www.gridet.com/wp-content/uploads/2016/06/G-rid-6.png' "
                                        "width='150px'></div><div style='background:white; "
                                        "padding: 20px 35px;border-radius: 8px '>"
                                        "<div style='text-align: center;font-size: 30px; font-family: 'Helvetica Neue', "
                                        "Helvetica, Arial, sans-serif; color: rgb(41,61,119)'>Hello, %s! </div><div "
                                        "style='<font-f></font-f>amily: sans-serif;'><p>We have just received a password reset request"
                                        " for this email account. Please click <a href='https://%s/#/upgrid/reset/%s/'>"
                                        " here</a> to reset your Upgrid password.</p><p>If the above link does not work for"
                                        " you, please copy and paste the following into your browser address "
                                        "bar:</p><a href='https://%s/#/upgrid/reset/%s/'>"
                                        "https://%s/#/upgrid/reset/%s/</a><br><br><div>Thanks!"
                                        "</div><h3>- Gridology Tech Team</h3></div></div></div>")

                        html_content = hmtl_resetPassword

                        message = EmailMessage(subject='Reset Password', body=html_content % (user_reset.contact_name,
                                               request.META['HTTP_HOST'], token, request.META['HTTP_HOST'], token,
                                                request.META['HTTP_HOST'], token), to=[request.data['email']],
                                               bcc=cc_addresses_tuple)
                        message.content_subtype = 'html'
                        message.send()
                except (BadHeaderError, SMTPServerDisconnected, SMTPSenderRefused, SMTPRecipientsRefused, SMTPDataError,
                        SMTPConnectError, SMTPHeloError, SMTPAuthenticationError) as e:
                    app_logger.exception('{0} when sending email. Error: {1}'.format(type(e).__name__, html_content))
                    raise ValidationError("Failed to send Email. {0}".format(type(e).__name__, html_content))

                try:
                    if request.is_create is True:
                        return
                except AttributeError:
                    print('go on reset')

                return HttpResponse(text, status=HTTP_200_OK)

        return HttpResponse(text, status=HTTP_200_OK)

    def validate(self, data):
        decoded_string = base64.b64decode(data)
        return decoded_string

    def put(self, request):
        user = request.user
        password = request.data['password']
        print(password)
        #print(self.validate(password).decode("utf-8"))
        #user.set_password(self.validate(password).decode("utf-8"))
        #password = zlib.decompress(self.validate(password))
        user.password = self.validate(password)
        user.save_password()
        #user.save()
        return Response({"success": "New password has been saved."}, status=HTTP_202_ACCEPTED)


# ------------------------------User API--------------------------------------------
# api/user/verify
class CustomerVerify(APIView):
    permission_classes = (AllowAny,)
    
    def put(self, request):
        jwt_value = request.data['token']

        try:
            payload = jwt_decode_handler(jwt_value)
        except jwt.ExpiredSignature:
            msg = 'Signature has expired.'
            raise AuthenticationFailed(msg)
        except jwt.DecodeError:
            msg = 'Error decoding signature.'
            raise AuthenticationFailed(msg)
        except jwt.InvalidTokenError:
            raise AuthenticationFailed()
        username = jwt_get_username_from_payload(payload)
       
        user = UniversityCustomer.objects.get(username=username)
        if user.is_active is True:
            return Response({"Failed": "have been verified before!"}, status=HTTP_400_BAD_REQUEST)
        user.is_active = True
        user.save_without_password()
        return Response({"success": "Your account has been verified."}, status=HTTP_202_ACCEPTED)


class CustomerSentVerifyEmail(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        
        try:
            user = UniversityCustomer.objects.get(email=request.data['email'])
            if user.is_active is True:
                return Response({"fail": "This account has been verified"}, status=HTTP_400_BAD_REQUEST)
            request.is_create = True
            ResetPassword().post(request)
        except:
            return Response({"fail": "data error"}, status=HTTP_400_BAD_REQUEST)

        return Response({"success": "Verification email has been sent successfully.."}, status=HTTP_202_ACCEPTED)


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
                    return Response({"Failed": "This is not a valid client!"}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": "System can not identify your status. Please login first!"},
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
        print('enter get_object')
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=client_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": "This is not a valid client!"}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": "System can not identify your status. Please login first!"},
                                status=HTTP_403_FORBIDDEN)

        if user.account_type == 'sub':
            program_list = UniversityCustomerProgram.objects.get(customer=user.main_user_id, object_id=object_id)
            return program_list
        else:
            try:
                program_list = UniversityCustomerProgram.objects.get(object_id=object_id, customer=user)
                return program_list
            except UniversityCustomerProgram.DoesNotExist:
                return Response({"Failed": "Permission Denied!"}, status=HTTP_403_FORBIDDEN)

    def get(self, request, object_id, client_id=None):
        customer_program = self.get_object(request, object_id, client_id)
        print(customer_program)
        print('customer progtams')
        serializer = CustomerCompetingProgramSerializer(customer_program)
        return Response(data=serializer.data)


# api/upgrid/user/dashboard/    used for full fill dashboard data requirement
class DashBoardAPI(APIView):
    def get_object(self, request, object_id):
        try:
            print(request)
            user = UniversityCustomer.objects.get(id=request.user.id)

        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=object_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": "This is not a valid client!"}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": "System can not identify your status. Please login first!"},
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
                    return Response({"Failed": "This is not a valid client!"}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": "System can not identify your status. Please login first!"},
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
                    return Response({"Failed": "This is not a valid client!"}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": "System can not identify your status. Please login first!"},
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
        whoops_report_list = self.get_reports_list(user, "whoops")
        whoops_update_list = WhoopsUpdateSerializer(whoops_report_list, many=True)
        enhancement_report_list = self.get_reports_list(user, "enhancement")
        enhancement_update_list = EnhancementUpdateSerializer(enhancement_report_list, many=True)
        context = {"WhoopsUpdateList": whoops_update_list.data, "EnhancementUpdateList": enhancement_update_list.data}

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
                    return Response({"Failed": ("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except UpgridAccountManager.DoesNotExist:
                return Response({"Failed": ("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)

    def get(self, request, client_id=None):
        customer = self.get_object(request, client_id)
        if customer.account_type == 'main':
            serializer = MainUserDetailSerializer(customer)
            return Response(data=serializer.data)
        else:
            serializer = SubUserDetailSerializer(customer)
            return Response(data=serializer.data)


class UniversityCustomerListAPI(generics.ListAPIView):
    """
    Get list of sub user

    """
    filter_backends = (DjangoFilterBackend, )
    serializer_class = SubuserListSerializer
    filter_class = UniversityCustomerFilter

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        if UpgridAccountManager.objects.filter(id=user.id).exists():
            return UniversityCustomer.objects.filter(account_manager=user)
        else:
            return UniversityCustomer.objects.filter(main_user_id=str(user.id)).filter(is_active=True)


class ClientAndProgramRelationAPI(mixins.ListModelMixin, generics.CreateAPIView):
    """
    Get, Create and Delete client and program relation

    """
    serializer_class = ClientAndProgramRelationSerializer
    filter_backends = (DjangoFilterBackend, )
    filter_class = ClientAndProgramRelationFilter
    multiple_lookup_fields = ['client', 'client_program']

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        if UpgridAccountManager.objects.filter(id=user.id).exists():
            owned_users = UniversityCustomer.objects.filter(account_manager=user)
        else:
            owned_users = UniversityCustomer.objects.filter(Q(main_user_id=str(user.id)) | Q(id=user.id))

        return ClientAndProgramRelation.objects.filter(client__in=owned_users)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = request.user
        if 'client' not in request.data or 'client_program' not in request.data:
            return Response({"Failed": ("client and client_program is required")}, status=HTTP_400_BAD_REQUEST)
        client = request.data['client']
        client_programs = request.data['client_program']
        if type(client_programs) is not list:
            return Response({"Failed": ("client_programs must be a list.")}, status=HTTP_400_BAD_REQUEST)

        if UpgridAccountManager.objects.filter(id=user.id):
            owned_users = UniversityCustomer.objects.filter(account_manager=user)
            university_customer_programs = UniversityCustomerProgram.objects.filter(customer__account_manager=user)
        else:
            owned_users = UniversityCustomer.objects.filter(Q(main_user_id=str(user.id)) | Q(id=user.id))
            university_customer_programs = UniversityCustomerProgram.objects.filter(customer=user)

        if client not in [str(owned_user.id) for owned_user in owned_users]:
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)

        client_owned_programs = [str(program.object_id) for program in university_customer_programs]
        error_program = []
        for program in client_programs:
            if program not in client_owned_programs:
                error_program.append(program)
                continue
            data = {'client': client,
                    'client_program': program, }
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

        if error_program:
            return Response({"error": "Permission Denied for {0}".format(",".join(error_program))},
                            status=HTTP_201_CREATED)
        return Response({"success": ("Client and Program relation has been created.")}, status=HTTP_201_CREATED)

    def delete(self, request):
        if 'client_program' not in request.data or 'client' not in request.data:
            return Response({"Failed": ("client and client_program is required")}, status=HTTP_400_BAD_REQUEST)
        client_id = request.data['client']
        client_program = request.data['client_program']
        if type(client_program) is not list:
            return Response({"Failed": ("client_programs must be a list.")}, status=HTTP_400_BAD_REQUEST)
        queryset = self.get_queryset()
        client_and_program_relation = queryset.filter(client_program__in=client_program).filter(client_id=client_id)
        client_and_program_relation.delete()
        return Response({"success": ("ClientAndProgramRelation has been deleted.")}, status=HTTP_204_NO_CONTENT)


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
                raise ValidationError("Permission Denied!")

        if main_user.Ceeb == sub_user.Ceeb:
            if main_user.account_type == "main":
                if sub_user.account_type == "sub":
                    return sub_user
                else:
                    raise ValidationError("Permission Denied!")
            else:
                raise ValidationError("Permission Denied!")
        else:
            raise ValidationError("Permission Denied!")

    def validate(self, data):
        decoded_string = base64.b64decode(data)
        return decoded_string

    def put(self, request):
        sub_user = self.get_subuser(request)

        if 'customer_program_id' in request.data:
            ClientAndProgramRelation.objects.filter(client=sub_user).delete()
            for i in request.data['customer_program_id']:
                selected_program = ClientAndProgramRelation.objects.create(
                    client=sub_user,
                    client_program=UniversityCustomerProgram.objects.get(object_id=i)
                )
                selected_program.save()

        else:
            update_fields = ['is_active', 'can_ccemail', 'title', 'contact_name', 'position', 'position_level',
                             'phone', ]
            for field in update_fields:
                if field in request.data:
                    setattr(sub_user, field, request.data[field])
            sub_user.save_without_password()
            return Response({"success": "Sub user has been update."}, status=HTTP_200_OK)

    def post(self, request):
        try:
            main_user = UniversityCustomer.objects.get(id=request.user.id, account_type='main')
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                main_user = UniversityCustomer.objects.get(id=request.data['main_user_id'])
            except UniversityCustomer.DoesNotExist or UpgridAccountManager.DoesNotExist:
                return Response({"failed": "Permission Denied."}, status=HTTP_403_FORBIDDEN)

        if 'email' not in request.data:
            return Response({"failed": "Email is required."}, status=HTTP_400_BAD_REQUEST)

        email_existed = UniversityCustomer.objects.filter(email=request.data['email'])
        if email_existed.exists():
            existed_user = email_existed.first()
            if existed_user.main_user_id == str(main_user.id) and existed_user.is_active is False:
                raise ValidationError('User was deleted, Please contact Admin for recover or create new!')
            raise ValidationError('Email already existed!')

        sub_user_number = UniversityCustomer.objects.filter(main_user_id=main_user.id).filter(is_active=True).count()
        if sub_user_number >= 10:
            return Response({"failed": "Can not create more than 10 sub user."}, status=HTTP_400_BAD_REQUEST)

        sub_service_until = main_user.service_until
        university_school = UniversitySchool.objects.get(ceeb=main_user.Ceeb.ceeb)
        decoded_new_password = self.validate(self.request.data['password'])
        user = UniversityCustomer.objects.create(
            username=request.data['username'],
            email=request.data['email'],
            can_ccemail=request.data['can_ccemail'],
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
        )

        print(decoded_new_password)
        user.password = decoded_new_password
        user.save_password()   

        # create corresponding customer programs of subuser
        programs_id = self.request.data['customer_programs']
        customer_program_id = programs_id.split('/')
        for i in customer_program_id:
            if i != '':
                main_customer_program = UniversityCustomerProgram.objects.get(object_id=i)

                sub_customer_program = ClientAndProgramRelation.objects.create(
                    client=user,
                    client_program=main_customer_program,
                    )
                sub_customer_program.save()

        non_degree_schools = main_user.non_degree_schools.all()
        for school in non_degree_schools:
            user.non_degree_schools.add(school)

        request.is_create = True
        ResetPassword().post(request)
        
        return Response({"success": ("Sub user has been created.")}, status=HTTP_201_CREATED)


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
                    return Response({"Failed": ("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": ("System can not identify your status. Please login first!")},
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
        print(object_id)
        print(client)
       
        try:
            program_id = UniversityCustomerProgram.objects.get(object_id=object_id)
            program = Program.objects.get(object_id=program_id.program.object_id)
            if client.account_type == 'sub':
                print('sub')
                wur = WhoopsUpdate.objects.get(customer=client.main_user_id,customer_program=object_id,most_recent='True')
            else:
                print('main')
                wur = WhoopsUpdate.objects.get(customer=client,customer_program=object_id,most_recent='True')
        except:
            return None
        return wur, program

    def get_enhancement_object(self, object_id, client):
        print(object_id)
        print(client)
        print(client.account_type)
        try:
            if client.account_type == 'sub':
                print('eur')
                print(object_id)
                print(client)
                eur = EnhancementUpdate.objects.get(customer_program=object_id, customer=client.main_user_id, most_recent='True')
            else:
                print('eur_main')
                eur = EnhancementUpdate.objects.get(customer_program=object_id, customer=client, most_recent='True')
        except:
            return None
        return eur

    def get(self, request, object_id, token):
        obj = get_object_or_404(SharedReportsRelation, object_id=object_id)
        if str(obj.access_token) != str(token):
            return Response("Invalid Token !", status=HTTP_403_FORBIDDEN)
        else:
            res_whoops = []
            res_enhancement = []
            if timezone.now() > obj.expired_time:
                return Response("Token Expired!", status=HTTP_403_FORBIDDEN)
            else:
                print(obj)
                whoops_report_list = obj.whoopsreportsrepo_set.all().filter(wr_share_relation=object_id)
                enhancement_report_list = obj.enhancementreportsrepo_set.all().\
                    filter(er_share_relation=object_id)

                print('shared list')
                print(whoops_report_list)
                print(enhancement_report_list)
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
            return Response({"Failed": ("Permission denied!")}, status=HTTP_403_FORBIDDEN)
        else:
            try:
                user = UniversityCustomer.objects.get(id=request.user.id)
            except UniversityCustomer.DoesNotExist:
                user = UniversityCustomer.objects.get(id=request.data['client_id'])

            time_now = timezone.now()
            if 'expired_day' in request.data:
                if request.data['expired_day'] > 30:
                    return Response({"Failed": ("expired_day can not greater than 30 days.")},
                                    status=HTTP_400_BAD_REQUEST)
                else:
                    expired_time = time_now + timezone.timedelta(days=request.data['expired_day'])
            else:
                expired_time = time_now + timezone.timedelta(days=2)
            if 'expired_sec' in request.data:
                expired_time = expired_time + timezone.timedelta(seconds=request.data['expired_sec'])

            relation_ship = SharedReportsRelation.objects.create(
                created_by=request.user,
                created_time=time_now,
                expired_time=expired_time,
            )
            relation_ship.save()

            if not request.data['whoops_id'] is None:
                whoops_id_list = request.data['whoops_id'].split('/')
                for x in whoops_id_list:
                    if not self.get_whoops_object(x, user) is None:
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
                        print(raw_data)
                        print('raw_data')
                        customer_program = UniversityCustomerProgram.objects.get(object_id=y)
                        e_obj = EnhancementReportsRepo.objects.create(er_customer_program=customer_program,
                                                                      er_enhancement_report=raw_data,
                                                                      er_created=time_now,
                                                                      er_share_relation=relation_ship)

                        e_obj.save()

            res = {'link': '{0}/{1}'.format(relation_ship.object_id, relation_ship.access_token),
                   'expired_time': expired_time}
            return Response(res)





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
        if manager:
            serializer = AccountManagerSerializer(manager)
            return Response(data=serializer.data, status=HTTP_200_OK)
        else:
            return Response({"Failed": ("Pleas login first!")}, status=HTTP_403_FORBIDDEN)


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
            return Response({"Failed": ("You don't have permission to see this client info!")},
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
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        manager = UpgridAccountManager.objects.get(id=request.user.id)
        if 'email' not in request.data:
            return Response({"Failed": ("Email is required!")}, status=HTTP_403_FORBIDDEN)
        email_existed = UniversityCustomer.objects.filter(email=request.data['email'])
        if email_existed.exists():
            existed_user = email_existed.first()
            if existed_user.account_manager == manager and existed_user.is_active is False:
                raise ValidationError('User was inactive!')
            raise ValidationError('Email already existed!')

        # create sub client object
        decoded_new_password = self.decode_password(self.request.data['password'])
        if 'main_user_id' in self.request.POST: # create subuser
            main_user = UniversityCustomer.objects.get(object_id=request.data['main_user_id'])
            university_school = UniversitySchool.objects.get(object_id=main_user.Ceeb.object_id)
            client = UniversityCustomer.objects.create(
                is_demo=self.request.data['isDemo'],
                username=self.request.data['username'],
                can_ccemail=self.request.data['ccemail'],
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
                )

        client.password = decoded_new_password
        client.save_password()   

        if 'competing_schools' in self.request.data:
            for cp in self.request.data['competing_schools']:
                school = UniversitySchool.objects.get(object_id=cp.get('object_id'))
                client.competing_schools.add(school)

        if 'non_degree_schools' in self.request.data:
            for school_id in self.request.data['non_degree_schools']:
                school = UniversitySchool.objects.get(object_id=school_id.get('object_id'))
                client.non_degree_schools.add(school)

        request.is_create = True
        ResetPassword().post(request)

        return Response({'client_id': client.id}, status=HTTP_201_CREATED)

    def put(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)

        if not 'client_id' in self.request.data:
            return Response({"Failed": ("client_id is required!")}, status=HTTP_403_FORBIDDEN)

        clients = UniversityCustomer.objects.filter(id=self.request.data['client_id'])
        if not clients.exists():
            return Response({"Failed": ("client_id is invalid!")}, status=HTTP_403_FORBIDDEN)
        client = clients.first()
        if 'main_user_id' in self.request.data:
            main_users = UniversityCustomer.objects.filter(id=request.data['main_user_id'])
            if main_users.exists():
                client.service_until = main_users.first().service_until
                # data['service_until'] = main_users.first().service_until
        if 'Ceeb' in self.request.data:
            university_school = UniversitySchool.objects.filter(object_id=request.data['Ceeb'])
            if university_school.exists():
                client.Ceeb = university_school.first()
                # data['Ceeb'] = university_school.first()

        update_fields = ['is_demo', 'username', 'email', 'department', 'account_type', 'account_manager',
                         'title', 'contact_name', 'position', 'position_level', 'phone', 'service_until', 'is_active']
        for field in update_fields:
            if field in request.data:
                setattr(client, field, request.data[field])
        client.save_without_password()

        if 'competing_schools' in self.request.data:
            client.competing_schools.clear()
            for cp in self.request.data['competing_schools']:
                school = UniversitySchool.objects.get(object_id=cp['object_id'])
                client.competing_schools.add(school)

        if 'non_degree_schools' in self.request.data:
            client.competing_schools.clear()
            for school_id in self.request.data['non_degree_schools']:
                school = UniversitySchool.objects.get(object_id=school_id['object_id'])
                client.competing_schools.add(school)

        return Response({"success": ("User has been modified.")}, status=HTTP_202_ACCEPTED)

    def delete(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        try:
            client = UniversityCustomer.objects.get(id=request.data['client_id'])
            client.is_active = False
            client.save_without_password()
            return Response({"Success": ("User deleted!")}, status=HTTP_204_NO_CONTENT)
        except UniversityCustomer.DoesNotExist:
            return Response({"Failed": ("User doesn't exists!")}, status=HTTP_403_FORBIDDEN)


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
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        try:
            client = UniversityCustomer.objects.get(id=object_id)
        except UniversityCustomer.DoesNotExist:
            return Response({"Failed": ("Can not find client with provided id.")}, status=HTTP_403_FORBIDDEN)
        customer_program_list = UniversityCustomerProgram.objects.filter(customer=client)
        serializer = UnivCustomerProgramSerializer(customer_program_list, many=True)
        return Response(serializer.data)

    def post(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        client = UniversityCustomer.objects.get(id=request.data['client_id'])
        if client.account_type == 'sub':
            sub_program_list = self.request.data['sub_client_program'].split('/')
            for cp in sub_program_list:
                ClientAndProgramRelation.objects.create(
                    client=client,
                    client_program=cp,
                    ).save()
            return Response({"success": ("User programs has been created.")}, status=HTTP_201_CREATED)
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

            return Response({"success": (" User programs has been created.")}, status=HTTP_201_CREATED)

    def put(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
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
            return Response({"success": ("User programs has been modified.")}, status=HTTP_202_ACCEPTED)
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

                try:          
                    customer_program_object = UniversityCustomerProgram.objects.get(object_id=p.get('customer_program_id'))
                except UniversityCustomer.DoesNotExist:
                    raise ValidationError('Bad request!')

                # if not customer_program_object.exists():
                #     raise 
                print(customer_program_object)
                print('customer_program_object and its final rel')
                print(customer_program_object.enhancement_final_release)
                if customer_program_object.whoops_final_release_time is None and customer_program_object.whoops_final_release == 'True':
                    customer_program_object.whoops_final_release_time = timezone.now()
                if customer_program_object.enhancement_final_release_time is None and customer_program_object.enhancement_final_release == 'True':
                    customer_program_object.enhancement_final_release_time = timezone.now()
                    print(customer_program_object.enhancement_final_release_time)

                customer_program_object.save()
                # customer_program.save()
            return Response({"success": ("User programs has been modified.")}, status=HTTP_202_ACCEPTED)

    def delete(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        client = UniversityCustomer.objects.get(id=request.data['client_id'])
        if client.account_type == 'main':
            total_program = request.data['customer_program_id'].split('/')
            for i in total_program:
                CustomerCompetingProgram.objects.filter(customer_program=i).delete()
                EnhancementUpdate.objects.filter(customer_program=i).delete()
                WhoopsUpdate.objects.filter(customer_program=i).delete()
                WhoopsReportsRepo.objects.filter(wr_customer_program=i).delete()
                EnhancementReportsRepo.objects.filter(er_customer_program=i).delete()
                ClientAndProgramRelation.objects.filter(client_program=i).delete()
                UniversityCustomerProgram.objects.get(object_id=i).delete()

            return Response({"success": ("User programs has been deleted.")}, status=HTTP_204_NO_CONTENT)


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
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        competing_programs = CustomerCompetingProgram.objects.filter(customer_program=object_id)
        serializer = ManagerUseCompetingProgramSerializer(competing_programs, many=True)
        return Response(serializer.data)

    def post(self, request):
        perm = self.is_manager(request)
        print(request.data['customer_competing_program'])
        print('post============================================================')
        if not perm:
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        for p in request.data['customer_competing_program']:
            CustomerCompetingProgram.objects.create(
                customer_program=UniversityCustomerProgram.objects.get(object_id=p.get('customer_program_id')),
                program=Program.objects.get(object_id=p.get('program_id')),
                order=p.get('order'),
                enhancement_status=p.get('enhancement_status')
            ).save()
        return Response({"success": ("Competing programs has been created.")}, status=HTTP_201_CREATED)

    def put(self, request):
        perm = self.is_manager(request)
        print(request.data['customer_competing_program'])
        if not perm:
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        for p in request.data['customer_competing_program']:
            ccp = CustomerCompetingProgram.objects.filter(object_id=p.get('object_id'))
            print(p.get('program_id'))
            print('program_id')
            print(p.get('customer_program_id'))
            try:
                ccp.update(
                    customer_program=UniversityCustomerProgram.objects.get(object_id=p.get('customer_program_id')),
                    program=Program.objects.get(object_id=p.get('program_id')),
                    order=p.get('order'),
                    enhancement_status=p.get('enhancement_status')
                )
            except:
                raise ValidationError('Bad request!')

        return Response({"success": ("User programs has been modified.")}, status=HTTP_202_ACCEPTED)

    def delete(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        for cp in request.data['competing_program_id']:
            CustomerCompetingProgram.objects.get(object_id=cp.get('object_id')).delete()
        return Response({"success": ("User programs has been deleted.")}, status=HTTP_204_NO_CONTENT)


# Returns all the university and School in the database for Ceeb drop down menu
class UniversitySchoolAPI(generics.ListAPIView):
    serializer_class = UniversityAndSchoolSerializer
    permission_classes = ((IsAuthenticated,))
    pagination_class = CompetingPageNumberPagination
    #search_fields = ['program_name','program_degree']    # pagination_class = CustomerPageNumberPagination
    filter_backend = [SearchFilter,OrderingFilter]

    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

     
    def get_queryset(self, *args, **kwargs):
        is_manager = self.is_manager(self.request)
        if not is_manager:
            return Response({"Failed": ("You don't have permission to access.")}, status=HTTP_403_FORBIDDEN)

        queryset = UniversitySchool.objects.all()   
        if 'object_id' in self.request.GET.keys():
            object_id = self.request.GET.get('object_id')
            queryset = queryset.filter(pk = object_id)
            if queryset.exists():
                return queryset
            else:
                return None
        if 'search' in self.request.GET.keys():
            search = self.request.GET.get('search')
            queryset = queryset.filter(Q(university__icontains = search)|
                    Q(school__icontains = search)|
                    Q(ceeb__icontains = search)) 

        return queryset

    # def get(self, request):
    #     is_manager = self.is_manager(request)
    #     if not is_manager:
    #         return Response({"Failed": ("You don't have permission to access.")}, status=HTTP_403_FORBIDDEN)

    #     ceebs = self.get_object()
    #     serializer = UniversityAndSchoolSerializer(ceebs, many=True)
    #     return Response(serializer.data, status=HTTP_200_OK)


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
            return Response({"Failed": ("You don't have permission to access.")}, status=HTTP_403_FORBIDDEN)

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
            return Response({"Failed": ("You don't have permission to access.")}, status=HTTP_403_FORBIDDEN)

        departments = self.get_object(object_id)
        # serializer = ProgramSerializer(programs, many=True)
        return Response(departments, status=HTTP_200_OK)


class CustomerAndCompetingProgramAPI(generics.ListAPIView):
    serializer_class = CustomerAndCompetingProgramSerializer
    permission_classes = ((IsAuthenticated,))
    pagination_class = CompetingPageNumberPagination
    #search_fields = ['program_name','program_degree']    # pagination_class = CustomerPageNumberPagination
    filter_backend = [SearchFilter,OrderingFilter]

    def is_manager(self, request):
        try:   
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_queryset(self, *args, **kwargs):
        ceeb = ""
        department = ""
        search = ""
        if 'ceeb' in self.request.GET.keys():
            ceeb = self.request.GET.get("ceeb")
        if 'dep' in self.request.GET.keys():
            department = self.request.GET.get("dep")
        if 'search' in self.request.GET.keys():
            search = self.request.GET.get('search')

        arr = self.request.get_full_path()
        arr = arr.split('&')
        if department != None:
            department = department.replace('!','&')

        total_ceeb = ceeb.split('/')
        if self.is_manager(self.request):
            query_list = Program.objects.all()
            query_list = query_list.filter(Q(program_name__icontains = search)|
                    Q(university_school__university__icontains = search)|
                    #Q(degree__description__icontains = search)|
                    Q(degree__name__icontains = search)|
                    Q(university_school__school__icontains = search))
            if total_ceeb:
                query_list = query_list.filter(
                    Q(university_school__in=total_ceeb)
                    )

            if department:
                if department == 'Others':
                    query_list = query_list.filter(Q(department="") | Q(department__isnull=True))
                else:
                    query_list = query_list.filter(
                        Q(department=department)
                        )

            return query_list
        else:
            return Response({"Failed": ("You don't have permission to access!")}, status=HTTP_403_FORBIDDEN)


    def list(self, request, *args, **kwargs):
        import time
        print('.......................start')
        start1 = time.time()
        queryset = self.filter_queryset(self.get_queryset())
        start2 = time.time()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        start3 = time.time()
        serializer = self.get_serializer(queryset, many=True)
        start4 = time.time()
        print(start2- start1)
        print(start3- start2)
        print(start4- start3)
        return Response(serializer.data)



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
            return Response({"failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
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
            return Response({"failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        client = UniversityCustomer.objects.get(id=client_id)

        print('1')

        enhancement_programs_id = EnhancementUpdate.objects.filter(customer=client, most_recent=True)\
            .exclude(initial_diff__isnull=True)

        eur = ManagerEnhancementUpdateNumberSerializer(enhancement_programs_id, many=True)

        print('2')
        whoops_programs_id = WhoopsUpdate.objects.filter(customer=client, most_recent=True)\
            .exclude(initial_diff__isnull=True)

        wur = ManagerWhoopsUpdateNumberSerializer(whoops_programs_id, many=True)

        print('3')
        print(eur.data)
        print('4')
        print(whoops_programs_id.first())
        print(wur.data)
        context = {"enhancement_update": eur.data, "whoops_update": wur.data}
        return Response(context, status=HTTP_200_OK)


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


class UnconfirmedPrograms(generics.ListAPIView):
    serializer_class = UnconfirmedProgramsSerializer

    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_queryset(self, *args, **kwargs):
        if self.is_manager(self.request) == False:
            client_id = self.request.user.id
        elif 'client_id' in self.request.GET :
            client_id = self.request.GET.get("client_id")
            print(self.request.GET.get("client_id"))
        print(self.request.user.id)
        print(**kwargs)
        #print(client_id)
        # if is_manager(self.request):
        #     client_id = self.request.GET.get("client_id")
        query_set = UniversityCustomerProgram.objects.filter(Q(customer=client_id) & Q(customer_confirmation='No'))

        return query_set