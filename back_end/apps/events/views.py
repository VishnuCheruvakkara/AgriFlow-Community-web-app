from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from apps.common.pagination import CustomUserPagination, CustomEventPagination
from .serializers import CommunitySerializer, CommunityEventCombinedSerializer, CommunityEventEditSerializer,EventParticipationSerializer,CommunityEventParticipantGetSerializer
from rest_framework import status
from rest_framework.response import Response
from community.models import CommunityMembership
from apps.common.cloudinary_utils import upload_image_to_cloudinary
from .serializers import CommunityEventSerializer
from .models import CommunityEvent, EventLocation,EventParticipation
import json
from community.models import Community
from django.db.models import Q
from django.shortcuts import get_object_or_404


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

        # Get the community ID and the event title from the request data
        community_id = request.data.get("community")
        event_title = request.data.get("title")

        # Check if the user is an admin for the specified community
        try:
            community_membership = CommunityMembership.objects.get(
                user=request.user, community_id=community_id)
            if not community_membership.is_admin:
                return Response({"error": "You must be an admin of the community to create events."}, status=status.HTTP_403_FORBIDDEN)
        except CommunityMembership.DoesNotExist:
            return Response({"error": "You are not a member of this community."}, status=status.HTTP_403_FORBIDDEN)

        # Check for duplicate event title for the same community
        if CommunityEvent.objects.filter(community_id=community_id, title=event_title).exists():
            return Response({"error": "An event with this title already exists for the selected community."}, status=status.HTTP_400_BAD_REQUEST)

        print("Incoming request data:", request.data)
        serializer = CommunityEventSerializer(
            data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Event created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


################### Get all community events #################

class GetAllCommunityEventsView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomEventPagination  # Set custom pagination class

    def get(self, request, *args, **kwargs):
        try:
            # Get the search term from query params, if any
            search_term = request.query_params.get('search', '').strip()
            user = request.user
            print("user is ::",user.id)
            # Get events the user is already participating in
            participated_event_ids = EventParticipation.objects.filter(
                user=user
            ).values_list('event_id', flat=True)

            # Filter the queryset based on search term if it exists
            events = CommunityEvent.objects.select_related('community', 'event_location').filter(
                is_deleted=False,
                community__is_deleted=False
            ).exclude(created_by=user).exclude(id__in=participated_event_ids)
            
            print("user event :: ",events)

            if search_term:
                events = events.filter(
                    Q(title__icontains=search_term) |
                    Q(event_type__icontains=search_term) |
                    Q(event_location__full_location__icontains=search_term)
                )

            # Paginate the queryset
            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(events, request)
            serializer = CommunityEventCombinedSerializer(
                result_page, many=True)

            # Return paginated response
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response(
                {"error": "Something went wrong while fetching events."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
########################## Get Events created by the logged in user ################## 

class UserCreatedEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        search_query = request.query_params.get('search', '')

        events = CommunityEvent.objects.filter(
            created_by=user,
            is_deleted=False,
            community__is_deleted=False
        )

        if search_query:
            events = events.filter(
                Q(title__icontains=search_query) |
                Q(event_type__icontains=search_query) |
                Q(event_location__location_name__icontains=search_query)
            )
       
        paginator = CustomEventPagination()
        paginated_events = paginator.paginate_queryset(events, request)
        serializer = CommunityEventParticipantGetSerializer(paginated_events, many=True)

        return paginator.get_paginated_response(serializer.data)

################### Edit the commmunity event ######################### 


class CommunityEventUpdateAPIView(APIView):
    permission_classes = [ IsAuthenticated ]
    def patch(self, request, pk):
        event = get_object_or_404(CommunityEvent, pk=pk)
        serializer = CommunityEventEditSerializer(event, data=request.data, partial=True)

        if serializer.is_valid():
            updated_event = serializer.save()
            return Response(CommunityEventEditSerializer(updated_event).data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
####################### Soft delete the community event  ############## 

class DeleteCommunityEventView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        try:
            event = CommunityEvent.objects.get(pk=pk, is_deleted=False)
        except CommunityEvent.DoesNotExist:
            return Response({'error': 'Event not found or already deleted.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is an admin in the event's community
        is_admin = CommunityMembership.objects.filter(
            user=request.user,

            community=event.community,
            is_admin=True,
            status='approved'
        ).exists()

        if not is_admin:
            return Response({'error': 'You do not have permission to delete this event.'}, status=status.HTTP_403_FORBIDDEN)

        # Perform soft delete
        event.is_deleted = True
        event.save()

        return Response({'message': 'Event deleted successfully.'}, status=status.HTTP_200_OK)
    
############# Join to a community event #################

class JoinEventAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EventParticipationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully enrolled in the event."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
######################  (Enrolled Events section in the Event pages of the user side) all events where the current user is a pariticipant  ####################

class EnrolledEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        search_query = request.query_params.get('search', '')

        # Get participations with related events and locations/communities
        participations = EventParticipation.objects.select_related(
            'event__event_location', 'event__community'
        ).filter(user=user, event__is_deleted=False, event__community__is_deleted=False)

        # Extract related events
        events = [p.event for p in participations]

        # Convert list to queryset for pagination and search
        from django.db.models import QuerySet
        if not isinstance(events, QuerySet):
            from .models import CommunityEvent  # Make sure CommunityEvent is imported
            event_ids = [e.id for e in events]
            events = CommunityEvent.objects.filter(id__in=event_ids)

        # Apply search
        if search_query:
            events = events.filter(
                Q(title__icontains=search_query) |
                Q(event_type__icontains=search_query) |
                Q(event_location__location_name__icontains=search_query)
            )

        # Pagination
        paginator = CustomEventPagination()
        paginated_events = paginator.paginate_queryset(events, request)
        serializer = CommunityEventCombinedSerializer(paginated_events, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)