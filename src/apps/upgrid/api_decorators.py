#decorators
from .models import (
    UpgridAccountManager, UniversityCustomer, UniversityCustomerProgram,
    CustomerCompetingProgram, ClientAndProgramRelation, WhoopsReports,
    EnhancementReports)
from django.db import models


def maintain_upgrid_tag_for_programs(original_function):
	
	def wrapper_function(*args,**kwargs):
		print('wrapper function',args[1].user,kwargs)
		customer_program_query = UniversityCustomerProgram.objects.filter(customer = args[1].user)
		#if the user does have the programs or competing programs
		if customer_program_query.exist():
			for customer_program in customer_program_query:
				print(customer_program)
				ProgramTag.objects.getOrCreate(program = customer_program.program, type__name = 'upgrid')
				customer_competing_program_query = CustomerCompetingProgram.objects.filter(customer_program = customer_program)
				if customer_competing_program_query.exist():
					for customer_competing_program in customer_competing_program_query:
						ProgramTag.objects.getOrCreate(program = customer_competing_program.program, type__name = 'upgrid')

		return original_function(*args,**kwargs)


	return wrapper_function

