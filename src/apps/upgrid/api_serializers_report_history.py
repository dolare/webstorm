from rest_framework.parsers import JSONParser
from rest_framework import serializers
from rest_framework.serializers import *
from .models import (WhoopsUpdate,EnhancementUpdate)
import zlib
from django.utils import timezone
from . import dbSerializers as dbLizer
from json import dumps, loads
from django.utils.six import BytesIO

class whoopsReportHistorySerializer(serializers.ModelSerializer):
	existing_report = SerializerMethodField()
	cache_report = SerializerMethodField()
	initial_diff = SerializerMethodField()
	prev_diff = SerializerMethodField()
	update_diff = SerializerMethodField()
	customer = SerializerMethodField()
	customer_program = SerializerMethodField()

	class Meta:
	    model = WhoopsUpdate
	    fields = ('customer', 'created', 'customer_program', 
	              'existing_report', 'cache_report', 'initial_diff',
	              'prev_diff', 'update_diff', 'most_recent','last_edit_time','object_id')

	def get_customer(self,obj):
		return obj.customer.email

	def get_customer_program(self,obj):
		return "{0} | {1}".format(obj.customer_program.program.program_name,obj.customer_program.program.degree.name)


	def get_existing_report(self, obj):
		if obj.existing_report != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.existing_report)))
		else:
			return None

	def get_cache_report(self, obj):
		if obj.cache_report != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.cache_report)))
		else:
			return None

	def get_initial_diff(self, obj):
		if obj.initial_diff != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.initial_diff)))
		else:
			return None

	def get_prev_diff(self, obj):
		if obj.prev_diff != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.prev_diff)))
		else:
			return None

	def get_update_diff(self, obj):
		if obj.update_diff != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.update_diff)))
		else:
			return None


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
		if obj.existing_report != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.existing_report)))
		else:
			return None

	def get_cache_report(self, obj):
		if obj.cache_report != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.cache_report)))
		else:
			return None

	def get_initial_diff(self, obj):
		if obj.initial_diff != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.initial_diff)))
		else:
			return None

	def get_prev_diff(self, obj):
		if obj.prev_diff != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.prev_diff)))
		else:
			return None

	def get_update_diff(self, obj):
		if obj.update_diff != None:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.update_diff)))
		else:
			return None


 