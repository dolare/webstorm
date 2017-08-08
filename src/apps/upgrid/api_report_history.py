from rest_framework import generics, mixins
from rest_framework import permissions
from .api_serializers_report_history import (whoopsReportHistorySerializer,enhancementReportHistorySerializer)
from .pagination import CustomerPageNumberPagination
from .models import (WhoopsUpdate,EnhancementUpdate,)
import zlib
from django.utils import timezone
from . import dbSerializers as dbLizer
from json import dumps, loads
from django.utils.six import BytesIO

class whoopsReportHistoryList(generics.ListAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	serializer_class = whoopsReportHistorySerializer
	pagination_class = CustomerPageNumberPagination
	lookup_fields = ('customer_program__degree','customer_program__program_name','customer__email')



	def get_queryset(self):
		print(self.request)
		try:
			query = self.request.GET.get("search");
			query_set = WhoopsUpdate.objects.filter(customer__account_manager = self.request.user)
			query_set = query_set.filter(Q(customer__email = search) | Q(customer_program__degree = search))
			#print(query_set)
			return query_set
		except:
			return None


class enhancementReportHistoryList(generics.ListAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	serializer_class = enhancementReportHistorySerializer
	pagination_class = CustomerPageNumberPagination
	lookup_fields = ('customer_program__degree','customer_program__program_name','customer__email')


	def get_queryset(self):
		print(self.request)
		try:
			query_set = EnhancementUpdate.objects.filter(customer__account_manager = self.request.user)
			#print(query_set)
			return query_set
		except:
			return None



class whoopsReportHistory(generics.UpdateAPIView):
	permission_classes = (permissions.IsAuthenticated,)

	serializer_class = whoopsReportHistorySerializer


class enhancementReportHistory(generics.UpdateAPIView):
	permission_classes = (permissions.IsAuthenticated,)

	serializer_class = enhancementReportHistorySerializer