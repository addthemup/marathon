import os
import pandas as pd
from django.core.management.base import BaseCommand
from sales.models import Sale, Invoice, Product, Category
from accounts.models import Account
from reps.models import SalesRep
from users.models import UserProfile  # Assuming this is your user model
from django.db import transaction
from brands.models import Brand  # Assuming Brand is imported to handle product linkage

class Command(BaseCommand):
    help = 'Import sales data from the grace format'

    def handle(self, *args, **kwargs):
        folder_path = 'files/grace/'
        files = [f for f in os.listdir(folder_path) if f.endswith('.xlsx') or f.endswith('.csv')]

        # Get or create the 'Grace' brand
        grace_brand, _ = Brand.objects.get_or_create(name='Grace')

        # Loop through each file in the folder
        for file_name in files:
            file_path = os.path.join(folder_path, file_name)
            self.stdout.write(f"Processing file: {file_name}")
            
            # Load the Excel or CSV file
            if file_name.endswith('.xlsx'):
                df = pd.read_excel(file_path)
            else:
                df = pd.read_csv(file_path)

            # Find the row where 'Invoice Date' appears and skip preceding rows
            start_row = self.find_start_row(df)
            if start_row is not None:
                df = df.iloc[start_row:].reset_index(drop=True)  # Skip irrelevant rows and reset index

                # Set the new headers from the row containing 'Invoice Date'
                df.columns = df.iloc[0]  # Assign the header row
                df = df.drop(0).reset_index(drop=True)  # Drop the header row itself

                # Ensure that only the necessary columns are renamed
                try:
                    expected_columns = ['Invoice Date', 'Sales Rep', 'Sub Rep', 'Customer Order', 'Customer ID', 'Customer Name', 
                                        'City', 'State', 'ZIP', 'Country', 'Invoice Number', 'Invoice Line', 'Part ID', 'Product', 
                                        'Reference', 'Invoice Quantity', 'Invoice Amount', 'Comm Percentage', 'Commission Due']

                    # Ensure we're only renaming the columns that exist in the file
                    df = df.rename(columns=lambda x: x.strip())  # Remove leading/trailing spaces
                    df = df[expected_columns]  # Filter only the expected columns
                    df.columns = ['invoice_date', 'sales_rep', 'sub_rep', 'customer_order', 'customer_id', 'customer_name', 
                                  'city', 'state', 'zip', 'country', 'invoice_number', 'invoice_line', 'part_id', 'product', 
                                  'reference', 'invoice_quantity', 'invoice_amount', 'comm_percentage', 'commission_due']
                except KeyError as e:
                    self.stdout.write(f"Error: Missing expected columns. {e}")
                    continue  # Skip this file and move to the next
                
                # Process the data
                self.import_data(df, grace_brand)
            else:
                self.stdout.write(f"No 'Invoice Date' column found in {file_name}")

    def find_start_row(self, df):
        # Loop through the DataFrame to find the row where 'Invoice Date' appears in any column
        for i, row in df.iterrows():
            if 'Invoice Date' in row.values:  # If any cell contains 'Invoice Date'
                return i
        return None  # Return None if 'Invoice Date' is not found

    def clean_name(self, name):
        """ Helper function to remove periods, commas, and capitalize each word. """
        if isinstance(name, str):
            return name.replace('.', '').replace(',', '').title()  # Remove periods and commas, capitalize each word
        return None  # Handle NaN or None

    def clean_category(self, product_name):
        """ Helper function to clean the category name by removing the 'G-' prefix and capitalizing the words. """
        if product_name and product_name.startswith('G-'):
            return product_name[2:].capitalize()  # Remove 'G-' and capitalize
        return product_name.capitalize() if product_name else product_name

    def clean_reference(self, reference, part_id):
        """ Helper function to remove Part ID from the Reference if it exists and clean up leading/trailing characters. """
        if part_id in reference:
            cleaned_reference = reference.replace(part_id, '').strip()  # Remove the part ID and strip spaces
        else:
            cleaned_reference = reference.strip()
        
        # Remove leading dashes or spaces that might remain after cleaning
        if cleaned_reference.startswith('-'):
            cleaned_reference = cleaned_reference.lstrip('-').strip()
        
        return cleaned_reference

    def import_data(self, df, grace_brand):
        for index, row in df.iterrows():
            with transaction.atomic():
                try:
                    # Skip rows where 'Product' is 'ZZ'
                    if row['product'] == 'ZZ':
                        self.stdout.write(f"Row {index + 1} skipped: 'ZZ' found in 'Product'")
                        continue
                    
                    # Ensure 'customer_id' and 'invoice_number' are present
                    if pd.isnull(row['customer_id']) or pd.isnull(row['invoice_number']):
                        self.stdout.write(f"Row {index + 1} skipped due to missing 'Customer ID' or 'Invoice Number'")
                        continue

                    # Capitalize the first letter of each word in the customer name and remove periods and commas
                    formatted_customer_name = self.clean_name(row['customer_name'])

                    # Get or create Account
                    account, _ = Account.objects.get_or_create(
                        customer_number=row['customer_id'], 
                        defaults={
                            'name': formatted_customer_name,
                            'city': row['city'],
                            'state': row['state'],
                            'zip_code': row['zip'],
                        }
                    )
                    
                    # Get or create SalesRep linked to UserProfile using Sub Rep
                    sub_rep_name = self.clean_name(row['sub_rep'])

                    # If there's no Sub Rep, we'll leave sales_rep as None
                    if sub_rep_name:
                        email = f"{sub_rep_name.lower().replace(' ', '_')}@example.com"  # Assign a placeholder email if necessary
                        
                        # Check if a UserProfile with this email or username exists
                        user = UserProfile.objects.filter(email=email).first()
                        if not user:
                            user, created = UserProfile.objects.get_or_create(
                                username=sub_rep_name.lower().replace(' ', '_'),  # Lowercase username, replace spaces
                                defaults={'first_name': sub_rep_name, 'email': email}  # Assign dummy email if necessary
                            )
                        
                        # Get or create SalesRep linked to the user
                        sales_rep, _ = SalesRep.objects.get_or_create(
                            user=user,
                            defaults={'code': sub_rep_name}  # Store 'Sub Rep' as the sales rep code
                        )
                    else:
                        # No sub_rep found, leave sales_rep as None
                        sales_rep = None

                    # Get or create Invoice
                    invoice, _ = Invoice.objects.get_or_create(
                        invoice_number=row['invoice_number'],
                        defaults={
                            'invoice_date': row['invoice_date'],
                            'sales_rep': sales_rep,  # May be None if there's no sub_rep
                            'account': account,
                        }
                    )

                    # Clean the 'Product' column by removing 'G-' prefix and converting to proper case
                    cleaned_product_name = self.clean_category(row['product'])

                    # Get or create Product Category using the cleaned 'Product' column
                    category, _ = Category.objects.get_or_create(name=cleaned_product_name)

                    # Clean the 'Reference' column by removing the 'Part ID' if it's found within the reference text
                    cleaned_reference = self.clean_reference(row['reference'], row['part_id'])

                    # Get or create Product and link it to the 'Grace' brand and 'Category'
                    product, _ = Product.objects.get_or_create(
                        product_code=row['part_id'],
                        defaults={
                            'product_description': cleaned_reference,  # Use the cleaned 'Reference' for product description
                            'sku_code': row.get('sku_code', ''),
                            'brand': grace_brand,  # Automatically assign 'Grace' as the brand
                            'category': category,  # Link the product to the category created from 'Product' column
                        }
                    )

                    # Check if Sale exists to prevent duplicates
                    sale_exists = Sale.objects.filter(
                        invoice=invoice, product=product
                    ).exists()

                    if sale_exists:
                        self.stdout.write(f"Row {index + 1} skipped: Sale already exists for product {row['part_id']} on invoice {row['invoice_number']}")
                        continue

                    # Create Sale
                    Sale.objects.create(
                        invoice=invoice,
                        customer=account,
                        product=product,
                        quantity_sold=row['invoice_quantity'],
                        sell_price=row['invoice_amount'],
                        commission_percentage=row['comm_percentage'],
                        commission_amount=row['commission_due'],
                    )
                except Exception as e:
                    self.stdout.write(f"Row {index + 1} skipped due to error: {e}")
