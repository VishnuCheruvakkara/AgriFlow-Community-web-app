from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework.permissions import IsAuthenticated 
from rest_framework import status
from notifications.models import Notification 
from notifications.serializers import NotificationSerializer
from channels.layers import get_channel_layer 
from asgiref.sync import async_to_sync 

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
    
#########################  Common function for handle the real-time notification and save that to the db table  #########################3

def create_and_send_notification(recipient, sender, type, message,community=None,image_url=None):
    # Save notification data into the table 
    notification = Notification.objects.create(
        recipient = recipient,
        sender = sender,
        notification_type = type,
        message = message,
        community = community,
        image_url = image_url,
    )

    #Send the real-time notification 
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{recipient.id}",
        {
            "type":"send_notification",
            "data":{
                "id":notification.id,
                "type":type,
                "message":message,
                "sender":sender.username if sender else None,
                "sender_id":sender.id,
                "timestamp":str(notification.created_at),
                "image_url":image_url
            }
        }
    )