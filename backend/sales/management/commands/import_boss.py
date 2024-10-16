import os
import pandas as pd
from django.core.management.base import BaseCommand
from sales.models import Sale, Invoice, Product
from accounts.models import Account
from brands.models import Brand
from django.db import transaction
from datetime import datetime


class Command(BaseCommand):
    help = 'Import sales data from the Boss format'

    def handle(self, *args, **kwargs):
        folder_path = 'files/boss/'
        files = [f for f in os.listdir(folder_path) if f.endswith('.xlsx') or f.endswith('.csv')]

        # Skip hidden system files (like ._ files)
        files = [f for f in files if not f.startswith('._')]

        # Get or create the 'Boss' brand
        boss_brand, _ = Brand.objects.get_or_create(name='Boss')

        # Process each file in the folder
        for file_name in files:
            file_path = os.path.join(folder_path, file_name)
            self.stdout.write(f"Processing file: {file_name}")

            # Load the Excel or CSV file
            try:
                if file_name.endswith('.xlsx'):
                    df = pd.read_excel(file_path, engine='openpyxl')  # Specify the engine explicitly
                else:
                    df = pd.read_csv(file_path)
            except ValueError as e:
                self.stdout.write(f"Error reading file {file_name}: {e}")
                continue  # Skip this file if it can't be read

            # Process the data
            self.process_file(df, boss_brand)

    def process_file(self, df, boss_brand):
        """Process the data from the Excel/CSV file."""
        try:
            expected_columns = ['Inv#', 'Date', 'C#', 'Name', 'CSV', 'Item#', 'Desc', 'Qty', 'Ext Prc', 'Comm', '%']

            df = df.rename(columns=lambda x: x.strip())  # Clean up column names
            df = df[expected_columns]  # Filter only the expected columns
            df.columns = [
                'invoice_number', 'invoice_date', 'customer_number', 'customer_name', 'csv',
                'product_code', 'product_description', 'quantity_sold', 'sell_price', 
                'commission_amount', 'commission_percentage'
            ]
        except KeyError as e:
            self.stdout.write(f"Error: Missing expected columns. {e}")
            return  # Skip file if required columns are missing

        # Import data row by row
        self.import_data(df, boss_brand)

    def import_data(self, df, boss_brand):
        """Import the data into the database."""
        for index, row in df.iterrows():
            with transaction.atomic():
                try:
                    if pd.isnull(row['customer_number']) or pd.isnull(row['invoice_number']):
                        self.stdout.write(f"Row {index + 1} skipped due to missing 'Customer Number' or 'Invoice Number'")
                        continue

                    # Clean customer name and parse city/state/zip from CSV
                    formatted_customer_name = self.clean_name(row['customer_name'])
                    city, state, zip_code = self.parse_csv(row['csv'])

                    if not city or not state or not zip_code:
                        self.stdout.write(f"Row {index + 1} skipped due to invalid 'CSV' format")
                        continue

                    # Fetch or create/update account
                    account = self.get_or_update_account(
                        customer_number=row['customer_number'],
                        customer_name=formatted_customer_name,
                        city=city,
                        state=state,
                        zip_code=zip_code
                    )

                    # Parse and clean the invoice date
                    cleaned_invoice_date = self.clean_date(row['invoice_date'])
                    if not cleaned_invoice_date:
                        self.stdout.write(f"Row {index + 1} skipped due to invalid 'Invoice Date'")
                        continue

                    # Create or fetch Invoice
                    invoice, _ = Invoice.objects.get_or_create(
                        invoice_number=row['invoice_number'],
                        defaults={
                            'invoice_date': cleaned_invoice_date,
                            'sales_rep': None,  # No SalesRep for this format
                            'account': account,
                        }
                    )

                    # Create or fetch Product
                    product, _ = Product.objects.get_or_create(
                        product_code=row['product_code'],
                        defaults={
                            'product_description': row['product_description'],
                            'brand': boss_brand,
                        }
                    )

                    # Prevent duplicate Sale
                    sale_exists = Sale.objects.filter(
                        invoice=invoice, product=product
                    ).exists()

                    if sale_exists:
                        self.stdout.write(f"Row {index + 1} skipped: Sale already exists for product {row['product_code']} on invoice {row['invoice_number']}")
                        continue

                    # Create the Sale record
                    Sale.objects.create(
                        invoice=invoice,
                        customer=account,
                        product=product,
                        quantity_sold=row['quantity_sold'],
                        sell_price=row['sell_price'],
                        commission_percentage=row['commission_percentage'],
                        commission_amount=row['commission_amount'],
                    )
                except Exception as e:
                    self.stdout.write(f"Row {index + 1} skipped due to error: {e}")

    def get_or_update_account(self, customer_number, customer_name, city, state, zip_code):
        """Fetch or create an Account, updating only if fields are empty."""
        # First try to get the account by customer_number
        account = Account.objects.filter(customer_number=customer_number).first()

        # If no account is found by customer_number, search by customer_name
        if not account:
            account = Account.objects.filter(name=customer_name).first()

        # If no account is found, create a new one
        if not account:
            account = Account.objects.create(
                customer_number=customer_number,
                name=customer_name,
                city=city,
                state=state,
                zip_code=zip_code
            )
        else:
            # Update only the missing fields
            if not account.city:
                account.city = city
            if not account.state:
                account.state = state
            if not account.zip_code:
                account.zip_code = zip_code
            account.save()

        return account

    def clean_name(self, name):
        """Clean and format the customer name."""
        if isinstance(name, str):
            cleaned_name = name.replace('.', '').replace(',', '').title()
            if 'Hospital' not in cleaned_name:
                cleaned_name = cleaned_name.replace('Hosp', 'Hospital')
            return cleaned_name
        return None

    def parse_csv(self, csv_value):
        """Parse the CSV field into city, state, and zip."""
        try:
            city, state_zip = csv_value.split(',')
            state_zip_parts = state_zip.strip().split(' ')
            state = ' '.join(state_zip_parts[:-1])
            zip_code = state_zip_parts[-1]
            return city.strip(), state.strip(), zip_code.strip()
        except ValueError:
            return None, None, None  # Return None if parsing fails

    def clean_date(self, date_value):
        """Convert the date value into a valid date format."""
        try:
            if isinstance(date_value, pd.Timestamp):
                return date_value.date()
            elif isinstance(date_value, str):
                try:
                    return datetime.strptime(date_value, '%m/%d/%y').date()  # Handle 'MM/DD/YY'
                except ValueError:
                    return datetime.strptime(date_value, '%m/%d/%Y').date()  # Handle 'MM/DD/YYYY'
            elif isinstance(date_value, (float, int)):
                return pd.to_datetime(date_value, unit='d', origin='1899-12-30').date()
            elif pd.isnull(date_value):
                return None
        except Exception as e:
            self.stdout.write(f"Error parsing date: {e}")
        return None
