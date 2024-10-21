from pathlib import Path
from datetime import timedelta
import os

from django.middleware.security import SecurityMiddleware



# Base directory path
BASE_DIR = Path(__file__).resolve().parent.parent

# Secret key
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'your-dev-secret-key')

ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

# Set debug based on the environment
DEBUG = ENVIRONMENT == 'development'


SECURE_CROSS_ORIGIN_OPENER_POLICY = None


if ENVIRONMENT == 'production':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DJANGO_DB_NAME', 'marathon'),        # Database name from env
            'USER': os.getenv('DJANGO_DB_USER', 'awc'),             # User from env
            'PASSWORD': os.getenv('DJANGO_DB_PASSWORD', 'Starbury03'),  # Password from env
            'HOST': os.getenv('DJANGO_DB_HOST', 'db'),              # Host from env
            'PORT': '5432',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'marathon',        # Local Postgres database
            'USER': 'awc',
            'PASSWORD': 'Starbury03',
            'HOST': 'localhost',       # Local Postgres server
            'PORT': '5432',
        }
    }




# Installed apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'blog',
    'rest_framework_simplejwt.token_blacklist',  # Blacklisting JWT tokens
    'accounts',
    'brands',
    'reps',
    'sales',
    'users',
]

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

# URL configuration
ROOT_URLCONF = 'backend.urls'

# Media settings
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

# WSGI application
WSGI_APPLICATION = 'backend.wsgi.application'


# Custom user model
AUTH_USER_MODEL = 'users.UserProfile'


# REST framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

# JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

if ENVIRONMENT == 'production':
    CSRF_TRUSTED_ORIGINS = [
        'https://admwyn.com',
        'https://www.admwyn.com'
    ]


# CORS settings: Allow specific origins for production and localhost for development
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://admwyn.com',
]

CSRF_TRUSTED_ORIGINS = [
    'http://137.184.223.198',
    'http://localhost:5173',
    'https://admwyn.com',  # If you later switch to a domain
]


if ENVIRONMENT == 'production':
    CORS_ALLOWED_ORIGINS += [
        'https://137.184.223.198:5173',
        'https://admwyn.com',
        'https://www.admwyn.com'
    ]


CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = ['http://localhost:5173']

if ENVIRONMENT == 'production':
    CSRF_TRUSTED_ORIGINS += ['http://admwyn.com']

# Password validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Language and timezone settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

# Static files settings
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Default auto field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Allowed hosts: dynamically set based on environment
if ENVIRONMENT == 'production':
    ALLOWED_HOSTS = ['137.184.223.198', 'admwyn.com', 'www.admwyn.com']

else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1']