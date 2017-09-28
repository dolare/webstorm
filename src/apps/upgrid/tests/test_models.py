from django.core.urlresolvers import reverse
from django.test import TestCase
# from ..models import (UpgridBaseUser, UpgridAccountManager, UniversityCustomer, UniversityCustomerProgram,
#     CustomerCompetingProgram, ClientAndProgramRelation, WhoopsReports,
#     EnhancementReports)
from apps.upgrid.models import UpgridBaseUser, UpgridAccountManager
# from ..models import


class UpgridUserTestCase(TestCase):
    def setUp(self):
        user = UpgridBaseUser.objects.create(username="testing", password="password")

    def test_user_created_or_not(self):
        """
        Testing object creation
        :return:
        """
        user = UpgridBaseUser.objects.get(username="testing")
        self.assertTrue(user is not None, msg="user not create.")

    # def test_password_setup(self):

    def tearDown(self):
        """
        deletes new data from test
        :return:
        """
        del self

