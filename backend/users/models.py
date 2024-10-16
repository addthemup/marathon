from django.db import models
from django.contrib.auth.models import AbstractUser

class UserProfile(AbstractUser):
    # Extending Django's built-in user model

    # Extra fields for user profile
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    pronouns = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    zip = models.CharField(max_length=10, blank=True, null=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)


    # Override the groups and user_permissions fields to prevent clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='userprofile_set',  # Changed related name
        blank=True,
        help_text='The groups this user belongs to.'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='userprofile_set',  # Changed related name
        blank=True,
        help_text='Specific permissions for this user.'
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
