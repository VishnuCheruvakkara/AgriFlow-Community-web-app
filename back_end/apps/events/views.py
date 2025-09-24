import logging
from tkinter import E
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from apps.common.pagination import CustomUserPagination, CustomEventPagination,CustomAdminEventPagination
from .serializers import CommunitySerializer, CommunityEventCombinedSerializer, CommunityEventEditSerializer, EventParticipationSerializer, CommunityEventParticipantGetSerializer, EventEnrollmentHistorySerializer, CommunityEventAdminSideListSerializer,CommunityEventDetailAdminSideSerializer
from rest_framework import status
from rest_framework.response import Response
from community.models import CommunityMembership
from apps.common.cloudinary_utils import upload_image_to_cloudinary, generate_secure_image_url
from .serializers import CommunityEventSerializer
from .models import CommunityEvent, EventLocation, EventParticipation
import json
from community.models import Community
from django.db.models import Q
from django.shortcuts import get_object_or_404
from apps.notifications.utils import create_and_send_notification

logger=logging.getLogger(__name__)

# Get community in the event creation section (only get the community where user is admin ) 
class GetCommunityForCreateEvent(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
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
        except Exception as e:
            logging.exception(f"Error fetching communities for event creation: {e}")   
            return Response({"error": "Something went wrong while fetching communities."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Admin User can Create Event View 
class CommunityEventCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:

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

            serializer = CommunityEventSerializer(
                data=request.data, context={"request": request})
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Event created successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logging.exception(f"Error creating event: {e}")
            return Response({"error": "Something went wrong while creating the event."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Get all community events
class GetAllCommunityEventsView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomEventPagination  # Set custom pagination class

    def get(self, request, *args, **kwargs):
        try:
            # Get the search term from query params, if any
            search_term = request.query_params.get('search', '').strip()
            user = request.user
            # Get events the user is already participating in
            participated_event_ids = EventParticipation.objects.filter(
                user=user
            ).values_list('event_id', flat=True)

            # Filter the queryset based on search term if it exists
            events = CommunityEvent.objects.select_related('community', 'event_location').filter(
                is_deleted=False,
                community__is_deleted=False
            ).exclude(created_by=user).exclude(id__in=participated_event_ids)

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
            logger.exception(f"Error fetching events: {e}")    
            return Response(
                {"error": "Something went wrong while fetching events."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Get Events created by the logged in user
class UserCreatedEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
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
            serializer = CommunityEventParticipantGetSerializer(
                paginated_events, many=True,context={'request':request})

            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            logger.exception(f"Error fetching user-created events: {e}")
            return Response(
                {"error": "Something went wrong while fetching your events."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
# Edit the commmunity event
class CommunityEventUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            event = get_object_or_404(CommunityEvent, pk=pk)
            serializer = CommunityEventEditSerializer(
                event, data=request.data, partial=True)

            if serializer.is_valid():
                updated_event = serializer.save()
                return Response(CommunityEventEditSerializer(updated_event).data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception(f"Error updating event: {e}")
            return Response(
                {"error": "Something went wrong while updating the event."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
# Soft delete the community event
class DeleteCommunityEventView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        try:
            event = CommunityEvent.objects.get(pk=pk, is_deleted=False)
        except CommunityEvent.DoesNotExist:
            return Response({'error': 'Event not found or already deleted.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is an admin in the event's community
        try:
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

            # Send notifications to all participants
            participations = EventParticipation.objects.filter(event=event)

            for participation in participations:
                recipient = participation.user
                create_and_send_notification(
                    recipient=recipient,
                    sender=request.user,
                    type="event_deleted",
                    message=f"The event '{event.title}' has been cancelled by the organizer.",
                    community=event.community,
                    image_url=generate_secure_image_url(event.banner)
                )

            return Response({'message': 'Event deleted successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(f"Error deleting event: {e}")
            return Response({'error': 'Something went wrong while deleting the event.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Join to a community event 
class JoinEventAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = EventParticipationSerializer(
                data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Successfully enrolled in the event."}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception(f"Error joining event: {e}")
            return Response({"error": "Something went wrong while joining the event."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# (Enrolled Events section in the Event pages of the user side) all events where the current user is a pariticipant 
class EnrolledEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
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
                from .models import CommunityEvent 
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
            serializer = CommunityEventCombinedSerializer(
                paginated_events, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            logger.exception(f"Error fetching enrolled events: {e}")
            return Response(
                {"error": "Something went wrong while fetching your enrolled events."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
# Get the enrolled event history for a user 
class EventEnrollmentHistoryAPIView(APIView):
    """
    API view to return event participation history for the current authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            participations = (
                EventParticipation.objects
                .filter(user=request.user)
                .select_related("event", "event__event_location")
            )
            serializer = EventEnrollmentHistorySerializer(
                participations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(f"Error fetching event enrollment history: {e}")
            return Response(
                {"error": "Something went wrong while fetching your event enrollment history."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# mark evnent as completed by the creator of the event 
class MarkEventAsCompletedView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, event_id):
        try:
            event = CommunityEvent.objects.get(
                id=event_id, created_by=request.user, is_deleted=False)

            if event.event_status == "completed":
                return Response({"detail": "Event is already marked as completed."}, status=status.HTTP_400_BAD_REQUEST)

            event.event_status = "completed"
            event.save()

            # Send notifications to all participants
            participations = EventParticipation.objects.filter(event=event)

            for participation in participations:
                recipient = participation.user
                create_and_send_notification(
                    recipient=recipient,
                    sender=request.user,
                    type="event_completed",
                    message=f"The event '{event.title}' has been marked as completed by the organizer.",
                    community=event.community,
                    image_url=generate_secure_image_url(event.banner)
                )

            return Response({"detail": "Event marked as completed successfully."}, status=status.HTTP_200_OK)

        except CommunityEvent.DoesNotExist:
            logger.exception(f"Event with ID {event_id} not found or user is not the creator.") 
            return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            logger.exception(f"Unexpected error while marking event {event_id} as completed.")
            return Response(
                {"detail": "Something went wrong while updating the event."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
# mark event as cancelled  
class MarkEventAsCancelledView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, event_id):
        try:
            event = CommunityEvent.objects.get(
                id=event_id, created_by=request.user, is_deleted=False)
            if event.event_status == "cancelled":
                return Response({"detail": "Event is already cancelled."}, status=status.HTTP_400_BAD_REQUEST)
            if event.event_status == "completed":
                return Response({"detail": "Completed events cannot be cancelled."}, status=status.HTTP_400_BAD_REQUEST)
            event.event_status = "cancelled"
            event.save()

            # Send notifications to all participants
            participations = EventParticipation.objects.filter(event=event)

            for participation in participations:
                recipient = participation.user
                create_and_send_notification(
                    recipient=recipient,
                    sender=request.user,
                    type="event_cancelled",
                    message=f"The event '{event.title}' has been cancelled by the organizer.",
                    community=event.community,
                    image_url=generate_secure_image_url(event.banner)
                )


            return Response({"detail": "Event has been cancelled successfully."}, status=status.HTTP_200_OK)
        except CommunityEvent.DoesNotExist:
            logger.exception(f"Event with ID {event_id} not found or user is not the creator.")
            return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            logger.exception(f"Unexpected error while cancelling event {event_id}.")
            return Response(
                {"detail": "Something went wrong while cancelling the event."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
#  Admin side Event handling 
# Get all events in the admin page
class AdminEventListAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        try:
            queryset = CommunityEvent.objects.all().order_by("-start_datetime")

            # Search
            search = request.query_params.get("search")
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(description__icontains=search)
                )

            # Status Filter
            status = request.query_params.get("status")
            if status == "upcoming":
                queryset = queryset.filter(event_status="upcoming", is_deleted=False)
            elif status == "completed":
                queryset = queryset.filter(event_status="completed", is_deleted=False)
            elif status == "cancelled":
                queryset = queryset.filter(event_status="cancelled", is_deleted=False)
            elif status == "deleted":
                queryset = queryset.filter(is_deleted=True)

            paginator = CustomAdminEventPagination()
            page = paginator.paginate_queryset(queryset, request)

            serializer = CommunityEventAdminSideListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            logger.exception(f"Error fetching admin event list: {e}")
            return Response(
                {"error": "Something went wrong while fetching events."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
# Event details amdin side

class CommunityEventDetailView(APIView):
    """
    Retrieve detailed event info for admin.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, id, format=None):
        try:
            event = get_object_or_404(
                CommunityEvent.objects.prefetch_related(
                    "participations__user"
                ).select_related(
                    "event_location",
                    "community",
                    "created_by"
                ),
                id=id
            )
            serializer = CommunityEventDetailAdminSideSerializer(event)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(f"Error fetching event details for admin: {e}")
            return Response(
                {"error": "Something went wrong while fetching event details."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Event delete status toggling view 
class ToggleEventDeleteStatusView(APIView):
    """
    Toggle the is_deleted status of a Event.
    Only accessible by admin users.
    """
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            event = get_object_or_404(CommunityEvent, pk=pk)
            event.is_deleted = not event.is_deleted
            event.save()

            return Response(
                {
                    "message": f"Event marked as {'deleted' if event.is_deleted else 'available'}.",
                    "is_deleted": event.is_deleted,
                },
                status=status.HTTP_200_OK,
            )     
        except Exception as e:
            logger.exception(f"Error toggling event delete status: {e}")
            return Response(
                {"error": "Something went wrong while updating the event status."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )                                                                                      