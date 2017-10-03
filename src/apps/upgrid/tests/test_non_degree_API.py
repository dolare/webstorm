from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER
from base64 import b64encode
import json
# from mock import patch
from ceeb_program.models import (
    Curriculum, Deadline, Duration, Program, Requirement, Scholarship, Tuition,
    UniversitySchool
    )

from apps.upgrid.models import UpgridBaseUser, UpgridAccountManager, UniversityCustomer, UniversityCustomerProgram


class UserBaseAPITestCase(APITestCase):
    """
    Set up user and token for testing.
    """
    def setUp(self):
        self.account_manager_data = {'username': 'account_manager',
                                     'is_active': True,
                                     'email': 'account_manager@testing.edu', }
        self.university_customer_data = {'username': 'university_customer',
                                         'email': 'university_customer@testing.edu',
                                         'is_active': True,
                                         }
        self.account_manager = UpgridAccountManager.objects.create(**self.account_manager_data)
        self.account_manager.set_password('password')
        self.account_manager.save()
        self.account_manager_token = jwt_encode_handler(jwt_payload_handler(self.account_manager))

        self.university_customer = UniversityCustomer.objects.create(**self.university_customer_data)
        self.university_customer.set_password('password')
        self.university_customer.save()
        self.university_customer_token = jwt_encode_handler(jwt_payload_handler(self.university_customer))

    def tearDown(self):
        """
        deletes new data from test
        :return:
        """
        del self


class DataBaseAPITestCase(UserBaseAPITestCase):
    fixtures = ['auth_data.json', 'ceeb_data_v0.13.json', 'upgrid_data.json', ]


# class SchoolAPITestCase(DataBaseAPITestCase):
#     """
#     Testing API for '^schools'
#     """
#
#     def test_user_school(self):
#         """
#         Ensure
#         """
#         user = UpgridBaseUser.objects.get(username="testing")
#         self.assertTrue(user is not None, msg="user not create.")