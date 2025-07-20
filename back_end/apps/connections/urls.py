from django.urls import path
from connections.views import (
    GetSuggestedFarmersView,
    SendConnectionRequestView,
    GetSentConnectionRequestsView,
    CancelConnectionRequestView,
    ReceivedConnectionRequestsView,
    AcceptConnectionRequestAPIView,
    RejectConnectionRequestView,
    GetMyConnectionView,
    BlockUserView,
    GetBlockedUsersView,
    UnblockUserView,
)

urlpatterns = [
    # Suggested farmers for the user to connect
    path('get-suggested-farmers/', GetSuggestedFarmersView.as_view(), name='get-suggested-farmers'),

    # Sent requests
    path('send-connection-request/', SendConnectionRequestView.as_view(), name='send-request'),
    path('get-sent-requests/', GetSentConnectionRequestsView.as_view(), name='get-sent-requests'),
    path('cancel-request/<int:pk>/', CancelConnectionRequestView.as_view(), name='cancel-request'),

    # Received requests
    path('received-connection-request/', ReceivedConnectionRequestsView.as_view(), name='received-requests'),
    path('accept-connection-request/<int:pk>/', AcceptConnectionRequestAPIView.as_view(), name='accept-connection'),
    path('reject-connection-request/<int:request_id>/', RejectConnectionRequestView.as_view(), name='reject-connection-request'),

    # My connections
    path('get-my-connections/', GetMyConnectionView.as_view(), name='get-my-connections'),

    # Block/unblock users
    path('block-user/', BlockUserView.as_view(), name='block-user'),
    path('get-blocked-users/', GetBlockedUsersView.as_view(), name='get-blocked-users'),
    path('unblock-user/', UnblockUserView.as_view(), name='unblock-user'),
]
