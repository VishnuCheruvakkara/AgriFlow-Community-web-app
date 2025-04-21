
#====================== Using community serializer to pass the user pending community notification data dynamically with websocket to the front-end ==========================# 
from http import server
from apps.community.serializers import CommunityInviteSerializer

def get_invite_payload(membership_instance):
    serializer = CommunityInviteSerializer(membership_instance)
    return serializer.data