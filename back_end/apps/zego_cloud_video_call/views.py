

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .zego_utils import generate_token
from django.conf import settings


class GenerateAndGetZegoToken(APIView):
    """
    POST endpoint to generate a Zego token.

    Expects JSON body:
    {
      "user_id": "some_user_id",
      "room_id": "some_room_id"
    }
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        room_id = request.data.get("room_id")

        if not user_id or not room_id:
            return Response(
                {"error": "Both 'user_id' and 'room_id' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = generate_token(user_id)

        return Response({
            "token": token,
            "app_id": int(settings.ZEGO_APP_ID),
            "room_id": room_id
        }, status=status.HTTP_200_OK)
