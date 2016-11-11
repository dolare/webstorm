#System lib
from django.shortcuts import render, render_to_response, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template.context import RequestContext
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import send_mail, BadHeaderError, EmailMessage
from django.utils.translation import ugettext, ugettext_lazy as _
from django.db.models import Q
import base64

#3rd party lib
from rest_framework.status import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework_jwt.views import ObtainJSONWebToken
from rest_framework_jwt.settings import api_settings
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
from weasyprint import HTML, CSS
import weasyprint

#Our lib
from ceeb_program.models import *

#lib in same project
from .pagination import CustomerLimitOffsetPagination, CustomerPageNumberPagination
from .models import *
from .api_serializers import * 
#used shared report
import zlib
from datetime import datetime, timedelta

#used shared report
import zlib
from datetime import datetime, timedelta
from json import dumps,loads
from django.core import serializers 
import re
import apps.upgrid.dbSerializers as dblizer
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.utils.six import BytesIO
from django.core.exceptions import ObjectDoesNotExist

#----------------------Login / Password ----------------------------------------
# api/access_token/
class CustomizeJWT(ObtainJSONWebToken):
    serializer_class = Login2Serializer


# api/password/
class PasswordChangeView(generics.GenericAPIView):
    

    def check_oldpwd(self, old_password):
        decoded_oldpwd = base64.b64decode(old_password)
        return decoded_oldpwd

    def check_newpwd(self, new_password):
        decoded_newpwd = base64.b64decode(new_password)
        return decoded_newpwd

    def put(self, request, format=None):
        username = request.user.username
        if username:
            decoded_oldpwd = self.check_oldpwd(request.data['old_password'])
            User = UpgridBaseUser.objects.get(username=username)
            if User.check_password(decoded_oldpwd):
                decoded_newpwd = self.check_newpwd(request.data['new_password'])

                User.set_password(decoded_newpwd)
                User.save()
                return Response({"success": _("New password has been saved.")}, status=HTTP_202_ACCEPTED)
            return Response({"Failed": _("Please input valid old password.")}, status=HTTP_403_FORBIDDEN)
        return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)        


# api/password/reset/send_eamil/
class ResetPassword(generics.GenericAPIView):

    @permission_classes((AllowAny,))
    def post(self, request, format=None):
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
                    #username = user_reset.username
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
        return HttpResponse(text, status= HTTP_200_OK)		


    def validate(self, data):
        decoded_string = base64.b64decode(data)
        return decoded_string

    def put(self, request, format=None):
        user = request.user
        encoded_password = request.data['password']
        password = self.validate(encoded_password)
        user.set_password(password)
        user.save()
        return Response({"success": _("New password has been saved.")},status=HTTP_202_ACCEPTED)



#------------------------------User API--------------------------------------------

# api/user/program
class CustomerProgram(generics.ListAPIView):
    """
    Get customer's selected program
    """
    serializer_class = UnivCustomerProgramSerializer
    permission_classes = ((IsAuthenticated,))
    pagination_class = CustomerPageNumberPagination


    def get_queryset(self, *args, **kwargs):
        programname = self.request.GET.get("name")
        programdegree = self.request.GET.get("degree")
        whoops_final_release = self.request.GET.get("wfs")
        enhancement_final_release = self.request.GET.get("efs")
        confirmationstatus =self.request.GET.get("cs")
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
            User = UniversityCustomer.objects.get(id = self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = client_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               

        if User.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client = User).values('client_program')
            query_list = UniversityCustomerProgram.objects.filter(customer = User.main_user_id, object_id__in=customer_programs)
        else:
            query_list = UniversityCustomerProgram.objects.filter(customer = User).order_by(order)
        if programname:
            query_list = query_list.filter(
                Q(program__program_name__icontains = programname)
                ).order_by(order)
        if programdegree:
            query_list = query_list.filter(
                Q(program__degree__name__icontains = programdegree)
                ).order_by(order)
        if whoops_final_release:
            query_list = query_list.filter(
                Q(whoops_final_release = whoops_final_release)
                ).order_by(order)
        if enhancement_final_release:
            query_list = query_list.filter(
                Q(enhancement_final_release = enhancement_final_release)
                ).order_by(order)
        if confirmationstatus:
            query_list = query_list.filter(
                Q(customer_confirmation = confirmationstatus)
                ).order_by(order)
        return query_list
        

# api/user/competing_program
class CustomerCompetingProgramAPI(APIView):
    permission_classes=((IsAuthenticated,))

    def get_object(self, request, object_id, client_id):

        try:
            User = UniversityCustomer.objects.get(id = self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = client_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               

        if User.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client = User).values('client_program')
            program_list = UniversityCustomerProgram.objects.filter(customer = User.main_user_id, object_id__in=customer_programs)
            return program_list
        else:            
            try:
                program_list = UniversityCustomerProgram.objects.get(object_id=object_id, customer=User)
                return program_list
            except UniversityCustomerProgram.DoesNotExist:
                return Response({"Failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)


    def get(self, request, object_id, client_id=None, format=None):
        customerprogram = self.get_object(request, object_id, client_id)
        serializer = CustomerCompetingProgramSerializer(customerprogram)
        return Response(data = serializer.data)


# numbers of finalreleased whoops reports
class FinalReleasedWhoops(APIView):

    def get_object(self, request, object_id):
        try:
            User = UniversityCustomer.objects.get(id = self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = object_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               

        return User

    def get(self, request, object_id=None, format=None):
        customer = self.get_object(request, object_id)

        if customer.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client = customer).values('client_program')
            finaltrue_program = UniversityCustomerProgram.objects.filter(customer = User.main_user_id, object_id__in=customer_programs, whoops_final_release='True').count()
        else:
            finaltrue_program = UniversityCustomerProgram.objects.filter(customer=customer, whoops_final_release='True').count()
        return Response(data=finaltrue_program, status=HTTP_200_OK)


# numbers of finalreleased enhancement reports
class FinalReleasedEnhancement(APIView):

    def get_object(self, request, object_id):
        try:
            User = UniversityCustomer.objects.get(id = self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = object_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               

        return User

    def get(self, request, object_id=None,format=None):
        customer = self.get_object(request,object_id)
        if customer.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client = customer).values('client_program')
            finaltrue_program = UniversityCustomerProgram.objects.filter(customer = User.main_user_id, object_id__in=customer_programs, enhancement_final_release='True').count()
        else:
            finaltrue_program = UniversityCustomerProgram.objects.filter(customer=customer, enhancement_final_release='True').count()
        return Response(data=finaltrue_program, status=HTTP_200_OK)


# api/upgrid/user/dashboard/    used for full fill dashboard data requirement
class DashBoardAPI(APIView):
    def get_object(self, request, object_id):
        try:
            user = UniversityCustomer.objects.get(id = self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id = object_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               
 
        return user

    def get_program_list(self, customer):
        if customer.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client = customer).values('client_program')
            program_list = UniversityCustomerProgram.objects.filter(customer = customer.main_user_id, object_id__in=customer_programs)
        else:
            program_list = UniversityCustomerProgram.objects.filter(customer = customer)
        return program_list

    def get_finalreleased_enhancement_nums(self, customer):
        program_list = self.get_program_list(customer)
        finaltrue_program = program_list.filter(enhancement_final_release='True').count()

        return finaltrue_program

    def get_finalreleased_whoops_nums(self, customer):
        program_list = self.get_program_list(customer)
        finaltrue_program = program_list.filter(whoops_final_release='True').count()
        return finaltrue_program

    def get_customerprogram_nums(self, customer):
        program_list = self.get_program_list(customer)
        customerprograms = program_list.count()
        return customerprograms

# To get all the programs belongs to a Ceeb and department
    def get_ceebprogram_nums(self, customer):
        programs = Program.objects.filter(university_school=customer.Ceeb).count()
        return programs

    def get_unconfirmedprogram_nums(self, customer):
        program_list = self.get_program_list(customer)
        programs = program_list.filter(customer_confirmation='No').count()
        return programs
    
    def get(self, request, object_id=None, format=None):
        customer = self.get_object(request, object_id)
        finalreleased_enhancement = self.get_finalreleased_enhancement_nums(customer)
        finalreleased_whoops = self.get_finalreleased_whoops_nums(customer)
        customerprogram_nums = self.get_customerprogram_nums(customer)
        ceebprogram_nums = self.get_ceebprogram_nums(customer)
        unconfirmedprogram_nums = self.get_unconfirmedprogram_nums(customer)
        context= {"finalreleased_enhancement": finalreleased_enhancement,
        "finalreleased_whoops": finalreleased_whoops, "customerprogram_nums": customerprogram_nums,
        "ceebprogram_nums": ceebprogram_nums, "unconfirmedprogram_nums": unconfirmedprogram_nums}
        return Response(context)

# Get user's basic information / 
class CustomerDetail(APIView):

    def get_object(self, request, client_id):
        try:
            User = UniversityCustomer.objects.get(id = self.request.user.id)
            return User
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                   User = UniversityCustomer.objects.get(id = client_id, account_manager=manager)
                   return User
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except UpgridAccountManager.DoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               

    def get(self, request, client_id=None,format=None):
        customer = self.get_object(request, client_id)
        if customer.account_type == 'main':
            serializer = MainUserDetailSerializer(customer)
            return Response(data=serializer.data)
        else:
            serializer = SubUserDetailSerializer(customer)
            return Response(data=serializer.data)


#Post create new subuser/ Put change subuser's is_active status
class CreateOrChangeSubuser(APIView):

    def get_subuser(self, request):
        try:
            subuser = UniversityCustomer.objects.get(id=request.data['subuser_id'])
            mainuser = UniversityCustomer.objects.get(id=request.user.id)
            if mainuser.Ceeb == subuser.Ceeb:
                if mainuser.account_type == "main":
                    if subuser.account_type == "sub":
                        return subuser
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

    def put(self, request, format=None):
        subuser = self.get_subuser(request)
        subuser.is_active = False
        subuser.save()
        return Response({"success": _("Subuser has been deactived.")}, status=HTTP_200_OK)


    def post(self, request, format=None):
        try:
            mainUser = UniversityCustomer.objects.get(id=self.request.user.id, account_type='main')
        except UniversityCustomer.DoesNotExist:
            return Response({"failed": _("Permission Denied.")}, status=HTTP_403_FORBIDDEN)
        
        subservice_until = mainUser.service_until
        universityschool = UniversitySchool.objects.get(ceeb = mainUser.Ceeb.ceeb)
        user = UniversityCustomer.objects.create(
            username = self.request.data['username'],
            email = self.request.data['email'],
            Ceeb = universityschool,
            #department = self.request.data['department'],
            main_user_id = mainUser.id,
            account_manager = mainUser.account_manager,
            title = self.request.data['title'],
            contact_name = self.request.data['contact_name'],
            position = self.request.data['position'],
            position_level = self.request.data['position_level'],
            phone = self.request.data['phone'],
            service_until = subservice_until)

        decoded_newpwd = self.validate(self.request.data['password'])
        user.set_password(decoded_newpwd)
        user.save()


        #create corresponding customer programs of subuser
        programs_id=self.request.data['customer_programs']
        cust_program_id = programs_id.split('/')
        for i in cust_program_id:
            main_customer_program = UniversityCustomerProgram.objects.get(object_id = i)
        
            sub_customer_program=ClientAndProgramRelation.objects.create(
                client = user,
                client_program = main_customer_program
                )
            sub_customer_program.save()
        return Response({"success": _("Subuser has been created.")}, status=HTTP_201_CREATED)



#----------------------------Report API---------------------------------------------


# Get whoops reports by UniversityCustomerProgram object_id 
class WhoopsReportsAPI(APIView):
    def check_permission(self, request, object_id, client_id):
        try:
            User = UniversityCustomer.objects.get(id = self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = client_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               

        if User.account_type == 'sub':
            try:
                customer_programs = ClientAndProgramRelation.objects.get(client = User, client_program = object_id)
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User.main_user_id, whoops_final_release='True')                
                return True
            except:
                return False
        else:
            try:
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User, whoops_final_release='True')
                return True
            except UniversityCustomerProgram.DoesNotExist:
                return False

    def get_object(self, object_id):
        program_id = UniversityCustomerProgram.objects.get(object_id=object_id)
        program = Program.objects.get(object_id=program_id.program.object_id)
        ean = program.expertadditionalnote_set.all()
        return ean

    def get(self,request, object_id, client_id=None):
        perm = self.check_permission(request, object_id, client_id)
        if perm:
            ean = self.get_object(object_id)
            if not len(ean) == 0:
                deadlink = ean.filter(additional_note_type = "dead_link")
                typo = ean.filter(additional_note_type = "typo")
                outdated_information = ean.filter(additional_note_type = "outdated_information")
                data_discrepancy = ean.filter(additional_note_type = "data_discrepancy")
                sidebars = ean.filter(additional_note_type = "sidebars")
                infinite_loop = ean.filter(additional_note_type = "infinite_loop")
                floating_page = ean.filter(additional_note_type = "floating_page")
                confusing = ean.filter(additional_note_type = "confusing")
                others = ean.filter(additional_note_type = "other_expert_note")
            
                html = render_to_string('whoops/whoops_report.html', {'deadlink': deadlink, 'typo': typo,
                    'outdated_information': outdated_information, 'data_discrepancy': data_discrepancy,
                    'sidebars': sidebars, 'infinite_loop': infinite_loop, 'floating_page': floating_page,
                    'confusing': confusing, 'others': others})

                response = HttpResponse(content_type = 'application/pdf')
                response['Content-Disposition'] = 'filename="whoops_report.pdf"'
                weasyprint.HTML(string=html).write_pdf(response)

                return response

            else:
                return HttpResponse(content_type = 'application/pdf', status =HTTP_204_NO_CONTENT)

        else:
            return Response({"Failed": _("Permission denied!")},status=HTTP_403_FORBIDDEN)


# Get Ehancement Reports / Put change confirmation status of a enhancement report.
class EnhancementReportsAPI(APIView):
    def get_user(self, request, client_id=None):
        try:
            User = UniversityCustomer.objects.get(id = self.request.user.id)
            return User
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = client_id, account_manager=manager)
                    return User
                except UniversityCustomer.DoesNotExist:
                    return False
            except:
                return False              

    def check_permission(self, request, object_id, client_id=None):
        User = self.get_user(request, client_id)
        if not User:
            return Response({"Failed": _("Permission Denied! ")}, status=HTTP_403_FORBIDDEN)

        #check if enhancement belongs to this user
        if User.account_type == 'sub':
            try:
                customer_programs = ClientAndProgramRelation.objects.get(client = User, client_program = object_id)
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User.main_user_id, enhancement_final_release='True')                
                return True
            except:
                return False
        else:
            try:
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User, enhancement_final_release='True')
                return True
            except UniversityCustomerProgram.DoesNotExist:
                return False

    def get_object(self, object_id):
        program_list=[]
        customerprogram = UniversityCustomerProgram.objects.select_related('program').get(object_id=object_id)
        self_program = Program.objects.get(object_id=customerprogram.program.object_id)
        program_list.append(self_program)
        competingprogram = customerprogram.customercompetingprogram_set.all().select_related('program').order_by('order')
        for cp in competingprogram:
            program=Program.objects.get(object_id=cp.program.object_id)
            program_list.append(program)
        return program_list

    def get(self, request, object_id, client_id=None):
        perm = self.check_permission(request, object_id, client_id)
        if perm:
            Total_Program = self.get_object(object_id)

            length = len(Total_Program)
            res_obj={}
            for i in range(1,length+1):
                program = "p"+ (str(i) if i>1 else "")
                curriculum = "c"+ (str(i) if i>1 else "")
                tuition = "t"+ (str(i) if i>1 else "")
                deadline = "d"+ (str(i) if i>1 else "")
                requirement = "r"+ (str(i) if i>1 else "")
                required_exam = "ex"+ (str(i) if i>1 else "")
                Intl_transcript = "Intl_transcript"+ (str(i) if i>1 else "")
                Intl_eng_test = "Intl_eng_test"+ (str(i) if i>1 else "")
                scholarship = "s"+ (str(i) if i>1 else "")
                duration = "dura" + (str(i) if i>1 else "")

                p_value = Total_Program[i-1]
                try:
                    c_value = Curriculum.objects.get(program=Total_Program[i-1])
        
                except Curriculum.DoesNotExist:
                    c_value = "empty"

                try:
                    t_value = Tuition.objects.get(program=Total_Program[i-1])
                except Tuition.DoesNotExist:
                    t_value = "empty"

                try:    
                    d_value = Deadline.objects.get(program=Total_Program[i-1])
                except Deadline.DoesNotExist:
                    d_value = "empty"

                try:
                    r_value = Requirement.objects.get(program=Total_Program[i-1])
                except Requirement.DoesNotExist:
                    r_value = "empty"

                try:    
                    dura_value = Duration.objects.get(program=Total_Program[i-1])
                except Duration.DoesNotExist:
                    dura_value = "empty"
                
                if r_value == "empty":
                    r_e_value = "empty"
                    i_value = "empty"
                    i_e_t_value = "empty"
                else:
                    r_e_value = r_value.exam.all()
                    i_value = r_value.intl_transcript.all()
                    i_e_t_value = r_value.intl_english_test.all()

                try:
                    s_value = Scholarship.objects.get(program=Total_Program[i-1])
                except Scholarship.DoesNotExist:
                    s_value = "empty"    

                res_obj[program] = p_value
                res_obj[curriculum] = c_value
                res_obj[tuition] = t_value
                res_obj[deadline] = d_value
                res_obj[requirement] = r_value
                res_obj[required_exam] = r_e_value
                res_obj[Intl_transcript] = i_value
                res_obj[Intl_eng_test] = i_e_t_value
                res_obj[scholarship] = s_value
                res_obj[duration] = dura_value

            res_obj["length"]=length

            html = render_to_string('enhancement/enhancement_5.html',res_obj)
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'filename="enhancement_report.pdf"'
            weasyprint.HTML(string=html).write_pdf(response)
            return response
        else:
            return Response({"Failed": _("Permission denied!")},status=HTTP_403_FORBIDDEN)


    def get_listobjects(self, request):
        total_program = request.data['object_id'].split('/')
        program_list=[]
        try:
            for p in total_program:
                cp = UniversityCustomerProgram.objects.get(object_id = p)
                program_list.append(cp)
            return program_list
        except UniversityCustomerProgram.DoesNotExist:
            raise Http404

    def put(self, request):
        User = self.get_user(request)        
        if not User:
            return Response({"Failed": _("Permission Denied! ")}, status=HTTP_403_FORBIDDEN)
        
        if not User.account_type == 'main':
            return Response({"Failed": _("Only main account can make enhancement report confirmation! ")}, status=HTTP_403_FORBIDDEN)


        cp_list = self.get_listobjects(request)
        # subuser_list = UniversityCustomer.objects.filter(main_user_id = User)
        for p in cp_list:
            if not p.customer == User:
                    return Response({"Failed": _("You don not have access to this program.! ")}, status=HTTP_403_FORBIDDEN)
            p.customer_confirmation = "Yes"
            p.save()                

        return Response({"Success": _("Confirmation status has been set!")}, status = HTTP_202_ACCEPTED)
   
#---------------------------------Share reports API--------------------------------------------
# Post generate share whoops reports link and return it to client. 
class ShareWhoopsReports(APIView):
    permission_classes=(IsAuthenticatedOrReadOnly,)
    def check_permission(self, request):
        try:
            User = UniversityCustomer.objects.get(id = self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = self.request.GET['client_id'], account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               
        
        if User.account_type == 'sub':
            try:
                customer_programs = ClientAndProgramRelation.objects.get(client = User, client_program = self.request.data['univcustomer_program_id'])
                selected_programs = UniversityCustomerProgram.objects.get(object_id=self.request.data['univcustomer_program_id'] ,customer=User.main_user_id, whoops_final_release='True')                
                return True
            except:
                return False
        else:
            try:
                selected_programs = UniversityCustomerProgram.objects.get(object_id=self.request.data['univcustomer_program_id'] ,customer=User, whoops_final_release='True')
                return True
            except UniversityCustomerProgram.DoesNotExist:
                return False
    def get_object(self, request):
        program_id = UniversityCustomerProgram.objects.get(object_id=self.request.data['univcustomer_program_id'])
        program = Program.objects.get(object_id=program_id.program.object_id)
        ean = program.expertadditionalnote_set.all()
        return ean,program
     # Get whoops reports through shared link. :Param :WhoopsReports's object_id , token
    def get(self, request, object_id, token):
        EXPIRED_PERIOD= 3600*48
        try:
            obj=WhoopsReports.objects.get(object_id=object_id)
        except WhoopsReports.DoesNotExist:
            return Response({"Failed":_("The report doesn't exsits.")},status=HTTP_403_FORBIDDEN)
        if str(obj.wr_token) != str(token):
            return Response(status=HTTP_403_FORBIDDEN)
        else:
            date=obj.wr_created
            period = datetime.now()-datetime(date.year, date.month, date.day, date.hour, date.minute, date.second)
            if period.total_seconds() > EXPIRED_PERIOD:
                return Response("expired!",status=HTTP_403_FORBIDDEN)
            else:
                json_str=zlib.decompress(obj.wr_whoops_report)

                return HttpResponse(json_str, content_type="application/json")
    

    #generate sharewhoops report's link
    def post(self, request):
        perm = self.check_permission(request)
        if not perm:
            return Response({"Failed": _("Permission denied!")},status=HTTP_403_FORBIDDEN)
        else:
            ean,program = self.get_object(request)
            if not len(ean) == 0:
                info={'university': program.university_school.university_foreign_key.name, 'school': program.university_school.school,
                    'program': program.program_name, 'degree': program.degree.name}              
                res=dblizer.ExpertAdditionalNoteSerializer(ean,many=True)       
                arr=res.data
                arr.append(info)
                json_str=JSONRenderer().render(arr)
                raw_data=zlib.compress(json_str)
                w_obj = WhoopsReports(wr_customer=UniversityCustomer.objects.get(username=request.user.username),
                                        wr_program=program,
                                        wr_whoops_report = raw_data
                                    )                    
                w_obj.save()  
                res={'{0}/{1}'.format(w_obj.object_id,w_obj.wr_token)}
                return Response(res) #redner json string by default
            else:
                #print("not content in sharedwhoops POST")
                return HttpResponse(content_type = 'plain/text', status =HTTP_204_NO_CONTENT)


class ShareEnhancementReports(APIView):
    permission_classes=(IsAuthenticatedOrReadOnly,)
    def check_permission(self, request, object_id):
        try:
            User = UniversityCustomer.objects.get(id = self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = self.request.GET['client_id'], account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               
        #check if enhancement belongs to this user
        if User.account_type == 'sub':
            try:
                customer_programs = ClientAndProgramRelation.objects.get(client = User, client_program = object_id)
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User.main_user_id, enhancement_final_release='True')                
                return True
            except:
                return False
        else:
            try:
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User, enhancement_final_release='True')
                return True
            except UniversityCustomerProgram.DoesNotExist:
                return False
    def get_object(self, request):
        program_list=[]
        customerprogram = UniversityCustomerProgram.objects.select_related('program').get(object_id=self.request.data['univcustomer_program_id'])
        self_program = Program.objects.get(object_id=customerprogram.program.object_id)
        program_list.append(self_program)
        competingprogram = customerprogram.customercompetingprogram_set.all().select_related('program').order_by('order')
        for cp in competingprogram:
            program=Program.objects.get(object_id=cp.program.object_id)
            program_list.append(program)
        return program_list
    def get(self, request, object_id, token):
        EXPIRED_PERIOD=3600*48
        obj=get_object_or_404(EnhancementReports,object_id=object_id)
        if str(obj.er_token) != str(token):
            return Response("Invalid Token !",status=HTTP_403_FORBIDDEN)
        else:
            date=obj.er_created
            period = datetime.now()-datetime(date.year, date.month, date.day, date.hour, date.minute)
            if period.total_seconds() > EXPIRED_PERIOD:
                return Response("Token Expired!",status=HTTP_403_FORBIDDEN)
            else:

                json_string=zlib.decompress(obj.er_enhancement_report)

                return HttpResponse(json_string, content_type="application/json")
    def post(self, request):
        object_id = self.request.data['univcustomer_program_id']
        print (object_id)
        perm = self.check_permission(request, object_id)
        if perm:
            Total_Program = self.get_object(request)
            json_data={} 
            length = len(Total_Program)

            for i in range(1,length+1):
                program = "p"+ (str(i) if i>1 else "")
                curriculum = "c"+ (str(i) if i>1 else "")
                tuition = "t"+ (str(i) if i>1 else "")
                deadline = "d"+ (str(i) if i>1 else "")
                requirement = "r"+ (str(i) if i>1 else "")
                required_exam = "ex"+ (str(i) if i>1 else "")
                Intl_transcript = "Intl_transcript"+ (str(i) if i>1 else "")
                Intl_eng_test = "Intl_eng_test"+ (str(i) if i>1 else "")
                scholarship = "s"+ (str(i) if i>1 else "")
                duration = "dura" + (str(i) if i>1 else "")
                empty=None
                try:
                    p_value = Total_Program[i-1]
                except Program.DoesNotExist:
                    return HttpResponse(status= 404)

                try:
                    c_value = Curriculum.objects.get(program=Total_Program[i-1],)
                except ObjectDoesNotExist:
                    c_value = empty
                try:
                    t_value = Tuition.objects.get(program=Total_Program[i-1],)
                except ObjectDoesNotExist:
                    t_value = empty
                try:
                    d_value = Deadline.objects.get(program=Total_Program[i-1],)
                except ObjectDoesNotExist:
                    d_value = empty
                try:    
                    dura_value = Duration.objects.get(program=Total_Program[i-1])
                except Duration.DoesNotExist:
                    dura_value = "empty"
                try:
                    r_value = Requirement.objects.get(program=Total_Program[i-1],)
                except ObjectDoesNotExist:
                    r_value = empty
                try:
                    s_value = Scholarship.objects.get(program=Total_Program[i-1],)
                except ObjectDoesNotExist:
                    s_value = empty
                       
                if r_value:
                    r_e_value = r_value.exam.all() #get django queryset
                    i_value = r_value.intl_transcript.all()
                    i_e_t_value = r_value.intl_english_test.all()
                else:
                    r_e_value = empty
                    i_value = empty
                    i_e_t_value = empty
                
                #convert db instance to serializer
                p_value = dblizer.ProgramSerializer(p_value) 
                c_value = dblizer.CurriculumSerializer(c_value)
                t_value = dblizer.TuitionSerializer(t_value)
                d_value = dblizer.DeadlineSerializer(d_value)
                r_value = dblizer.RequirementSerializer(r_value)
                
                r_e_value = dblizer.ExamSerializer(r_e_value, many=True)
                i_value = dblizer.TranscriptEvaluationProviderSerializer(i_value, many=True)
                i_e_t_value = dblizer.InternationalEnglishTestSerializer(i_e_t_value, many=True)
                s_value = dblizer.ScholarshipSerializer(s_value)         
                dura_value = dblizer.DurationSerializer(dura_value)

                json_data[program] = p_value.data #return unordered map if empty would be a empty list
                json_data[curriculum] = c_value.data
                json_data[tuition] = t_value.data
                json_data[deadline] = d_value.data
                json_data[requirement] = r_value.data 
                json_data[required_exam]  = r_e_value.data
                json_data[Intl_transcript] = i_value.data
                json_data[Intl_eng_test] = i_e_t_value.data
                json_data[scholarship] = s_value.data
                json_data[duration] = dura_value.data

            json_data["length"] = length
            
            json_str=JSONRenderer().render(json_data)  # render to bytes with utf-8 encoding
            raw_data=zlib.compress(json_str)
            e_obj=EnhancementReports.objects.create(er_customer_program=Total_Program[0],
                                        er_enhancement_report = raw_data
                                        )
            e_obj.save() 
            #ss= str(json_str,'utf-8')
            
            res={'{0}/{1}'.format(e_obj.object_id,e_obj.er_token)}
            return Response(res)  #redner json string by default  
  

#------------------------------------Account Manager APIs---------------------------------------
# check is_account manager
class IsAccountManager(APIView):
    def is_manager(self, request):
        try:

            mananger = UpgridAccountManager.objects.get(id = request.user.id)
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
            return Response(data=serializer.data, status = HTTP_200_OK)
        else:
            return Response({"Failed":_("Pleas login first!")}, status=HTTP_403_FORBIDDEN)


# used to get client detail information
class Client(APIView):
    def check_permission(self, request, object_id):
        try:
            manager = UpgridAccountManager.objects.get(id = request.user.id)
            client = UniversityCustomer.objects.select_related('account_manager').get(id = object_id)
            if manager.id == client.account_manager.id:
                return True
            else:
                return False
        except:
            return False

    #decode password
    def validate(self, data):
        decoded_string = base64.b64decode(data)
        return decoded_string

    def get_object(self, object_id):
        try:
            client = UniversityCustomer.objects.get(id=object_id)
            # if client.account_type == 'sub':
            #     return UniversityCustomer.objects.get(object_id=client.main_user_id)
            return client
        except UniversityCustomer.DoesNotExist:
            raise Http404
        

    def get(self, request, object_id):
        perm = self.check_permission(request, object_id)
        if not perm:
            return Response({"Failed":_("You don't have permission to see this client info!")},status = HTTP_403_FORBIDDEN)

        client = self.get_object(object_id)
        if client.account_type == 'sub':
            serializer = SubClientDetailSerializer(client)
            return Response(serializer.data,status=HTTP_200_OK)
        else:
            serializer = MainClientDetailSerializer(client)
            return Response(serializer.data,status=HTTP_200_OK)
            
    def post(self, request):        
        try:
            UpgridAccountManager.objects.get(id= self.request.user.id)
        except UpgridAccountManager.DoesNotExist:
            return Response({"Failed":_("Permission Denied!")}, status=HTTP_403_FORBIDDEN)

        # create sub client object
        if 'mainUser_id' in self.request.POST:
            mainUser = UniversityCustomer.objects.get(object_id = self.request.data['mainUser_id'])
            universityschool = UniversitySchool.objects.get(object_id=mainUser.Ceeb.object_id)
            client = UniversityCustomer.objects.create(
                username =self.request.data['username'],
                email = self.request.data['email'],
                Ceeb = universityschool,
                department = self.request.data['department'],
                account_type = self.request.data['account_type'],
                service_level = mainUser.service_level,
                account_manager = UpgridAccountManager.objects.get(id =mainUser.account_manager),
                title = self.request.data['title'],
                contact_name = self.request.data['contact_name'],
                position = self.request.data['position'],
                position_level = self.request.data['position_level'],
                phone = self.request.data['phone'],
                service_until = mainUser.service_until,            
                )
        # create main client object
        else: 
            universityschool = UniversitySchool.objects.get(object_id=self.request.data['ceeb'])
            client = UniversityCustomer.objects.create(
                username =self.request.data['username'],
                email = self.request.data['email'],
                Ceeb = universityschool,
                department = self.request.data['department'],
                account_type = self.request.data['account_type'],
                service_level = self.request.data['service_level'],
                account_manager = UpgridAccountManager.objects.get(id =self.request.user.id),
                title = self.request.data['title'],
                contact_name = self.request.data['contact_name'],
                position = self.request.data['position'],
                position_level = self.request.data['position_level'],
                phone = self.request.data['phone'],
                service_until = self.request.data['service_until'],            
                )

        decoded_newpwd = self.validate(self.request.data['password'])
        client.set_password(decoded_newpwd)
        client.save()

        # for subuser create client adn program relation
        if client.account_type == 'sub':
            subprogram_list = self.request.data['subclient_program'].split('/')
            for scp in subprogram_list:
                ClientAndProgramRelation.objects.create(
                    client = client,
                    client_program = cp,
                    ).save()
            return Response({"success": _("Subuser has been created.")}, status=HTTP_201_CREATED)
    
        # for mainuser add competing_schools
        for cp in self.request.data['competing_schools']:
            school = UniversitySchool.objects.get(object_id=cp.get('object_id'))
            client.competing_schools.add(school)

        #create UniversityCustomerProgram for main user
        for p in self.request.data['selected_customerprogram']:
            program = Program.objects.get(object_id = p.get('program_id'))
            customer_program = UniversityCustomerProgram.objects.create(
                customer = client,
                program = program,
                whoops_status = p.get('whoops_status'),
                whoops_final_release = p.get('whoops_final_release'),
                enhancement_final_release = p.get('enhancement_final_release'),
                customer_confirmation = 'No',
                )
            customer_program.save()

        #create competing program of each customer program for mainuser
            for cp in p.get('competing_program'):
                competingprogram = Program.objects.get(object_id = cp.get('object_id'))
                new_cp = CustomerCompetingProgram.objects.create(
                    customer_program = customer_program,
                    program = competingprogram,
                    order = cp.get('order'),
                    enhancement_status = cp.get('enhancement_status'),
                    )
                new_cp.save()

        return Response({"success": _("User has been created.")}, status=HTTP_201_CREATED)

    def put(self,request):
        try:
            UpgridAccountManager.objects.get(id= self.request.user.id)
        except UpgridAccountManager.DoesNotExist:
            return Response({"Failed":_("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
 
        universityschool = UniversitySchool.objects.get(object_id=self.request.data['ceeb'])
        client = UniversityCustomer.objects.get(object_id=self.request.data['client_id']).update(
            username =self.request.data['username'],
            email = self.request.data['email'],
            Ceeb = universityschool,
            account_type = self.request.data['account_type'],
            account_manager = self.request.user.id,
            title = self.request.data['title'],
            contact_name = self.request.data['contact_name'],
            position = self.request.data['position'],
            position_level = self.request.data['position_level'],
            phone = self.request.data['phone'],
            service_until = self.request.data['service_until'],            
            )
        client.save()

        # update competing_schools
        if client.account_type == 'main':
            client.competing_schools.clear()
            for cp in self.request.data['competing_schools']:
                school = UniversitySchool.objects.get(object_id=cp['object_id'])
                client.competing_schools.add(school)

            #update UniversityCustomerProgram

            for p in self.request.data['selected_customerprogram']:
                #program = Program.objects.get(object_id = p.get('program_id'))
                if not p.get('customer_program_id') == None:               
                    customer_program = UniversityCustomerProgram.objects.get(object_id=p.get('customer_program_id'))

                    customer_program.customer = client,
                    customer_program.program = Program.objects.get(object_id = p.get('program_id'))        
                    customer_program.whoops_status = p.get('whoops_status'),
                    customer_program.whoops_final_release = p.get('whoops_final_release'),
                    customer_program.enhancement_final_release = p.get('enhancement_final_release'),
                    customer_program.customer_confirmation = p.get('customer_confirmation'),
            
                    customer_program.save()
                else:
                    customer_program = UniversityCustomerProgram.objects.create(
                        customer = client,
                        program = program.objects.get(object_id = p.get['program_id']),
                        whoops_status = p.get('whoops_status'),
                        whoops_final_release = p.get('whoops_final_release'),
                        enhancement_final_release = p.get('enhancement_final_release'),
                        customer_confirmation = p.get('customer_confirmation')
                        )
                    customer_program.save()

            #update competing program of each customer program
                #origin_list = CustomerCompetingProgram.objects.filter(customer_program=customer_program)
                for cp in p.get('competing_program'):
                    ccp = CustomerCompetingProgram.objects.get(object_id = cp.get('competing_program_id'))
                   
                    ccp.customer_program = customer_program
                    ccp.program = Program.objects.get(object_id = cp.get('program_id'))
                    ccp.order = cp.get('order') 
                    ccp.enhancement_status = cp.get('enhancement_status')

                    ccp.save()


        return Response({"success": _("Subuser has been created.")}, status=HTTP_201_CREATED)

    def delete(self, request, format=None):
        total_program = self.request.data[customer_program_id].split('/')
        for i in total_program:
            UniversityCustomerProgram.objects.get(object_id = i).delete()
        return Response(status=HTTP_204_NO_CONTENT)


# Returns all the university and School in the database for Ceeb drop down menu
class UniversitySchoolAPI(APIView):
    def is_manager(self, request):
        try:
            mananger = UpgridAccountManager.objects.get(id = request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_object(self):

        return UniversitySchool.objects.all()    
    
    def get(self, request):
        is_manager = self.is_manager(request)
        if not is_manager:
            return Response({"Failed": _("You don't have permission to access.")}, status=HTTP_403_FORBIDDEN)

        Ceebs = self.get_object()
        serializer = UniversityAndSchoolSerializer(Ceebs, many=True)
        return Response(serializer.data, status=HTTP_200_OK)


class ProgramAPI(APIView):
    def is_manager(self, request):
        try:
            mananger = UpgridAccountManager.objects.get(id = request.user.id)
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

            mananger = UpgridAccountManager.objects.get(id = request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_object(self, object_id):
        try:
            universityschool = UniversitySchool.objects.get(object_id=object_id)
            programs = Program.objects.filter(university_school=universityschool).values('department').exclude(department__isnull=True).exclude(department__exact="").order_by().distinct()

            return programs
        except:
            raise Http404

    def get(self, request, object_id):
        ismanager = self.is_manager(request)
        if not ismanager:
            return Response({"Failed": _("You don't have permission to access.")}, status=HTTP_403_FORBIDDEN)

        departments = self.get_object(object_id)
        #serializer = ProgramSerializer(programs, many=True)
        return Response(departments, status=HTTP_200_OK)


class CustomerAndCompetingProgramAPI(generics.ListAPIView):
    serializer_class = CustomerAndCompetingProgramSerializer
    permission_classes = ((IsAuthenticated,))
    pagination_class = CustomerPageNumberPagination

    def is_manager(self, request):
        try:   
            mananger = UpgridAccountManager.objects.get(id = request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_queryset(self, *args, **kwargs):
        Ceeb = self.request.GET.get("ceeb")
        department = self.request.GET.get("dep")

        Total_Ceeb = Ceeb.split('/')
        if self.is_manager(self.request):
            query_list = Program.objects.all()
            if Total_Ceeb:
                #universityschool = UniversitySchool.objects.get(object_id=Ceeb)
                query_list = query_list.filter(
                    Q(university_school__in = Total_Ceeb)
                    )
            if department:
                query_list = query_list.filter(
                    Q(department = department)
                    )
            return query_list
        else:
            return Response({"Failed": _("You don't have permission to access!")}, status=HTTP_403_FORBIDDEN)



class Testing(APIView):
    def post(self, request):

        a= request.data

        for x in self.request.data['competing_schools']:
            print (x.get('class'))

        return Response((a.get('competing_schools')[0]['class']), status=HTTP_200_OK)


class CreateManager(APIView):
    permission_classes = (AllowAny,)
    def post(self, request):
        user = UpgridAccountManager.objects.create(
            username = self.request.data['username'],
            email = self.request.data['email'],
            )

        user.set_password(self.request.data['password'])
        user.save()
        return Response(user.username)



# Get whoops reports by UniversityCustomerProgram object_id 
class WhoopsWebReports(APIView):
    def check_permission(self, request, object_id, client_id):
        try:
            User = UniversityCustomer.objects.get(id = self.request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = client_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except:
                return Response({"Failed": _("System can not identify your status. Please login first!")}, status=HTTP_403_FORBIDDEN)               

        if User.account_type == 'sub':
            try:
                customer_programs = ClientAndProgramRelation.objects.get(client = User, client_program = object_id)
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User.main_user_id, whoops_final_release='True')                
                return True
            except:
                return False
        else:
            try:
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User, whoops_final_release='True')
                return True
            except UniversityCustomerProgram.DoesNotExist:
                return False

    def get_object(self, object_id):
        program_id = UniversityCustomerProgram.objects.get(object_id=object_id)
        program = Program.objects.get(object_id=program_id.program.object_id)
        ean = program.expertadditionalnote_set.all()
        return ean,program

    def get(self,request, object_id, client_id=None):
        perm = self.check_permission(request, object_id, client_id)
        if perm:
            ean,program = self.get_object(object_id)
            if not len(ean) == 0:
                info={'university': program.university_school.university_foreign_key.name, 'school': program.university_school.school,
                    'program': program.program_name, 'degree': program.degree.name}
                res = dblizer.ExpertAdditionalNoteSerializer(ean, many=True).data
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
            User = UniversityCustomer.objects.get(id = self.request.user.id)
            return User
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id = self.request.user.id)
                try:
                    User = UniversityCustomer.objects.get(id = client_id, account_manager=manager)
                    return User
                except UniversityCustomer.DoesNotExist:
                    return False
            except:
                return False              

    def check_permission(self, request, object_id, client_id=None):
        User = self.get_user(request, client_id)
        if not User:
            return Response({"Failed": _("Permission Denied! ")}, status=HTTP_403_FORBIDDEN)

        #check if enhancement belongs to this user
        if User.account_type == 'sub':
            try:
                customer_programs = ClientAndProgramRelation.objects.get(client = User, client_program = object_id)
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User.main_user_id, enhancement_final_release='True')                
                return True
            except:
                return False
        else:
            try:
                selected_programs = UniversityCustomerProgram.objects.get(object_id=object_id ,customer=User, enhancement_final_release='True')
                return True
            except UniversityCustomerProgram.DoesNotExist:
                return False

    def get_object(self, object_id):
        program_list=[]
        customerprogram = UniversityCustomerProgram.objects.select_related('program').get(object_id=object_id)
        self_program = Program.objects.get(object_id=customerprogram.program.object_id)
        program_list.append(self_program)
        competingprogram = customerprogram.customercompetingprogram_set.all().select_related('program').order_by('order')
        for cp in competingprogram:
            program=Program.objects.get(object_id=cp.program.object_id)
            program_list.append(program)
        return program_list

    def get(self, request, object_id, client_id=None):
       # perm = self.check_permission(request, object_id, client_id)
        perm =True
        if perm:
            Total_Program = self.get_object(object_id)

            length = len(Total_Program)
            res_obj={}
            for i in range(1,length+1):
                program = "p"+ (str(i) if i>1 else "")
                curriculum = "c"+ (str(i) if i>1 else "")
                tuition = "t"+ (str(i) if i>1 else "")
                deadline = "d"+ (str(i) if i>1 else "")
                requirement = "r"+ (str(i) if i>1 else "")
                required_exam = "ex"+ (str(i) if i>1 else "")
                Intl_transcript = "Intl_transcript"+ (str(i) if i>1 else "")
                Intl_eng_test = "Intl_eng_test"+ (str(i) if i>1 else "")
                scholarship = "s"+ (str(i) if i>1 else "")
                duration = "dura" + (str(i) if i>1 else "")

                p_value = Total_Program[i-1]
                try:
                    c_value = Curriculum.objects.get(program=Total_Program[i-1])
        
                except Curriculum.DoesNotExist:
                    c_value = "empty"

                try:
                    t_value = Tuition.objects.get(program=Total_Program[i-1])
                except Tuition.DoesNotExist:
                    t_value = "empty"

                try:    
                    d_value = Deadline.objects.get(program=Total_Program[i-1])
                except Deadline.DoesNotExist:
                    d_value = "empty"

                try:
                    r_value = Requirement.objects.get(program=Total_Program[i-1])
                except Requirement.DoesNotExist:
                    r_value = "empty"

                try:    
                    dura_value = Duration.objects.get(program=Total_Program[i-1])
                except Duration.DoesNotExist:
                    dura_value = "empty"
                
                if r_value == "empty":
                    r_e_value = "empty"
                    i_value = "empty"
                    i_e_t_value = "empty"
                else:
                    r_e_value = r_value.exam.all()
                    i_value = r_value.intl_transcript.all()
                    i_e_t_value = r_value.intl_english_test.all()

                try:
                    s_value = Scholarship.objects.get(program=Total_Program[i-1])
                except Scholarship.DoesNotExist:
                    s_value = "empty"    

                p_value = dblizer.ProgramSerializer(p_value) 
                c_value = dblizer.CurriculumSerializer(c_value)
                t_value = dblizer.TuitionSerializer(t_value)
                d_value = dblizer.DeadlineSerializer(d_value)
                r_value = dblizer.RequirementSerializer(r_value)
                
                r_e_value = dblizer.ExamSerializer(r_e_value, many=True)
                i_value = dblizer.TranscriptEvaluationProviderSerializer(i_value, many=True)
                i_e_t_value = dblizer.InternationalEnglishTestSerializer(i_e_t_value, many=True)
                s_value = dblizer.ScholarshipSerializer(s_value)
                dura_value = dblizer.DurationSerializer(dura_value)

                res_obj[program] = p_value.data
                res_obj[curriculum] = c_value.data
                res_obj[tuition] = t_value.data
                res_obj[deadline] = d_value.data
                res_obj[requirement] = r_value.data
                res_obj[required_exam] = r_e_value.data
                res_obj[Intl_transcript] = i_value.data
                res_obj[Intl_eng_test] = i_e_t_value.data
                res_obj[scholarship] = s_value.data
                res_obj[duration] = dura_value.data

            res_obj["length"]=length

            return Response(res_obj, status=HTTP_200_OK)
        else:
            return Response({"Failed": _("Permission denied!")},status=HTTP_403_FORBIDDEN)