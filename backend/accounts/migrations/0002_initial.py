# Generated by Django 5.1.2 on 2024-11-06 05:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
        ('reps', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='sales_rep',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='accounts', to='reps.salesrep'),
        ),
        migrations.AddField(
            model_name='branchaccount',
            name='accounts',
            field=models.ManyToManyField(related_name='branch_accounts', to='accounts.account'),
        ),
        migrations.AddField(
            model_name='branchaccount',
            name='sales_rep',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='branch_accounts', to='reps.salesrep'),
        ),
        migrations.AddField(
            model_name='rootaccount',
            name='branch_accounts',
            field=models.ManyToManyField(related_name='root_accounts', to='accounts.branchaccount'),
        ),
        migrations.AddField(
            model_name='rootaccount',
            name='sales_rep',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='root_accounts', to='reps.salesrep'),
        ),
    ]