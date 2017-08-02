from rest_framework import generics, mixins
from .api_serializers_report_history import (whoopsReportHistorySerializer,enhancementReportHistorySerializer)
from .pagination import CustomerPageNumberPagination

class whoopsReportHistoryList(generics.ListAPIView):
    serializer_class = whoopsReportHistorySerializer
    pagination_class = CustomerPageNumberPagination
    multiple_lookup_fields = ['customer_program','customer',]



class enhancementReportHistoryList(generics.ListAPIView):
    serializer_class = enhancementReportHistorySerializer
    pagination_class = CustomerPageNumberPagination

    multiple_lookup_fields = ['customer_program','customer',]




class whoopsReportHistory(generics.UpdateAPIView):
	serializer_class = whoopsReportHistorySerializer


class enhancementReportHistory(generics.UpdateAPIView):
	serializer_class = enhancementReportHistorySerializer