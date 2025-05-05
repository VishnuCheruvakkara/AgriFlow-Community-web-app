from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CommunitySerializer
from rest_framework import status
from rest_framework.response import Response
from community.models import CommunityMembership

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

        communities = [membership.community for membership in admin_memberships]

        serializer = CommunitySerializer(communities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)