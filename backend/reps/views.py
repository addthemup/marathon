from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import SalesRep
from .serializers import SalesRepSerializer
from accounts.models import BranchAccount, Account
from sales.models import Invoice
from accounts.serializers import BranchAccountSerializer, InvoiceSerializer
from django.db.models import Sum
from collections import defaultdict
from datetime import datetime

class SalesRepListCreateView(generics.ListCreateAPIView):
    queryset = SalesRep.objects.all()
    serializer_class = SalesRepSerializer

class SalesRepDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SalesRep.objects.all()
    serializer_class = SalesRepSerializer

    def retrieve(self, request, *args, **kwargs):
        # Retrieve the SalesRep instance
        instance = self.get_object()

        # Fetch all BranchAccounts related to the SalesRep
        branch_accounts = BranchAccount.objects.filter(sales_rep=instance)

        # Prepare the response data
        response_data = {
            "sales_rep": SalesRepSerializer(instance).data,
            "branch_accounts": [],
            "monthly_gross_sales": defaultdict(float)  # For storing monthly gross sales
        }

        for branch_account in branch_accounts:
            # For each BranchAccount, fetch related Accounts
            accounts = branch_account.accounts.all()

            # Fetch all Invoices related to the accounts under this BranchAccount
            invoices = Invoice.objects.filter(account__in=accounts)

            # Calculate gross sales for each branch account
            gross_sales = Sale.objects.filter(invoice__in=invoices).aggregate(total_sales=Sum('sell_price'))['total_sales'] or 0

            # Append branch account info
            response_data["branch_accounts"].append({
                "branch_account": BranchAccountSerializer(branch_account).data,
                "gross_sales": gross_sales,
                "invoice_count": invoices.count()
            })

            # Calculate monthly gross sales
            monthly_sales = invoices.values('invoice_date').annotate(
                monthly_gross_sales=Sum('sales__sell_price')  # Sum of sales for each invoice
            )
            
            # Organize monthly sales by year and month
            for entry in monthly_sales:
                invoice_date = entry['invoice_date']
                if invoice_date:
                    month_year = invoice_date.strftime('%Y-%m')  # Format as 'YYYY-MM'
                    response_data['monthly_gross_sales'][month_year] += entry['monthly_gross_sales'] or 0

        # Convert defaultdict to a normal dict for serialization
        response_data['monthly_gross_sales'] = dict(response_data['monthly_gross_sales'])

        return Response(response_data, status=status.HTTP_200_OK)