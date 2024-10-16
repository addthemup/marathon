import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.db import transaction
from brands.models import Brand
from accounts.models import Account
from sales.models import Product, Sale, Invoice
from decimal import Decimal, InvalidOperation
from datetime import datetime


class Command(BaseCommand):
    help = 'Import sales data from the Hemostasis format'

    def handle(self, *args, **kwargs):
        folder_path = 'files/hemostasis/'  # Directory for Hemostasis files
        files = [f for f in os.listdir(folder_path) if f.endswith('.xlsx') or f.endswith('.csv')]

        # Get or create the 'Hemostasis' brand
        hemostasis_brand, _ = Brand.objects.get_or_create(name='Hemostasis')

        # Process each file
        for file_name in files:
            file_path = os.path.join(folder_path, file_name)
            self.stdout.write(f"Processing file: {file_name}")
            try:
                if file_name.endswith('.xlsx'):
                    # Skip first 4 rows to get the actual data
                    data = pd.read_excel(file_path, engine='openpyxl', skiprows=4)
                elif file_name.endswith('.csv'):
                    data = pd.read_csv(file_path, skiprows=4)
                else:
                    continue  # Skip if not .xlsx or .csv

                # Process the file data
                self.import_data(data, hemostasis_brand)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing file {file_name}: {e}"))

    def clean_name(self, name):
        """Helper function to remove periods, commas, and capitalize each word."""
        if not isinstance(name, str):
            return ''
        return name.replace('.', '').replace(',', '').title()

    def format_city_name(self, city):
        """Helper function to capitalize the first letter of a city name."""
        if not isinstance(city, str):
            return ''
        return city.capitalize()

    @transaction.atomic
    def import_data(self, data, brand):
        """Imports data from the dataframe into the relevant models."""
        for index, row in data.iterrows():
            try:
                # Clean and format account name
                customer_name = self.clean_name(row['Customer'])

                # Get or create the Account
                account = self.get_or_update_account(row, customer_name)

                # Get or create the Product
                product, _ = Product.objects.get_or_create(
                    product_code=row['Part'],
                    defaults={
                        'product_description': row['Description'],
                        'brand': brand,
                    }
                )

                # Get or create the Invoice
                invoice, _ = Invoice.objects.get_or_create(
                    invoice_number=row['Order #'],
                    defaults={
                        'invoice_date': self.parse_date(row['Ship Date']),
                        'account': account,
                    }
                )

                # Create the Sale
                try:
                    quantity = int(row['Quantity'])
                    sell_price = Decimal(row['Part Price'])
                    Sale.objects.create(
                        invoice=invoice,
                        customer=account,
                        product=product,
                        quantity_sold=quantity,
                        sell_price=sell_price,
                    )
                except (ValueError, InvalidOperation) as e:
                    self.stdout.write(self.style.ERROR(f"Error with sale data in row {index}: {e}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing row {index}: {e}"))

    def get_or_update_account(self, row, customer_name):
        """
        Fetch or create an Account, updating only missing fields.
        """
        # Try to find the account by customer_number
        account = Account.objects.filter(customer_number=row['Order #']).first()

        # If no account is found by customer_number, search by customer_name
        if not account:
            account = Account.objects.filter(name=customer_name).first()

        if not account:
            # If no account exists, create a new one
            city = self.format_city_name(row['City'])
            account = Account.objects.create(
                customer_number=row['Order #'],
                name=customer_name,
                city=city,
                state=row['State'],
            )
        else:
            # Update only missing fields
            if not account.city and row['City']:
                account.city = self.format_city_name(row['City'])
            if not account.state and row['State']:
                account.state = row['State']
            account.save()

        return account

    def parse_date(self, date_str):
        """Parses date from string to datetime object."""
        try:
            return datetime.strptime(date_str, '%Y-%m-%d')
        except (ValueError, TypeError):
            return None
