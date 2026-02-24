from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets

from .models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
)


# ---------------------------
# Helper: Generate JWT tokens
# ---------------------------
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# ---------------------------
# Register View
# ---------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(id=response.data["id"])
        tokens = get_tokens_for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
            }
        )


# ---------------------------
# Login View
# ---------------------------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        tokens = get_tokens_for_user(user)

        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
            }
        )


# ---------------------------
# Profile /me View
# ---------------------------
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True,  # partial update
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser] 