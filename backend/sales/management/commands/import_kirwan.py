import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.db import transaction
from brands.models import Brand
from accounts.models import Account
from sales.models import Product, Sale, Invoice
from decimal import Decimal, InvalidOperation
from datetime import datetime
import re


class Command(BaseCommand):
    help = 'Import sales data from the Kirwan format'

    def handle(self, *args, **kwargs):
        folder_path = 'files/kirwan/'
        files = [f for f in os.listdir(folder_path) if f.endswith('.xlsx') or f.endswith('.csv')]

        # Get or create the 'Kirwan' brand
        kirwan_brand, _ = Brand.objects.get_or_create(name='Kirwan')

        # Process each file
        for file_name in files:
            file_path = os.path.join(folder_path, file_name)
            self.stdout.write(f"Processing file: {file_name}")
            try:
                if file_name.endswith('.xlsx'):
                    data = pd.read_excel(file_path, engine='openpyxl')
                elif file_name.endswith('.csv'):
                    data = pd.read_csv(file_path)
                else:
                    continue  # Skip if not .xlsx or .csv

                # Process the file data
                self.import_data(data, kirwan_brand)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing file {file_name}: {e}"))

    @transaction.atomic
    def import_data(self, data, kirwan_brand):
        """
        Import data from the provided DataFrame into the respective models using get_or_create.
        Handles missing data and invalid decimal conversions gracefully.
        """

        for index, row in data.iterrows():
            try:
                # Skip rows with missing critical fields (Customer and Item)
                if pd.isna(row.get('Customer')) or pd.isna(row.get('Item')):
                    self.stdout.write(self.style.WARNING(f"Skipping row {index} due to missing 'Customer' or 'Item'"))
                    continue

                # Clean the account name
                cleaned_name = self.clean_account_name(row['Name'])

                # Get or create the customer account
                account = self.get_or_update_account(
                    customer_number=row['Customer'],
                    customer_name=cleaned_name,
                    address=row.get('Address [2]', ''),
                    city=row.get('Address [3]', ''),
                    zip_code=row.get('Postal/ZIP', ''),
                    phone_number=row.get('Phone', '')
                )

                # Get or create the product
                product, _ = Product.objects.get_or_create(
                    product_code=row['Item'],
                    defaults={
                        'product_description': row['Description'],
                        'brand': kirwan_brand
                    }
                )

                # Get or create the invoice
                invoice, _ = Invoice.objects.get_or_create(
                    invoice_number=row['Invoice'],
                    defaults={
                        'invoice_date': pd.to_datetime(row['Invoice Date'], errors='coerce'),
                        'customer_po': row.get('Cust PO', ''),
                        'account': account,
                    }
                )

                # Handle decimal conversions with error handling
                quantity_invoiced = self.parse_decimal(row.get('Qty Invoiced', 0), 'Qty Invoiced', index)
                sell_price = self.parse_decimal(row.get('Price', 0), 'Price', index)
                commission_amount = self.parse_decimal(row.get('Commission Earned', 0), 'Commission Earned', index)
                commission_percentage = self.parse_decimal(row.get('Slsp Comm Base', 0), 'Slsp Comm Base', index)

                # Get or create the sale entry
                Sale.objects.get_or_create(
                    invoice=invoice,
                    product=product,
                    customer=account,
                    defaults={
                        'quantity_invoiced': quantity_invoiced,
                        'sell_price': sell_price,
                        'commission_amount': commission_amount,
                        'commission_percentage': commission_percentage,
                        'ship_to_city': row.get('Address [3]', ''),
                        'ship_to_postal_code': row.get('Postal/ZIP', ''),
                        'sale_date': pd.to_datetime(row['Invoice Date'], errors='coerce')
                    }
                )

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error importing row {index}: {e}"))

    def get_or_update_account(self, customer_number, customer_name, address, city, zip_code, phone_number):
        """
        Fetch or create an Account, updating only missing fields.
        """
        # Try to find the account by customer_number
        account = Account.objects.filter(customer_number=customer_number).first()

        # If no account is found by customer_number, search by customer_name
        if not account:
            account = Account.objects.filter(name=customer_name).first()

        if not account:
            # If no account exists, create a new one
            account = Account.objects.create(
                customer_number=customer_number,
                name=customer_name,
                address=address,
                city=city,
                zip_code=zip_code,
                phone_number=phone_number
            )
        else:
            # Update missing fields only
            if not account.address and address:
                account.address = address
            if not account.city and city:
                account.city = city
            if not account.zip_code and zip_code:
                account.zip_code = zip_code
            if not account.phone_number and phone_number:
                account.phone_number = phone_number
            account.save()

        return account

    def parse_decimal(self, value, field_name, index):
        """Helper function to parse decimal values with error handling."""
        try:
            return Decimal(value)
        except InvalidOperation:
            self.stdout.write(self.style.WARNING(f"Invalid '{field_name}' value in row {index}, setting to 0"))
            return Decimal(0)

    def clean_account_name(self, name):
        """
        Cleans and formats account names by converting them to title case and removing periods/commas.
        """
        # Remove periods and commas from the name
        cleaned_name = name.replace('.', '').replace(',', '')

        # Convert to title case (capitalizes the first letter of each word)
        return cleaned_name.title()
