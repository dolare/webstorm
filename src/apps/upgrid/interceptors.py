

from service_interceptor.constants import GRIDET_ATTR_KEY, GRIDET_CUSTOMER_ID, GRIDET_APP_NAME


class UpgridUserInterceptor(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # --- pre process ---

        # execute next middle ware/view
        response = self.get_response(request)

        # --- post process ---
        if not request.META.get(GRIDET_ATTR_KEY):
            request.META[GRIDET_ATTR_KEY] = {}

        request.META[GRIDET_ATTR_KEY][GRIDET_APP_NAME] = 'upgrid'
        request.META[GRIDET_ATTR_KEY][GRIDET_CUSTOMER_ID] = str(request.user.id)
        if hasattr(request.user, 'username')\
                and len(request.user.username) > 0:
            request.META[GRIDET_ATTR_KEY]['CUSTOMER_NAME'] = request.user.username
        if hasattr(request.user, 'email') \
                and len(request.user.email) > 0:
            request.META[GRIDET_ATTR_KEY]['CUSTOMER_EMAIL'] = str(request.user.email)

        return response
