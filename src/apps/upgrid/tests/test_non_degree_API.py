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
    fixtures = ['auth_data_10_3.json', 'webtracking_data.json', 'ceeb_data_v0.28.json', 'upgrid_data_10_3.json', ]

    def setUp(self):
        # self.account_manager_data = {'username': 'account_manager',
        #                              'is_active': True,
        #                              'email': 'account_manager@testing.edu', }
        # self.university_customer_data = {'username': 'university_customer',
        #                                  'email': 'university_customer@testing.edu',
        #                                  'is_active': True,
        #                                  }
        # self.account_manager = UpgridAccountManager.objects.create(**self.account_manager_data)
        # self.account_manager.set_password('password')
        # self.account_manager.save()
        # self.account_manager_token = jwt_encode_handler(jwt_payload_handler(self.account_manager))
        #
        # self.university_customer = UniversityCustomer.objects.create(**self.university_customer_data)
        # self.university_customer.set_password('password')
        # self.university_customer.save()
        # self.university_customer_token = jwt_encode_handler(jwt_payload_handler(self.university_customer))
        self.customer = UniversityCustomer.objects.get(email="cky1@gustr.com")
        self.customer_token = jwt_encode_handler(jwt_payload_handler(self.customer))
        self.manager = UpgridAccountManager.objects.get(email="ckykokoko@gmail.com")
        self.manager_token = jwt_encode_handler(jwt_payload_handler(self.manager))

    def tearDown(self):
        """
        deletes new data from test
        :return:
        """
        del self


class SchoolsAPITestCase(UserBaseAPITestCase):
    """
    Testing API for '^schools'
    """

    def test_schools_with_manager(self):
        """
        Test schools API with manager account
        """
        url = reverse('upgrid:non_degree_api:schools')
        response = APIClient().get(url, {}, format='json', HTTP_AUTHORIZATION='JWT ' + self.manager_token)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_schools_with_university_customer(self):
        """
        Test schools API with university customer
        """
        url = reverse('upgrid:non_degree_api:schools')
        response = APIClient().get(url, {}, format='json', HTTP_AUTHORIZATION='JWT ' + self.customer_token)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SchoolDetailAPITestCase(UserBaseAPITestCase):
    """
    Testing API for '^schools/(?P<object_id>[0-9a-fA-F\-]+)$'
    """

    def test_school_detail_with_manager(self):
        """
        Test school API with manager account
        """
        url = reverse('upgrid:non_degree_api:school_detail', args=['580bbf8b-642b-4eb7-914c-03a054981719'])
        response = APIClient().get(url, format='json', HTTP_AUTHORIZATION='JWT ' + self.manager_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('object_id' in response.data, "Did not return object_id.")
        self.assertTrue('ceeb' in response.data, "Did not return ceeb.")
        self.assertTrue('school' in response.data, "Did not return school.")
        self.assertTrue('university' in response.data, "Did not return university.")
        self.assertTrue('categories' in response.data, "Did not return categories.")

    def test_school_detail_with_customer(self):
        """
        Test school detail API with university customer
        Always return 404, because school detail API only for manager.
        """
        url = reverse('upgrid:non_degree_api:school_detail', args=['580bbf8b-642b-4eb7-914c-03a054981719'])
        response = APIClient().get(url, {}, format='json', HTTP_AUTHORIZATION='JWT ' + self.customer_token)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class SchoolClientsAPITestCase(UserBaseAPITestCase):
    """
    Testing API for '^schools/(?P<object_id>[0-9a-fA-F\-]+)/clients$'
    """

    def test_school_clients_with_manager(self):
        """
        Test school API with manager account
        """
        url = reverse('upgrid:non_degree_api:school_client', args=['580bbf8b-642b-4eb7-914c-03a054981719'])
        response = APIClient().get(url, format='json', HTTP_AUTHORIZATION='JWT ' + self.manager_token)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('object_id' in response.data, "Did not return object_id.")
        self.assertTrue('ceeb' in response.data, "Did not return ceeb.")
        self.assertTrue('school' in response.data, "Did not return school.")
        self.assertTrue('non_degree_client' in response.data, "Did not return non_degree_client.")

    def test_school_clients_with_customer(self):
        """
        Test school clients API with university customer
        Always return 404, because school clients API only for manager.
        """
        url = reverse('upgrid:non_degree_api:school_client', args=['580bbf8b-642b-4eb7-914c-03a054981719'])
        response = APIClient().get(url, {}, format='json', HTTP_AUTHORIZATION='JWT ' + self.customer_token)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
