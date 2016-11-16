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
    url(r'^api/upgrid/user/competing_program/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.CustomerCompetingProgramAPI.as_view()),

    url(r'^api/upgrid/user/(?P<client_id>[0-9a-fA-F\-]+)/competing_program/(?P<object_id>[0-9a-fA-F\-]+)/$',
        apis.CustomerCompetingProgramAPI.as_view()),

    # numbers of finalreleased whoops reports status == "True"
    url(r'^api/upgrid/user/released_whoops/$', apis.FinalReleasedWhoops.as_view()),

    url(r'^api/upgrid/user/released_whoops/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.FinalReleasedWhoops.as_view()),

    # numbers of finalreleased enhancement reports status == "True" 
    url(r'^api/upgrid/user/released_enhancement/$', apis.FinalReleasedEnhancement.as_view()),

    url(r'^api/upgrid/user/released_enhancement/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.FinalReleasedEnhancement.as_view()),
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

    # Get Whoops reports by customerprogram object_id +++
    url(r'^api/upgrid/whoops_reports/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.WhoopsReportsAPI.as_view()),
    url(r'^api/upgrid/(?P<client_id>[0-9a-fA-F\-]+)/whoops_reports/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.WhoopsReportsAPI.as_view()),
    
    # Get Enhancement reports by customerprogram object_id / 
    url(r'^api/upgrid/enhancement_reports/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.EnhancementReportsAPI.as_view()),
    url(r'^api/upgrid/(?P<client_id>[0-9a-fA-F\-]+)/enhancement_reports/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.EnhancementReportsAPI.as_view()),
    # Put change confirmation status of a enhancement report.

    url(r'^api/upgrid/enhancement_reports/$', apis.EnhancementReportsAPI.as_view()),

    # Post generate whoops reports share link. Post Param: univcustomer_program_id
    url(r'^api/upgrid/whoops_reports/shared/$', apis.ShareWhoopsReports.as_view(),),
    # Get  get whoops reports through shared link.
    url(r'^api/upgrid/whoops_reports/shared/(?P<object_id>[0-9a-zA-Z\-]+)/(?P<token>[0-9a-z\-]+)/$', apis.ShareWhoopsReports.as_view(),),

    # Post generate enhancement reports share link. Post Param: univcustomer_program_id
    url(r'^api/upgrid/enhancement_reports/shared/$', apis.ShareEnhancementReports.as_view(),),
    # Get  getenhancement reports through shared link.
    url(r'^api/upgrid/enhancement_reports/shared/(?P<object_id>[0-9a-zA-Z\-]+)/(?P<token>[0-9a-z\-]+)/$', apis.ShareEnhancementReports.as_view(),),
 

    # ------------------------------------Account Manager APIs-----------------------------------
    
    # Check if the login user is manager. GET request
    url(r'^api/upgrid/accountmanager/is_manager/$', apis.IsAccountManager.as_view()),

    # Get account manager's information and client_list under him.   GET request
    url(r'^api/upgrid/accountmanager/$', apis.AccountManager.as_view()),

    # Get client detail infomation of a specific client by id.  GET :param  client_id/  POST create client
    url(r'^api/upgrid/accountmanager/client/(?P<object_id>[0-9a-fA-F\-]+)/$', apis.Client.as_view()),

    url(r'^api/upgrid/accountmanager/client/$', apis.Client.as_view()),


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

]
