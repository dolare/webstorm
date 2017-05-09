import django_filters
from rest_framework.filters import FilterSet

from .models import UniversityCustomer, ClientAndProgramRelation


class UniversityCustomerFilter(FilterSet):
    main_user_id = django_filters.UUIDFilter(method='main_user_filter')

    class Meta:
        model = UniversityCustomer
        fields = ['main_user_id', 'is_active', 'id']

    def main_user_filter(self, queryset, name, value):
        return queryset.filter(main_user_id=str(value))


class ClientAndProgramRelationFilter(FilterSet):
    main_user_id = django_filters.UUIDFilter(method='main_user_filter')

    class Meta:
        model = ClientAndProgramRelation
        fields = ['main_user_id', 'client', 'client_program']

    def main_user_filter(self, queryset, name, value):
        return queryset.filter(client=value)
