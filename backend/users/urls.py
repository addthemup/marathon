# users/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # User-related endpoints (e.g., registration, profile management)
    path('register/', views.UserRegisterView.as_view(), name='user-register'),  # Registration endpoint
    path('profile/<int:pk>/', views.UserProfileView.as_view(), name='user-profile'),  # User profile management
]
