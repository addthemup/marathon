from rest_framework import serializers
from .models import Account, RootAccount, BranchAccount
from reps.serializers import SalesRepSerializer
from reps.serializers import BranchSalesRepSerializer
from sales.serializers import ProductSerializer
from sales.models import Invoice, Sale
from django.db.models import Sum, F, DecimalField, Value, ExpressionWrapper
from django.db.models.functions import Coalesce, TruncYear
from django.db.models import Min, Max, Count
from datetime import datetime
from django.utils.timezone import now 


# Serializer for Sale model (to calculate line_price)
class SaleSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    line_price = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = ['id', 'sale_date', 'product', 'quantity_sold', 'quantity_invoiced', 'sell_price', 'line_price']

    def get_line_price(self, obj):
        quantity = (
            obj.quantity_invoiced if obj.quantity_invoiced and obj.quantity_invoiced > 0
            else obj.quantity_sold if obj.quantity_sold and obj.quantity_sold > 0 else 1
        )
        return float(quantity) * float(obj.sell_price) if obj.sell_price else 0


# Serializer for Invoice model (to calculate invoice_sum)
class InvoiceSerializer(serializers.ModelSerializer):
    sales = SaleSerializer(many=True, read_only=True)
    invoice_sum = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = ['invoice_sum', 'id', 'invoice_date', 'invoice_number', 'customer_po', 'sales_rep', 'account', 'sales']

    def get_invoice_sum(self, obj):
        sales = Sale.objects.filter(invoice=obj).annotate(
            line_price=ExpressionWrapper(
                F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
                output_field=DecimalField()
            )
        )
        return sales.aggregate(total=Sum('line_price', output_field=DecimalField()))['total'] or 0


# Serializer for Account model
class AccountSerializer(serializers.ModelSerializer):
    total_invoices = serializers.SerializerMethodField()
    gross_sum = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = [
            'id', 'name', 'customer_number', 'logo', 'address', 'city', 'state', 'zip_code',
            'phone_number', 'email', 'person_of_contact', 'poc_phone_number', 'poc_email',
            'total_invoices', 'gross_sum'
        ]

    def get_total_invoices(self, obj):
        return Invoice.objects.filter(account=obj).count()

    def get_gross_sum(self, obj):
        gross_sum = Sale.objects.filter(invoice__account=obj).annotate(
            line_price=ExpressionWrapper(
                F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
                output_field=DecimalField()
            )
        ).aggregate(total=Sum('line_price', output_field=DecimalField()))['total'] or 0
        return gross_sum


# Serializer for Account-level product sales report
class AccountProductSalesSerializer(serializers.Serializer):
    product_code = serializers.CharField(source='product.product_code')
    product_description = serializers.CharField(source='product.product_description')
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_time_between_sales = serializers.FloatField()
    time_since_last_purchase = serializers.IntegerField()


# Serializer for Account sales invoice (detailed)
class AccountSalesInvoiceSerializer(serializers.ModelSerializer):
    sales_rep = BranchSalesRepSerializer(read_only=False)
    total_invoices = serializers.SerializerMethodField()
    gross_sum = serializers.SerializerMethodField()
    average_time_between_sales = serializers.SerializerMethodField()
    time_since_last_purchase = serializers.SerializerMethodField()
    invoices = InvoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Account
        fields = [
            'id', 'name', 'customer_number', 'logo', 'address', 'city', 'state', 'zip_code',
            'phone_number', 'email', 'sales_rep', 'person_of_contact', 'poc_phone_number', 'poc_email',
            'total_invoices', 'gross_sum', 'average_time_between_sales', 'time_since_last_purchase', 
            'invoices'
        ]

    def get_total_invoices(self, obj):
        return Invoice.objects.filter(account=obj).count()

    def get_gross_sum(self, obj):
        gross_sum = Sale.objects.filter(invoice__account=obj).annotate(
            line_price=ExpressionWrapper(
                F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
                output_field=DecimalField()
            )
        ).aggregate(total=Sum('line_price', output_field=DecimalField()))['total'] or 0
        return gross_sum

    def get_average_time_between_sales(self, obj):
        # Fetch sale dates, fallback to invoice dates if sale_date is missing
        sales_dates = Sale.objects.filter(invoice__account=obj).values_list('sale_date', 'invoice__invoice_date').order_by('sale_date', 'invoice__invoice_date')
        
        # Extract the valid dates, prefer sale_date, fallback to invoice_date
        dates = [sale_date or invoice_date for sale_date, invoice_date in sales_dates if sale_date or invoice_date]

        # We need at least 2 dates to calculate time differences
        if len(dates) < 2:
            return None

        # Calculate time differences between consecutive sales
        time_differences = [(dates[i + 1] - dates[i]).days for i in range(len(dates) - 1)]
        
        # Return the average of the time differences
        return sum(time_differences) / len(time_differences) if time_differences else None

    def get_time_since_last_purchase(self, obj):
        # Fetch the most recent sale_date, fallback to invoice_date if sale_date is missing
        last_sale_date = Sale.objects.filter(invoice__account=obj).values_list('sale_date', 'invoice__invoice_date').order_by('-sale_date', '-invoice__invoice_date').first()

        # Use sale_date if available, otherwise invoice_date
        last_date = last_sale_date[0] or last_sale_date[1] if last_sale_date else None

        # If we have a valid date, calculate the time since the last purchase
        if last_date:
            return (now().date() - last_date).days
        return None

    def get_product_sales(self, obj):
        product_sales = Sale.objects.filter(invoice__account=obj).values('product__product_code', 'product__product_description') \
            .annotate(
                total_sales=ExpressionWrapper(
                    Sum(F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1))),
                    output_field=DecimalField()
                ),
                first_sale=Min('sale_date'),
                last_sale=Max('sale_date'),
                sale_count=Count('id')
            )
        product_reports = []
        for sale in product_sales:
            first_sale = sale['first_sale']
            last_sale = sale['last_sale']
            if first_sale and last_sale:
                time_between_sales = (last_sale - first_sale).days / sale['sale_count'] if sale['sale_count'] > 1 else None
                time_since_last = (now().date() - last_sale).days
            else:
                time_between_sales = None
                time_since_last = None
            product_reports.append({
                'product_code': sale['product__product_code'],
                'product_description': sale['product__product_description'],
                'total_sales': sale['total_sales'],
                'average_time_between_sales': time_between_sales,
                'time_since_last_purchase': time_since_last
            })
        return product_reports


# Serializer for BranchAccount sales invoice (detailed)
class BranchAccountSalesInvoiceSerializer(serializers.ModelSerializer):
    sales_rep = BranchSalesRepSerializer(read_only=True)  # Expanded sales rep data
    accounts_details = AccountSalesInvoiceSerializer(source='accounts', many=True, read_only=True)  # Expanded sales data

    gross_sales_by_year = serializers.SerializerMethodField()
    total_gross_sum = serializers.SerializerMethodField()
    branch_invoices = serializers.SerializerMethodField()  # New field for total invoices in the branch

    class Meta:
        model = BranchAccount
        fields = [
            'id', 'name', 'logo', 'address', 'city', 'state', 'zip_code', 'phone_number', 'email',
            'sales_rep', 'person_of_contact', 'poc_phone_number', 'poc_email',
            'gross_sales_by_year', 'total_gross_sum', 'branch_invoices', 'accounts_details'  # Added branch_invoices
        ]

    def get_gross_sales_by_year(self, obj):
        # Aggregating gross sales by year across all related accounts
        sales_by_year = (
            Sale.objects.filter(invoice__account__branch_accounts=obj)
            .annotate(year=TruncYear('invoice__invoice_date'))  # Group by year
            .values('year')  # Get each year
            .annotate(total_sales=Sum(ExpressionWrapper(
                F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
                output_field=DecimalField()
            )))
            .order_by('year')
        )

        return [{'year': sale['year'], 'total_sales': sale['total_sales']} for sale in sales_by_year]

    def get_total_gross_sum(self, obj):
        # Sum the gross_sum of all accounts under this branch
        total_gross_sum = Sale.objects.filter(invoice__account__branch_accounts=obj).annotate(
            line_price=ExpressionWrapper(
                F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
                output_field=DecimalField()
            )
        ).aggregate(total=Sum('line_price'))['total'] or 0
        return float(total_gross_sum)

    def get_branch_invoices(self, obj):
        # Sum the total number of invoices from all accounts related to this branch account
        return Invoice.objects.filter(account__branch_accounts=obj).count()





# Serializer for RootAccount sales invoice (detailed)
class RootAccountSalesInvoiceSerializer(serializers.ModelSerializer):
    branch_accounts_details = BranchAccountSalesInvoiceSerializer(source='branch_accounts', many=True, read_only=True)

    class Meta:
        model = RootAccount
        fields = ['id', 'name', 'root_category', 'branch_accounts_details']




# Serializer for BranchAccount model
class BranchAccountSerializer(serializers.ModelSerializer):
    accounts_details = AccountSerializer(source='accounts', many=True, read_only=True)
    sales_rep = serializers.SerializerMethodField()
    branch_gross_sum = serializers.SerializerMethodField()  # New field for total gross sum of the branch
    branch_total_invoices = serializers.SerializerMethodField()  # New field for total invoices of the branch

    class Meta:
        model = BranchAccount
        fields = [
            'id', 'name', 'logo', 'address', 'city', 'state', 'zip_code',
            'phone_number', 'email', 'sales_rep','branch_total_invoices' , 'person_of_contact',
            'poc_phone_number', 'poc_email', 'accounts', 'accounts_details',
            'branch_gross_sum',  # Add new fields
        ]

    def get_sales_rep(self, obj):
        # Only return the sales rep details without the associated branch accounts to avoid redundancy
        if obj.sales_rep:
            return {
                'id': obj.sales_rep.id,
                'full_name': f"{obj.sales_rep.user.first_name} {obj.sales_rep.user.last_name}",
                'email': obj.sales_rep.user.email,
                'region': obj.sales_rep.region,
                'role': obj.sales_rep.role,
                'profile_pic': obj.sales_rep.profile_pic.url if obj.sales_rep.profile_pic else None,
            }
        return None

    def get_branch_gross_sum(self, obj):
        # Calculate the sum of gross_sum from all accounts related to this branch account
        gross_sum = Sale.objects.filter(invoice__account__branch_accounts=obj).annotate(
            line_price=ExpressionWrapper(
                F('sell_price') * Coalesce(F('quantity_invoiced'), F('quantity_sold'), Value(1)),
                output_field=DecimalField()
            )
        ).aggregate(total_gross_sum=Sum('line_price'))['total_gross_sum'] or 0
        return float(gross_sum)  # Ensure it's returned as a float

    def get_branch_total_invoices(self, obj):
        # Calculate the total number of invoices from all accounts related to this branch account
        return Invoice.objects.filter(account__branch_accounts=obj).count()



# Serializer for RootAccount model
class RootAccountSerializer(serializers.ModelSerializer):
    branch_accounts = serializers.PrimaryKeyRelatedField(many=True, queryset=BranchAccount.objects.all())
    branch_accounts_details = BranchAccountSerializer(source='branch_accounts', many=True, read_only=True)
    sales_rep = SalesRepSerializer(read_only=True)

    class Meta:
        model = RootAccount
        fields = [
            'id', 'name', 'logo', 'address', 'city', 'state', 'zip_code',
            'phone_number', 'email', 'sales_rep', 'person_of_contact',
            'poc_phone_number', 'poc_email', 'root_category',
            'branch_accounts', 'branch_accounts_details'
        ]


