from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    'admwyn.com', 'www.admwyn.com', '137.184.223.198', 'api.137.184.223.198'
]

CORS_ALLOWED_ORIGINS = [
    'https://admwyn.com',
    'https://www.admwyn.com',
    'https://api.admwyn.com',
]

SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}
