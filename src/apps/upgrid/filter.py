import django_filters
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.filters import FilterSet

from .models import UniversityCustomer, ClientAndProgramRelation, CustomerFeature, CustomerFeatureMapping
NON_DEGREE_FEATURE = 'non-degree'
AMP_FEATURE = 'AMP'


class UniversityCustomerFilter(FilterSet):
    main_user_id = django_filters.UUIDFilter(method='main_user_filter')
    is_main_user = django_filters.BooleanFilter(method='is_main_user_filter')
    is_non_degree_user = django_filters.BooleanFilter(method='is_non_degree_user_filter')

    class Meta:
        model = UniversityCustomer
        fields = ['main_user_id', 'is_active', 'id', 'is_demo', ]

    def main_user_filter(self, queryset, name, value):
        return queryset.filter(main_user_id=str(value))

    def is_main_user_filter(self, queryset, name, value):
        if value is True:
            return queryset.filter(account_type='main')
        return queryset.filter(account_type='sub')

    def is_non_degree_user_filter(self, queryset, name, value):
        try:
            feature = CustomerFeature.objects.get(name=NON_DEGREE_FEATURE)
        except ObjectDoesNotExist:
            return queryset
        if value is True:
            main_user_qs = queryset.filter(customerfeaturemapping__feature=feature)
            sub_user_qs = UniversityCustomer.objects.filter(main_user_id__in=[str(user.id) for user in main_user_qs])
            return main_user_qs.union(sub_user_qs)
        return UniversityCustomer.objects.none()


class ClientAndProgramRelationFilter(FilterSet):
    main_user_id = django_filters.UUIDFilter(method='main_user_filter')

    class Meta:
        model = ClientAndProgramRelation
        fields = ['main_user_id', 'client', 'client_program']

    def main_user_filter(self, queryset, name, value):
        return queryset.filter(client=value)
