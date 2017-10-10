import pytest
from apps.upgrid.models import UpgridAccountManager,UniversityCustomer
from apps.upgrid.apis import ClientCRUD

class test_clientCRUD(self):
    account_manager_testing2 = UpgridAccountManager.objects.create(username="manager_integrate_test2",password="12345678")
    account_manager_testing1 = UpgridAccountManager.objects.create(username="manager_integrate_test1",password="123456")
    client_testing1 = UniversityCustomer.objects.create(username="client_integrate_test1",password="123456",account_manager=account_manager_testing1)
    client_testing2 = UniversityCustomer.objects.create(username="client_integrate_test2",password="12345678",account_manager=account_manager_testing2)
    client_testing3 = UniversityCustomer.objects.create(username="client_integrate_test3",password="12345678")

    