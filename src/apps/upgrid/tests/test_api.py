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


class CreateBaseUserTest(APITestCase):
    def setUp(self):
        self.user_data = {'username': 'testing',
                          'password': 'password',
                          'email': 'testing@testing.edu', }
        self.user = UpgridBaseUser.objects.create(**self.user_data)

    def test_user_created_or_not(self):
        """
        Testing object creation
        :return:
        """
        user = UpgridBaseUser.objects.get(username="testing")
        self.assertTrue(user is not None, msg="user not create.")

    def tearDown(self):
        """
        deletes new data from test
        :return:
        """
        del self


class AccessTokenTests(APITestCase):
    """
    Testing API '/api/upgrid/access_token/'
    """
    def setUp(self):
        UpgridAccountManager.objects.create(username="testing",
                                            password="password",
                                            email="testing@testing.edu")

    def test_create_user(self):
        """
        Ensure we can create a new account object.
        """
        user = UpgridBaseUser.objects.get(username="testing")
        self.assertTrue(user is not None, msg="user not create.")

    def test_get_token_wrong_email(self):
        client = APIClient(enforce_csrf_checks=True)
        url = '/api/upgrid/access_token/'
        data = {'email': b'abc@abc.edu', 'password': b'cGFzc3dvcmQ='}
        response = client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertTrue('non_field_errors' in response.data, "Did not return error message.")
        self.assertEqual(response.data['non_field_errors'], ['Email is not correct!'])

    def test_get_token_wrong_password(self):
        client = APIClient(enforce_csrf_checks=True)
        url = '/api/upgrid/access_token/'
        data = {'email': b'testing@testing.edu', 'password': b'MzIxMzIx'}
        response = client.post(url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertTrue('non_field_errors' in response.data, "Did not return error message.")
        self.assertEqual(response.data['non_field_errors'], ['Unable to login with provided credentials.'])

    def test_get_token(self):
        client = APIClient(enforce_csrf_checks=True)
        url = '/api/upgrid/access_token/'
        data = {'email': b'testing@testing.edu', 'password': b'cGFzc3dvcmQ='}
        response = client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue('token' in response.data, "Did not return token.")

    def tearDown(self):
        """
        deletes new data from test
        :return:
        """
        del self


class UserBaseAPITestCase(APITestCase):
    """
    Set up user and token for testing.
    """
    def setUp(self):
        self.account_manager_data = {'username': 'account_manager',
                                     'password': 'password',
                                     'email': 'account_manager@testing.edu', }
        self.university_customer_data = {'username': 'university_customer',
                                         'password': 'password',
                                         'email': 'university_customer@testing.edu', }
        self.account_manager_user = UpgridAccountManager.objects.create(**self.account_manager_data)
        self.account_manager_token = jwt_encode_handler(jwt_payload_handler(self.account_manager_user))
        self.university_customer_user = UniversityCustomer.objects.create(**self.university_customer_data)
        self.university_customer_token = jwt_encode_handler(jwt_payload_handler(self.university_customer_user))

    def tearDown(self):
        """
        deletes new data from test
        :return:
        """
        del self


class DataBaseAPITestCase(UserBaseAPITestCase):
    fixtures = ['auth_data.json', 'ceeb_data_v0.13.json', 'upgrid_data.json', ]
    # fixtures = ['auth_data.json', 'ceeb_data_v0.14.json', 'upgrid_data.json', ]

    # def setUp(self):
    #     super(DataBaseAPITestCase, self).setUp()
        # UniversityCustomer.create()


class AccountManagerPasswordTests(UserBaseAPITestCase):
    """
    Testing API '/api/upgrid/user/password/'
    """
    def test_create_user(self):
        """
        Ensure we can create a new account object.
        """
        user = UpgridAccountManager.objects.get(username=self.account_manager_data['username'])
        self.assertTrue(user is not None, msg="user not create.")

    def test_change_password_not_authorize(self):

        url = '/api/upgrid/user/password/'
        data = {'old_password': b64encode(b'password'), 'new_password': b64encode(b'321321')}
        response = APIClient().put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password_wrong_old_password(self):

        url = '/api/upgrid/user/password/'
        data = {'old_password': b64encode(b'wrong_password'), 'new_password': b64encode(b'321321')}
        response = APIClient().put(url, data, format='json', HTTP_AUTHORIZATION='JWT ' + self.account_manager_token)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue('Failed' in response.data, "Did not return 'Failed' when pass in wrong old password.")
        self.assertEqual('Please input valid old password.', response.data['Failed'])

    def test_change_password_success(self):

        url = '/api/upgrid/user/password/'
        data = {'old_password': b64encode(b'password'), 'new_password': b64encode(b'321321')}
        response = APIClient().put(url, data, format='json', HTTP_AUTHORIZATION='JWT ' + self.account_manager_token)

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertTrue('success' in response.data, "Did not return 'Failed' when pass in wrong old password.")
        self.assertEqual('New password has been saved.', response.data['success'])


class UserPasswordResetTests(UserBaseAPITestCase):
    """
    Testing API '/api/upgrid/user/password/reset/'
    """
    def test_reset_password_wrong_email(self):
        """
        return 200 although with wrong email
        :return:
        """
        url = '/api/upgrid/user/password/reset/'
        data = {'email': b'wrong_email@testing.edu'}
        response = APIClient().post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_password_correct_email(self):
        url = '/api/upgrid/user/password/reset/'
        data = {'email': b'testing@testing.edu'}
        response = APIClient().post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)


# class CustomerProgramTests(DataBaseAPITestCase):
#     """
#     api/upgrid/user/program/
#     """
#     def setUp(self):
#         super(CustomerProgramTests, self).setUp()
#         self.account_manager = UpgridAccountManager.objects.get(email='cky2@gmail.com')
#         self.token = jwt_encode_handler(jwt_payload_handler(self.account_manager))

        # UniversityCustomerProgram.create()

    # def test_user_program(self):
    #     url = 'api/upgrid/user/program/'
    #     data = {'email': b'cky22@gmail.com'}
    #     print("lllllllllllllllllllll.........")
    #     # nums = Program.objects.count()s
    #     # print(nums)
    #     response = APIClient().get(url, data, format='json', HTTP_AUTHORIZATION='JWT ' + self.token)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)

##############################


class AccountManagerIsManagerTests(UserBaseAPITestCase):
    """
    Testing api/upgrid/accountmanager/is_manager/
    """
    def test_is_manager_with_account_manager(self):
        url = '/api/upgrid/accountmanager/is_manager/'
        # account_manager = UpgridAccountManager.objects.get(username='cky')
        # token = jwt_encode_handler(jwt_payload_handler(account_manager))
        response = APIClient().get(url, {}, format='json', HTTP_AUTHORIZATION='JWT ' + self.account_manager_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('True' in response.data, "Did not return 'True'.")

    def test_is_manager_with_university_customer(self):
        url = '/api/upgrid/accountmanager/is_manager/'
        response = APIClient().get(url, {}, format='json', HTTP_AUTHORIZATION='JWT ' + self.university_customer_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('False' in response.data, "Did not return 'False'.")


class AccountManagerTests(UserBaseAPITestCase):
    """
    Testing api/upgrid/accountmanager/
    """

    def test_get_with_account_manager(self):
        url = '/api/upgrid/accountmanager/'
        response = APIClient().get(url, {}, format='json', HTTP_AUTHORIZATION='JWT ' + self.account_manager_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('username' in response.data, "Did not return 'username'")
        self.assertTrue('id' in response.data, "Did not return 'id'")
        self.assertTrue('client_list' in response.data, "Did not return 'client_list'")
        self.assertEqual('account_manager', response.data['username'])

    def test_get_with_university_customer(self):
        url = '/api/upgrid/accountmanager/'
        response = APIClient().get(url, {}, format='json', HTTP_AUTHORIZATION='JWT ' + self.university_customer_token)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class AccountManagerClientTests(DataBaseAPITestCase):
    """
    Testing api/upgrid/accountmanager/client/(?P<object_id>[0-9a-fA-F\-]+)/
    """

    # fixtures = ['auth_data.json', 'ceeb_data_v0.13.json', 'upgrid_data.json', ]

    def test_get_client_info_with_not_account_manager(self):
        # client = UpgridAccountManager.objects.get(username='cky2')
        # account_manager_token = jwt_encode_handler(jwt_payload_handler(account_manager))
        university_customer = UniversityCustomer.objects.get(username='cky22@M')
        url = '/api/upgrid/accountmanager/client/' + str(university_customer.id) + '/'
        response = APIClient().get(url, HTTP_AUTHORIZATION='JWT ' + self.university_customer_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue('Failed' in response.data, "Did not return 'Failed'")
        self.assertEqual("You don't have permission to see this client info!", response.data['Failed'])

    def test_get_main_client_info_with_account_manager(self):
        account_manager = UpgridAccountManager.objects.get(username='cky2')
        account_manager_token = jwt_encode_handler(jwt_payload_handler(account_manager))
        university_customer = UniversityCustomer.objects.get(username='cky22@M')
        url = '/api/upgrid/accountmanager/client/' + str(university_customer.id) + '/'
        response = APIClient().get(url, HTTP_AUTHORIZATION='JWT ' + account_manager_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('username' in response.data, "Did not return 'username'")
        self.assertTrue('id' in response.data, "Did not return 'id'")
        self.assertTrue('email' in response.data, "Did not return 'email'")
        self.assertTrue('account_type' in response.data, "Did not return 'account_type'")
        self.assertTrue('contact_name' in response.data, "Did not return 'contact_name'")
        self.assertTrue('position_level' in response.data, "Did not return 'position_level'")
        self.assertTrue('Ceeb' in response.data, "Did not return 'Ceeb'")
        self.assertTrue('competing_schools' in response.data, "Did not return 'competing_schools'")
        self.assertEqual('2159 - Columbia University - Mailman School of Public Health', response.data['Ceeb'])
        self.assertEqual('main', response.data['account_type'])

    def test_get_sub_client_info_with_account_manager(self):
        account_manager = UpgridAccountManager.objects.get(username='cky2')
        account_manager_token = jwt_encode_handler(jwt_payload_handler(account_manager))
        university_customer = UniversityCustomer.objects.get(username='cky22@M')
        university_customer.account_type = 'sub'
        university_customer.save()
        url = '/api/upgrid/accountmanager/client/' + str(university_customer.id) + '/'
        response = APIClient().get(url, HTTP_AUTHORIZATION='JWT ' + account_manager_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('username' in response.data, "Did not return 'username'")
        self.assertTrue('id' in response.data, "Did not return 'id'")
        self.assertTrue('email' in response.data, "Did not return 'email'")
        self.assertTrue('account_type' in response.data, "Did not return 'account_type'")
        self.assertTrue('contact_name' in response.data, "Did not return 'contact_name'")
        self.assertTrue('position_level' in response.data, "Did not return 'position_level'")
        self.assertTrue('Ceeb' in response.data, "Did not return 'Ceeb'")
        self.assertTrue('competing_schools' in response.data, "Did not return 'competing_schools'")
        self.assertEqual('2159 - Columbia University - Mailman School of Public Health', response.data['Ceeb'])
        self.assertEqual('sub', response.data['account_type'])

    def test_post_client_with_no_data(self):
        url = '/api/upgrid/accountmanager/client/'
        # response = APIClient().post(url, {}, HTTP_AUTHORIZATION='JWT ' + self.account_manager_token)
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_client_with_not_account_manager(self):
        url = '/api/upgrid/accountmanager/client/'
        response = APIClient().post(url, data={}, HTTP_AUTHORIZATION='JWT ' + self.university_customer_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_client_with_not_account_manager(self):
        url = '/api/upgrid/accountmanager/client/'
        response = APIClient().delete(url, data={}, HTTP_AUTHORIZATION='JWT ' + self.university_customer_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_client_with_account_manager(self):
        url = '/api/upgrid/accountmanager/client/'
        data = {
            'client_id': self.university_customer_user.id,
        }

        response = APIClient().delete(url, data=data, HTTP_AUTHORIZATION='JWT ' + self.account_manager_token)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue('Success' in response.data, "Did not return 'Success'")
        self.assertEqual("User deleted!", response.data['Success'])

    def test_delete_client_with_data(self):
        url = '/api/upgrid/accountmanager/client/'
        # response = APIClient().delete(url, data={}, HTTP_AUTHORIZATION='JWT ' + self.account_manager_token)
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # self.assertTrue('Success' in response.data, "Did not return 'Success'")
        # self.assertEqual("User deleted!", response.data['Success'])


class AccountManagerClientCustomerProgramTests(DataBaseAPITestCase):
    """
    Testing api/upgrid/accountmanager/client/customer_program/$
    UniversityCustomerProgramCRUD
    """

    def test_get_Customer_program_with_not_account_manager(self):
        university_customer = UniversityCustomer.objects.get(username='cky22@M')
        url = '/api/upgrid/accountmanager/client/customer_program/' + str(university_customer.id) + '/'
        response = APIClient().get(url, HTTP_AUTHORIZATION='JWT ' + self.university_customer_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue('Failed' in response.data, "Did not return 'Failed'")
        self.assertEqual("Permission Denied!", response.data['Failed'])

    def test_get_Customer_program_with_account_manager(self):
        account_manager = UpgridAccountManager.objects.get(username='cky2')
        account_manager_token = jwt_encode_handler(jwt_payload_handler(account_manager))
        university_customer = UniversityCustomer.objects.get(username='cky22@M')
        url = '/api/upgrid/accountmanager/client/customer_program/' + str(university_customer.id) + '/'
        response = APIClient().get(url, HTTP_AUTHORIZATION='JWT ' + account_manager_token)
        print(response.data)
        self.assertEqual(response.status_code, 200)

    def test_post_Customer_program_with_not_account_manager(self):
        university_customer = UniversityCustomer.objects.get(username='cky22@M')
        url = '/api/upgrid/accountmanager/client/customer_program/' + str(university_customer.id) + '/'
        response = APIClient().post(url, HTTP_AUTHORIZATION='JWT ' + self.university_customer_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue('Failed' in response.data, "Did not return 'Failed'")
        self.assertEqual("Permission Denied!", response.data['Failed'])

    def test_post_Customer_program_with_no_data(self):
        account_manager = UpgridAccountManager.objects.get(username='cky2')
        account_manager_token = jwt_encode_handler(jwt_payload_handler(account_manager))
        university_customer = UniversityCustomer.objects.get(username='cky22@M')

        url = '/api/upgrid/accountmanager/client/customer_program/' + str(university_customer.id) + '/'
        # response = APIClient().post(url, data={}, HTTP_AUTHORIZATION='JWT ' + account_manager_token)
        # self.assertEqual(response.status_code, 200)

    def test_put_Customer_program_with_not_account_manager(self):
        university_customer = UniversityCustomer.objects.get(username='cky22@M')
        url = '/api/upgrid/accountmanager/client/customer_program/' + str(university_customer.id) + '/'
        response = APIClient().put(url, HTTP_AUTHORIZATION='JWT ' + self.university_customer_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue('Failed' in response.data, "Did not return 'Failed'")
        self.assertEqual("Permission Denied!", response.data['Failed'])

    def test_put_Customer_program_with_no_data(self):
        account_manager = UpgridAccountManager.objects.get(username='cky2')
        account_manager_token = jwt_encode_handler(jwt_payload_handler(account_manager))
        university_customer = UniversityCustomer.objects.get(username='cky22@M')

        url = '/api/upgrid/accountmanager/client/customer_program/' + str(university_customer.id) + '/'
        # response = APIClient().post(url, data={}, HTTP_AUTHORIZATION='JWT ' + account_manager_token)
        # self.assertEqual(response.status_code, 200)


class AccountManagerClientCompetingProgramTests(DataBaseAPITestCase):
    """
    Testing api/upgrid/accountmanager/client/competing_program/
    CustomerCompetingProgramCRUD
    """

    # def test_get_Customer_program_with_not_account_manager(self):
    #     university_customer = UniversityCustomer.objects.get(username='cky22@M')
    #     url = '/api/upgrid/accountmanager/client/customer_program/' + str(university_customer.id) + '/'
    #     response = APIClient().get(url, HTTP_AUTHORIZATION='JWT ' + self.university_customer_token)
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    #     self.assertTrue('Failed' in response.data, "Did not return 'Failed'")
    #     self.assertEqual("Permission Denied!", response.data['Failed'])
    #
    # def test_get_Customer_program_with_account_manager(self):
    #     account_manager = UpgridAccountManager.objects.get(username='cky2')
    #     account_manager_token = jwt_encode_handler(jwt_payload_handler(account_manager))
    #     university_customer = UniversityCustomer.objects.get(username='cky22@M')
    #     url = '/api/upgrid/accountmanager/client/customer_program/' + str(university_customer.id) + '/'
    #     response = APIClient().get(url, HTTP_AUTHORIZATION='JWT ' + account_manager_token)
    #     print(response.data)
    #     self.assertEqual(response.status_code, 200)
