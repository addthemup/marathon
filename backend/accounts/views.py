from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Account, RootAccount, BranchAccount
from sales.models import Sale
from django.db.models import Sum, F, DecimalField, ExpressionWrapper, Value
from django.db.models.functions import TruncYear, Coalesce
from .serializers import (
    AccountSerializer,
    RootAccountSerializer,
    BranchAccountSerializer,
    AccountSalesInvoiceSerializer,
    RootAccountSalesInvoiceSerializer,
    BranchAccountSalesInvoiceSerializer
)

# Account Views
class AccountListCreateView(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class AccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

# RootAccount Views
class RootAccountListCreateView(generics.ListCreateAPIView):
    queryset = RootAccount.objects.all()
    serializer_class = RootAccountSerializer

class RootAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RootAccount.objects.all()
    serializer_class = RootAccountSerializer

# BranchAccount Views
class BranchAccountListCreateView(generics.ListCreateAPIView):
    queryset = BranchAccount.objects.all()
    serializer_class = BranchAccountSerializer

class BranchAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BranchAccount.objects.all()
    serializer_class = BranchAccountSerializer

# Update Sales Rep for Account
class UpdateSalesRepView(APIView):

    def put(self, request, pk):
        try:
            account = Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

        sales_rep_id = request.data.get('sales_rep')
        if not sales_rep_id:
            return Response({"error": "No sales rep provided"}, status=status.HTTP_400_BAD_REQUEST)

        account.sales_rep_id = sales_rep_id
        account.save()

        serializer = AccountSerializer(account)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Account Sales Invoice View
class AccountSalesInvoiceView(APIView):

    def get(self, request, pk):
        try:
            account = Account.objects.get(pk=pk)
        except Account.DoesNotExist:
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AccountSalesInvoiceSerializer(account)
        return Response(serializer.data, status=status.HTTP_200_OK)

# RootAccount Sales Invoice View
class RootAccountSalesInvoiceView(APIView):

    def get(self, request, pk):
        try:
            root_account = RootAccount.objects.get(pk=pk)
        except RootAccount.DoesNotExist:
            return Response({"error": "Root account not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RootAccountSalesInvoiceSerializer(root_account)
        return Response(serializer.data, status=status.HTTP_200_OK)

# BranchAccount Sales Invoice View

class BranchAccountSalesInvoiceView(APIView):
    def get(self, request, pk):
        try:
            # Fetch the branch account and prefetch related accounts, invoices, and sales
            branch_account = BranchAccount.objects.prefetch_related(
                'accounts__invoices__sales'
            ).get(pk=pk)
        except BranchAccount.DoesNotExist:
            return Response({"error": "Branch account not found"}, status=404)

        # Fetch all sales for this branch account's associated accounts
        sales = Sale.objects.filter(invoice__account__branch_accounts=branch_account)

        # Calculate the total sales value: sell_price * quantity_invoiced (or quantity_sold if invoiced is null)
        total_sales_value = ExpressionWrapper(
            F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
            output_field=DecimalField()
        )

        # Aggregate sales by year and calculate total gross sales by year
        gross_sales_by_year = sales.annotate(year=TruncYear('invoice__invoice_date')).values('year').annotate(
            total_sales=Sum(total_sales_value)
        ).order_by('year')

        # Calculate total gross sales for the branch account
        total_gross_sum = sales.aggregate(
            total_sum=Sum(total_sales_value)
        )['total_sum'] or 0

        # Serialize the branch account data with custom context
        serializer = BranchAccountSalesInvoiceSerializer(branch_account, context={
            'gross_sales_by_year': gross_sales_by_year,
            'total_gross_sum': total_gross_sum
        })

        return Response(serializer.data, status=200)