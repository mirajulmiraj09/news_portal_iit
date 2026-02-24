from django.urls import path,include
from accounts.views import RegisterView, LoginView, ProfileView,UserViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")


urlpatterns = [
    path("", include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("me/", ProfileView.as_view()),
    
]