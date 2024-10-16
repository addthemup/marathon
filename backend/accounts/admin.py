from django.contrib import admin
from .models import Account, RootAccount, BranchAccount  # Import BranchAccount
from sales.models import Invoice

# Define an inline admin descriptor for Invoice model
class InvoiceInline(admin.TabularInline):
    model = Invoice
    fields = ['invoice_date', 'invoice_number', 'customer_po', 'sales_rep', 'account']
    extra = 0  # Do not display extra empty fields
    readonly_fields = ['invoice_date', 'invoice_number', 'customer_po', 'sales_rep']  # Make these fields readonly

    def has_add_permission(self, request, obj):
        return False  # Prevent adding invoices from the Account page

    def has_change_permission(self, request, obj=None):
        return False  # Prevent editing invoices from the Account page


# Register the Account admin and include the Invoice inline
class AccountAdmin(admin.ModelAdmin):
    list_display = ['name', 'customer_number', 'address', 'city', 'state', 'zip_code']
    search_fields = ['name', 'customer_number']
    list_filter = ['state']
    
    # Include Invoice inlines
    inlines = [InvoiceInline]


# Admin for RootAccount
class RootAccountAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'state', 'sales_rep', 'root_category']  # Added root_category field
    search_fields = ['name']
    list_filter = ['state', 'root_category']  # Added filter by root_category
    filter_horizontal = ['branch_accounts']  # Changed from 'accounts' to 'branch_accounts'

    fieldsets = (
        (None, {
            'fields': ('name', 'logo', 'address', 'city', 'state', 'zip_code', 'phone_number', 'email', 'sales_rep', 'root_category')  # Added root_category
        }),
        ('Person of Contact', {
            'fields': ('person_of_contact', 'poc_phone_number', 'poc_email'),
            'classes': ('collapse',),
        }),
        ('Related Branch Accounts', {  # Changed 'Related Accounts' to 'Related Branch Accounts'
            'fields': ('branch_accounts',),  # Updated to 'branch_accounts' from 'accounts'
        }),
    )


# Admin for BranchAccount
class BranchAccountAdmin(admin.ModelAdmin):
    # Display name, address, city, state, and zip code in the list view
    list_display = ['name', 'address', 'city', 'state', 'zip_code', 'sales_rep']
    search_fields = ['name']  # Enable search by branch account name
    list_filter = ['state']  # Enable filtering by state
    filter_horizontal = ['accounts']  # Add horizontal filter for related accounts

    fieldsets = (
        (None, {
            'fields': ('name', 'logo', 'address', 'city', 'state', 'zip_code', 'phone_number', 'email', 'sales_rep')
        }),
        ('Person of Contact', {
            'fields': ('person_of_contact', 'poc_phone_number', 'poc_email'),
            'classes': ('collapse',),
        }),
        ('Related Accounts', {
            'fields': ('accounts',),
        }),
    )

    class Media:
        js = (
            'js/branch_account_admin.js',  # Path to the JS file
        )


# Register Account, RootAccount, and BranchAccount admins
admin.site.register(Account, AccountAdmin)
admin.site.register(RootAccount, RootAccountAdmin)
admin.site.register(BranchAccount, BranchAccountAdmin)
