from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, F
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from .models import Product, Invoice, Sale
from .serializers import ProductSerializer, InvoiceSerializer, SaleSerializer
from accounts.models import Account
from django.conf import settings

# View for listing and creating products
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# View for retrieving, updating, or deleting a product
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# View for listing and creating invoices
class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer


# View for retrieving, updating, or deleting an invoice
class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer


# View for listing and creating sales
class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer


# View for retrieving, updating, or deleting a sale
class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer


# Monthly sales grouped by brand
class MonthlySalesByBrandView(APIView):
    def get(self, request, *args, **kwargs):
        # Filter sales with valid sell_price, invoice, and product brand
        sales_by_brand = Sale.objects.filter(
            sell_price__isnull=False, 
            invoice__invoice_date__isnull=False, 
            product__brand__isnull=False
        ).annotate(
            month=TruncMonth('invoice__invoice_date')
        ).values(
            'month', 'product__brand__name'
        ).annotate(
            total_sales=Sum('sell_price')
        ).order_by('month', 'product__brand__name')

        # Format the response data
        result = {}
        for sale in sales_by_brand:
            month = sale['month'].strftime('%Y-%m')
            brand_name = sale['product__brand__name']
            total_sales = sale['total_sales']

            # Build the monthly sales data grouped by brand
            if month not in result:
                result[month] = {}
            if brand_name not in result[month]:
                result[month][brand_name] = total_sales
            else:
                result[month][brand_name] += total_sales

        return Response(result)


# View for retrieving top products and top accounts
class TopProductsView(APIView):
    def get(self, request):
        current_date = timezone.now()
        one_year_ago = current_date - timedelta(days=365)
        two_years_ago = current_date - timedelta(days=730)

        # Top products for the last 12 months
        top_products = Sale.objects.filter(
            invoice__invoice_date__gte=one_year_ago
        ).values(
            'product__product_code', 'product__product_description'
        ).annotate(
            total_sales=Sum(F('sell_price') * F('quantity_invoiced'))
        )

        # Previous year's product sales
        previous_sales = Sale.objects.filter(
            invoice__invoice_date__gte=two_years_ago, 
            invoice__invoice_date__lt=one_year_ago
        ).values(
            'product__product_code'
        ).annotate(
            previous_total_sales=Sum(F('sell_price') * F('quantity_invoiced'))
        )

        # Mapping previous sales by product code for easy lookup
        previous_sales_dict = {
            sale['product__product_code']: sale['previous_total_sales'] 
            for sale in previous_sales
        }

        # Adding previous total sales to the top products
        product_data = []
        for product in top_products:
            product_code = product['product__product_code']
            product['previous_total_sales'] = previous_sales_dict.get(product_code, 0)
            product['total_sales'] = product['total_sales'] or 0
            product_data.append(product)

        # Sort and limit the products to top 10
        product_data = sorted(product_data, key=lambda x: x['total_sales'], reverse=True)[:10]

        # Top accounts for the last 12 months
        top_accounts = Sale.objects.filter(
            invoice__invoice_date__gte=one_year_ago
        ).values(
            'customer__name', 'customer__logo', 
            'customer__sales_rep__user__first_name', 
            'customer__sales_rep__user__last_name'
        ).annotate(
            total_sales=Sum(F('sell_price') * F('quantity_invoiced'))
        )

        # Previous year's account sales
        previous_account_sales = Sale.objects.filter(
            invoice__invoice_date__gte=two_years_ago, 
            invoice__invoice_date__lt=one_year_ago
        ).values(
            'customer__name'
        ).annotate(
            previous_total_sales=Sum(F('sell_price') * F('quantity_invoiced'))
        )

        # Mapping previous sales by customer name for easy lookup
        previous_account_sales_dict = {
            sale['customer__name']: sale['previous_total_sales'] 
            for sale in previous_account_sales
        }

        # Adding previous total sales and sales_rep name to the top accounts
        account_data = []
        for account in top_accounts:
            customer_name = account['customer__name']
            account['total_sales'] = account['total_sales'] or 0
            account['previous_total_sales'] = previous_account_sales_dict.get(customer_name, 0)

            # Handle the sales_rep field
            first_name = account.pop('customer__sales_rep__user__first_name', '')
            last_name = account.pop('customer__sales_rep__user__last_name', '')
            account['sales_rep'] = f"{first_name} {last_name}".strip() if first_name or last_name else "Unknown"

            # Construct the full URL for the logo
            logo = account['customer__logo']
            account['logo'] = f"http://127.0.0.1:8000{settings.MEDIA_URL}{logo}" if logo else None

            account_data.append(account)

        # Sort and limit the accounts to top 10
        account_data = sorted(account_data, key=lambda x: x['total_sales'], reverse=True)[:10]

        return Response({
            'top_products': product_data,
            'top_accounts': account_data
        })
