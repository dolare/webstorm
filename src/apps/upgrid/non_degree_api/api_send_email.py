
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT, HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST)
from rest_framework.views import APIView
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
app_logger = logging.getLogger('app')
import json

try:
    cc_email = os.environ["CC_EMAIL"]
    #cc_email = os.environ["CC_EMAIL"]
except KeyError:
    cc_email = "swang@gradgrid.com"

class SendNotification(APIView):

    def post(self, request, *args, **kwargs):

        query_set = NonDegreeReportCustomerMapping.objects.filter(is_sent = False)
        send_list = {}
        for query in query_set:
            if query.customer.email in send_list.keys():
                send_list[query.customer.email]['report'].append("{},{}".format(query.report.school.school, query.report.categories))
            else:
                send_list[query.customer.email] = {}
                send_list[query.customer.email]['customer'] = {}
                send_list[query.customer.email]['customer']['username'] = query.customer.username
                send_list[query.customer.email]['customer']['school'] = query.customer.Ceeb
                send_list[query.customer.email]['report'] = []
                send_list[query.customer.email]['report'].append("{},{}".format(query.report.school.school, query.report.categories))
    
            cc_addresses = [cc_email]
            cc_addresses_tuple = tuple(cc_addresses)

        for (customer, content) in send_list.items():
            html_content = html.format(customer, 'school', '1','2','3','4','5','6','7')
            print(customer)
            print(content)

            try:
                message = EmailMessage(subject='Update Notification', body=html_content, 
                                        to=[customer], bcc=cc_addresses_tuple)
                message.content_subtype = 'html'
                message.send()
                
                temp_report_mapping = NonDegreeReportCustomerMapping.objects.filter(customer__email = customer).update(is_sent = True, send_fail = False)
 
            except(BadHeaderError, SMTPServerDisconnected, SMTPSenderRefused, SMTPRecipientsRefused, SMTPDataError,
                SMTPConnectError, SMTPHeloError, SMTPAuthenticationError) as e:
                
                temp_report_mapping = NonDegreeReportCustomerMapping.objects.filter(customer__email = customer).update(is_sent = False, send_fail = True)
                app_logger.exception('{0} when sending email. Error: {1}'.format(type(e).__name__, html_content))
               
                continue
        
        return Response({"success": ("email have been sent succussful.")}, status=HTTP_202_ACCEPTED)


class PreviewNotification(APIView):
    def get(self, request, *args, **kwargs):
        query_set = NonDegreeReportCustomerMapping.objects.filter(is_sent = False)
        send_list = {}
        for query in query_set:
            if query.customer.email in send_list.keys():
                send_list[query.customer.email]['report'].append("{},{}".format(query.report.school.school, query.report.categories))
            else:
                send_list[query.customer.email] = {}
                send_list[query.customer.email]['customer'] = {}
                send_list[query.customer.email]['customer']['username'] = query.customer.username
                send_list[query.customer.email]['customer']['school'] = query.customer.Ceeb.school
                send_list[query.customer.email]['report'] = []
                send_list[query.customer.email]['report'].append("{},{}".format(query.report.school.school, query.report.categories))
            
        return HttpResponse(json.dumps(send_list), status=HTTP_200_OK)


html = '<div style="margin: 30px auto;max-width: 600px;"> \
      <div style="margin-bottom: 20px"> \
        <img src="http://www.gridet.com/wp-content/uploads/2016/06/G-rid-6.png" width="150px"> \
      </div> \
      <div style="background:white; padding: 20px 35px;border-radius: 8px "> \
        <div style="text-align: left; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size:18px ; color: rgb(41,61,119)"> \
          Hello, {}! \
        </div> \
        <div style="font-family: sans-serif"></div> \
          <p>New reports have been released.</p> \
          <p>Here is a brief summary of the changes:</p> \
          <div> \
            <table> \
					    <thead> \
                <tr> \
                  <th>Schools</th> \
                  <th>Latest Release</th> \
                  <th colspan=2>Categories</th> \
                  <th colspan=2>Courses</th> \
                </tr> \
					    </thead> \
					    <tbody> \
                <tr> \
                  <td> {}school</td> \
                  <td> {}releasetime</td> \
                  <td style="color: rgb(0,128,0)"> {}cateplus</td> \
                  <td style="color: rgb(255,0,0)"> {}catemin</td> \
                  <td style="color: rgb(0,128,0)"> {}courseplus</td> \
                  <td style="color: rgb(255,0,0)"> {}coursemin</td> \
                </tr> \
					    </tbody> \
            </table> \
          </div> \
          <p>If you want more details, please log in using the following link:</p> \
          <a href="https:// {}">https:// {}</a><br /><br /> \
          <div> \
            Thanks! \
          </div> \
          <p>--</p> \
          <p>Best Regards,</p> \
          <p>- Gridology Team</p> \
        </div> \
      </div>' 