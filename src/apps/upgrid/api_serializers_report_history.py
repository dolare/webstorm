from rest_framework.parsers import JSONParser
from rest_framework import serializers
from rest_framework.serializers import *
from .models import (WhoopsUpdate,EnhancementUpdate)

class whoopsReportHistorySerializer(serializers.ModelSerializer):
    existing_report = SerializerMethodField()
    cache_report = SerializerMethodField()
    initial_diff = SerializerMethodField()
    prev_diff = SerializerMethodField()
    update_diff = SerializerMethodField()

    class Meta:
        model = WhoopsUpdate
        fields = ('customer', 'created', 'customer_program', 
                  'existing_report', 'cache_report', 'initial_diff',
                  'prev_diff', 'update_diff', 'most_recent','last_edit_time')

    def get_existing_report(self, obj):
        return JSONParser().parse(BytesIO(zlib.decompress(obj.existing_report)))

    def get_cache_report(self, obj):
        return JSONParser().parse(BytesIO(zlib.decompress(obj.cache_report)))

    def get_initial_diff(self, obj):
        return JSONParser().parse(BytesIO(zlib.decompress(obj.initial_diff)))

    def get_prev_diff(self, obj):
        return JSONParser().parse(BytesIO(zlib.decompress(obj.prev_diff)))

    def get_update_diff(self, obj):
        return JSONParser().parse(BytesIO(zlib.decompress(obj.update_diff)))


class enhancementReportHistorySerializer(serializers.ModelSerializer):
	
	existing_report = SerializerMethodField()
	cache_report = SerializerMethodField()
	initial_diff = SerializerMethodField()
	prev_diff = SerializerMethodField()
	update_diff = SerializerMethodField()

	class Meta:
		model = EnhancementUpdate
		fields = ('customer', 'created', 'customer_program', 
	          'existing_report', 'cache_report', 'initial_diff',
	          'prev_diff', 'update_diff', 'most_recent','last_edit_time')

	def get_existing_report(self, obj):
	    return JSONParser().parse(BytesIO(zlib.decompress(obj.existing_report)))

	def get_cache_report(self, obj):
	    return JSONParser().parse(BytesIO(zlib.decompress(obj.cache_report)))

	def get_initial_diff(self, obj):
	    return JSONParser().parse(BytesIO(zlib.decompress(obj.initial_diff)))

	def get_prev_diff(self, obj):
	    return JSONParser().parse(BytesIO(zlib.decompress(obj.prev_diff)))

	def get_update_diff(self, obj):
	    return JSONParser().parse(BytesIO(zlib.decompress(obj.update_diff)))


 