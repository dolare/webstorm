from rest_framework.parsers import JSONParser
from rest_framework import serializers
from rest_framework.serializers import *
from .models import (WhoopsUpdate,EnhancementUpdate)
import zlib
from django.utils import timezone
from . import dbSerializers as dbLizer
from json import dumps, loads
from django.utils.six import BytesIO

class WhoopsReportHistorySerializer(serializers.ModelSerializer):
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
		try:
			print(obj.customer.email)
			return obj.customer.email
		except Exception as e:
			print(e)
			return None

	def get_customer_program(self,obj):
		try:
			print("{0} | {1}".format(obj.customer_program.program.program_name,obj.customer_program.program.degree.name))
			return "{0} | {1}".format(obj.customer_program.program.program_name,obj.customer_program.program.degree.name)
		except Exception as e:
			print(e)
			return None


	def get_existing_report(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.existing_report)))
		except Exception as e:
			print(e)
			return None

	def get_cache_report(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.cache_report)))
		except Exception as e:
			print(e)
			return None

	def get_initial_diff(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.initial_diff)))
		except Exception as e:
			print(e)
			return None

	def get_prev_diff(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.prev_diff)))
		except Exception as e:
			print(e)
			return None

	def get_update_diff(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.update_diff)))
		except Exception as e:
			print(e)
			return None



class EnhancementReportHistorySerializer(serializers.ModelSerializer):

	existing_report = SerializerMethodField()
	cache_report = SerializerMethodField()
	initial_diff = SerializerMethodField()
	prev_diff = SerializerMethodField()
	update_diff = SerializerMethodField()
	customer = SerializerMethodField()
	customer_program = SerializerMethodField()

	class Meta:
		model = EnhancementUpdate
		fields = ('customer', 'created', 'customer_program', 
	          'existing_report', 'cache_report', 'initial_diff',
	          'prev_diff', 'update_diff', 'most_recent','last_edit_time','object_id')

	def get_customer(self,obj):
		try:
			print(obj.customer.email)
			return obj.customer.email
		except Exception as e:
			print(e)
			return None

	def get_customer_program(self,obj):
		try:
			print("{0} | {1}".format(obj.customer_program.program.program_name,obj.customer_program.program.degree.name))
			return "{0} | {1}".format(obj.customer_program.program.program_name,obj.customer_program.program.degree.name)
		except Exception as e:
			print(e)
			return None


	def get_existing_report(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.existing_report)))
		except Exception as e:
			print(e)
			return None

	def get_cache_report(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.cache_report)))
		except Exception as e:
			print(e)
			return None

	def get_initial_diff(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.initial_diff)))
		except Exception as e:
			print(e)
			return None

	def get_prev_diff(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.prev_diff)))
		except Exception as e:
			print(e)
			return None

	def get_update_diff(self, obj):
		try:
			return JSONParser().parse(BytesIO(zlib.decompress(obj.update_diff)))
		except Exception as e:
			print(e)
			return None


 