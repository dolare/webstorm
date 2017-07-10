from .apis import *


# numbers of final_released enhancement reports
class FinalReleasedEnhancement(APIView):

    def get_object(self, request, object_id):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=object_id, account_manager=manager)
                except UniversityCustomer.DoesNotExist:
                    return Response({"Failed": ("This is not a valid client!")}, status=HTTP_403_FORBIDDEN)
            except ObjectDoesNotExist:
                return Response({"Failed": ("System can not identify your status. Please login first!")},
                                status=HTTP_403_FORBIDDEN)

        return user

    def get(self, request, object_id=None):
        customer = self.get_object(request, object_id)
        if customer.account_type == 'sub':
            customer_programs = ClientAndProgramRelation.objects.filter(client=customer).values('client_program')
            final_true_program = UniversityCustomerProgram.objects.filter(customer=customer.main_user_id,
                                                                          object_id__in=customer_programs,
                                                                          enhancement_final_release='True').count()
        else:
            final_true_program = UniversityCustomerProgram.objects.filter(customer=customer,
                                                                          enhancement_final_release='True').count()
        return Response(data=final_true_program, status=HTTP_200_OK)


# Get Ehancement Reports / Put change confirmation status of a enhancement report.
class EnhancementReportsAPI(APIView):
    def get_user(self, request, client_id=None):
        try:
            user = UniversityCustomer.objects.get(id=request.user.id)
            return user
        except UniversityCustomer.DoesNotExist:
            try:
                manager = UpgridAccountManager.objects.get(id=request.user.id)
                try:
                    user = UniversityCustomer.objects.get(id=client_id, account_manager=manager)
                    return user
                except UniversityCustomer.DoesNotExist:
                    return False
            except ObjectDoesNotExist:
                return False

    def get_listobjects(self, request):
        total_program = request.data['object_id'].split('/')
        if len(total_program) <= 0:
            raise ValidationError('Bad request!')
        print(total_program)
        program_list = []
        try:
            for p in total_program:
                cp = UniversityCustomerProgram.objects.get(object_id=p)
                program_list.append(cp)
            return program_list
        except UniversityCustomerProgram.DoesNotExist:
            raise Http404

    def put(self, request):
        user = self.get_user(request, self.request.data['client_id'])
        if not user:
            return Response({"Failed": ("Permission Denied! ")}, status=HTTP_403_FORBIDDEN)
        
        if not user.account_type == 'main':
            return Response({"Failed": ("Only main account can make enhancement report confirmation! ")},
                            status=HTTP_403_FORBIDDEN)

        cp_list = self.get_listobjects(request)
        for p in cp_list:
            if not p.customer == user:
                    return Response({"Failed": ("You don not have access to this program.! ")},
                                    status=HTTP_403_FORBIDDEN)
            p.customer_confirmation = "Yes"
            p.save()

        return Response({"Success": ("Confirmation status has been set!")}, status=HTTP_202_ACCEPTED)

# ------------------------------------Account Manager APIs---------------------------------------


class EnhancementWebReports(APIView):

    def check_permissions(self, request):
        try:
            manager = UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request, customer_program_id):
        perm = self.check_permissions(request)
        if perm:
            context = EnhancementReportsUpdateAPI().get_programs_data(customer_program_id)
            print(context)
            print('return context')
            return Response(context, status=HTTP_200_OK)

        else:
            return Response({"Failed": ("Permission denied!")}, status=HTTP_403_FORBIDDEN)




class EnhancementReportsUpdateAPI(APIView):
    def get_user(self, request):
        try:
            return UniversityCustomer.objects.get(id=self.request.user.id, account_type='main')
        except UniversityCustomer.DoesNotExist:
            return False

    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get_programs(self, customer_program_id):
        """
        get customer program and competing Program
           return: object list
        """
        program_list = []
        customer_program_query = UniversityCustomerProgram.objects.select_related('program').filter(object_id=customer_program_id)
        if not customer_program_query.exists():
            return None
        customer_program = customer_program_query.first()
        self_program = Program.objects.get(object_id=customer_program.program.object_id)
        program_list.append(self_program)
        competing_programs = customer_program.customercompetingprogram_set.all().select_related('program').order_by(
            'order')
        print(competing_programs)
        for cp in competing_programs:
            program = Program.objects.get(object_id=cp.program.object_id)
            program_list.append(program)
        # print(program_list)
        print('program.................list')
        return program_list

    def get_programs_data(self, object_id):
        """
        get customer program and competing program
           return: dictionary
        """
        total_program = self.get_programs(object_id)
        print(total_program)
        print('tatal Program')
        length = len(total_program)
        res_obj = {}
        arr_0 = []
        arr_1= []

        for i in range(1, length + 1):
            temp = {}
            empty = None
            try:
                p_value = total_program[i - 1]
            except Program.DoesNotExist:
                return HttpResponse(status=Http404)

            try:
                c_value = Curriculum.objects.get(program=total_program[i - 1], )
            except ObjectDoesNotExist:
                c_value = empty
            try:
                t_value = Tuition.objects.get(program=total_program[i - 1], )
            except ObjectDoesNotExist:
                t_value = empty
            try:
                d_value = Deadline.objects.get(program=total_program[i - 1], )
            except ObjectDoesNotExist:
                d_value = empty
            try:
                dura_value = Duration.objects.get(program=total_program[i - 1])
            except Duration.DoesNotExist:
                dura_value = empty
            try:
                r_value = Requirement.objects.get(program=total_program[i - 1], )
            except ObjectDoesNotExist:
                r_value = empty
            try:
                s_value = Scholarship.objects.get(program=total_program[i - 1], )
            except ObjectDoesNotExist:
                s_value = empty


            if r_value:
                r_e_value = r_value.exam.all()  # get django queryset
                i_value = r_value.intl_transcript.all()
                i_e_t_value = r_value.intl_english_test.all()
            else:
                r_e_value = empty
                i_value = empty
                i_e_t_value = empty

            # convert db instance to serializer
            p_value = dbLizer.ProgramSerializer(p_value)
            c_value = dbLizer.CurriculumSerializer(c_value)
            t_value = dbLizer.TuitionSerializer(t_value)
            d_value = dbLizer.DeadlineSerializer(d_value)
            r_value = dbLizer.RequirementSerializer(r_value)

            r_e_value = dbLizer.ExamSerializer(r_e_value, many=True)
            i_value = dbLizer.TranscriptEvaluationProviderSerializer(i_value, many=True)
            i_e_t_value = dbLizer.InternationalEnglishTestSerializer(i_e_t_value, many=True)
            s_value = dbLizer.ScholarshipSerializer(s_value)
            dura_value = dbLizer.DurationSerializer(dura_value)

            temp['program_detail'] = p_value.data  # return unordered map if empty would be a empty list
            temp['curriculum'] = c_value.data
            temp['tuition'] = t_value.data
            temp['deadline'] = d_value.data
            temp['requirement'] = r_value.data
            temp['required_exam'] = r_e_value.data
            temp['intl_transcript'] = i_value.data
            temp['intl_eng_test'] = i_e_t_value.data
            temp['scholarship'] = s_value.data
            temp['duration'] = dura_value.data
            temp['object_id'] = total_program[i - 1].object_id

            if i == 1:
                arr_0.append(temp)
            else:
                arr_1.append(temp)

        res_obj["competing_programs"] = arr_1;
        res_obj["program"] = arr_0

        res_obj["length"] = length
        
        return res_obj

    #generate diff
    @classmethod
    def compare_enhancement_report(self,a, b):
        # print('a')
        # print(a);
        # print('b');
        # print(b);
     
        #cause order by order, so store them in a list
        def compare_program_list(old_program_list,new_program_list):
            result = {}
            for i1,val1 in enumerate(old_program_list):
                for i2,val2 in enumerate(new_program_list):
                    print(type(val1['object_id']))
                    print(val2['object_id'])
                    if str(val1['object_id']) == str(val2['object_id']):
                        print('++++++')
                        temp = compare_program(val1,val2)
                        if temp != None:
                            if 'object_id' in temp:
                                del temp['object_id']
                            object_id = val1['object_id']
                            result[object_id] = temp

                    else:
                        print('{0}!====={1}'.format(val1['object_id'],val2['object_id']))
            print(result)
            print('result list')
            return result

        #compare a single program key by key
        def compare_program(old_program,new_program):
            result = {}
            for k1,v1 in new_program.items():
                if k1 == 'object_id':
                    continue
                if k1 in old_program.keys() and isinstance(v1,dict):
                    for k2,v2 in v1.items():
                        if k2 in old_program[k1].keys():
                        	if v2 == None and old_program[k1][k2] == "":
                        		continue
                        	elif v2 == "" and old_program[k1][k2] == None:
                        		continue
                        	elif v2 != old_program[k1][k2]:
                        		print('v2')
                        		print(old_program[k1][k2])
                        		if not k1 in result.keys():
                        			result[k1] = {}
                        		result[k1][k2] = v2
                        elif v2 != None and v2 != "":
                            if not k1 in result.keys():
                                result[k1] = {}
                            print(v2)
                            result[k1][k2] = v2
                elif not k1 in old_program.keys() and isinstance(v1,dict): 
                    print('key1 =====')
                    print(k1)
                    print(old_program[k1])
                    result[k1] = v1
                elif k1 in old_program.keys() and not isinstance(v1,dict):
                    print('key2')
                    print(k1)
                    if v1 != old_program[k1]:
                        result[k1] = v1
                else:
                    print('key3')
                    print(k1)
                    result[k1] = v1

            # print(result)
            # print('test')


            #diff not only contains the object_id
            if len(result) >= 1:
                # print('len > 1')
                # print(result)
                return result
            else:
                return None



        #a is old and b is new 
        old_program = a['program']
        new_program = b['program']

        old_competing_programs = a['competing_programs']
        new_competing_programs = b['competing_programs']

        diff_result = {}
        
        diff_result['program'] = compare_program_list(old_program,new_program)
        diff_result['competing_programs'] = compare_program_list(old_competing_programs,new_competing_programs)

        # print(diff_result)
        #count how many diffs in the result_diff
        diff_count = 0
        for k,v in diff_result['program'].items():
            for k1,v1 in v.items():
                if isinstance(v1,dict):
                    diff_count = diff_count + len(v1)
                else:
                    diff_count = diff_count + 1


        for k,v in diff_result['competing_programs'].items():
            for k1,v1 in v.items():
                if isinstance(v1,dict):
                    diff_count = diff_count + len(v1)
                else:
                    diff_count = diff_count + 1

        #combine two dict program and competing programs
        diff_return  = {}
        diff_return = diff_result['program']

        diff_return.update(diff_result['competing_programs'])

        #print(diff_count)
        #struct the diff and return it
        diff_return['diff_count'] = diff_count
        if diff_return and diff_count != 0 and len(diff_return):
            # print(diff_return)
            return diff_return
        else:
            return None  # return None if no difference

    def compare_enhancement_process(self, eru, raw_new_enhancement_report, new_enhancement_report_dict):
        if eru.existing_report is None and eru.cache_report is None: 
         # For the very first EnhancementUpdate object
            print('existing_report ')
            eru.existing_report = raw_new_enhancement_report  # raw binary data
        elif eru.cache_report is None:
            binary_data = zlib.decompress(eru.existing_report)
            enhancement_json_string = BytesIO(binary_data)
            existing_report_dict = JSONParser().parse(enhancement_json_string)
            diff = EnhancementReportsUpdateAPI.compare_enhancement_report(existing_report_dict,
                                                                            new_enhancement_report_dict)
            print('cache_report is none')
            if diff:
                diff = zlib.compress(JSONRenderer().render(diff))
                eru.initial_diff = diff
            else:
                eru.initial_diff = None
        else:
            binary_data = zlib.decompress(eru.cache_report)
            enhancement_json_string = BytesIO(binary_data)
            cache_report_dict = JSONParser().parse(enhancement_json_string)
            diff = EnhancementReportsUpdateAPI.compare_enhancement_report(cache_report_dict,
                                                                         new_enhancement_report_dict)
            print('generate diff ')
            if diff:
                diff = zlib.compress(JSONRenderer().render(diff))
                eru.initial_diff = diff
            else:
            	eru.initial_diff = None
        eru.save()

    def enhancement_schedule_compare(self, request):
        """call this method each day at 04:00 or any other time, update EnhancementReports each day for all users"""
        if 'customer_program_id' in request.data:
            university_customer_program = request.data['customer_program_id']
        else:
            university_customer_program = 0
        
        if university_customer_program != 0:  # Account Manager on demand compare
            print('release............on_demand')
            # print(request.user.id)
            # print(UniversityCustomer.objects.get(id=request.user.id))
            customer_program = UniversityCustomerProgram.objects.get(object_id=university_customer_program)
            eru, created = EnhancementUpdate.objects.get_or_create(customer_program=customer_program,
                                                                   customer=UniversityCustomer.objects.
                                                                   get(id=request.data['client_id']), most_recent=True)
            # customer = UniversityCustomer.objects.get(id=request.user.id)
            new_enhancement_report_dict = self.get_programs_data(university_customer_program)  # dict
            json_str = JSONRenderer().render(new_enhancement_report_dict)  # render to bytes with utf-8 encoding
            raw_new_enhancement_report = zlib.compress(json_str)
            self.compare_enhancement_process(eru, raw_new_enhancement_report, new_enhancement_report_dict)
        else:
            users = UniversityCustomer.objects.filter(account_type='main',account_manager = request.user.id)
            print('account manager')
            print(users)
            for user in users:
                # login_time = user.last_login_time # get latest login time
                customer_enhancement_programs = UniversityCustomerProgram.objects.all().\
                    filter(customer=user, enhancement_final_release='True', customer_confirmation='Yes')
                for customer_program in customer_enhancement_programs:
                    eru, created = EnhancementUpdate.objects.get_or_create(customer_program=customer_program,
                                                                           customer=user, most_recent=True)
                    new_enhancement_report_dict = self.get_programs_data(customer_program.object_id)
                    json_str = JSONRenderer().render(new_enhancement_report_dict)  # render to bytes with utf-8 encoding
                    raw_new_enhancement_report = zlib.compress(json_str)
                    self.compare_enhancement_process(eru, raw_new_enhancement_report, new_enhancement_report_dict)

    def put(self, request):
        if not self.is_manager(request):
            raise Http404("Permission denied!")
        else:
            self.enhancement_schedule_compare(request)
        return Response("Ok", HTTP_200_OK)

class ManagerEnhancementDiffConfirmation(APIView):
    def is_manager(self, request):
        try:
            UpgridAccountManager.objects.get(id=request.user.id)
            return True
        except UpgridAccountManager.DoesNotExist:
            return False

    def get(self, request, customer_program_id, client_id):
        """
        Get Initial diff and report for a customer program.
        """
        perm = self.is_manager(request)
        # perm = True
        if not perm:
            return Response({"failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        update_report = EnhancementUpdate.objects.get(customer=client_id, customer_program=customer_program_id,
                                                      most_recent=True)
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
            result = {"initial_diff": initial_diff, "confirmed_diff": confirmed_diff, "existing_or_cache_report": existing_report}
        else:
            cache_report = zlib.decompress(update_report.cache_report)
            cache_report = BytesIO(cache_report)
            cache_report = JSONParser().parse(cache_report)  
            result = {"initial_diff": initial_diff, "confirmed_diff": confirmed_diff, "existing_or_cache_report": cache_report}  
        return Response(result, HTTP_200_OK)

    def put(self, request):
        perm = self.is_manager(request)
        if not perm:
            return Response({"failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        eru = EnhancementUpdate.objects.get(customer_program=request.data['customer_program_id'],
                                            customer=request.data['client_id'], most_recent=True)
        eru.cache_report = zlib.compress(JSONRenderer().render(request.data['cache_report']))
        
        #update diff change
        update_diff = EnhancementReportsUpdateAPI.\
            compare_enhancement_report(request.data['cache_report'],JSONParser().parse(BytesIO(zlib.decompress(eru.existing_report))))
        
        print(update_diff)
        print('update_diff')
        print(JSONParser().parse(BytesIO(zlib.decompress(eru.existing_report))))
        print('cache report')

        #initial diff change
        university_customer_program = request.data['customer_program_id']
        new_enhancement_report_dict = EnhancementReportsUpdateAPI().get_programs_data(university_customer_program)
        initial_diff = EnhancementReportsUpdateAPI.\
            compare_enhancement_report(request.data['cache_report'],new_enhancement_report_dict)

     

        print(initial_diff)
        print('initial_diff')
        confirmed_diff = request.data['confirmed_diff']
        
        diff_count = 0
    
        for k1,v1 in confirmed_diff.items():
            if isinstance(v1,dict):
                diff_count = diff_count + len(v1)
            else:
                diff_count = diff_count + 1
        confirmed_diff['diff_count'] = diff_count
        eru.confirmed_diff = zlib.compress(JSONRenderer().render(confirmed_diff))
        eru.initial_diff = zlib.compress(JSONRenderer().render(initial_diff))
        eru.update_diff = zlib.compress(JSONRenderer().render(update_diff))

        print(eru.confirmed_diff)
        eru.last_edit_time = timezone.now()
        eru.save()

        return Response({"success": ("Confirmed diff!")}, status=HTTP_202_ACCEPTED)


class ClientViewEnhancementUpdate(APIView):
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
                print('sub user')
                ClientAndProgramRelation.objects.get(client=user, client_program=object_id)
                user = UniversityCustomer.objects.filter(id = user.main_user_id)
                if user.exists():
                    user = user.first()
                else: 
                    return False
            except ClientAndProgramRelation.DoesNotExist:
                return False
        return user

    def get(self, request, object_id=None, client_id=None):

        user = self.get_user(request, object_id, client_id)

        customer_program = UniversityCustomerProgram.objects.get(object_id=object_id)
        if not user:
            return Response({"failed": ("Permission Denied!")}, status=HTTP_403_FORBIDDEN)
        try:
            update_report_query = EnhancementUpdate.objects.filter(customer_program=customer_program, customer=user,
                                                          most_recent=True)
            if update_report_query.exists():
                update_report = update_report_query.first()
            else:
                return Response({"failed": ("No EnhancementReportsViewUpdate matches the given query.")},
                            status=HTTP_403_FORBIDDEN)
        except EnhancementUpdate.DoesNotExist:
            return Response({"failed": ("No EnhancementReportsViewUpdate matches the given query.")},
                            status=HTTP_403_FORBIDDEN)
        if update_report.cache_report and not client_id:
            
            update_report.most_recent = False
            
            new_eru = EnhancementUpdate.objects.create(
                customer_program=customer_program,
                customer=user,
                most_recent=True,
                existing_report=update_report.cache_report,
                prev_diff=update_report.update_diff,
                last_edit_time=update_report.last_edit_time)

            update_report.save()
            new_eru.save()

        # print(update_report.existing_report)
            if new_eru.existing_report and not zlib.decompress(new_eru.existing_report) == b'':
                existing_report = JSONParser().parse(BytesIO(zlib.decompress(new_eru.existing_report)))
            else:
                existing_report = "None"
            if new_eru.prev_diff and not zlib.decompress(new_eru.prev_diff) == b'':
                update_diff = JSONParser().parse(BytesIO(zlib.decompress(new_eru.prev_diff)))
            else:
                update_diff = "None"



        else:
            if update_report.existing_report and not zlib.decompress(update_report.existing_report) == b'':
                existing_report = JSONParser().parse(BytesIO(zlib.decompress(update_report.existing_report)))

            else:
                existing_report = "None"

            if update_report.update_diff and client_id and not zlib.decompress(update_report.update_diff)==b'':  # if manager view report before client and has updates
                update_diff = JSONParser().parse(BytesIO(zlib.decompress(update_report.update_diff)))

            elif update_report.prev_diff:
                if not zlib.decompress(update_report.prev_diff) == b'':
                    update_diff = JSONParser().parse(BytesIO(zlib.decompress(update_report.prev_diff)))
                else:
                    update_diff = ''
            else:

                update_diff = "None"


        # context = "{'existing_report': {0}, 'update_diff':{1}".format(existing_report, update_diff)
        context = {'existing_report': existing_report, 'prev_diff': update_diff,
                   'enhancement_final_release_time': customer_program.enhancement_final_release_time,
                   'report_last_edit_time': update_report.last_edit_time
                   }
        return Response(context, HTTP_200_OK)
