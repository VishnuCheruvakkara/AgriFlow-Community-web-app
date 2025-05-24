from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework.permissions import IsAuthenticated 
from rest_framework import status
from notifications.models import Notification 
from notifications.serializers import NotificationSerializer

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
    