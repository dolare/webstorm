from django.conf.urls import url
from . import apis

urlpatterns=[

    # --------------------------New Designed Upgrid API------------------------
    
    # ---------------------------Login API----------------------------
    
    # POST login +++
    url(r'^api/upgrid/access_token/$', apis.CustomizeJWT.as_view()),  

    # PUT change password +++
    url(r'^api/upgrid/user/password/$', apis.PasswordChangeView.as_view()), 
    
    # PUT reset password and POST send reset password email
    url(r'^api/upgrid/user/password/reset/$', apis.ResetPassword.as_view()),

    # --------------------------User API------------------------------

    # Get user's customer program +++
    url(r'^api/upgrid/user/program/$', apis.CustomerProgram.as_view()),

    # url(r'^api/upgrid/user/(?P<client_id>[0-9a-fA-F\-]+)/program/$', apis.CustomerProgram.as_view()),
    # Get competing program +++
    url(r'^api/upgrid/user/competing_program/(?P<object_id>[0-9a-fA-F\-]+)/$',
        apis.CustomerCompetingProgramAPI.as_view()),

    url(r'^api/upgrid/user/(?P<client_id>[0-9a-fA-F\-]+)/competing_program/(?P<object_id>[0-9a-fA-F\-]+)/$',
        apis.CustomerCompetingProgramAPI.as_view()),

    # numbers of finalreleased whoops reports status == "True"
    url(r'^api/upgrid/user/released_whoops/$', apis.FinalReleasedWhoops.as_view()),

    url(r'^api/upgrid/user/released_whoops/(?P<client_id>[0-9a-fA-F\-]+)/$', apis.FinalReleasedWhoops.as_view()),

    # numbers of finalreleased enhancement reports status == "True" 
    url(r'^api/upgrid/user/released_enhancement/$', apis.FinalReleasedEnhancement.as_view()),

    url(r'^api/upgrid/user/released_enhancement/(?P<object_id>[0-9a-fA-F\-]+)/$',
        apis.FinalReleasedEnhancement.as_view()),

    # get customer detail information +++
    url(r'^api/upgrid/user/$', apis.CustomerDetail.as_view()),
    url(r'^api/upgrid/user/(?P<client_id>[0-9a-fA-F\-]+)/$', apis.CustomerDetail.as_view()),

    # Put change subuser is_active status, Post create subuser
    url(r'^api/upgrid/user/subuser$', apis.CreateOrChangeSubUser.as_view()),


    # # Get Dashboard information for client +++
    url(r'^api/upgrid/user/dashboard/$', apis.DashBoardAPI.as_view()),
    # For account manager inpersonate use
    url(r'^api/upgrid/user/dashboard/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.DashBoardAPI.as_view()),

    # ---------------------------Report API----------------------------------------

    # Put change confirmation status of a enhancement report.
    url(r'^api/upgrid/enhancement_reports/$', apis.EnhancementReportsAPI.as_view()),

    # Post generate whoops reports share link. Post Param: univcustomer_program_id
    url(r'^api/upgrid/reports/shared/$', apis.ShareReports.as_view(),),
    # Get  get whoops and enhancement reports through shared link.
    url(r'^api/upgrid/reports/shared/(?P<object_id>[0-9a-zA-Z\-]+)/(?P<token>[0-9a-z\-]+)/$',
        apis.ShareReports.as_view(),),

    # ------------------------------------Account Manager APIs-----------------------------------
    
    # Check if the login user is manager. GET request
    url(r'^api/upgrid/accountmanager/is_manager/$', apis.IsAccountManager.as_view()),

    # Get account manager's information and client_list under him.   GET request
    url(r'^api/upgrid/accountmanager/$', apis.AccountManager.as_view()),

    # Get client detail infomation of a specific client by id.  GET :param  client_id/  POST create client
    url(r'^api/upgrid/accountmanager/client/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.ClientCRUD.as_view()),

    url(r'^api/upgrid/accountmanager/client/$', apis.ClientCRUD.as_view()),

    #   Get all customer programs of a client. :param client_id
    url(r'^api/upgrid/accountmanager/client/customer_program/(?P<object_id>[0-9a-fA-F\-]+)/$',
        apis.UniversityCustomerProgramCRUD.as_view()),
    url(r'^api/upgrid/accountmanager/client/customer_program/$', apis.UniversityCustomerProgramCRUD.as_view()),

    # Get all competing programs under a university customer program. :param university customer program object_id.
    url(r'^api/upgrid/accountmanager/client/competing_program/(?P<object_id>[0-9a-fA-F\-]+)/$',
        apis.CustomerCompetingProgramCRUD.as_view()),
    url(r'^api/upgrid/accountmanager/client/competing_program/$', apis.CustomerCompetingProgramCRUD.as_view()),

    # get all Ceebs in database. Used for accountmanager create client's Ceeb. GET request. 
    url(r'api/upgrid/accountmanager/ceebs/$', apis.UniversitySchoolAPI.as_view()),

    # get all programs' object_id, ceeb code and name. GET request
    url(r'api/upgrid/accountmanager/programs/$', apis.ProgramAPI.as_view()),

    # get department under a specific ceeb code. GET :param  ceeb
    url(r'api/upgrid/accountmanager/department/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.DepartmentAPI.as_view()),

    # :param /?ceeb=??&department=??
    # Get program list for account manager to choice to create client's customer program. Based on Ceeb and department
    url(r'api/upgrid/accountmanager/dropdown_menu/programs/$', apis.CustomerAndCompetingProgramAPI.as_view()),

    url(r'api/upgrid/wwr/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.WhoopsWebReports.as_view()),
    url(r'api/upgrid/ewr/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.EnhancementWebReports.as_view()),

    # --------------------------------Update API-----------------------------------------------
    # PUT. used for account manager on-demand compare customer enhancementprogram.
    # Param: object_id: university customer program id
    url(r'api/upgrid/update/enhancement/ondemand/$', apis.EnhancementReportsUpdateAPI.
        as_view()),
    # PUT. used for account manager on-demand compare customer whoops program.
    # Param: object_id: university customer program id
    url(r'api/upgrid/update/whoops/ondemand/$', apis.WhoopsReportsUpdateAPI.
        as_view()),

    # Get. For Account Manager get initial_diff and existing_report of a customer enhancement program .
    # Param: customer program id
    url(r'api/upgrid/update/enhancement/diff_confirmation/(?P<customer_program_id>[0-9a-fA-F\-]+)/'
        r'(?P<client_id>[0-9a-fA-F\-]+)/$', apis.ManagerEnhancementDiffConfirmation.as_view()),

    # Get. For Account Manager get initial_diff and existing_report of a customer whoops program.
    # Param: customer program id
    url(r'api/upgrid/update/whoops/diff_confirmation/(?P<customer_program_id>[0-9a-fA-F\-]+)/'
        r'(?P<client_id>[0-9a-fA-F\-]+)/$', apis.ManagerWhoopsDiffConfirmation.as_view()),

    # Put. For Account Manager to confirm update_diff and exsiting_report of enhancement.
    # Param in request: customer_program_id, cache_report, confirmed_diff.
    url(r'api/upgrid/update/enhancement/diff_confirmation/$', apis.ManagerEnhancementDiffConfirmation.as_view()),

    # Put. For Account Manager to confirm update_diff and exsiting_report of whoops.
    # Param in request: customer_program_id, cache_report, confirmed_diff.
    url(r'api/upgrid/update/whoops/diff_confirmation/$', apis.ManagerWhoopsDiffConfirmation.as_view()),

    # Get. For Client to get enhancement existing report and update_diff. Param: customer program id
    url(r'api/upgrid/update/view/enhancement/(?P<object_id>[0-9a-fA-F\-]+)/$',
        apis.ClientViewEnhancementUpdate.as_view()),
    # Get. For Account Manager to get enhancement existing report and update_diff.
    url(r'api/upgrid/update/view/enhancement/(?P<object_id>[0-9a-fA-F\-]+)/(?P<client_id>[0-9a-fA-F\-]+)/$',
        apis.ClientViewEnhancementUpdate.as_view()),

    # Get. For Client to get whoops existing report and update_diff. Param: customer program id
    url(r'api/upgrid/update/view/whoops/(?P<object_id>[0-9a-fA-F\-]+)/$',
        apis.ClientViewWhoopsUpdate.as_view()),
    # Get. For Account manager to get whoops existing report and update_diff
    url(r'api/upgrid/update/view/whoops/(?P<object_id>[0-9a-fA-F\-]+)/(?P<client_id>[0-9a-fA-F\-]+)/$',
        apis.ClientViewWhoopsUpdate.as_view()),

    # GET. For account manager to get update dashboard client list.
    url(r'api/upgrid/update/dashboard/$', apis.ManagerUpdateDashBoardAPI.as_view()),

    # GET. For account manager to check how many updates of each program of a client.
    url(r'api/upgrid/update/programs/(?P<client_id>[0-9a-fA-F\-]+)/$', apis.ManagerUpdateProgramListAPI.as_view()),

    url(r'api/upgrid/getid/$', apis.GetID.as_view()),
]
