from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import F, Prefetch
from sales.models import Sale
from accounts.models import BranchAccount

class SalesReportView(APIView):
    def get(self, request, *args, **kwargs):
        # Query the sales data with related objects for efficient querying
        sales = Sale.objects.select_related(
            'product', 'invoice', 'invoice__account', 'invoice__sales_rep', 'invoice__sales_rep__user'
        ).prefetch_related(
            'invoice__account__branch_accounts__sales_rep__user'  # Prefetch the BranchAccount Sales Rep data
        )

        # Create the report data
        report_data = []
        for sale in sales:
            # Extract relevant information for each sale
            invoice = sale.invoice
            account = invoice.account
            branch_account = account.branch_accounts.first() if account else None
            sales_rep = branch_account.sales_rep if branch_account else invoice.sales_rep

            # Construct sales rep full name
            if sales_rep:
                full_name = f"{sales_rep.user.first_name} {sales_rep.user.last_name}".strip()
            else:
                full_name = "Unknown"

            # Append the sale data with invoice number included
            report_data.append({
                'account': branch_account.name if branch_account else account.name if account else 'Unknown',
                'invoice_number': invoice.invoice_number if invoice else 'Unknown',  # Add invoice number here
                'sales_rep': full_name,
                'sale_date': sale.sale_date,
                'brand': sale.product.brand.name if sale.product and sale.product.brand else 'Unknown',
                'product_code': sale.product.product_code if sale.product else 'Unknown',
                'product_description': sale.product.product_description if sale.product else 'Unknown',
                'quantity_sold': sale.quantity_sold,
                'quantity_invoiced': sale.quantity_invoiced,
                'sell_price': sale.sell_price,
            })

        return Response(report_data)