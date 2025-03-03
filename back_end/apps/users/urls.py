from django.urls import path 
from .views import RegisterView,VerifyOTPView,LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('logout/',LogoutView.as_view(),name='logout')
]
