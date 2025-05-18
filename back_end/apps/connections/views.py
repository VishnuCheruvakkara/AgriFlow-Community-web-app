from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from connections.models import Connection, BlockedUser
from .serializers import GetSuggestedFarmersSerializer,ConnectionSerializer,SentConnectionRequestSerializer,ReceivedConnectionRequestsSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q
from apps.common.pagination import CustomConnectionPagination
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404

User = get_user_model()
# Create your views here.

########################  Get the all users for set suggesion to connect ##################### 

class GetSuggestedFarmersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        search_query = request.query_params.get('search', '').strip()
        users = User.objects.exclude(id=current_user.id).exclude(is_staff=True)

        # Exclude blocked users
        blocked_user_ids = BlockedUser.objects.filter(
            blocker=current_user
        ).values_list('blocked_id', flat=True)
        users = users.exclude(id__in=blocked_user_ids)

        # Filter users with complete profile and verified Aadhar
        users = users.filter(profile_completed=True, is_aadhar_verified=True)

        # Get all connections sent by current user
        connections = Connection.objects.filter(sender=current_user)

        # Exclude connected, pending, rejected
        active_connection_user_ids = connections.filter(
            ~Q(status='cancelled')
        ).values_list('receiver_id', flat=True)

        # Handle "cancelled" connections only if cancelled less than 3 days ago
        three_days_ago = timezone.now() - timedelta(days=3)
        recent_cancelled_user_ids = connections.filter(
            status='cancelled',
            updated_at__gte=three_days_ago
        ).values_list('receiver_id', flat=True)

        users = users.exclude(id__in=active_connection_user_ids)
        users = users.exclude(id__in=recent_cancelled_user_ids)

        # Apply search
        if search_query:
            users = users.filter(
                Q(username__icontains=search_query) |
                Q(address__location_name__icontains=search_query) |
                Q(farming_type__icontains=search_query)
            )

        # Paginate
        paginator = CustomConnectionPagination()
        paginated_users = paginator.paginate_queryset(users, request)
        serializer = GetSuggestedFarmersSerializer(paginated_users, many=True)
        return paginator.get_paginated_response(serializer.data)

##################  Pending request section ( Requests You Sent - front end section in the connection page  ) ################### 
#================== view for send connection request ====================#

class SendConnectionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver_id = request.data.get('receiver_id')

        if receiver_id == request.user.id:
            return Response({"error": "You cannot connect to yourself."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver = User.objects.get(id=receiver_id)

            # Limit daily requests for each users 
            now = timezone.now()
            start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)

            daily_requests_count = Connection.objects.filter(
                sender=request.user,
                created_at__gte=start_of_day,
            ).count()

            if daily_requests_count >= 10:
                return Response({"error": "Max connection limit reached today. Try again later."}, status=status.HTTP_400_BAD_REQUEST)

            connection, created = Connection.objects.get_or_create(
                sender=request.user,
                receiver=receiver,
                defaults={'status': 'pending'}
            )

            if not created:
                return Response({"error": "Connection already exists."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = ConnectionSerializer(connection)
            return Response({
                "message": "Connection request sent.",
                "connection": serializer.data
            }, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({"error": "Receiver not found."}, status=status.HTTP_404_NOT_FOUND)
        
#==================== Get users in the Request you send section View  =========================#

class GetSentConnectionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        sent_requests = Connection.objects.filter(sender=user, status='pending').select_related('receiver')
        serializer = SentConnectionRequestSerializer(sent_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
#===================== Cancell connection request View ============================#

class CancelConnectionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            connection = Connection.objects.get(pk=pk, sender=request.user)
        except Connection.DoesNotExist:
            return Response({'detail': 'Connection not found or permission denied.'}, status=status.HTTP_404_NOT_FOUND)

        if connection.status != 'pending':
            return Response({'detail': 'Only pending requests can be cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        connection.status = 'cancelled'
        connection.save()
        return Response({'detail': 'Request cancelled successfully.'}, status=status.HTTP_200_OK)
    
##################  Pending request section ( Received Connection Requests - front end section in the connection page  ) ################### 

#================ Get recieved connection requests view =====================# 
class ReceivedConnectionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        connections = Connection.objects.filter(receiver=user, status='pending')
        serializer = ReceivedConnectionRequestsSerializer(connections, many=True)
        return Response(serializer.data)
 
#=================  accept the connection request View ============================# 

class AcceptConnectionRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        connection = get_object_or_404(Connection, id=pk, receiver=request.user)

        if connection.status != "pending":
            return Response({"detail": "Request is not pending."}, status=status.HTTP_400_BAD_REQUEST)

        connection.status = "accepted"
        connection.save()
        return Response({"detail": "Connection request accepted."}, status=status.HTTP_200_OK)
    
#======================= reject connection request View ======================#

class RejectConnectionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, request_id):
        # Find the connection request by id and ensure the logged-in user is the receiver
        connection_request = get_object_or_404(Connection, id=request_id, receiver=request.user)

        # Only allow rejecting if the request is still pending
        if connection_request.status != 'pending':
            return Response({"detail": "This connection request cannot be rejected."}, status=status.HTTP_400_BAD_REQUEST)

        # Update status to rejected
        connection_request.status = 'rejected'
        connection_request.save()

        return Response({"detail": "Connection request rejected successfully."}, status=status.HTTP_200_OK)
