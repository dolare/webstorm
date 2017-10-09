from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER

from apps.upgrid.models import UpgridBaseUser, UpgridAccountManager, UniversityCustomer, UniversityCustomerProgram


class UserBaseAPITestCase(APITestCase):
    """
    Set up user and token for testing.
    """
    fixtures = ['auth_data_10_3.json', 'webtracking_data.json', 'ceeb_data_v0.28.json', 'upgrid_data_10_3.json', ]

    def setUp(self):
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
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_schools_with_university_customer(self):
        """
        Test schools API with university customer
        """
        url = reverse('upgrid:non_degree_api:schools')
        response = APIClient().get(url, {}, format='json', HTTP_AUTHORIZATION='JWT ' + self.customer_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SchoolDetailAPITestCase(UserBaseAPITestCase):
    """
    Testing API for '^schools/(?P<object_id>[0-9a-fA-F\-]+)$'
    """

    def test_school_detail_with_manager(self):
        """
        Test school detail API with manager account
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
        Test school clients API with manager account
        """
        url = reverse('upgrid:non_degree_api:school_client', args=['580bbf8b-642b-4eb7-914c-03a054981719'])
        response = APIClient().get(url, format='json', HTTP_AUTHORIZATION='JWT ' + self.manager_token)
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


class SchoolCategoriesAPITestCase(UserBaseAPITestCase):
    """
    Testing API for '^schools/(?P<school_id>[0-9a-fA-F\-]+)/categories$'
    """

    def test_school_Categories_with_manager(self):
        """
        Test school Categories API with manager account
        """
        url = reverse('upgrid:non_degree_api:school_categories', args=['580bbf8b-642b-4eb7-914c-03a054981719'])
        response = APIClient().get(url, format='json', HTTP_AUTHORIZATION='JWT ' + self.manager_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('object_id' in response.data[0], "Did not return object_id.")
        self.assertTrue('name' in response.data[0], "Did not return name.")

    def test_school_Categories_with_customer(self):
        """
        Test school Categories API with university customer
        """
        url = reverse('upgrid:non_degree_api:school_categories', args=['580bbf8b-642b-4eb7-914c-03a054981719'])
        response = APIClient().get(url, format='json', HTTP_AUTHORIZATION='JWT ' + self.customer_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('object_id' in response.data[0], "Did not return object_id.")
        self.assertTrue('name' in response.data[0], "Did not return name.")


class SchoolCategoryCoursesAPITestCase(UserBaseAPITestCase):
    """
    Testing API for '^schools/(?P<school_id>[0-9a-fA-F\-]+)/categories/(?P<category_id>[0-9a-fA-F\-]+)/courses$'
    """

    def test_school_Category_courses_with_manager(self):
        """
        Test school Categories API with manager account
        """
        url = reverse('upgrid:non_degree_api:school_category_courses', args=['580bbf8b-642b-4eb7-914c-03a054981719',
                                                                             'ada0a9a5-5288-449b-9b27-74a6c20530a3'])
        response = APIClient().get(url, format='json', HTTP_AUTHORIZATION='JWT ' + self.manager_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('object_id' in response.data[0], "Did not return object_id.")
        self.assertTrue('name' in response.data[0], "Did not return name.")

    def test_school_Category_courses_with_customer(self):
        """
        Test school Categories API with university customer
        """
        url = reverse('upgrid:non_degree_api:school_category_courses', args=['580bbf8b-642b-4eb7-914c-03a054981719',
                                                                             'ada0a9a5-5288-449b-9b27-74a6c20530a3'])
        response = APIClient().get(url, format='json', HTTP_AUTHORIZATION='JWT ' + self.customer_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('object_id' in response.data[0], "Did not return object_id.")
        self.assertTrue('name' in response.data[0], "Did not return name.")


class ReportsAPITestCase(UserBaseAPITestCase):
    """
    Testing API for '^reports$'
    """

    def test_get_reports_with_manager(self):
        """
        Test reports API with manager account
        """
        url = reverse('upgrid:non_degree_api:reports')
        response = APIClient().get(url, format='json', HTTP_AUTHORIZATION='JWT ' + self.manager_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('object_id' in response.data['results'][0], "Did not return object_id.")
        self.assertTrue('school' in response.data['results'][0], "Did not return school.")
        self.assertTrue('date_created' in response.data['results'][0], "Did not return date_created.")
        self.assertTrue('active' in response.data['results'][0], "Did not return active.")

    def test_get_reports_with_university_customer(self):
        """
        Test reports API with university customer
        """
        url = reverse('upgrid:non_degree_api:reports')
        response = APIClient().get(url, format='json', HTTP_AUTHORIZATION='JWT ' + self.customer_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('object_id' in response.data['results'][0], "Did not return object_id.")
        self.assertTrue('school' in response.data['results'][0], "Did not return school.")
        self.assertTrue('date_created' in response.data['results'][0], "Did not return date_created.")
        self.assertTrue('active' in response.data['results'][0], "Did not return active.")

    def test_post_reports_with_manager(self):
        """
        Test reports API with manager account
        """
        url = reverse('upgrid:non_degree_api:reports')
        data = {'school': '580bbf8b-642b-4eb7-914c-03a054981719',
                'school_name': 'cky_school',
                'university_name': 'cky_university'}
        response = APIClient().post(url, data, HTTP_AUTHORIZATION='JWT ' + self.manager_token)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('school_name' in response.data, "Did not return school_name.")
        self.assertTrue('university_name' in response.data, "Did not return university_name.")
        self.assertTrue('school' in response.data, "Did not return school.")
        self.assertTrue('categories' in response.data, "Did not return categories.")

    def test_post_reports_with_university_customer(self):
        """
        Test reports API with university customer
        """
        url = reverse('upgrid:non_degree_api:reports')
        response = APIClient().post(url, {'school': '580bbf8b-642b-4eb7-914c-03a054981719'}, format='json',
                                    HTTP_AUTHORIZATION='JWT ' + self.customer_token)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
