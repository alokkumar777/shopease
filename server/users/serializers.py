from rest_framework import serializers
from django.contrib.auth import get_user_model

# using get_user_model instead of importing User directly
User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {
            "password": {
                "write_only": True  #? hide the password in API response
            },
        }

    def create(self, validated_data):
        # extract the data user manager's create_user method
        user = User.objects.create_user(
            username = validated_data["username"],
            email = validated_data.get("email"),
            password = validated_data["password"]
        )
        return user



