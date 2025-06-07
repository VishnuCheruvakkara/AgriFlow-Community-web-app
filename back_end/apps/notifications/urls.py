from django.urls import path 
from .views import ConnectionAcceptedNotificationView,MarkNotificationReadView,PrivateMessageNotificationView,MarkNotificationAsReadView,GeneralNotificationListView

urlpatterns = [
    ########################## Notification for connections set up ######################
    #========================== get connection accepted notifications =================================#
    path("get-connection-accpeted/",ConnectionAcceptedNotificationView.as_view(),name="get-connection-accepted"),
    
    #======================= clear connection accepted notifications ======================#
    path('mark-read/<int:pk>/', MarkNotificationReadView.as_view(), name='mark-notification-read'),

    #======================= get saved private messages ===========================# 
    path('get-private_messages/',PrivateMessageNotificationView.as_view(),name="get-saved-private-messages"),

    #====================== mark the notifcation as readed ============================# 
    path('mark-as-read-notifications/<int:pk>/', MarkNotificationAsReadView.as_view(), name='mark_notification_as_read'),

    #======================= get the all notificaiton except the message notificaitons ===================#
    path('get-general_notifications/', GeneralNotificationListView.as_view(), name='get_general_notifications'),

]

