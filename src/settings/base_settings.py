
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import datetime
# BASE_DIR is parent directory of directory hosting this setting file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'pd2&8hmk$smo2_r3@i_wh2uia&lq36m&phkp=)xpba+p_2bpsi'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    "127.0.0.1",
]


# Application definition

INSTALLED_APPS = (
    # 'django.contrib.admin',   # removed for "adminplus", see below
    'django.contrib.admin.apps.SimpleAdminConfig',  # added for "adminplus", see below
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd party libs
    #'guardian',
    'bootstrap3',
    'adminplus',    # add custom view to admin page, https://github.com/jsocol/django-adminplus
    'rest_framework',
    #'rest_framework.authtoken',
    'rest_framework_docs',
    #'nested_admin',
    # our apps
    'ceeb_program',
    'apps.record_management',
    'apps.upgrid',
)


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

try:
    email_pass = os.environ["EMAIL_PASS"]
    #cc_email = os.environ["CC_EMAIL"]
except KeyError:
    print("Error: environment variable EMAIL_PASS must be set.")
    exit(1)

EMAIL_HOST = 'smtp.1and1.com'
EMAIL_HOST_USER = 'no-reply@upgrid.gridet.com'
EMAIL_HOST_PASSWORD = email_pass
EMAIL_PORT = 587
EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = 'no-reply@upgrid.gridet.com'
SERVER_EMAIL = 'no-reply@upgrid.gridet.com'


REST_FRAMEWORK = {
    
    'DEFAULT_PERMISSION_CLASSES':(
        #'rest_framework.permissions.IsAuthenticatedOrReadOnly',
        'rest_framework.permissions.IsAuthenticated',
        ),
        'DEFAULT_AUTHENTICATION_CLASSES':(
           #'rest_framework.authentication.SessionAuthentication',
           #'rest_framework.authentication.BasicAuthentication',
           #'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
           'apps.upgrid.authentication.JSONWebTokenAuthentication',
            ),
}

REST_FRAMEWORK_DOCS = {
    'HIDE_DOCS': True
}

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend', #default
    'guardian.backends.ObjectPermissionBackend',
    )


MIDDLEWARE_CLASSES = (
    'django.middleware.security.SecurityMiddleware',
    # whitenoise must be above others except SecurityMiddleware
    'whitenoise.middleware.WhiteNoiseMiddleware',   # whitenoise, http://whitenoise.evans.io/
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'wsgi.application'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')  # where "collectstatic" will store artifact to
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static_common'),
)
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=1),
    'JWT_ALLOW_REFRESH': True,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),
}

