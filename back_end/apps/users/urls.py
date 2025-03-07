from django.urls import path,include
from .views import RegisterView,VerifyOTPView,LogoutView
from .views import GoogleAuthCallbackView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('logout/',LogoutView.as_view(),name='logout'),

    #for google based authentication : Google OAuth Login
    path("auth/callback/", GoogleAuthCallbackView.as_view(), name="google_callback"),

]
