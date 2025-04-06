from django.urls import path
from .views import RegisterView, VerifyOTPView, LogoutView, LoginView, AdminLoginView, AdminLogoutView
from .views import GoogleAuthCallbackView, RefreshTokenView, ResendOTPView
from .views import ForgotPasswordView, ForgotPasswordOTPVerifyView, ForgotPasswordSetNewView
from .views import LocationAutocompleteView, ProfileUpdateView
from .views import GetUserDataView, GetAllUsersInAdminSideView, AdminRefreshTokenView, UserStatusUpdateView, AdminSideUserDetailView, VerifyAadhaarView,UpdateAadharResubmissionMessageView


urlpatterns = [
    # Authentication urls
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('login/', LoginView.as_view(), name='login'),
    # ==============Admin Login ===============
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    # resend OTP
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
    # =============admin logout ===================
    path('admin/logout/', AdminLogoutView.as_view(), name='admin-logout'),

    # forget password urls
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('forgot-password-otp-verification/', ForgotPasswordOTPVerifyView.as_view(),
         name='forgot-password-otp-verification'),
    path('forgot-password-set-new-password/',
         ForgotPasswordSetNewView.as_view(), name='forgot-password-set-new'),
    # Other urls
    # for google based authentication : Google OAuth Login
    path("auth/callback/", GoogleAuthCallbackView.as_view(), name="google_callback"),
    # for refrsh and access token controlling with axios interceptors.
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    # for admin refresh token handling
    path('admin/token-refresh/', AdminRefreshTokenView.as_view(),
         name='admin_token_refresh'),

    # =============== urls for usersprofile creation ================#
    path("location-autocomplete/", LocationAutocompleteView.as_view(),
         name="location_autocomplete"),
    path('profile-update/', ProfileUpdateView.as_view(), name='profile_update'),

    # ================== get user data =======================#
    path("get-user-data/", GetUserDataView.as_view(), name="get-user-data"),
    path('admin/get-all-users-data/',
         GetAllUsersInAdminSideView.as_view(), name='get-all-users'),
    # ================== Change user status (active or incative) ===================#
    path('change-status/<int:pk>/', UserStatusUpdateView.as_view(),
         name='user-status-update'),
    # ================== User Deatailpage in admin side to fetch perticular user data ========================#
    path('admin/get-user/<int:id>/', AdminSideUserDetailView.as_view(),
         name='admin_get_user_details'),
    # ============= Verify the user aadhar on admin side =======================#
    path('verify-aadhaar/<int:user_id>/',
         VerifyAadhaarView.as_view(), name='verify-aadhaar'),
    # ==============  addhar resubmission message set up admin side ===============#
    path('update-aadhar-resubmission-message/<int:user_id>/', UpdateAadharResubmissionMessageView.as_view(), name='update-aadhar-message'),
]
