import email
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from rest_framework.response import Response
#==============product model===============#
from products.models import Product
#==============community model===============#
from community.models import Community
#==============event model===============#
from events.models import CommunityEvent
#==============post model===============#
from posts.models import Post

# Create your views here.

User = get_user_model()


class GetDashBoardDataView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):

        # Get the card datas 
        total_users = User.objects.count()
        total_products = Product.objects.count()
        total_communities=Community.objects.count()
        total_events= CommunityEvent.objects.count()
        total_posts= Post.objects.count()

        #Get data for the user details chart 
        profile_completed = User.objects.filter(profile_completed=True).count()
        aadhaar_verified = User.objects.filter(is_aadhar_verified = True).count()
        email_verified = User.objects.filter(is_verified=True).count()
        active_users= User.objects.filter(is_active=True).count()


        return Response({
            "cards":{
                "total_users":total_users,
                "total_products":total_products,
                "total_communities":total_communities,
                "total_events":total_events,
                "total_posts":total_posts,
            },
            "user_details":{
                "total_users":total_users,
                "profile_completed":profile_completed,
                "aadhaar_verified":aadhaar_verified,
                "email_verified":email_verified,
                "active_users":active_users,
            }
        })
