from django.db import models
from users.models import UserProfile  # Assuming this is your custom user model

class SalesRep(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)  # Link to the user model
    code = models.CharField(max_length=10, unique=True)  # Unique sales rep code
    profile_pic = models.ImageField(upload_to='sales_reps/profile_pics/', null=True, blank=True)  # Profile picture
    role = models.CharField(max_length=50, null=True, blank=True)  # Optional role field (e.g., "Manager", "Field Rep")
    region = models.CharField(max_length=100, null=True, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.code})"

    class Meta:
        verbose_name = "Sales Representative"
        verbose_name_plural = "Sales Representatives"
        ordering = ['user__last_name']


class SalesRepZipCode(models.Model):
    sales_rep = models.ForeignKey(SalesRep, related_name='zip_codes', on_delete=models.CASCADE)  # Link to SalesRep
    zip_code = models.CharField(max_length=10)  # Store the zip code

    def __str__(self):
        return f"{self.sales_rep.user.first_name} {self.sales_rep.user.last_name} - {self.zip_code}"

    class Meta:
        unique_together = ['sales_rep', 'zip_code']  # Ensure each ZIP code is unique for each rep
