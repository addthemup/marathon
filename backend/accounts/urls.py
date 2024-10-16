from django.urls import path
from . import views

urlpatterns = [
    # Account URLs
    path('accounts/', views.AccountListCreateView.as_view(), name='account-list-create'),
    path('accounts/<int:pk>/', views.AccountDetailView.as_view(), name='account-detail'),
    path('accounts/<int:pk>/sales-rep/', views.UpdateSalesRepView.as_view(), name='update-sales-rep'),
    path('accounts/<int:pk>/sales-invoice/', views.AccountSalesInvoiceView.as_view(), name='account-sales-invoice'),

    # RootAccount URLs
    path('root-accounts/', views.RootAccountListCreateView.as_view(), name='root-account-list-create'),
    path('root-accounts/<int:pk>/', views.RootAccountDetailView.as_view(), name='root-account-detail'),
    path('root-accounts/<int:pk>/sales-invoice/', views.RootAccountSalesInvoiceView.as_view(), name='root-account-sales-invoice'),

    # BranchAccount URLs
    path('branch-accounts/', views.BranchAccountListCreateView.as_view(), name='branch-account-list-create'),
    path('branch-accounts/<int:pk>/', views.BranchAccountDetailView.as_view(), name='branch-account-detail'),
    path('branch-accounts/<int:pk>/sales-invoice/', views.BranchAccountSalesInvoiceView.as_view(), name='branch-account-sales-invoice'),
]
