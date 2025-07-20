from django.urls import path
from events.views import (
    GetCommunityForCreateEvent, CommunityEventCreateAPIView, GetAllCommunityEventsView,
    UserCreatedEventsView, CommunityEventUpdateAPIView, DeleteCommunityEventView,
    JoinEventAPIView, EnrolledEventsView, EventEnrollmentHistoryAPIView,
    MarkEventAsCompletedView, MarkEventAsCancelledView, AdminEventListAPIView,
    CommunityEventDetailView, ToggleEventDeleteStatusView
)

urlpatterns = [
    # User-side event actions
    path('get-community-create-event/', GetCommunityForCreateEvent.as_view(), name='get-community-create-event'),
    path('create-new-event/', CommunityEventCreateAPIView.as_view(), name='create-event'),
    path('get-all-events/', GetAllCommunityEventsView.as_view(), name='get_all_events'),
    path('created-events-by-user/', UserCreatedEventsView.as_view(), name='created-events-by-user'),
    path('edit-event/<int:pk>/', CommunityEventUpdateAPIView.as_view(), name='event-update'),
    path('delete-event/<int:pk>/', DeleteCommunityEventView.as_view(), name='delete-community-event'),
    path('join-to-event/', JoinEventAPIView.as_view(), name='join-event'),
    path('get-enrolled-events/', EnrolledEventsView.as_view(), name='get-enrolled-events'),
    path('get-event-enrollment-history/', EventEnrollmentHistoryAPIView.as_view(), name='event-enrollment-history'),
    path('mark-as-completed/<int:event_id>/', MarkEventAsCompletedView.as_view(), name='mark-event-as-completed'),
    path('mark-as-cancelled/<int:event_id>/', MarkEventAsCancelledView.as_view(), name='mark-event-as-cancelled'),

    # Admin-side event management
    path('admin/get-all-event/', AdminEventListAPIView.as_view(), name='admin-get-all-event'),
    path('admin/get-event-details/<int:id>/', CommunityEventDetailView.as_view(), name='admin-event-detail'),
    path('admin/toggle-delete-status/<int:pk>/', ToggleEventDeleteStatusView.as_view(), name='toggle_event_delete_status'),
]
