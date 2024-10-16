from django.urls import path
from .views import (
    ProductListCreateView, ProductDetailView, 
    InvoiceListCreateView, InvoiceDetailView, 
    SaleListCreateView, SaleDetailView, 
    MonthlySalesByBrandView, TopProductsView,
)
from .category_views import (
    CategoryListCreateView, SubCategoryListCreateView, TagListCreateView
)
from .analysis_view import AnalysisView  
from .sales_report_view import SalesReportView
from .dashboard_view import (
    GrossSalesYearlyYTDView, TopTenBranchAccountsYTDView, 
    TopTenSalesRepYTDView, TopBrandsYTDView, MonthlySalesBySalesRepView
)

urlpatterns = [
    # Product URLs
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Invoice URLs
    path('invoices/', InvoiceListCreateView.as_view(), name='invoice-list-create'),
    path('invoices/<int:pk>/', InvoiceDetailView.as_view(), name='invoice-detail'),

    # Sale URLs
    path('sales/', SaleListCreateView.as_view(), name='sale-list-create'),
    path('sales/<int:pk>/', SaleDetailView.as_view(), name='sale-detail'),
    path('sales/monthly_sales_by_brand/', MonthlySalesByBrandView.as_view(), name='monthly-sales-by-brand'),
    path('sales/top-products/', TopProductsView.as_view(), name='top-products'),
    path('sales/report/', SalesReportView.as_view(), name='sales-report'),

    # Category, SubCategory, and Tag URLs
    path('products/categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('products/subcategories/', SubCategoryListCreateView.as_view(), name='subcategory-list-create'),
    path('products/tags/', TagListCreateView.as_view(), name='tag-list-create'),

    # Analysis URL
    path('sales/analysis/', AnalysisView.as_view(), name='sales-analysis'),

    # Dashboard URLs
    path('dashboard/gross-sales/', GrossSalesYearlyYTDView.as_view(), name='gross-sales-yearly-ytd'),
    path('dashboard/top-ten-branch-ytd/', TopTenBranchAccountsYTDView.as_view(), name='top-ten-branch-ytd'),
    path('dashboard/top-ten-sales-rep-ytd/', TopTenSalesRepYTDView.as_view(), name='top-ten-sales-rep-ytd'),
    path('dashboard/top-brands-ytd/', TopBrandsYTDView.as_view(), name='top-brands-ytd'),

    # New Monthly Sales by Sales Rep URL
    path('dashboard/monthly-sales-by-sales-rep/', MonthlySalesBySalesRepView.as_view(), name='monthly-sales-by-sales-rep'),
]
