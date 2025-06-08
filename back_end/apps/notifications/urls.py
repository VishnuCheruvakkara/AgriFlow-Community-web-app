from django.urls import path 
from .views import ConnectionAcceptedNotificationView,MarkNotificationReadView,PrivateMessageNotificationView,MarkNotificationAsReadView,GeneralNotificationListView,SoftDeleteNotificationView

urlpatterns = [
    ########################## Notification for connections set up ######################
    #========================== get connection accepted notifications =================================#
    path("get-connection-accpeted/",ConnectionAcceptedNotificationView.as_view(),name="get-connection-accepted"),
    
    #======================= clear connection accepted notifications ======================#
    path('mark-read/<int:pk>/', MarkNotificationReadView.as_view(), name='mark-notification-read'),

    #======================= get saved private messages ===========================# 
    path('get-private-messages/',PrivateMessageNotificationView.as_view(),name="get-saved-private-messages"),

    #====================== mark the notifcation as readed ============================# 
    path('mark-as-read-notifications/<int:pk>/', MarkNotificationAsReadView.as_view(), name='mark-notification-as-read'),

    #======================= get the all notificaiton except the message notificaitons ===================#
    path('get-general-notifications/', GeneralNotificationListView.as_view(), name='get-general-notifications'),

    #======================= Soft delete teh notofications ======================================# 
    path('soft-delete-notifications/<int:pk>/', SoftDeleteNotificationView.as_view(), name='soft-delete-notification'),
]

