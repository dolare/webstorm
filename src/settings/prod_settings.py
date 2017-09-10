
from .base_settings import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ceeb#&urrmc4ye=tac(z)-sn%z*3w__pj=v@rb!v$b*xkgudab@4@pceeb'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "upgrid-env.us-east-1.elasticbeanstalk.com",
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'jsonentry': {
            'format': '-' * 40 + '\n%(message)s',
        },
        'simple': {
            'format': '[%(asctime)s] - %(levelname)s : %(message)s',
        },
        'full': {
            'format': '[%(asctime)s] - %(levelname)s - %(name)s [P%(process)d]: %(message)s',
        },
    },
    'root': {
        'level': 'INFO',
    },
    'handlers': {
        'django_log': {
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'class': 'logging.FileHandler',
            'filename': '/var/log/app/django.log',
            'formatter': 'full'
        },
        'app_log': {
            'level': os.getenv('APP_LOG_LEVEL', 'INFO'),
            'class': 'logging.FileHandler',
            'filename': '/var/log/app/application.log',
            'formatter': 'full'
        },
        'service_log': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/var/log/app/service.log',
            'formatter': 'jsonentry'
        },
        'audit_log': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/var/log/app/audit.log',
            'formatter': 'full'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['django_log'],
        },
        'py.warnings': {
            'handlers': ['app_log'],
        },
        'app': {
            'handlers': ['app_log'],
        },
        'service': {
            'handlers': ['service_log'],
        },
        'audit': {
            'handlers': ['audit_log'],
        },
    }
}


# security settings
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
#SECURE_SSL_REDIRECT=True
#SESSION_COOKIE_SECURE = True
#CSRF_COOKIE_SECURE = True
#CSRF_COOKIE_HTTPONLY = True
X_FRAME_OPTIONS = 'DENY'

# database settings
# init db connection
try:
    db_host = os.environ["DB_HOST"]
    db_port = os.environ["DB_PORT"]
    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASS"]
except KeyError:
    print("Error: environment variable DB_HOST, DB_PORT, DB_USER, and DB_PASS must be set.")
    exit(1)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'ceeb',
        'HOST': db_host,
        'PORT': db_port,
        'USER': db_user,
        'PASSWORD': db_pass,
    }
}

