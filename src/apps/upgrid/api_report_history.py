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
from django.db.models import Q

class whoopsReportHistoryList(generics.ListAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	serializer_class = whoopsReportHistorySerializer
	pagination_class = CustomerPageNumberPagination
	

	def get_queryset(self):
		print(self.request)
		try:
			print(self.request.GET.get("search"))
			print('search value')
			if "search" in self.request.GET.keys():
				query = self.request.GET.get("search");
				query_set = WhoopsUpdate.objects.filter(customer__account_manager = self.request.user)
				query_set = query_set.filter(Q(customer_program__program__degree__name__icontains = query) | Q(customer_program__program__program_name__icontains = query) | Q(customer__email__icontains = query))
			#print(query_set)
				return query_set
			else:
				return WhoopsUpdate.objects.filter(customer__account_manager = self.request.user)
		except Exception as e:
			print(e)
			return WhoopsUpdate.objects.filter(customer__account_manager = self.request.user)


class enhancementReportHistoryList(generics.ListAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	serializer_class = enhancementReportHistorySerializer
	pagination_class = CustomerPageNumberPagination
	lookup_fields = ('customer_program__degree','customer_program__program_name','customer__email')


	def get_queryset(self):
		print(self.request)
		try:
			if "search" in self.request.GET.keys():
				query = self.request.GET.get("search");
				query_set = EnhancementUpdate.objects.filter(customer__account_manager = self.request.user)
				query_set = query_set.filter(Q(customer_program__program__degree__name__icontains = query) | Q(customer_program__program__program_name__icontains = query) | Q(customer__email__icontains = query))
				#print(query_set)
				return query_set
			else:
				return EnhancementUpdate.objects.filter(customer__account_manager = self.request.user)
		except Exception as e:
			print(e)
			return EnhancementUpdate.objects.filter(customer__account_manager = self.request.user)



class whoopsReportHistory(generics.UpdateAPIView):
	permission_classes = (permissions.IsAuthenticated,)

	serializer_class = whoopsReportHistorySerializer


class enhancementReportHistory(generics.UpdateAPIView):
	permission_classes = (permissions.IsAuthenticated,)

	serializer_class = enhancementReportHistorySerializer