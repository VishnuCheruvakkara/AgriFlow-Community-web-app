from django.urls import path
from .views import RegisterView,VerifyOTPView,LogoutView,LoginView,AdminLoginView
from .views import GoogleAuthCallbackView,RefreshTokenView,ResendOTPView
from .views import ForgotPasswordView,ForgotPasswordOTPVerifyView,ForgotPasswordSetNewView


urlpatterns = [
    ############### Authentication urls
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('logout/',LogoutView.as_view(),name='logout'),
    path('login/',LoginView.as_view(),name='login'),
    #==============Admin Login ===============
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    #resend OTP 
    path('resend-otp/',ResendOTPView.as_view(),name='resend_otp'),

    ############### forget password urls
    path('forgot-password/',ForgotPasswordView.as_view(),name='forgot-password'),
    path('forgot-password-otp-verification/',ForgotPasswordOTPVerifyView.as_view(),name='forgot-password-otp-verification'),
    path('forgot-password-set-new-password/',ForgotPasswordSetNewView.as_view(),name='forgot-password-set-new'),
    ############### Other urls 
    #for google based authentication : Google OAuth Login
    path("auth/callback/", GoogleAuthCallbackView.as_view(), name="google_callback"),
    #for refrsh and access token controlling with axios interceptors.
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
]
