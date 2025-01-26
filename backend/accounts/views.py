from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import serializers


User = get_user_model()

# Define a serializer for the request data
class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=30, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
class RegisterView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response("User successfully registered"),
            400: openapi.Response("Bad Request"),
        },
    )
    def post(self, request):
        email = request.data.get("email")
        first_name = request.data.get("first_name")
        password = request.data.get("password")

        if not email or not first_name or not password:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=email,
            first_name=first_name,
            password=password,
            username=email,
        )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )

# Define a serializer for the login view
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)
    
class LoginView(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={
            200: openapi.Response("User successfully logged in"),
            400: openapi.Response("Bad Request"),
        },
    )
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user using email as the username
        user = authenticate(request, username=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FetchAuthenticatedUserView(APIView):
    permission_classes = (IsAuthenticated,)  # Ensures only authenticated users can access this view

    def get(self, request):
        # Access the currently authenticated user
        user = request.user

        # Serialize and return the user data
        return Response(
            {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
            },
            status=status.HTTP_200_OK,
        )