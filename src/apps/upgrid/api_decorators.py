#decorators

def maintain_upgrid_tag_for_programs(original_function):
	def wrapper_function(*args,**kwargs):
		return original_function(*args,**kwargs)
	return wrapper_function

