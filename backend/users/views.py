from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import UserProfile
from .serializers import UserProfileSerializer


# User Registration View
class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Generate JWT tokens for the newly registered user
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User Profile View (Retrieve & Update)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # Retrieve user profile
    def get(self, request, pk):
        user = get_object_or_404(UserProfile, pk=pk)
        if request.user != user:
            return Response({'error': 'You do not have permission to view this profile.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    # Update user profile
    def put(self, request, pk):
        user = get_object_or_404(UserProfile, pk=pk)
        if request.user != user:
            return Response({'error': 'You do not have permission to update this profile.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# JWT Login View
class UserLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    # You can override the serializer_class if you need to customize the token payload.
    # But we'll use the default TokenObtainPairSerializer for now.


# JWT Token Refresh View
class TokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]


# Logout View (Token Blacklist)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
