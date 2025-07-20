from django.urls import path
from .views import (
    ConnectionAcceptedNotificationView,
    MarkNotificationReadView,
    PrivateMessageNotificationView,
    MarkNotificationAsReadView,
    GeneralNotificationListView,
    SoftDeleteNotificationView
)

urlpatterns = [
    path("get-connection-accpeted/", ConnectionAcceptedNotificationView.as_view(), name="get-connection-accepted"),
    path('mark-read/<int:pk>/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
    path('get-private-messages/', PrivateMessageNotificationView.as_view(), name="get-saved-private-messages"),
    path('mark-as-read-notifications/<int:pk>/', MarkNotificationAsReadView.as_view(), name='mark-notification-as-read'),
    path('get-general-notifications/', GeneralNotificationListView.as_view(), name='get-general-notifications'),
    path('soft-delete-notifications/<int:pk>/', SoftDeleteNotificationView.as_view(), name='soft-delete-notification'),
]
