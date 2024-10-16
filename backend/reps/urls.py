from django.urls import path
from .views import SalesRepListCreateView, SalesRepDetailView

urlpatterns = [
    path('reps/', SalesRepListCreateView.as_view(), name='sales-rep-list-create'),
    path('reps/<int:pk>/', SalesRepDetailView.as_view(), name='sales-rep-detail'),

]
