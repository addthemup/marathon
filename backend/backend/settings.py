from pathlib import Path
from datetime import timedelta
import os

# Base directory path
BASE_DIR = Path(__file__).resolve().parent.parent

# Secret key
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

# Raise error if SECRET_KEY is not provided in production
if not SECRET_KEY and os.getenv('ENVIRONMENT') == 'production':
    raise ValueError("SECRET_KEY is not set in production!")

ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

# Set debug based on the environment
DEBUG = ENVIRONMENT == 'development'

SECURE_CROSS_ORIGIN_OPENER_POLICY = None

# Database configuration based on environment
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DJANGO_DB_NAME', 'marathon'),  # Default for local dev
        'USER': os.getenv('DJANGO_DB_USER', 'awc'),
        'PASSWORD': os.getenv('DJANGO_DB_PASSWORD', 'Starbury03'),
        'HOST': os.getenv('DJANGO_DB_HOST', 'localhost' if ENVIRONMENT == 'development' else 'db'),
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
    'whitenoise.runserver_nostatic',  # Add whitenoise to handle static files in dev
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

# CORS settings
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://admwyn.com',
]

if ENVIRONMENT == 'production':
    CORS_ALLOWED_ORIGINS += [
        'https://137.184.223.198',
        'https://www.admwyn.com'
    ]

CORS_ALLOW_CREDENTIALS = True

# CSRF trusted origins
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'https://admwyn.com',
    'http://137.184.223.198',
    'https://www.admwyn.com',
]

# Password validators
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Language and timezone settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]

# Default auto field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Allowed hosts
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

if ENVIRONMENT == 'production':
    ALLOWED_HOSTS += ['137.184.223.198', 'admwyn.com', 'www.admwyn.com']

# Additional security settings for production
if ENVIRONMENT == 'production':
    SECURE_SSL_REDIRECT = True  # Ensure requests are redirected to HTTPS
    SECURE_HSTS_SECONDS = 31536000  # Enforce HTTPS for a year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'  # Prevent clickjacking
