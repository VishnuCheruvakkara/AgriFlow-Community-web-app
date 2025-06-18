
import cloudinary
import os
from celery import Celery
from re import A
import sys
from pathlib import Path
import environ
from datetime import timedelta

env = environ.Env()
environ.Env.read_env()



# Build paths inside the project like this: BASE_DIR / 'subdir'.

BASE_DIR = Path(__file__).resolve().parent.parent

env.read_env(os.path.join(BASE_DIR, '.env'))

# To run the intial configuration for cloudinary 
cloudinary.config(
    cloud_name=env("CLOUDINARY_CLOUD_NAME"),
    api_key=env("CLOUDINARY_API_KEY"),
    api_secret=env("CLOUDINARY_API_SECRET"),
    secure=True,
)

# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = env.bool('DEBUG', default=True)

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Application definition

# path to all apps that are inside the common 'apps' folder.
APPS_DIR = BASE_DIR / 'apps'
sys.path.insert(0, str(APPS_DIR))

INSTALLED_APPS = [
    # Third party app setup 
    'channels',
    'jazzmin',
    #Default apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    #====== for cloudinary ======#
    'cloudinary_storage',
    'cloudinary',

    # for google OAuth setup
    'social_django',  # Google OAuth
    'rest_framework.authtoken',
    'dj_rest_auth',  # Authentication package

    # custom apps.
    'users',
    'community',
    'events',
    'notifications',
    'common',
    'connections',
    'products',
    'posts',
    # Django main page (Home) for initial load (optional).
    'Home',
    #Custom app for handle websoket
    'websocket',

]

#=============  Asgi set up ==================#

#Set up for asgi for WebSocket
ASGI_APPLICATION = 'agri_flow.asgi.application'

# Add channel layer backend (for now, use in-memory for dev)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND' : 'channels_redis.core.RedisChannelLayer',
        'CONFIG' : {
            # Caution : Use hte WSL ip address here for the redis (currently redis is running in the wsl environment not in windows)
            "hosts" : [("127.0.0.1",6379)], #Redis default host and port 
        },
    },
}


CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'x-csrftoken',
    'withcredentials',  # <-- Add this line
]


CORS_ALLOW_CREDENTIALS = True
# Cross-origins that allowd with django port 8000
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "ws://localhost:8000",  # WebSocket URL

]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]

# Djanot rest framerword with jwt setup.
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}                                                                                           

#################### JWT Token custom setup. ############################

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),

    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}
# Extra setup for Cookies
# Change to True in production || Required for SameSite=None to work
AUTH_COOKIE_SECURE = True
AUTH_COOKIE_HTTP_ONLY = True  # Prevent JavaScript from accessing the cookie
AUTH_COOKIE_SAMESITE = "None"  # Required for cross-site cookies

###################  Middle ware setup #####################################
MIDDLEWARE = [
    # Third party middleware added.
    'corsheaders.middleware.CorsMiddleware',
    # Django default middleware.
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Google authentication middleware
    'social_django.middleware.SocialAuthExceptionMiddleware',
    # WhiteNoice static file loader 
    "whitenoise.middleware.WhiteNoiseMiddleware",

]

ROOT_URLCONF = 'agri_flow.urls'

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

WSGI_APPLICATION = 'agri_flow.wsgi.application'


# Database structure.

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}


# Password validation.

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

# Custom user configuration when call "get_user_model()" Tis part will triggered.
AUTH_USER_MODEL = 'users.CustomUser'

# Internationalization

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)

STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Setup of django cache for otp storage in temporary to avoid multi user login in single-time.
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1", 
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
        "TIMEOUT": 300,
    }
}

# redis set up for define the define Redis URL globally for custom Redis usage (e.g., in WebSocket consumers)
REDIS_URL = "redis://127.0.0.1:6379/2"

########################### Celery setup ############################ 

CELERY_BROKER_URL = 'redis://localhost:6379/3'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'

########################### smtp (Simple Mail Transfer Protocol) for send generated otp to the user entered email address.  ###########################
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env('EMAIL_PORT')
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS', default=True)
EMAIL_HOST_USER = env('EMAIL_HOST_USER')  # Replace with your Gmail address
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')

############################## django jazzmin setup for better ui for django admin.  #########################

JAZZMIN_SETTINGS = {
    "site_title": "AgriFlow Admin",
    "site_header": "AgriFlow Admin",
    "site_brand": "AgriFlow",
    "welcome_sign": "Welcome to AgriFlow Farmer Community",
    "copyright": "AgriFlow © 2024",
}


#################### google authentication setup  ####################

AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',  # Google OAuth backend
    'django.contrib.auth.backends.ModelBackend',  # Default auth backend
)

GOOGLE_CLIENT_ID = env("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = env("GOOGLE_CLIENT_SECRET")
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ['email', 'profile']

# Allow automatic user creation on OAuth login
SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'social_core.pipeline.user.create_user',  # Automatically create users
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
)

# Login redirect after successful authentication
GOOGLE_REDIRECT_URI = 'http://127.0.0.1:8000/users/auth/callback/'

################### Cloudinary configuration for meadia-files access  ##########################

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': env('CLOUDINARY_API_KEY'),
    'API_SECRET': env('CLOUDINARY_API_SECRET'),
    'SECURE': True,  # Ensures HTTPS for file access
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.RawMediaCloudinaryStorage'

################## Location IQ set up for API key configuration #######################

# Get the API key from the environment variable
LOCATIONIQ_API_KEY = env("LOCATIONIQ_API_KEY")






