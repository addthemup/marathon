from django.contrib import admin
from .models import Product, Invoice, Sale, Category, SubCategory, Tag

# Inline for displaying sales attached to an invoice
class SaleInline(admin.TabularInline):
    model = Sale
    fields = ('product', 'customer', 'quantity_sold', 'sell_price', 'commission_percentage', 'sale_date')
    extra = 0  # Do not display extra empty rows
    readonly_fields = ('product', 'customer', 'quantity_sold', 'sell_price', 'commission_percentage', 'sale_date')
    can_delete = False  # Prevent deletion of sales from the inline admin

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    search_fields = ('name', 'category__name')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_code', 'product_description', 'brand', 'sku_code', 'category', 'sub_category')
    search_fields = ('product_code', 'product_description', 'brand__name', 'category__name', 'sub_category__name')
    list_filter = ('category', 'sub_category', 'brand')
    filter_horizontal = ('tags',)  # Allow multiple tag selection with a horizontal widget

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'invoice_date', 'sales_rep', 'account', 'notes')
    search_fields = ('invoice_number', 'account__name', 'sales_rep__user__first_name', 'sales_rep__user__last_name')
    list_filter = ('invoice_date', 'sales_rep', 'account')

    # Add the SaleInline to display sales under the invoice
    inlines = [SaleInline]

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('product', 'invoice', 'customer', 'quantity_sold', 'sell_price', 'commission_percentage', 'sale_date')
    search_fields = ('product__product_code', 'invoice__invoice_number', 'customer__name')
    list_filter = ('sale_date', 'commission_percentage', 'product')
