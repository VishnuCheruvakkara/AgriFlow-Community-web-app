from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CommunitySerializer,CommunityEventCombinedSerializer
from rest_framework import status
from rest_framework.response import Response
from community.models import CommunityMembership
from apps.common.cloudinary_utils import upload_image_to_cloudinary
from .serializers import CommunityEventSerializer
from .models import CommunityEvent,EventLocation
import json
from community.models import Community

##############  Get community in the event creation section (only get the community where user is admin ) #################


class GetCommunityForCreateEvent(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        admin_memberships = CommunityMembership.objects.filter(
            user=user,
            is_admin=True,
            status='approved',
            community__is_deleted=False
        ).select_related('community')

        communities = [
            membership.community for membership in admin_memberships]

        serializer = CommunitySerializer(communities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

################  Admin User can Create Event -- View ##################

class CommunityEventCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Incoming request data:", request.data)
        serializer = CommunityEventSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Event created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

############### Get all community events ################# 

class GetAllCommunityEventsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        try:
            events = CommunityEvent.objects.select_related('community', 'event_location').all()
            serializer = CommunityEventCombinedSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Something went wrong while fetching events."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
