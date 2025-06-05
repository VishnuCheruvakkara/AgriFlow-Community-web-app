from django.urls import path 
from .views import ConnectionAcceptedNotificationView,MarkNotificationReadView,PrivateMessageNotificationView

urlpatterns = [
    ########################## Notification for connections set up ######################
    #========================== get connection accepted notifications =================================#
    path("get-connection-accpeted/",ConnectionAcceptedNotificationView.as_view(),name="get-connection-accepted"),
    
    #======================= clear connection accepted notifications ======================#
    path('mark-read/<int:pk>/', MarkNotificationReadView.as_view(), name='mark-notification-read'),

    #======================= get saved private messages ===========================# 
    path('get-private_messages/',PrivateMessageNotificationView.as_view(),name="get-saved-private-messages")
]

