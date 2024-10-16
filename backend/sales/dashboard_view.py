from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, F, DecimalField, ExpressionWrapper, Value
from reps.serializers import BranchSalesRepSerializer
from django.db.models.functions import Coalesce, TruncYear, TruncMonth
from sales.models import Sale
from accounts.models import BranchAccount
from datetime import datetime
from django.utils.timezone import now

# Gross Sales Yearly and YTD (first view)
class GrossSalesYearlyYTDView(APIView):
    def get(self, request):
        sales = Sale.objects.filter(invoice__account__branch_accounts__isnull=False)

        total_sales_value = ExpressionWrapper(
            F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
            output_field=DecimalField()
        )

        current_year = now().year

        # Gross sales by year
        sales_by_year = sales.annotate(
            year=TruncYear('invoice__invoice_date')
        ).values('year').annotate(
            total_sales=Sum(total_sales_value)
        ).order_by('year')

        # YTD sales for the current year
        ytd_sales = sales.filter(invoice__invoice_date__year=current_year).aggregate(
            ytd_total_sales=Sum(total_sales_value)
        )['ytd_total_sales'] or 0

        response_data = {
            'gross_sales_by_year': [
                {'year': entry['year'], 'total_sales': entry['total_sales']} for entry in sales_by_year
            ],
            'year_to_date_sales': ytd_sales
        }

        return Response(response_data, status=status.HTTP_200_OK)

class TopTenBranchAccountsYTDView(APIView):
    def get(self, request):
        current_year = now().year

        # Get all branch accounts and related sales
        sales = Sale.objects.filter(invoice__account__branch_accounts__isnull=False)

        total_sales_value = ExpressionWrapper(
            F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
            output_field=DecimalField()
        )

        # YTD sales per branch account
        branch_ytd_sales = sales.filter(invoice__invoice_date__year=current_year).values(
            'invoice__account__branch_accounts__id', 'invoice__account__branch_accounts__name'
        ).annotate(
            ytd_total_sales=Sum(total_sales_value)
        ).order_by('-ytd_total_sales')[:10]  # Top 10 branch accounts by YTD sales

        # Yearly gross sales for each of the top 10 branch accounts
        top_branch_yearly_sales = []
        for branch in branch_ytd_sales:
            # Get the yearly sales for each branch account
            yearly_sales = sales.filter(invoice__account__branch_accounts=branch['invoice__account__branch_accounts__id']).annotate(
                year=TruncYear('invoice__invoice_date')
            ).values('year').annotate(
                total_sales=Sum(total_sales_value)
            ).order_by('year')

            # Format the year to display only the year part (YYYY)
            formatted_yearly_sales = []
            for entry in yearly_sales:
                year_value = entry['year'].year if entry['year'] else None  # Extract just the year part
                formatted_yearly_sales.append({
                    'year': year_value,  # Year as YYYY (e.g., 2024)
                    'total_sales': entry['total_sales']
                })

            # Get the SalesRep details for the branch account
            branch_account_id = branch['invoice__account__branch_accounts__id']
            branch_account = BranchAccount.objects.get(pk=branch_account_id)
            sales_rep = branch_account.sales_rep

            # Serialize the SalesRep data
            sales_rep_data = None
            if sales_rep:
                sales_rep_data = BranchSalesRepSerializer(sales_rep).data

            # Append the branch account with its formatted yearly sales and sales rep info
            top_branch_yearly_sales.append({
                'branch_account': {
                    'id': branch['invoice__account__branch_accounts__id'],
                    'name': branch['invoice__account__branch_accounts__name'],
                    'ytd_total_sales': branch['ytd_total_sales'],
                    'sales_rep': sales_rep_data  # Include sales rep details
                },
                'yearly_sales': formatted_yearly_sales  # Use formatted yearly sales
            })

        return Response(top_branch_yearly_sales, status=status.HTTP_200_OK)
    

class TopTenSalesRepYTDView(APIView):
    def get(self, request):
        current_year = now().year

        # Get all sales related to branch accounts that have a sales rep
        sales = Sale.objects.filter(invoice__account__branch_accounts__sales_rep__isnull=False)

        # Expression to calculate the total sale value (sell_price * quantity_invoiced or quantity_sold)
        total_sales_value = ExpressionWrapper(
            F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
            output_field=DecimalField()
        )

        # YTD sales per sales rep
        sales_rep_ytd_sales = sales.filter(invoice__invoice_date__year=current_year).values(
            'invoice__account__branch_accounts__sales_rep__id',  # SalesRep ID
            'invoice__account__branch_accounts__sales_rep__user__first_name',  # SalesRep first name
            'invoice__account__branch_accounts__sales_rep__user__last_name',  # SalesRep last name
            'invoice__account__branch_accounts__sales_rep__profile_pic'  # SalesRep profile picture
        ).annotate(
            ytd_total_sales=Sum(total_sales_value)
        ).order_by('-ytd_total_sales')[:10]  # Top 10 sales reps by YTD sales

        # For each sales rep, calculate their yearly sales as well
        top_sales_rep_yearly_sales = []
        for sales_rep in sales_rep_ytd_sales:
            # Get the yearly sales for each sales rep
            yearly_sales = sales.filter(invoice__account__branch_accounts__sales_rep=sales_rep['invoice__account__branch_accounts__sales_rep__id']).annotate(
                year=TruncYear('invoice__invoice_date')
            ).values('year').annotate(
                total_sales=Sum(total_sales_value)
            ).order_by('year')

            # Format the year to display only the year part (YYYY)
            formatted_yearly_sales = []
            for entry in yearly_sales:
                year_value = entry['year'].year if entry['year'] else None  # Extract just the year part
                formatted_yearly_sales.append({
                    'year': year_value,  # Year as YYYY (e.g., 2024)
                    'total_sales': entry['total_sales']
                })

            # Add the sales rep details
            full_name = f"{sales_rep['invoice__account__branch_accounts__sales_rep__user__first_name']} {sales_rep['invoice__account__branch_accounts__sales_rep__user__last_name']}"
            profile_pic = sales_rep['invoice__account__branch_accounts__sales_rep__profile_pic']

            # Append the sales rep data with its formatted yearly sales
            top_sales_rep_yearly_sales.append({
                'sales_rep': {
                    'id': sales_rep['invoice__account__branch_accounts__sales_rep__id'],
                    'full_name': full_name,
                    'profile_pic': profile_pic,
                    'ytd_total_sales': sales_rep['ytd_total_sales']
                },
                'yearly_sales': formatted_yearly_sales  # Use formatted yearly sales
            })

        return Response(top_sales_rep_yearly_sales, status=status.HTTP_200_OK)
    
class TopBrandsYTDView(APIView):
    def get(self, request):
        current_year = now().year

        # Get all sales related to products that have a brand
        sales = Sale.objects.filter(product__brand__isnull=False)

        # Expression to calculate the total sale value (sell_price * quantity_invoiced or quantity_sold)
        total_sales_value = ExpressionWrapper(
            F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
            output_field=DecimalField()
        )

        # YTD sales per brand
        brand_ytd_sales = sales.filter(invoice__invoice_date__year=current_year).values(
            'product__brand__id',  # Brand ID
            'product__brand__name'  # Brand Name
        ).annotate(
            ytd_total_sales=Sum(total_sales_value)
        ).order_by('-ytd_total_sales')[:10]  # Top 10 brands by YTD sales

        # For each brand, calculate their yearly sales as well
        top_brand_yearly_sales = []
        for brand in brand_ytd_sales:
            # Get the yearly sales for each brand
            yearly_sales = sales.filter(product__brand=brand['product__brand__id']).annotate(
                year=TruncYear('invoice__invoice_date')
            ).values('year').annotate(
                total_sales=Sum(total_sales_value)
            ).order_by('year')

            # Format the year to display only the year part (YYYY)
            formatted_yearly_sales = []
            for entry in yearly_sales:
                year_value = entry['year'].year if entry['year'] else None  # Extract just the year part
                formatted_yearly_sales.append({
                    'year': year_value,  # Year as YYYY (e.g., 2024)
                    'total_sales': entry['total_sales']
                })

            # Append the brand data with its formatted yearly sales
            top_brand_yearly_sales.append({
                'brand': {
                    'id': brand['product__brand__id'],
                    'name': brand['product__brand__name'],
                    'ytd_total_sales': brand['ytd_total_sales']
                },
                'yearly_sales': formatted_yearly_sales  # Use formatted yearly sales
            })

        return Response(top_brand_yearly_sales, status=status.HTTP_200_OK)


class MonthlySalesBySalesRepView(APIView):
    def get(self, request):
        # Get all sales related to branch accounts that have a sales rep
        sales = Sale.objects.filter(invoice__account__branch_accounts__sales_rep__isnull=False)

        # Expression to calculate the total sale value (sell_price * quantity_invoiced or quantity_sold)
        total_sales_value = ExpressionWrapper(
            F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
            output_field=DecimalField()
        )

        # Annotate sales by month and year across all sales reps
        monthly_sales = sales.annotate(
            year=TruncYear('invoice__invoice_date'),
            month=TruncMonth('invoice__invoice_date')
        ).values('year', 'month', 'invoice__account__branch_accounts__sales_rep__id').annotate(
            total_sales=Sum(total_sales_value)
        ).filter(month__isnull=False).order_by('year', 'month')

        # Serialize sales by sales rep
        sales_by_rep = {}
        for sale in monthly_sales:
            sales_rep_id = sale['invoice__account__branch_accounts__sales_rep__id']
            
            # Fetch the sales rep object if we don't have it yet
            if sales_rep_id not in sales_by_rep:
                sales_rep_obj = BranchAccount.objects.filter(
                    sales_rep__id=sales_rep_id
                ).first().sales_rep
                
                # Serialize the sales rep object using BranchSalesRepSerializer
                sales_rep_data = BranchSalesRepSerializer(sales_rep_obj).data
                sales_by_rep[sales_rep_id] = {
                    'sales_rep': sales_rep_data,  # Include serialized sales rep data
                    'sales': []
                }

            # Add the sales data (by month and year) to the rep's sales
            sales_by_rep[sales_rep_id]['sales'].append({
                'year': sale['year'].year,
                'month': sale['month'].month,
                'total_sales': sale['total_sales']
            })

        # Return the sales data serialized by sales rep
        return Response(sales_by_rep.values(), status=status.HTTP_200_OK)
