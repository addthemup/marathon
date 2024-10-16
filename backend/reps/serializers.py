from rest_framework import serializers
from .models import SalesRep, SalesRepZipCode
from users.models import UserProfile
from sales.models import Invoice, Sale
from django.db.models import Sum, F
from collections import defaultdict
from datetime import datetime
from decimal import Decimal 

# Serializer for SalesRepZipCode model
class SalesRepZipCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRepZipCode
        fields = ['zip_code']

# Serializer for UserProfile model
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'email', 'phone', 'pronouns', 'city', 'state', 'zip']

# Serializer for SalesRep model
class SalesRepSerializer(serializers.ModelSerializer):
    zip_codes = SalesRepZipCodeSerializer(many=True)
    full_name = serializers.SerializerMethodField()
    user = UserProfileSerializer()
    profile_pic = serializers.ImageField(required=False)
    role = serializers.CharField(required=False, allow_blank=True)
    branch_accounts = serializers.SerializerMethodField()  # Custom method to get BranchAccounts and summarized invoice data
    top_ten_items_by_volume = serializers.SerializerMethodField()  # Top 10 items by volume
    top_ten_items_by_price = serializers.SerializerMethodField()  # Top 10 items by price
    monthly_gross_sales = serializers.SerializerMethodField()  # Monthly gross sales

    class Meta:
        model = SalesRep
        fields = [
            'id', 'full_name', 'user', 'code', 'region', 'hire_date', 'role', 'profile_pic',
            'zip_codes', 'branch_accounts', 'top_ten_items_by_volume', 'top_ten_items_by_price', 'monthly_gross_sales'
        ]

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_branch_accounts(self, obj):
        branch_accounts = obj.branch_accounts.all()
        branch_accounts_data = []

        for branch_account in branch_accounts:
            accounts = branch_account.accounts.all()

            # Fetch all invoices related to the accounts under this branch
            invoices = Invoice.objects.filter(account__in=accounts)

            # Calculate gross sales and count of invoices for each branch account
            gross_sales = invoices.aggregate(total_sales=Sum('sales__sell_price'))['total_sales'] or 0
            invoice_count = invoices.count()

            # Append summarized branch account data
            branch_accounts_data.append({
                "branch_account": {
                    "id": branch_account.id,
                    "name": branch_account.name,
                    "city": branch_account.city,
                    "state": branch_account.state,
                    "zip_code": branch_account.zip_code
                },
                "gross_sales": gross_sales,  # Total gross sales
                "invoice_count": invoice_count  # Number of invoices
            })

        return branch_accounts_data

    def get_top_ten_items_by_volume(self, obj):
        sales = Sale.objects.filter(invoice__account__branch_accounts__sales_rep=obj)

        top_items_by_volume = sales.values('product__product_code', 'product__product_description').annotate(
            total_quantity=Sum('quantity_sold')
        ).order_by('-total_quantity')[:10]  # Top 10 items by volume

        return [{
            'product_code': item['product__product_code'],
            'product_description': item['product__product_description'],
            'total_quantity_sold': item['total_quantity']
        } for item in top_items_by_volume]

    def get_top_ten_items_by_price(self, obj):
        sales = Sale.objects.filter(invoice__account__branch_accounts__sales_rep=obj)

        top_items_by_price = sales.values('product__product_code', 'product__product_description').annotate(
            total_sales=Sum(F('quantity_sold') * F('sell_price'))
        ).order_by('-total_sales')[:10]  # Top 10 items by price

        return [{
            'product_code': item['product__product_code'],
            'product_description': item['product__product_description'],
            'total_sales': item['total_sales']
        } for item in top_items_by_price]

    def get_monthly_gross_sales(self, obj):
        # Monthly gross sales calculation
        branch_accounts = obj.branch_accounts.all()
        monthly_gross_sales = defaultdict(Decimal)  # Use Decimal to ensure proper precision handling

        for branch_account in branch_accounts:
            accounts = branch_account.accounts.all()
            invoices = Invoice.objects.filter(account__in=accounts)

            # Calculate gross sales per month
            monthly_sales = invoices.values('invoice_date').annotate(
                monthly_gross_sales=Sum('sales__sell_price')
            )

            for entry in monthly_sales:
                invoice_date = entry['invoice_date']
                gross_sales = entry['monthly_gross_sales'] or Decimal(0)  # Ensure gross_sales is a Decimal
                if invoice_date:
                    month_year = invoice_date.strftime('%Y-%m')  # Format as 'YYYY-MM'
                    monthly_gross_sales[month_year] += gross_sales  # Add Decimal to Decimal

        return dict(monthly_gross_sales)  # Convert defaultdict to dict

    def create(self, validated_data):
        zip_codes_data = validated_data.pop('zip_codes', [])
        user_data = validated_data.pop('user')

        profile_pic = validated_data.pop('profile_pic', None)
        role = validated_data.get('role', '')

        # Create UserProfile instance
        user = UserProfile.objects.create(**user_data)

        # Create SalesRep instance and associate the user
        sales_rep = SalesRep.objects.create(user=user, profile_pic=profile_pic, role=role, **validated_data)

        # Create associated ZIP codes
        for zip_code_data in zip_codes_data:
            SalesRepZipCode.objects.create(sales_rep=sales_rep, **zip_code_data)

        return sales_rep

    def update(self, instance, validated_data):
        zip_codes_data = validated_data.pop('zip_codes', [])
        user_data = validated_data.pop('user')

        # Handle profile_pic update
        profile_pic = validated_data.get('profile_pic', instance.profile_pic)
        role = validated_data.get('role', instance.role)

        # Update associated UserProfile instance
        user = instance.user
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.email = user_data.get('email', user.email)
        user.phone = user_data.get('phone', user.phone)
        user.pronouns = user_data.get('pronouns', user.pronouns)
        user.city = user_data.get('city', user.city)
        user.state = user_data.get('state', user.state)
        user.zip = user_data.get('zip', user.zip)
        user.save()

        # Update SalesRep instance
        instance.code = validated_data.get('code', instance.code)
        instance.region = validated_data.get('region', instance.region)
        instance.hire_date = validated_data.get('hire_date', instance.hire_date)
        instance.profile_pic = profile_pic
        instance.role = role
        instance.save()

        # Clear existing ZIP codes and add new ones
        instance.zip_codes.all().delete()
        for zip_code_data in zip_codes_data:
            SalesRepZipCode.objects.create(sales_rep=instance, **zip_code_data)

        return instance


class BranchSalesRepSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = SalesRep
        fields = ['id', 'full_name', 'code', 'region', 'hire_date', 'role', 'profile_pic']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"