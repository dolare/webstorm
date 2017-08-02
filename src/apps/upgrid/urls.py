from django.conf.urls import url, include
from .apis import *
from .api_enhancement import *
from .api_whoops import *
from .api_report_history import (whoopsReportHistoryList,enhancementReportHistoryList,whoopsReportHistory,enhancementReportHistory)

urlpatterns=[
    ##############################################
    url(r'^$', index, name='index'),
    ##############################################
    # --------------------------New Designed Upgrid API------------------------

    # ---------------------------Login API----------------------------

    # POST login +++
    url(r'^api/upgrid/access_token/$', CustomizeJWT.as_view()),
    url(r'^api/upgrid/token_refresh/$', JWTRefresh.as_view()),

    # PUT change password +++
    url(r'^api/upgrid/user/password/$', PasswordChangeView.as_view()),

    # PUT reset password and POST send reset password email
    url(r'^api/upgrid/user/password/reset/$', ResetPassword.as_view()),

    # --------------------------User API------------------------------
    #Verify user
    
    url(r'^api/upgrid/user/verify/$', CustomerVerify.as_view()),

     url(r'^api/upgrid/user/sent_verify_email/$', CustomerSentVerifyEmail.as_view()),

    # Get user's customer program +++
    url(r'^api/upgrid/user/program/$', CustomerProgram.as_view()),

    # url(r'^api/upgrid/user/(?P<client_id>[0-9a-fA-F\-]+)/program/$', CustomerProgram.as_view()),
    # Get competing program +++
    url(r'^api/upgrid/user/competing_program/(?P<object_id>[0-9a-fA-F\-]+)/$',
        CustomerCompetingProgramAPI.as_view()),

    url(r'^api/upgrid/user/(?P<client_id>[0-9a-fA-F\-]+)/competing_program/(?P<object_id>[0-9a-fA-F\-]+)/$',
        CustomerCompetingProgramAPI.as_view()),

    # numbers of finalreleased whoops reports status == "True"
    url(r'^api/upgrid/user/released_whoops/$', FinalReleasedWhoops.as_view()),

    url(r'^api/upgrid/user/released_whoops/(?P<client_id>[0-9a-fA-F\-]+)/$', FinalReleasedWhoops.as_view()),

    # numbers of finalreleased enhancement reports status == "True"
    url(r'^api/upgrid/user/released_enhancement/$', FinalReleasedEnhancement.as_view()),

    url(r'^api/upgrid/user/released_enhancement/(?P<object_id>[0-9a-fA-F\-]+)/$',
        FinalReleasedEnhancement.as_view()),

    # get customer detail information +++
    url(r'^api/upgrid/user/$', CustomerDetail.as_view()),
    url(r'^api/upgrid/user/(?P<client_id>[0-9a-fA-F\-]+)/$', CustomerDetail.as_view()),

    url(r'^api/upgrid/user/university_customer/$', UniversityCustomerListAPI.as_view()),  # new

    # Put change subuser is_active status, Post create subuser
    url(r'^api/upgrid/user/subuser/$', CreateOrChangeSubUser.as_view()),

    url(r'^api/upgrid/user/client_and_program_relation/$', ClientAndProgramRelationAPI.as_view()),   # new

    # # Get Dashboard information for client +++
    url(r'^api/upgrid/user/dashboard/$', DashBoardAPI.as_view()),
    # For account manager inpersonate use
    url(r'^api/upgrid/user/dashboard/(?P<object_id>[0-9a-fA-F\-]+)/$', DashBoardAPI.as_view()),

    # # Get Dashboard newly released whoops and enhancement reports and time info for client +++
    url(r'^api/upgrid/user/dashboard/newly_released/$', ReleasedPrograms.as_view()),
    # For account manager inpersonate use
    url(r'^api/upgrid/user/dashboard/newly_released/(?P<object_id>[0-9a-fA-F\-]+)/$', ReleasedPrograms.as_view()),

    # # Get Dashboard newly updated whoops and enhancement reports and time info for client +++
    url(r'^api/upgrid/user/dashboard/newly_updated/$', UpdatedReportsList.as_view()),
    # For account manager inpersonate use
    url(r'^api/upgrid/user/dashboard/newly_updated/(?P<object_id>[0-9a-fA-F\-]+)/$', UpdatedReportsList.as_view()),

    # ---------------------------Report API----------------------------------------

    # Put change confirmation status of a enhancement report. key client_id : for account manager pass main client id.
    url(r'^api/upgrid/enhancement_reports/$', EnhancementReportsAPI.as_view()),

    # Post generate whoops reports share link. Post Param: univcustomer_program_id
    url(r'^api/upgrid/reports/shared/$', ShareReports.as_view(),),
    # Get  get whoops and enhancement reports through shared link.
    url(r'^api/upgrid/reports/shared/(?P<object_id>[0-9a-zA-Z\-]+)/(?P<token>[0-9a-z\-]+)/$',
        ShareReports.as_view(),),

    # ------------------------------------Account Manager ----------------------------------

    # Check if the login user is manager. GET request
    url(r'^api/upgrid/accountmanager/is_manager/$', IsAccountManager.as_view()),

    # Get account manager's information and client_list under him.   GET request
    url(r'^api/upgrid/accountmanager/$', AccountManager.as_view()),

    # Get client detail infomation of a specific client by id.  GET :param  client_id/  POST create client
    url(r'^api/upgrid/accountmanager/client/(?P<object_id>[0-9a-fA-F\-]+)/$', ClientCRUD.as_view()),

    url(r'^api/upgrid/accountmanager/client/$', ClientCRUD.as_view()),

    #   Get all customer programs of a client. :param client_id
    url(r'^api/upgrid/accountmanager/client/customer_program/(?P<object_id>[0-9a-fA-F\-]+)/$',
        UniversityCustomerProgramCRUD.as_view()),
    url(r'^api/upgrid/accountmanager/client/customer_program/$', UniversityCustomerProgramCRUD.as_view()),

    # Get all competing programs under a university customer program. :param university customer program object_id.
    url(r'^api/upgrid/accountmanager/client/competing_program/(?P<object_id>[0-9a-fA-F\-]+)/$',
        CustomerCompetingProgramCRUD.as_view()),
    url(r'^api/upgrid/accountmanager/client/competing_program/$', CustomerCompetingProgramCRUD.as_view()),

    # get all Ceebs in database. Used for accountmanager create client's Ceeb. GET request.
    url(r'api/upgrid/accountmanager/ceebs/$', UniversitySchoolAPI.as_view()),

    # get all programs' object_id, ceeb code and name. GET request
    url(r'api/upgrid/accountmanager/programs/$', ProgramAPI.as_view()),

    # get department under a specific ceeb code. GET :param  ceeb
    url(r'api/upgrid/accountmanager/department/(?P<object_id>[0-9a-fA-F\-]+)/$', DepartmentAPI.as_view()),

    # :param /?ceeb=??&department=??
    # Get program list for account manager to choice to create client's customer program. Based on Ceeb and department
    url(r'api/upgrid/accountmanager/dropdown_menu/programs/$', CustomerAndCompetingProgramAPI.as_view()),

    #  For account manager preview reports before the reports are released.
    url(r'api/upgrid/wwr/(?P<customer_program_id>[0-9a-fA-F\-]+)/$',
        WhoopsWebReports.as_view()),
    url(r'api/upgrid/ewr/(?P<customer_program_id>[0-9a-fA-F\-]+)/$',
        EnhancementWebReports.as_view()),

    # --------------------------------Update API-----------------------------------------------
    # PUT. used for account manager on-demand compare customer enhancementprogram.
    # Param: object_id: university customer program id
    url(r'api/upgrid/update/enhancement/ondemand/$', EnhancementReportsUpdateAPI.
        as_view()),
    # PUT. used for account manager on-demand compare customer whoops program.
    # Param: object_id: university customer program id
    url(r'api/upgrid/update/whoops/ondemand/$', WhoopsReportsUpdateAPI.
        as_view()),

    # Get. For Account Manager get initial_diff and existing_report of a customer enhancement program .
    # Param: customer program id
    url(r'api/upgrid/update/enhancement/diff_confirmation/(?P<customer_program_id>[0-9a-fA-F\-]+)/'
        r'(?P<client_id>[0-9a-fA-F\-]+)/$', ManagerEnhancementDiffConfirmation.as_view()),

    # Get. For Account Manager get initial_diff and existing_report of a customer whoops program.
    # Param: customer program id
    url(r'api/upgrid/update/whoops/diff_confirmation/(?P<customer_program_id>[0-9a-fA-F\-]+)/'
        r'(?P<client_id>[0-9a-fA-F\-]+)/$', ManagerWhoopsDiffConfirmation.as_view()),

    # Put. For Account Manager to confirm update_diff and exsiting_report of enhancement.
    # Param in request: customer_program_id, cache_report, confirmed_diff.
    url(r'api/upgrid/update/enhancement/diff_confirmation/$', ManagerEnhancementDiffConfirmation.as_view()),

    # Put. For Account Manager to confirm update_diff and exsiting_report of whoops.
    # Param in request: customer_program_id, cache_report, confirmed_diff.
    url(r'api/upgrid/update/whoops/diff_confirmation/$', ManagerWhoopsDiffConfirmation.as_view()),

    # Get. For Client to get enhancement existing report and update_diff. Param: customer program id
    url(r'api/upgrid/update/view/enhancement/(?P<object_id>[0-9a-fA-F\-]+)/$',
        ClientViewEnhancementUpdate.as_view()),
    # Get. For Account Manager to get enhancement existing report and update_diff.
    url(r'api/upgrid/update/view/enhancement/(?P<object_id>[0-9a-fA-F\-]+)/(?P<client_id>[0-9a-fA-F\-]+)/$',
        ClientViewEnhancementUpdate.as_view()),

    # Get. For Client to get whoops existing report and update_diff. Param: customer program id
    url(r'api/upgrid/update/view/whoops/(?P<object_id>[0-9a-fA-F\-]+)/$',
        ClientViewWhoopsUpdate.as_view()),
    # Get. For Account manager to get whoops existing report and update_diff
    url(r'api/upgrid/update/view/whoops/(?P<object_id>[0-9a-fA-F\-]+)/(?P<client_id>[0-9a-fA-F\-]+)/$',
        ClientViewWhoopsUpdate.as_view()),

    # GET. For account manager to get update dashboard client list.
    url(r'api/upgrid/update/dashboard/$', ManagerUpdateDashBoardAPI.as_view()),

    # GET. For account manager to check how many updates of each program of a client.
    url(r'api/upgrid/update/programs/(?P<client_id>[0-9a-fA-F\-]+)/$', ManagerUpdateProgramListAPI.as_view()),

    url(r'api/upgrid/getid/$', GetID.as_view()),

    #Get return unconfirmed enhancement program
    url(r'api/upgrid/user/unenhancement/programs/$', UnconfirmedPrograms.as_view()),

    # non-degree api
    url(r'api/upgrid/non_degree/', include('apps.upgrid.non_degree_api.urls', namespace='non_degree_api')),

    # report history list and update
    url(r'api/upgrid/history/whoops_report/$', whoopsReportHistoryList.as_view()),

    url(r'api/upgrid/history/enhancement_report/$', enhancementReportHistoryList.as_view()),

    url(r'api/upgrid/history/whoops_report/(?P<client_id>[0-9a-fA-F\-]+)/$', whoopsReportHistory.as_view()),

    url(r'api/upgrid/history/ehhancement_report/(?P<client_id>[0-9a-fA-F\-]+)/$', enhancementReportHistory.as_view()),

]


