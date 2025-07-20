from django.urls import path
from .views import (
    RegisterView, VerifyOTPView, LogoutView, LoginView,
    AdminLoginView, AdminLogoutView, GoogleAuthCallbackView, RefreshTokenView,
    ResendOTPView, ForgotPasswordView, ForgotPasswordOTPVerifyView,
    ForgotPasswordSetNewView, LocationAutocompleteView, ProfileUpdateView,
    GetUserDataView, GetAllUsersInAdminSideView, AdminRefreshTokenView,
    UserStatusUpdateView, AdminSideUserDetailView, VerifyAadhaarView,
    UpdateAadharResubmissionMessageView, AadhaarResubmissionUpdateView,
    UserProfileView, PrivateChatMessagesView, UpdateUserProfilePictureView,
    UpdateUserBannerImageView, UserProfileUpdateView,GetDashBoardDataView
)

urlpatterns = [
    # User authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Admin authentication
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    path('admin/logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('admin/token-refresh/', AdminRefreshTokenView.as_view(), name='admin_token_refresh'),

    # Forgot password flow
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('forgot-password-otp-verification/', ForgotPasswordOTPVerifyView.as_view(), name='forgot-password-otp-verification'),
    path('forgot-password-set-new-password/', ForgotPasswordSetNewView.as_view(), name='forgot-password-set-new'),

    # OAuth and token handling
    path("auth/callback/", GoogleAuthCallbackView.as_view(), name="google_callback"),
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),

    # Profile management
    path("location-autocomplete/", LocationAutocompleteView.as_view(), name="location_autocomplete"),
    path('profile-update/', ProfileUpdateView.as_view(), name='profile_update'),
    path("edit-profile-details/", UserProfileUpdateView.as_view(), name="edit-profile"),
    path('update-profile-picture/', UpdateUserProfilePictureView.as_view(), name="update-profile-picture"),
    path("update-banner-image/", UpdateUserBannerImageView.as_view(), name="update-banner-image"),

    # User data
    path("get-user-data/", GetUserDataView.as_view(), name="get-user-data"),
    path('admin/get-all-users-data/', GetAllUsersInAdminSideView.as_view(), name='get-all-users'),
    path('admin/get-user/<int:id>/', AdminSideUserDetailView.as_view(), name='admin_get_user_details'),
    path('change-status/<int:pk>/', UserStatusUpdateView.as_view(), name='user-status-update'),

    # Aadhaar verification
    path('verify-aadhaar/<int:user_id>/', VerifyAadhaarView.as_view(), name='verify-aadhaar'),
    path('update-aadhar-resubmission-message/<int:user_id>/', UpdateAadharResubmissionMessageView.as_view(), name='update-aadhar-message'),
    path('aadhaar-resubmission/', AadhaarResubmissionUpdateView.as_view(), name='aadhaar-resubmission'),

    # Profile view (public/user dashboard)
    path('get-user-profile-data/<int:user_id>/', UserProfileView.as_view(), name='get_user_profile_data'),

    # Private chat
    path('get-private-chat-messages/<int:receiver_id>/', PrivateChatMessagesView.as_view(), name='get-private-messages'),

    # Fetch admin dash-board datas 
    path('get-dash-board-data/', GetDashBoardDataView.as_view(), name='get-dash-board-data'),
]
