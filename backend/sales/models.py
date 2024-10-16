from django.db import models
from brands.models import Brand  # Import from the brands app for linking the product to a brand
from reps.models import SalesRep  # Import from the reps app for linking the sales rep
from accounts.models import Account  # Import from the accounts app for linking the customer account

# Category model
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Category name

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name']


# SubCategory model
class SubCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)  # SubCategory name
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')  # Link to Category

    def __str__(self):
        return f"{self.category.name} - {self.name}"

    class Meta:
        verbose_name = "SubCategory"
        verbose_name_plural = "SubCategories"
        ordering = ['name']


# Tag model
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Tag name

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ['name']


# Product model
class Product(models.Model):
    product_code = models.CharField(max_length=20, null=True, blank=True)  # Product code (Item#)
    product_description = models.CharField(max_length=255, null=True, blank=True)  # Product description
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')  # Foreign key to Brand
    sku_code = models.CharField(max_length=50, null=True, blank=True)  # SKU or product identifier
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')  # Foreign key to Category
    sub_category = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')  # Foreign key to SubCategory
    tags = models.ManyToManyField(Tag, related_name='products', blank=True)  # Many-to-many relation with tags

    def __str__(self):
        return f"{self.product_code} - {self.product_description}"

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ['product_code']


# Invoice model
class Invoice(models.Model):
    invoice_date = models.DateField(null=True, blank=True)  # Date of the invoice
    invoice_number = models.CharField(max_length=50, null=True, blank=True, unique=True)  # Unique Invoice number
    customer_po = models.CharField(max_length=50, null=True, blank=True)  # Customer purchase order number
    sales_rep = models.ForeignKey(SalesRep, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')  # Reference to SalesRep
    account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')  # Reference to Account
    notes = models.TextField(null=True, blank=True)  # Additional notes for flexibility

    def __str__(self):
        return f"Invoice {self.invoice_number} ({self.invoice_date})"

    class Meta:
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"
        ordering = ['-invoice_date']


# Sale model
class Sale(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='sales', on_delete=models.CASCADE, null=True, blank=True)  # Foreign key to Invoice
    customer = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='sales')  # Foreign key to Customer (Account)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='sales')  # Foreign key to Product

    # Quantity and pricing details
    quantity_sold = models.IntegerField(null=True, blank=True)  # Quantity sold
    quantity_invoiced = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Quantity invoiced
    sell_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Sell price (Invoice Amount)

    # Commission details
    commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Commission Percentage
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Commission Due

    # Location details for shipping
    ship_to_city = models.CharField(max_length=100, null=True, blank=True)
    ship_to_state = models.CharField(max_length=50, null=True, blank=True)
    ship_to_postal_code = models.CharField(max_length=10, null=True, blank=True)

    # Dates
    sale_date = models.DateField(null=True, blank=True)
    commission_paid_date = models.DateField(null=True, blank=True)

    notes = models.TextField(null=True, blank=True)  # Additional notes for flexibility

    def __str__(self):
        return f"Sale for {self.product.product_code} on Invoice {self.invoice.invoice_number}"

    class Meta:
        verbose_name = "Sale"
        verbose_name_plural = "Sales"
        ordering = ['-sale_date']
