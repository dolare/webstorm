from .apis import *

# numbers of final released whoops reports
class FinalReleasedWhoops(APIView):

    def get_object(self, request, client_id):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=client_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": _("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": _("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)
        return user

    def get(self, request, client_id=None):
        customer = self.get_object(request, client_id)

        if customer.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client=customer).values('client_program')
            final_true_program = UniversityCustomerProgram.objects.filter(customer=customer.main_user_id,
                                                                          object_id__in=customer_programs,
                                                                          whoops_final_release='True').count()
        else:
            final_true_program = UniversityCustomerProgram.objects.filter(customer=customer,
                                                                          whoops_final_release='True').count()
        return Response(data=final_true_program, status=HTTP_200_OK)

# Get whoops reports by UniversityCustomerProgram object_id


class WhoopsWebReports(APIView):

    def check_permissions(self, request):
        try:
            manager = UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request, customer_program_id):
        user = self.check_permissions(request)
        if user:
            customer_program_query = UniversityCustomerProgram.objects.filter(object_id=customer_program_id)
            if not customer_program_query.exists():
                return Response({"Failed": _("WhoopsUpdate does not found!")}, status=HTTP_400_BAD_REQUEST)
            customer_program = customer_program_query.first()
            context = WhoopsReportsUpdateAPI().get_programs_data(request,customer_program)
            if context is None:
                context = {
                    'dead_link': None, 'typo': None, 'outdated_information': None,
                    'data_discrepancy': None, 'sidebars': None,
                    'infinite_loop': None, 'floating_page': None,
                    'confusing': None, 'other_expert_note': None
                }
            return Response(context, status=HTTP_200_OK)

        else:
            return Response({"Failed": _("Permission denied!")}, status=HTTP_403_FORBIDDEN)


class WhoopsReportsUpdateAPI(APIView):

    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_object(self, request, customer_program):
        if customer_program is None:
            program_id = UniversityCustomerProgram.objects.get(object_id=request.data['customer_program_id'])
        else:
            program_id = customer_program
        program_query = Program.objects.filter(object_id=program_id.program.object_id)
        if not program_query.exists():
            return Response({"Failed": _("WhoopsUpdate does not found!")}, status=HTTP_400_BAD_REQUEST)
        program = program_query.first()
        print(program)
        ean = program.expertadditionalnote_set.all()
        return ean, program

    def get_programs_data(self, request, customer_program=None):
        perm = self.is_manager(request)
        if not perm:
            return Response({"Failed": _("Permission denied!")}, status=HTTP_403_FORBIDDEN)
        else:
            ean, program = self.get_object(request, customer_program)
            print(ean)

            # print(ean[0]._meta.get_fields())
            # print (model_to_dict(ean[0]))
            if not len(ean) == 0:
                json_data = {
                    'dead_link': None, 'typo': None, 'outdated_information': None,
                    'data_discrepancy': None, 'sidebars': None,
                    'infinite_loop': None, 'floating_page': None,
                    'confusing': None, 'other_expert_note': None,
                }
                query_fields = ('additional_note_type', 'additional_note_url',
                                'additional_note_url2', 'additional_note_url3', 'additional_note')
                # database data=>json string stored in json_data dict
                print("#####team type####", type(ean))
                for k, v in json_data.items():
                    query_set = ean.filter(additional_note_type=k)
                    json_data[k] = serialize("json", query_set, fields=query_fields)
                # json_data=>python dict
                obj_data = json_data
                for k, v in obj_data.items():  # you can print it to see its structure
                    record = loads(v)
                    new_list = []
                    for field_dict_idx in range(len(record)):
                        new_list.append(
                            record[field_dict_idx].get('fields'))  # if get failed, None value would be return
                    obj_data[k] = new_list

                #define the object_id
                obj_data['object_id'] = program.object_id
                return obj_data
            else:
                return None

    @classmethod
    def compare_whoops_report(cls, a, b):
        """a is old report, b is new report"""
        print(a)
        print('old')
        print(b)
        print('new')
        def compare(a, b):
            diff = {}
            old_diff = {}
            new_diff = {}
            diff["old"] = old_diff
            diff["new"] = new_diff
            if not a or not b:
                return None
            if len(a) == len(b) and len(a) == 0:
                return None
            if isinstance(a, dict) and isinstance(b, dict):
                for k, v in a.items():
                    if not b.get(k):
                        old_diff[k] = v
                        new_diff[k] = None
                    elif v != b[k]:
                        old_diff[k] = v
                        new_diff[k] = b[k]
                for k, v in b.items():
                    if not a.get(k):
                        old_diff[k] = None
                        new_diff[k] = v
                for k, v in a.items():
                    if (not v or len(v) == 0) and (not b.get(k) or len(b.get(k)) == 0):
                        del old_diff[k]
                        del new_diff[k]

                return diff

        res_dict = compare(a, b)
       
        if res_dict:
            for _, v in res_dict.items():
                if len(v) > 1:
                    print(res_dict)
                    print('res_dict')
                    return res_dict
        else:
            return None  # return None if no difference

    def whoops_compare_process(self, wru, raw_new_whoops_report, new_whoops_report_dict):
        if wru.existing_report is None and wru.cache_report is None and wru.initial_diff is None:  # For the very first WhoopsUpdate object
            wru.existing_report = raw_new_whoops_report  # raw binary data
        elif wru.cache_report is None:
            binary_data = zlib.decompress(wru.existing_report)
            whoops_json_string = BytesIO(binary_data)
            existing_report_dict = JSONParser().parse(whoops_json_string)
            diff = WhoopsReportsUpdateAPI.compare_whoops_report(existing_report_dict, new_whoops_report_dict)

            if diff:
                diff = zlib.compress(JSONRenderer().render(diff))
                wru.initial_diff = diff
            else:
                print('diff_initl == None')
                wru.initial_diff = None
        else:
            binary_data = zlib.decompress(wru.cache_report)
            whoops_json_string = BytesIO(binary_data)
            cache_report_dict = JSONParser().parse(whoops_json_string)
            diff = WhoopsReportsUpdateAPI.compare_whoops_report(cache_report_dict, new_whoops_report_dict)
            print('diff_whoops')
            print(diff)
            if diff:
                diff = zlib.compress(JSONRenderer().render(diff))
                wru.initial_diff = diff
            else:
                print('diff_initl == None')
                wru.initial_diff = None
        wru.save()

    def whoops_schedule_compare(self, request):
        """call this method each day at 04:00 or any other time, update WhoopsReports each day for all users"""
        if 'customer_program_id' in request.data:
            customer_program_id = request.data['customer_program_id']
        else:
            customer_program_id = 0
        if customer_program_id != 0:  # Account Manager on demand compare
            # print(request.user.id)
            # print(UniversityCustomer.objects.get(id=request.user.id))
            print(1234567)
            customer_program = UniversityCustomerProgram.objects.get(object_id=request.data['customer_program_id'])
            wru, created = WhoopsUpdate.objects.get_or_create(customer_program=customer_program,
                                                              customer=UniversityCustomer.objects.
                                                              get(id=request.data['client_id']), most_recent=True)
            # customer = UniversityCustomer.objects.get(id=request.user.id)
            new_whoops_report_dict = self.get_programs_data(request)  # dict
            if new_whoops_report_dict is not None:
                json_str = JSONRenderer().render(new_whoops_report_dict)  # render to bytes with utf-8 encoding
                raw_new_whoops_report = zlib.compress(json_str)
            else:
                raw_new_whoops_report = None
            print(new_whoops_report_dict)
            print(raw_new_whoops_report)
            print('1234567')
            self.whoops_compare_process(wru, raw_new_whoops_report, new_whoops_report_dict)
        else:
            users = UniversityCustomer.objects.filter(account_type='main',account_manager = request.user.id)
            print(12356)
            for user in users:
                print(user)
                # login_time = user.last_login_time # get latest login time
                customer_whoops_programs = UniversityCustomerProgram.objects.all().\
                    filter(customer=user, whoops_final_release='True')
                for customer_program in customer_whoops_programs:
                    wru, created = WhoopsUpdate.objects.get_or_create(customer_program=customer_program,
                                                                      customer=user, most_recent=True)
                    print('second test')
                    new_whoops_report_dict = self.get_programs_data(request, customer_program)
                    if new_whoops_report_dict is not None:
                        json_str = JSONRenderer().render(new_whoops_report_dict)  # render to bytes with utf-8 encoding
                        raw_new_whoops_report = zlib.compress(json_str)
                        self.whoops_compare_process(wru, raw_new_whoops_report, new_whoops_report_dict)

    def put(self, request):
        if not self.is_manager(request):
            raise Http404("Permission denied!")
        else:
            self.whoops_schedule_compare(request)
            # p = WhoopsUpdate.objects.get(customer_program=request.data['customer_program_id'], most_recent=True)
            # # print(p.initial_diff)
            # if p.initial_diff is None:

            #     print(p.initial_diff)
            # else:
            #     json_string = zlib.decompress(p.initial_diff)
            #     json_string = BytesIO(json_string)
            #     res = JSONParser().parse(json_string)
        return Response("Ok", HTTP_200_OK)



class ManagerWhoopsDiffConfirmation(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request, customer_program_id, client_id):
        """
        Get Initial Whoops diff and report for a customer program.
        """
        perm = self.is_manager(request)
        if not perm:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        update_report = WhoopsUpdate.objects.get(customer=client_id, customer_program=customer_program_id, most_recent=True)
        if update_report.initial_diff is not None:
            initial_diff = zlib.decompress(update_report.initial_diff)
            initial_diff = BytesIO(initial_diff)
            initial_diff = JSONParser().parse(initial_diff)
        else:
            initial_diff = None
        if update_report.existing_report is not None:
            existing_report = zlib.decompress(update_report.existing_report)
            existing_report = BytesIO(existing_report)
            existing_report = JSONParser().parse(existing_report)
        else:
            existing_report = None
        if update_report.confirmed_diff is not None:
            confirmed_diff = zlib.decompress(update_report.confirmed_diff)
            confirmed_diff = BytesIO(confirmed_diff)
            confirmed_diff = JSONParser().parse(confirmed_diff)
        else:
            confirmed_diff = None

        if update_report.cache_report == None:
            result =  {"initial_diff": initial_diff, "confirmed_diff": confirmed_diff, "existing_or_cache_report": existing_report}
        else:
            cache_report = zlib.decompress(update_report.cache_report)
            cache_report = BytesIO(cache_report)
            cache_report = JSONParser().parse(cache_report)
            result = {"initial_diff": initial_diff, "confirmed_diff": confirmed_diff, "existing_or_cache_report": cache_report}

        app_logger.info(" ManagerWhoopsDiffConfirmation get ::: cache_report = {0},  initial_diff={1}, ".format(cache_report,initial_diff))


        return Response(result, HTTP_200_OK)

    def put(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        wru = WhoopsUpdate.objects.get(customer_program=request.data['customer_program_id'],
                                       most_recent=True)
        wru.cache_report = zlib.compress(JSONRenderer().render(request.data['cache_report']))

        #initial diff change
        university_customer_program_query = UniversityCustomerProgram.objects.filter(pk = request.data['customer_program_id'])
        if not university_customer_program_query.exists():
            return Response({"failed": _("bad request")}, status=HTTP_400_BAD_REQUEST)
        university_customer_program = university_customer_program_query.first()
        new_whoops_report_dict = WhoopsReportsUpdateAPI().get_programs_data(request,university_customer_program)
        initial_diff = WhoopsReportsUpdateAPI.\
            compare_whoops_report(request.data['cache_report'],new_whoops_report_dict)



        update_diff = WhoopsReportsUpdateAPI.\
            compare_whoops_report(JSONParser().parse(BytesIO(zlib.decompress(wru.existing_report))),
                                       request.data['cache_report'])
        wru.update_diff = zlib.compress(JSONRenderer().render(update_diff))
        wru.initial_diff = zlib.compress(JSONRenderer().render(initial_diff))
        wru.confirmed_diff = zlib.compress(JSONRenderer().render(request.data['confirmed_diff']))
        wru.last_edit_time = timezone.now()
        wru.save()

        app_logger.info(" ManagerWhoopsDiffConfirmation put ::: update_diff = {0},  initial_diff={1}, ".format(update_diff,initial_diff))

        return Response({"success": ("Confirmed diff!")}, status=HTTP_202_ACCEPTED)




class ClientViewWhoopsUpdate(APIView):

    def get_user(self, request, object_id, client_id):
        
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            user = UniversityCustomer.objects.get(id=client_id)
        except UpgridAccountManager.DoesNotExist:
            try:
                user = UniversityCustomer.objects.get(id=request.user.id)
            except UniversityCustomer.DoesNotExist:
                return False
        if user.account_type == 'sub':
            try:
                ClientAndProgramRelation.objects.get(client=user, client_program=object_id)
                return UniversityCustomer.objects.get(id=user.main_user_id)
            except ClientAndProgramRelation.DoesNotExist:
                return False
        return user

    def get(self, request, object_id=None, client_id=None):
        user = self.get_user(request, object_id, client_id)
        print(user)
        cust_pro = UniversityCustomerProgram.objects.get(object_id=object_id)
        print(cust_pro)
        if not user:
            return Response({"failed": _("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        try:
            update_report_query = WhoopsUpdate.objects.filter(customer_program=object_id, customer=user, most_recent=True)
            print(update_report_query)
            update_report = update_report_query.first()
        except WhoopsUpdate.DoesNotExist:
            return Response({"failed": _("No WhoopsReportsViewUpdate matches the given query.")},
                            status=HTTP_403_FORBIDDEN)
        if update_report.cache_report and not client_id: #client's view after account manager updating a new version
            app_logger.info("client or account manager's view and has no existing report".format())
            print("#client's view after account manager updating a new version")
            update_report.most_recent = False
            update_report.save()
            new_wru = WhoopsUpdate.objects.create(
                customer_program=cust_pro,
                customer=user,
                most_recent=True,
                existing_report=update_report.cache_report,
                prev_diff=update_report.update_diff,
                last_edit_time=update_report.last_edit_time)

            new_wru.save()
            if new_wru.existing_report:
                existing_report = JSONParser().parse(BytesIO(zlib.decompress(new_wru.existing_report)))
            else:
                existing_report = "None"
            if new_wru.prev_diff:
                update_diff = JSONParser().parse(BytesIO(zlib.decompress(new_wru.prev_diff)))
            else:
                update_diff = "None"
            print('update_diff')
            app_logger.info("existing_report = {0}, update_diff = {1}".format(existing_report,update_diff))
            print(update_diff)
        else:

            if update_report.existing_report:#(account manager's view or client's veiw) and has existing report and no cache_report
                print("(account manager's view or client's veiw) and has existing report no cache report")
                existing_report = JSONParser().parse(BytesIO(zlib.decompress(update_report.existing_report)))
                app_logger.info("(account manager's view or client's veiw) and has existing report and no_cache report".format(existing_report))
            else:#client or account manager's view and has no existing report
                existing_report = "None"                                
                app_logger.info("client or account manager's view and has no existing report".format())
            if update_report.update_diff and client_id:
                update_diff = JSONParser().parse(BytesIO(zlib.decompress(update_report.update_diff)))
            elif update_report.prev_diff:

                if not zlib.decompress(update_report.prev_diff) == b'':
                    update_diff = JSONParser().parse(BytesIO(zlib.decompress(update_report.prev_diff)))
                else:
                    update_diff = '' 
            else:
                update_diff = "None"

            app_logger.info("existing_report = {0}, update_diff = {1}".format(existing_report,update_diff))
        print(update_diff)

        # context = "{'existing_report': {0}, 'update_diff':{1}".format(existing_report, update_diff)
        context = {'existing_report': existing_report, 'update_diff': update_diff,
                   'university': cust_pro.program.university_school.university_foreign_key.name,
                   'school': cust_pro.program.university_school.school,
                   'program': cust_pro.program.program_name, 'degree': cust_pro.program.degree.name,
                   'whoops_final_release_time': cust_pro.whoops_final_release_time,
                   'report_last_edit_time': update_report.last_edit_time}

        return Response(context, HTTP_200_OK)