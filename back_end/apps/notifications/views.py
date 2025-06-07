from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework.permissions import IsAuthenticated 
from rest_framework import status
from notifications.models import Notification 
from notifications.serializers import NotificationSerializer,GetPrivateMessageSerializer,GeneralNotificationSerializer
from channels.layers import get_channel_layer 
from asgiref.sync import async_to_sync 
from django.db.models import Q

############################ Notification View for connection set up ################################
#========================== get connection accepted notifications =================================#
class ConnectionAcceptedNotificationView(APIView):
    permission_classes=[IsAuthenticated]
    
    def get(self,request):
        user=request.user 
        notifications = Notification.objects.filter(
            recipient = user,
            notification_type = "connection_accepted",
            is_read=False
        ).order_by("-created_at")
        serializer = NotificationSerializer(notifications,many=True)
        return Response(serializer.data)
    
#======================= clear connection accepted notifications ======================#
class MarkNotificationReadView(APIView):
    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, recipient=request.user)
            notification.is_read = True
            notification.save()
            return Response({"message": "Notification marked as read"}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
    
############################ Get messages for private user-to-user meessages  ####################3

class PrivateMessageNotificationView(APIView):
    permission_classes= [IsAuthenticated]

    def get(self,request):
        user = request.user 
        private_msgs = Notification.objects.filter(
           Q( recipient=user) & (Q(notification_type="private_message") | Q(notification_type="community_message"))
        ).order_by('-created_at')

        serializer = GetPrivateMessageSerializer(private_msgs,many=True)

        return Response(serializer.data)
    

############################ Mark notifications as read ##############################

class MarkNotificationAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(id=pk, recipient=request.user)
            notification.is_read = True
            notification.save()
            return Response({"success": True, "message": "Marked as read."}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({"success": False, "message": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)
        
###############################  Get all the notifications ##############################

class GeneralNotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        general_notifications = Notification.objects.filter(
            recipient=user
        ).exclude(notification_type__in=["private_message", "community_message"])
        
        serializer = GeneralNotificationSerializer(general_notifications, many=True)
        return Response(serializer.data)