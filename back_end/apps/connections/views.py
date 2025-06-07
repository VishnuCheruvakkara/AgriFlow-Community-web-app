from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from connections.models import Connection, BlockedUser
from .serializers import GetSuggestedFarmersSerializer,ConnectionSerializer,SentConnectionRequestSerializer,ReceivedConnectionRequestsSerializer,GetMyConnectionSerializer,BlockUserSerializer,BlockedUserSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q
from apps.common.pagination import CustomConnectionPagination
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_object_or_404
from notifications.models import Notification
from notifications.utils import create_and_send_notification
from apps.common.cloudinary_utils import generate_secure_image_url

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

        # Exclude users who blocked current_user
        blocked_by_other_user_ids = BlockedUser.objects.filter(
            blocked=current_user
        ).values_list('blocker_id', flat=True)

        users = users.exclude(id__in=blocked_user_ids)
        users = users.exclude(id__in=blocked_by_other_user_ids)

        # Filter users with complete profile and verified Aadhar
        users = users.filter(profile_completed=True, is_aadhar_verified=True)

        # Get all connections sent by current user
        connections = Connection.objects.filter(sender=current_user)

        # Get all connections received by current user (for reverse check)
        reverse_connections = Connection.objects.filter(receiver=current_user)

        # Exclude users who sent a pending request TO current_user
        pending_received_user_ids = reverse_connections.filter(
            status='pending'
        ).values_list('sender_id', flat=True)

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

        # Exclude users who already accepted your connection
        accepted_received_user_ids = reverse_connections.filter(
            status='accepted'
        ).values_list('sender_id', flat=True)

        users = users.exclude(id__in=active_connection_user_ids)
        users = users.exclude(id__in=pending_received_user_ids)
        users = users.exclude(id__in=recent_cancelled_user_ids)
        users = users.exclude(id__in=accepted_received_user_ids)

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

            # Check for existing connection
            connection = Connection.objects.filter(sender=request.user, receiver=receiver).first()

            if connection:
                if connection.status == 'accepted':
                    return Response({"error": "Connection already exists."}, status=status.HTTP_400_BAD_REQUEST)
                elif connection.status == 'blocked':
                    return Response({"error": "You cannot send request. This user is blocked."}, status=status.HTTP_400_BAD_REQUEST)
                elif connection.status in ['rejected', 'cancelled']:
                    # Resend request
                    connection.status = 'pending'
                    connection.updated_at = timezone.now()
                    connection.save()
                    serializer = ConnectionSerializer(connection)
                    return Response({
                        "message": "Connection request re-sent.",
                        "connection": serializer.data
                    }, status=status.HTTP_200_OK)

                else:
                    return Response({"error": f"Connection already in {connection.status} status."}, status=status.HTTP_400_BAD_REQUEST)

            # No connection exists: create a new one
            connection = Connection.objects.create(
                sender=request.user,
                receiver=receiver,
                status='pending'
            )
            serializer = ConnectionSerializer(connection)

            # Send the real time notification for connection request 
            create_and_send_notification(
                recipient = receiver,
                sender = request.user,
                type="connection_request",
                message=f"{request.user.username} sent you a connection request",
                image_url=generate_secure_image_url(request.user.profile_picture) if request.user.profile_picture else None
            )

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

        image_url = (
            generate_secure_image_url(connection.receiver.profile_picture)
            if connection.receiver.profile_picture else None
        )
        
        # Set up notification to inform the user that who accpet connection request
        create_and_send_notification(
            recipient=connection.sender,  # person who will receive the notification
            sender=connection.receiver,   # person who accepted the request
            type="connection_accepted",
            message=f"{connection.receiver.username} accepted your connection request.",
            image_url=image_url
        )

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


############################### My Connection section ###########################################

#============================ get all my connection serialzier ===========================# 

class GetMyConnectionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        search_query = request.query_params.get('search', '').strip()

        # Get users blocked by or who blocked the current user
        blocked_user_ids = BlockedUser.objects.filter(
            Q(blocker=user) | Q(blocked=user)
        ).values_list('blocker', 'blocked')

        # Flatten to a unique set of user IDs to exclude
        exclude_user_ids = set()
        for blocker_id, blocked_id in blocked_user_ids:
            if blocker_id != user.id:
                exclude_user_ids.add(blocker_id)
            if blocked_id != user.id:
                exclude_user_ids.add(blocked_id)

        # Base queryset excluding blocked users
        queryset = Connection.objects.filter(status='accepted').filter(
            Q(sender=user) | Q(receiver=user)
        ).exclude(
            Q(sender__id__in=exclude_user_ids) | Q(receiver__id__in=exclude_user_ids)
        )

        # Optional search
        if search_query:
            queryset = queryset.filter(
                Q(sender__username__icontains=search_query) |
                Q(receiver__username__icontains=search_query) |
                Q(sender__farming_type__icontains=search_query) |
                Q(receiver__farming_type__icontains=search_query)
            )

        # Pagination
        paginator = CustomConnectionPagination()
        paginated_qs = paginator.paginate_queryset(queryset, request, view=self)

        serializer = GetMyConnectionSerializer(paginated_qs, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)



##################################### Block user View ############################

class BlockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BlockUserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            blocker = request.user
            blocked_user_id = serializer.validated_data['user_id']
            blocked = User.objects.get(id=blocked_user_id)

            # Check if already blocked
            if BlockedUser.objects.filter(blocker=blocker, blocked=blocked).exists():
                return Response({'message': f"You already blocked {blocked}."}, status=status.HTTP_200_OK)

            # Create BlockedUser entry
            BlockedUser.objects.create(blocker=blocker, blocked=blocked)

            # Update connection status (in both directions if exists)
            Connection.objects.filter(
                Q(sender=blocker, receiver=blocked) |
                Q(sender=blocked, receiver=blocker)
            ).update(status='blocked')

            return Response({'message': f"Successfully blocked {blocked}."}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

################################  Get Blocked users View #############################

class GetBlockedUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        search_query = request.query_params.get('search', '')
        blocked_users = BlockedUser.objects.filter(blocker=user).select_related('blocked')

        if search_query:
            blocked_users = blocked_users.filter(
                Q(blocked__username__icontains=search_query) |
                Q(blocked__farming_type__icontains=search_query)
            )

        paginator = CustomConnectionPagination()
        paginated_queryset = paginator.paginate_queryset(blocked_users, request)
        serializer = BlockedUserSerializer(paginated_queryset, many=True)

        return paginator.get_paginated_response(serializer.data)
    
################################ Unblock user View #############################

class UnblockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blocked_user = get_object_or_404(User, id=user_id)
            blocker = request.user

            # Delete from BlockedUser
            try:
                blocked_entry = BlockedUser.objects.get(blocker=blocker, blocked=blocked_user)
                blocked_entry.delete()
            except BlockedUser.DoesNotExist:
                return Response({'error': 'Blocked user not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Update Connection status to 'cancelled' if it was 'blocked'
           
            connection = Connection.objects.get(sender=blocker, receiver=blocked_user, status='blocked')
            connection.status = 'cancelled'
            connection.save()

            return Response({'message': 'User unblocked successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)