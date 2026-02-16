from django.contrib.auth.models import AbstractUser

"""
class CustomUserAdmin(UserAdmin):
    # Add your custom fields to the fieldsets
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('bio',)}),
    )

admin.site.register(User, CustomUserAdmin)
"""


class User(AbstractUser):
    """
    Custom User model that inherits from AbstractUser.
    Currently, it has the same fields as the default User:
    username, first_name, last_name, email, password, etc.
    """
    pass