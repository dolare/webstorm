from rest_framework import generics, mixins
from .api_serializers_report_history import whoopsReportHistoryListSerializer

class whoopsReportHistoryList(generics.ListAPIView):
    serializer_class = whoopsReportHistoryListSerializer
    pagination_class = CustomerPageNumberPagination
    multiple_lookup_fields = ['customer_program','customer',]



class enhancementReportHistoryList(generics.ListAPIView):
    serializer_class = enhancementReportHistoryListSerializer
    pagination_class = CustomerPageNumberPagination


    def get_queryset(self, *args, **kwargs):
        #program_name = self.request.GET.get("name")


        return 

class whoopsReport(generics.APIView):
	serializer_class = whoopsReportHistorySerializer


class enhancementReport(generics.APIView):
	serializer_class = enhancementReportHistorySerializer