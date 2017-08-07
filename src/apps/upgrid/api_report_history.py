from rest_framework import generics, mixins
from .api_serializers_report_history import (whoopsReportHistorySerializer,enhancementReportHistorySerializer)
from .pagination import CustomerPageNumberPagination
from .models import (WhoopsUpdate,EnhancementUpdate,)
import zlib
from django.utils import timezone
from . import dbSerializers as dbLizer
from json import dumps, loads
from django.utils.six import BytesIO

class whoopsReportHistoryList(generics.ListAPIView):
    serializer_class = whoopsReportHistorySerializer
    pagination_class = CustomerPageNumberPagination
    multiple_lookup_fields = ['customer_program','customer__email',]


    def get_queryset(self):
    	return WhoopsUpdate.objects.all()


class enhancementReportHistoryList(generics.ListAPIView):
    serializer_class = enhancementReportHistorySerializer
    pagination_class = CustomerPageNumberPagination

    multiple_lookup_fields = ['customer_program','customer__email',]

    def get_queryset(self):
        print(self.request)
        return EnhancementUpdate.objects.all()



class whoopsReportHistory(generics.UpdateAPIView):
	serializer_class = whoopsReportHistorySerializer


class enhancementReportHistory(generics.UpdateAPIView):
	serializer_class = enhancementReportHistorySerializer