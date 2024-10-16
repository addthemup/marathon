
from rest_framework import serializers
from .models import Product, Invoice, Sale, Category, SubCategory, Tag
from django.db.models import Sum, F, DecimalField, Value, Count, Min, Max
from brands.models import Brand
from accounts.models import Account
from reps.models import SalesRep
from datetime import datetime


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']



class SubCategorySerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())  # Link to an existing category

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'category']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    brand = serializers.StringRelatedField()
    category = CategorySerializer(read_only=True)
    sub_category = SubCategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    sub_category_id = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all(), source='sub_category', write_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, source='tags', write_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'product_code', 'product_description', 'brand', 'sku_code',
            'category', 'sub_category', 'tags',
            'category_id', 'sub_category_id', 'tag_ids'
        ]

    def create(self, validated_data):
        category = validated_data.pop('category', None)
        sub_category = validated_data.pop('sub_category', None)
        tags_data = validated_data.pop('tags', [])

        product = Product.objects.create(**validated_data)

        if category:
            product.category = category
        if sub_category:
            product.sub_category = sub_category
        if tags_data:
            product.tags.set(tags_data)

        return product

    def update(self, instance, validated_data):
        category = validated_data.pop('category', None)
        sub_category = validated_data.pop('sub_category', None)
        tags_data = validated_data.pop('tags', None)

        if category:
            instance.category = category
        if sub_category:
            instance.sub_category = sub_category

        if tags_data is not None:
            instance.tags.set(tags_data)

        instance.product_code = validated_data.get('product_code', instance.product_code)
        instance.product_description = validated_data.get('product_description', instance.product_description)
        instance.sku_code = validated_data.get('sku_code', instance.sku_code)
        instance.save()

        return instance
    

class SaleSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  

    class Meta:
        model = Sale
        fields = [
            'id', 'product', 'quantity_sold', 'quantity_invoiced', 'sell_price',
            'commission_percentage', 'commission_amount', 'ship_to_city',
            'ship_to_state', 'ship_to_postal_code', 'sale_date', 'notes'
        ]


class InvoiceSerializer(serializers.ModelSerializer):
    sales = SaleSerializer(many=True, read_only=True)
    account = serializers.StringRelatedField(read_only=True)  
    sales_rep = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_date', 'invoice_number', 'customer_po', 
            'sales_rep', 'account', 'notes', 'sales'
        ]



class SaleSerializer(serializers.ModelSerializer):
    product = ProductSerializer() 

    class Meta:
        model = Sale
        fields = [
            'id', 'product', 'quantity_sold', 'quantity_invoiced', 'sell_price',
            'line_price', 'commission_percentage', 'commission_amount', 
            'ship_to_city', 'ship_to_state', 'ship_to_postal_code', 'sale_date', 'notes'
        ]

    def get_line_price(self, obj):
        quantity = (
            obj.quantity_invoiced if obj.quantity_invoiced and obj.quantity_invoiced > 0
            else obj.quantity_sold if obj.quantity_sold and obj.quantity_sold > 0 else 1
        )
        return float(quantity) * float(obj.sell_price) if obj.sell_price else 0



class AnalysisSerializer(serializers.ModelSerializer):
    product_code = serializers.CharField(source='product.product_code')
    product_description = serializers.CharField(source='product.product_description')
    brand = serializers.CharField(source='product.brand.name')
    category = serializers.CharField(source='product.category.name', allow_null=True)
    sub_category = serializers.CharField(source='product.sub_category.name', allow_null=True)
    tags = serializers.StringRelatedField(source='product.tags', many=True)

    invoice_date = serializers.DateField(source='invoice.invoice_date')
    sales_rep = serializers.SerializerMethodField()
    account = serializers.CharField(source='invoice.account.name')

    root_accounts = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = ['id', 'product_code', 'product_description', 'brand', 'category', 'sub_category', 'tags', 
                  'quantity_sold', 'quantity_invoiced', 'sell_price', 'sale_date', 'invoice_date', 'sales_rep', 
                  'account', 'root_accounts']

    def get_sales_rep(self, obj):
        first_name = obj.invoice.sales_rep.user.first_name if obj.invoice.sales_rep else ''
        last_name = obj.invoice.sales_rep.user.last_name if obj.invoice.sales_rep else ''
        return f"{first_name} {last_name}".strip() or "Unknown"

    def get_root_accounts(self, obj):

        if hasattr(obj.invoice.account, 'branch_accounts'):
            branch_accounts = obj.invoice.account.branch_accounts.all()
            root_accounts = set()
            
            for branch in branch_accounts:
                for root_account in branch.root_accounts.all():
                    root_accounts.add(root_account.name)
                    
            return list(root_accounts)

        return [] 

    def get_time_difference_in_days(self, first_date, second_date):
        """Utility function to handle NoneType date values gracefully."""
        if first_date and second_date:
            return (first_date - second_date).days
        return None

    def get_product_sales_data(self, obj):
        product_sales = Sale.objects.filter(invoice__account=obj.invoice.account).values(
            'product__product_code', 'product__product_description'
        ).annotate(
            total_sales=Sum('sell_price'),
            first_sale=Min('sale_date'),
            last_sale=Max('sale_date'),
            sale_count=Count('id')
        )

        product_reports = []
        for sale in product_sales:
            first_sale = sale['first_sale']
            last_sale = sale['last_sale']
            if first_sale and last_sale:
                time_between_sales = self.get_time_difference_in_days(last_sale, first_sale) / sale['sale_count'] if sale['sale_count'] > 1 else None
                time_since_last = self.get_time_difference_in_days(datetime.now().date(), last_sale)
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