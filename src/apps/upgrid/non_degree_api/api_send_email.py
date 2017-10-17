
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT, HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST)
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from django.core.mail import BadHeaderError, EmailMessage
from ..models import *
from django.core.exceptions import ValidationError
from ceeb_program.models import (
    Curriculum, Deadline, Duration, Program, Requirement, Scholarship, Tuition,
    UniversitySchool
    )
from smtplib import SMTPServerDisconnected,  SMTPSenderRefused, SMTPRecipientsRefused, \
    SMTPDataError, SMTPConnectError, SMTPHeloError, SMTPAuthenticationError
from django.http import Http404, HttpResponse
import logging
import os
from .views import ReportOverview
from .serializers import ReportSerializer, NonDegreeReportCustomerMappingSerializer
app_logger = logging.getLogger('app')
import json
import time, datetime
from ..pagination import CustomerPageNumberPagination

try:
    cc_email = os.environ["CC_EMAIL"]
except KeyError:
    cc_email = "swang@gradgrid.com"


class SendNotification(APIView):

    def post(self, request, *args, **kwargs):

        query_set = NonDegreeReportCustomerMapping.objects.filter(is_sent = False).order_by('-date_modified','report').distinct('date_modified','report')
        send_list = {}
        if 'email' in request.data.keys():
            email = request.data['email']
            query_set = query_set.filter(customer__email = email)
        print(query_set)
        for query in query_set:
            if query.customer.email in send_list.keys():
                report_dict = {}
                report_dict['object_id'] = query.report.object_id
                report_dict['school_id'] = query.report.school.object_id
                report_dict['school_name'] = query.report.school.school
                report_dict['university_name'] = query.report.school.university_foreign_key.name
                report_dict['date_modified'] = query.report.date_modified
                send_list[query.customer.email]['report'].append(report_dict)
            else:
                send_list[query.customer.email] = {}
                send_list[query.customer.email]['customer'] = {}
                send_list[query.customer.email]['customer']['username'] = query.customer.username
                send_list[query.customer.email]['customer']['school'] = query.customer.Ceeb.school
                send_list[query.customer.email]['customer']['clientname'] = query.customer.contact_name 
                send_list[query.customer.email]['university'] = query.customer.Ceeb.university_foreign_key.name
                send_list[query.customer.email]['report'] = []
                report_dict = {}
                report_dict['object_id'] = query.report.object_id
                report_dict['school_id'] = query.report.school.object_id
                report_dict['school_name'] = query.report.school.school
                report_dict['university_name'] = query.report.school.university_foreign_key.name
                report_dict['date_modified'] = query.report.date_modified 
                send_list[query.customer.email]['report'].append(report_dict)
    
            cc_addresses = [cc_email]
            cc_addresses_tuple = tuple(cc_addresses)
        

        #generate the course and category changes and display as table rows
        for (customer, content) in send_list.items():
            html_tr = ''
            email = str(customer)
            clientname = send_list[email]["customer"]["clientname"]
            firstname = clientname.split(' ',1)[0]
            current_school_list = UniversitySchool.objects.filter(non_degree_user__email=email)
            report_email = []
            customer_schools_list = []
            report_schools_list = []
            removed_schools_list = []

            for instance in current_school_list:
                customer_schools_list.append(str(instance.object_id))

            for report in content['report']:
                status = True
                name = report['school_id']
                report_schools_list.append(str(name))
                for string in report_schools_list:
                    if not string in customer_schools_list:
                        removed_schools_list.append(string)
                if not str(name) in removed_schools_list:
                    for prereport in report_email:
                        if name == prereport['school_id']:
                            status = False
                            if report['date_modified'].date()>prereport['date_modified'].date():
                                report_email = [report if x==prereport else x for x in report_email]
                    if status:
                        report_email.append(report)

            for report in report_email:
                reportTwo = NonDegreeReport.objects.filter(school__object_id=report['school_id'], active = True).order_by('-date_created')[:2]

                report_data = []
                print(reportTwo)
                if len(reportTwo) > 1:
                    for report_obj in reportTwo:
                        report_data.append(ReportSerializer(report_obj).data)
                    diff_data = ReportOverview.count_diff(report_data[0], report_data[1])
                    diff_update = ReportOverview.count_diff_update(report_data[0], report_data[1])
                else:
                    continue

                cr = str(diff_data['category_removed'])
                ca = str(diff_data['category_added'])
                cor = str(diff_data['course_removed'])
                coa = str(diff_data['course_added'])
                up = str(diff_update['updated'])
                if cr == '0':
                    cr = '<span style="color:gray">-</span>'
                elif cr != '0':
                    cr = '-' + cr
                if ca == '0':
                    ca = '<span style="color:gray">-</span>'
                elif ca != '0':
                    ca = '+' + ca
                if cor == '0':
                    cor = '<span style="color:gray">-</span>'
                elif cor != '0':
                    cor = '-' + cor
                if coa == '0':
                    coa = '<span style="color:gray">-</span>'
                elif coa != '0':
                    coa = '+' + coa
                if up == '0':
                    up = '<span style="color:gray">-</span>'
                elif up != '0':
                    up = '+' + up
                html_tr = tableRow.format(report['school_name']+"<br />\n"+report['university_name'], report['date_modified'].date(), ca, cr,  coa, cor, up) + html_tr 
            
            if html_tr == '':
                continue
            html_content = html.format(firstname, html_tr)

            try:
                message = EmailMessage(subject="Peers' Most Recent Updates", body=html_content, 
                                        to=[customer], bcc=cc_addresses_tuple)
                message.content_subtype = 'html'
                message.send()
        
                temp_report_mapping = NonDegreeReportCustomerMapping.objects.filter(customer__email = customer).update(is_sent = True, send_fail = False, email_content=html_content)
            except(BadHeaderError, SMTPServerDisconnected, SMTPSenderRefused, SMTPRecipientsRefused, SMTPDataError,
                SMTPConnectError, SMTPHeloError, SMTPAuthenticationError) as e:
                
                temp_report_mapping = NonDegreeReportCustomerMapping.objects.filter(customer__email = customer).update(is_sent = False, send_fail = True)
                app_logger.exception('{0} when sending email. Error: {1}'.format(type(e).__name__, html_content))
               
                continue

        date_email_sent = time.strftime("%x")

        return Response({"success": ("email have been sent succussful."),"date_email_sent": date_email_sent}, status=HTTP_202_ACCEPTED)

class PreviewNotification(APIView):
    def get(self, request, *args, **kwargs):
        query_set = NonDegreeReportCustomerMapping.objects.filter(customer__account_manager = request.user).filter(is_sent = False).order_by('-date_modified','report').distinct('date_modified','report')   
        try:
            if 'is_demo' in request.GET.keys() and request.GET.get("is_demo") != None:
                app_logger.info(request.GET.get("is_demo"))
                is_demo = request.GET.get("is_demo")
                query_set = query_set.filter(customer__is_demo = is_demo)

            if 'is_active' in request.GET.keys() and request.GET.get("is_active") != None:
                app_logger.info(request.GET.get("is_active"))
                is_active = request.GET.get("is_active")
                query_set = query_set.filter(customer__is_active = is_active)
        except Exception as e:
            app_logger.error(e)
            return Response({"Failed": ("error input !")}, status=HTTP_400_BAD_REQUEST)

        query_set2 = NonDegreeReportCustomerMapping.objects.filter(customer__account_manager = request.user).filter(is_sent = True)
        send_list = {}
        preview_data = {}
        date_sent_list = []
        schools_list = {}
        for query in query_set:
            if query.customer.email in send_list.keys():
                report_dict = {}
                report_dict['object_id'] = query.report.object_id
                report_dict['school_id'] = query.report.school.object_id
                report_dict['school_name'] = query.report.school.school
                report_dict['university_name'] = query.report.school.university_foreign_key.name
                report_dict['date_modified'] = query.report.date_modified 
                send_list[query.customer.email]['report'].append(report_dict)
            else:
                preview_data[query.customer.email] = {}
                preview_data[query.customer.email]['username'] = query.customer.username
                preview_data[query.customer.email]['school'] = query.customer.Ceeb.school
                preview_data[query.customer.email]['clientname'] = query.customer.contact_name 
                preview_data[query.customer.email]['university'] = query.customer.Ceeb.university_foreign_key.name
                send_list[query.customer.email] = {}
                send_list[query.customer.email]['customer'] = {}
                send_list[query.customer.email]['customer']['username'] = query.customer.username
                send_list[query.customer.email]['customer']['school'] = query.customer.Ceeb.school
                send_list[query.customer.email]['customer']['clientname'] = query.customer.contact_name 
                send_list[query.customer.email]['university'] = query.customer.Ceeb.university_foreign_key.name
                send_list[query.customer.email]['report'] = []
                report_dict = {}
                report_dict['object_id'] = query.report.object_id
                report_dict['school_id'] = query.report.school.object_id
                report_dict['school_name'] = query.report.school.school
                report_dict['university_name'] = query.report.school.university_foreign_key.name
                report_dict['date_modified'] = query.report.date_modified
                send_list[query.customer.email]['report'].append(report_dict)

            cc_addresses = [cc_email]
            cc_addresses_tuple = tuple(cc_addresses)

        for query in query_set2:
            if query.customer.email in send_list.keys():
                send_list[query.customer.email]['date_sent'] = query.report.date_modified.date()
                date_sent_list.append(send_list[query.customer.email]['date_sent'])
                preview_data[query.customer.email]['date_lastsent'] = str(max(date_sent_list))
                send_list[query.customer.email]['date_lastsent'] = max(date_sent_list)

        #generate the course and category changes and display as table rows
        for (customer, content) in send_list.items():
            html_tr = ''        
            email = str(customer)
            clientname = send_list[email]["customer"]["clientname"]
            firstname = clientname.split(' ',1)[0]
            current_school_list = UniversitySchool.objects.filter(non_degree_user__email=email)
            report_email = []
            customer_schools_list = []
            report_schools_list = []
            removed_schools_list = []
            
            for instance in current_school_list:
                customer_schools_list.append(str(instance.object_id))

            for report in content['report']:
                status = True
                name = report['school_id']
                report_schools_list.append(str(name))
                for string in report_schools_list:
                    if not string in customer_schools_list:
                        removed_schools_list.append(string)
                if not str(name) in removed_schools_list:
                    for prereport in report_email:
                        if name == prereport['school_id']:
                            status = False
                            if report['date_modified'].date()>prereport['date_modified'].date():
                                report_email = [report if x==prereport else x for x in report_email]
                    if status:
                        report_email.append(report)

            for report in report_email:
                reportTwo = NonDegreeReport.objects.filter(school__object_id = report['school_id'], active = True).order_by('-date_created')[:2]
                report_data = []
                if len(reportTwo) > 1:
                    for report_obj in reportTwo:
                        report_data.append(ReportSerializer(report_obj).data)
                    diff_data = ReportOverview.count_diff(report_data[0], report_data[1])
                    diff_update = ReportOverview.count_diff_update(report_data[0], report_data[1])
                else:
                    continue
                
                cr = str(diff_data['category_removed'])
                ca = str(diff_data['category_added'])
                cor = str(diff_data['course_removed'])
                coa = str(diff_data['course_added'])
                up = str(diff_update['updated'])
                if cr == '0':
                    cr = '<span style="color:gray">-</span>'
                elif cr != '0':
                    cr = '-' + cr
                if ca == '0':
                    ca = '<span style="color:gray">-</span>'
                elif ca != '0':
                    ca = '+' + ca
                if cor == '0':
                    cor = '<span style="color:gray">-</span>'
                elif cor != '0':
                    cor = '-' + cor
                if coa == '0':
                    coa = '<span style="color:gray">-</span>'
                elif coa != '0':
                    coa = '+' + coa
                if up == '0':
                    up = '<span style="color:gray">-</span>'
                elif up != '0':
                    up = '+' + up
                html_tr = tableRow.format(report['school_name']+"<br />\n"+report['university_name'], report['date_modified'].date(), ca, cr,  coa, cor, up) + html_tr
                
            if html_tr == '':
                del preview_data[customer]
                continue 
            html_content = html.format(firstname, html_tr)

            preview_data[customer]['email_content'] = html_content
        return HttpResponse(json.dumps(preview_data), status=HTTP_200_OK)

class SendEmailHistory(ListAPIView):
    serializer_class = NonDegreeReportCustomerMappingSerializer
    pagination_class = CustomerPageNumberPagination
    def get_queryset(self, *args, **kwargs):
        query_set = NonDegreeReportCustomerMapping.objects.filter(send_fail = False, is_sent = True).order_by('-date_modified','report').distinct('date_modified','report')
        
        return query_set      

html = '<div style="margin: 30px auto;max-width: 80%;">\
      <div style="margin-bottom: 20px">\
        <img src="http://www.gridet.com/wp-content/uploads/2016/06/G-rid-6.png" width="150px">\
      </div>\
      <div style="background:white; padding: 10px 15px;border-radius: 8px ">\
        <div style="text-align: left; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size:18px ; color: rgb(41,61,119)">\
          Hello, {}!<br /><br /> \
        </div>\
        <div style="font-family: sans-serif;">\
          <p>New reports have been released.</p>\
          <p>Here is a brief summary of the most recent changes:</p>\
          <div>\
            <table style="border:1px solid black; text-align:center; border-collapse:collapse;table-layout：fixed">\
              <colgroup>\
                <col width="40%" />\
                <col width="15%" />\
                <col width="9%" />\
                <col width="9%" />\
                <col width="9%" />\
                <col width="9%" />\
                <col width="9%" />\
              </colgroup>\
              <thead>\
                <tr>\
                  <th style="border:1px solid">Schools</th>\
                  <th style="border:1px solid">Latest Release</th>\
                  <th style="border:1px solid" colspan=2>Categories</th>\
                  <th style="border:1px solid" colspan=2>Courses</th>\
                  <th style="border:1px solid">Updates</th>\
                </tr>\
                {} \
              </thead>\
              <tbody>\
              </tbody>\
            </table>\
            <br />\
            <br />\
          </div>\
          <p>For more details, please log in using the following link:</p >\
          <a href="https://upgrid.gridet.com/#/non_degree">https://upgrid.gridet.com/#/non_degree</a><br /><br />\
          <p>Best Regards,</p>\
          <p>Gridology Team</p>\
        </div>\
      </div>\
    </div>' 

tableRow = '<tr>\
                  <td style="border:1px solid;word-break:break-all">{}</td>\
                  <td style="border:1px solid;word-break:break-all">{}</td>\
                  <td style="border:1px solid black; color: rgb(0,128,0);word-break:break-all">{}</td>\
                  <td style="border:1px solid black; color: rgb(255,0,0);word-break:break-all">{}</td>\
                  <td style="border:1px solid black; color: rgb(0,128,0);word-break:break-all">{}</td>\
                  <td style="border:1px solid black; color: rgb(255,0,0);word-break:break-all">{}</td>\
                  <td style="border:1px solid black; color: rgb(0,128,0);word-break:break-all">{}</td>\
                </tr>'
