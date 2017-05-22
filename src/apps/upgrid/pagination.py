from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination


class CustomerLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 1
    max_limit = 1


class CustomerPageNumberPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

class CompetingPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
