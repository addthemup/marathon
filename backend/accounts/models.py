from django.db import models
from reps.models import SalesRep  # Import SalesRep model


# Account model
class Account(models.Model):
    name = models.CharField(max_length=255)  # Customer name
    customer_number = models.CharField(max_length=50, unique=True)  # Unique customer number
    logo = models.ImageField(upload_to='accounts/logos/', null=True, blank=True)  # Upload for logo
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    # ForeignKey to SalesRep
    sales_rep = models.ForeignKey(SalesRep, on_delete=models.SET_NULL, null=True, blank=True, related_name='accounts')

    # Person of Contact (POC) details
    person_of_contact = models.CharField(max_length=100, null=True, blank=True)
    poc_phone_number = models.CharField(max_length=20, null=True, blank=True)
    poc_email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.customer_number})"

    class Meta:
        verbose_name = "Account"
        verbose_name_plural = "Accounts"
        ordering = ['name']


# BranchAccount model
class BranchAccount(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Branch account name
    logo = models.ImageField(upload_to='branch_accounts/logos/', null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    # Many-to-Many relationship with Account
    accounts = models.ManyToManyField(Account, related_name='branch_accounts')

    # ForeignKey to SalesRep (optional)
    sales_rep = models.ForeignKey(SalesRep, on_delete=models.SET_NULL, null=True, blank=True, related_name='branch_accounts')

    # Person of Contact (POC) details
    person_of_contact = models.CharField(max_length=100, null=True, blank=True)
    poc_phone_number = models.CharField(max_length=20, null=True, blank=True)
    poc_email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Branch Account"
        verbose_name_plural = "Branch Accounts"
        ordering = ['name']


# RootAccount model
class RootAccount(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Root account name
    logo = models.ImageField(upload_to='root_accounts/logos/', null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    # ForeignKey to SalesRep (optional)
    sales_rep = models.ForeignKey(SalesRep, on_delete=models.SET_NULL, null=True, blank=True, related_name='root_accounts')

    # Person of Contact (POC) details
    person_of_contact = models.CharField(max_length=100, null=True, blank=True)
    poc_phone_number = models.CharField(max_length=20, null=True, blank=True)
    poc_email = models.EmailField(null=True, blank=True)

    # ForeignKey to BranchAccount instead of ManyToManyField to Account
    branch_accounts = models.ManyToManyField(BranchAccount, related_name='root_accounts')

    # New field for root account categorization
    root_category = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Root Account"
        verbose_name_plural = "Root Accounts"
        ordering = ['name']
