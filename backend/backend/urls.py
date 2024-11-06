from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import health_check

urlpatterns = [
    path('marathon/admin/', admin.site.urls),
    path('marathon/api/users/', include('users.urls')),  
    path('marathon/api/', include('accounts.urls')),
    path('marathon/api/', include('sales.urls')),
    path('marathon/api/', include('reps.urls')),
    
    # JWT Authentication
    path('marathon/api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('marathon/api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Health Check
    path('marathon/api/health/', health_check.health_check, name='health_check'),
]

# Serve static and media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
