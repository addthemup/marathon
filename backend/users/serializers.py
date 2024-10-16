from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)  # Confirm password field

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'first_name', 'last_name', 'pronouns', 'city', 'state', 'zip', 'email', 'phone', 'password', 'password2']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True, 'validators': [UniqueValidator(queryset=UserProfile.objects.all())]},
        }
    
    def validate(self, attrs):
        # Ensure that password and confirm password match
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        # Remove password2 from validated_data since we don't need it for creating the user
        validated_data.pop('password2')

        # Create a new user and hash the password
        user = UserProfile.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            pronouns=validated_data.get('pronouns', ''),
            city=validated_data.get('city', ''),
            state=validated_data.get('state', ''),
            zip=validated_data.get('zip', ''),
            phone=validated_data.get('phone', '')
        )
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        password2 = validated_data.pop('password2', None)

        for key, value in validated_data.items():
            setattr(instance, key, value)

        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
