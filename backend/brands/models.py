from django.db import models

class Brand(models.Model):
    name = models.CharField(max_length=255, unique=True)
    website = models.URLField(null=True, blank=True)
    logo = models.ImageField(upload_to='brands/logos/', null=True, blank=True)  # Store brand logos in a dedicated folder
    address = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=10, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Brand"
        verbose_name_plural = "Brands"
        ordering = ['name']
