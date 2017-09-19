
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
                send_list[query.customer.email].append("{},{}".format(query.report.school.school, query.report.categories))
            else:
                send_list[query.customer.email] = []
                send_list[query.customer.email].append("{},{}".format(query.report.school.school, query.report.categories))

        try:
            cc_addresses = [cc_email]
            cc_addresses_tuple = tuple(cc_addresses)

            for (customer, content) in send_list.items():
                html_content = ("{}".format(content))
                print(customer)
                print(content)


                message = EmailMessage(subject='Update Notification', body=html_content, 
                                        to=[customer], bcc=cc_addresses_tuple)
                message.content_subtype = 'html'
                message.send()
    
        except(BadHeaderError, SMTPServerDisconnected, SMTPSenderRefused, SMTPRecipientsRefused, SMTPDataError,
            SMTPConnectError, SMTPHeloError, SMTPAuthenticationError) as e:
            app_logger.exception('{0} when sending email. Error: {1}'.format(type(e).__name__, html_content))
            raise ValidationError("Failed to send Email. {0}".format(type(e).__name__, html_content))
        
        return Response({"success": ("email have been sent succussful.")}, status=HTTP_202_ACCEPTED)


class PreviewNotification(APIView):
    def get(self, request, *args, **kwargs):
        query_set = NonDegreeReportCustomerMapping.objects.filter(is_sent = False)
        send_list = {}
        for query in query_set:
            if query.customer.email in send_list.keys():
                send_list[query.customer.email].append("{},{}".format(query.report.school.school, query.report.categories))
            else:
                send_list[query.customer.email] = []
                send_list[query.customer.email].append("{},{}".format(query.report.school.school, query.report.categories))
        
        return HttpResponse(json.dumps(send_list), status=HTTP_200_OK)
