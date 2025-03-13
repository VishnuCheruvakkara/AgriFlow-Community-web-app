from django.urls import path
from .views import RegisterView,VerifyOTPView,LogoutView
from .views import GoogleAuthCallbackView,LoginView,RefreshTokenView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('logout/',LogoutView.as_view(),name='logout'),
    path('login/',LoginView.as_view(),name='login'),

    #for google based authentication : Google OAuth Login
    path("auth/callback/", GoogleAuthCallbackView.as_view(), name="google_callback"),

    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
]
