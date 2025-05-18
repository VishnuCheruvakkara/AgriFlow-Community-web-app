from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from connections.models import Connection, BlockedUser
from .serializers import GetSuggestedFarmersSerializer,ConnectionSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q
from apps.common.pagination import CustomConnectionPagination
from rest_framework import status
from django.utils import timezone

User = get_user_model()
# Create your views here.

########################  Get the all users for set suggesion to connect ##################### 

class GetSuggestedFarmersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        search_query = request.query_params.get('search','').strip()

        # Exclude self
        users = User.objects.exclude(id=current_user.id)

        # Exclude admin/staff/superuser users
        users = users.exclude(is_staff=True)

        # Exclude blocked users
        blocked_users = BlockedUser.objects.filter(
            blocker=current_user).values_list('blocked_id', flat=True)
        users = users.exclude(id__in=blocked_users)

        # Exclude connected/pending users
        connected_users = Connection.objects.filter(
            sender=current_user).values_list('receiver_id', flat=True)
        users = users.exclude(id__in=connected_users)

        # Exclude users with incomplete profiles or unverified Aadhar
        users = users.filter(profile_completed=True, is_aadhar_verified=True)

        #search set up 
        if search_query:
            users = users.filter(
                Q(username__icontains=search_query) | 
                Q(address__location_name__icontains = search_query) | 
                Q(farming_type__icontains = search_query)
            )

        # pagination set ups  
        paginator = CustomConnectionPagination()
        paginated_users = paginator.paginate_queryset(users,request)

        serializer = GetSuggestedFarmersSerializer(paginated_users,many=True)
        return paginator.get_paginated_response(serializer.data)

###################### view for send connection request ####################


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