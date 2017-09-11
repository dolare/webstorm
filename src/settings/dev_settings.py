from .base_settings import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "192.168.56.101",
    "192.168.1.108",
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
        'level': 'DEBUG',
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'django_log': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'tmp/django.log',
            'formatter': 'full'
        },
        'app_log': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'tmp/application.log',
            'formatter': 'full'
        },
        'service_log': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'tmp/service.log',
            'formatter': 'jsonentry'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'django_log'],
        },
        'py.warnings': {
            'handlers': ['console', 'app_log'],
        },
        'app': {
            'handlers': ['console', 'app_log'],
        },
        'service': {
            'handlers': ['service_log'],
        },
    }
}


#databas settings
upgridAdmin = None
ceebAdmin = None

try:
    db_pass = os.environ["DB_PASS"]
except KeyError:
    print("Error: environment variable DB_PASS must be set.")
    exit(1)

try:
    upgridAdmin = os.environ["upgridAdmin"]
except KeyError:
    print('upgridAdmin == null')
    upgridAdmin = None


try:
    ceebAdmin = os.environ["ceebAdmin"]
except KeyError:
    print('ceebAdmin == null')
    ceebAdmin = None

try:
    ceebdev = os.environ["ceebdev"]
except KeyError:
    ceebdev = None

if not upgridAdmin == None:
    print('upgridAdmin')
    DATABASES = {  
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'ceeb',
            'HOST': 'test-ceeb.czaefnaupx0d.us-east-1.rds.amazonaws.com',
            'PORT': '8443',
            'USER': 'upgridadmin',
            'PASSWORD': upgridAdmin,
            },
    }
elif not ceebAdmin == None and upgridAdmin == None:
    print('ceebdAdmin')
    DATABASES = {  
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'ceeb',
            'HOST': 'test-ceeb.czaefnaupx0d.us-east-1.rds.amazonaws.com',
            'PORT': '8443',
            'USER': 'ceebadmin',
            'PASSWORD': ceebAdmin,
            },
    }
elif ceebdev is not None:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'ceebdev',
            'HOST': 'localhost',
            'PORT': '',
            'USER': 'localuser',
            'PASSWORD': ceebdev,
            },
    }
else:
    DATABASES = {  
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'upgriddemo',
            'HOST': 'localhost',
            'PORT': '',
            'USER': 'localuser',
            'PASSWORD': db_pass,
            },
    }


REST_FRAMEWORK_DOCS = {
    'HIDE_DOCS': False
}
