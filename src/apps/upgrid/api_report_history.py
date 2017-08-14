from rest_framework import generics, mixins
from rest_framework import permissions
from .api_serializers_report_history import (WhoopsReportHistorySerializer,EnhancementReportHistorySerializer)
from .pagination import CustomerPageNumberPagination
from .models import (WhoopsUpdate,EnhancementUpdate,)
import zlib
from django.utils import timezone
from . import dbSerializers as dbLizer
from json import dumps, loads
from django.utils.six import BytesIO
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.status import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT, HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST)

class whoopsReportHistoryList(generics.ListAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	serializer_class = WhoopsReportHistorySerializer
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
	serializer_class = EnhancementReportHistorySerializer
	pagination_class = CustomerPageNumberPagination
	

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



class whoopsReportHistory(generics.UpdateAPIView,generics.RetrieveAPIView):
	permission_classes = (permissions.IsAuthenticated,)

	serializer_class = WhoopsReportHistorySerializer
	queryset = WhoopsUpdate.objects.all()
	


	def get(self, request, client_id):
		update = WhoopsUpdate.objects.get(object_id=client_id)
		serializer = WhoopsReportHistorySerializer(update)
		return Response(serializer.data, HTTP_200_OK)



class enhancementReportHistory(generics.UpdateAPIView,generics.RetrieveAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	queryset = EnhancementUpdate.objects.all()
	serializer_class = EnhancementReportHistorySerializer

	def get(self, request, client_id):
		update = EnhancementUpdate.objects.get(object_id=client_id)
		serializer = EnhancementReportHistorySerializer(update)
		return Response(serializer.data, HTTP_200_OK)