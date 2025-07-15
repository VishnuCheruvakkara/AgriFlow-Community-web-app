import email
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from rest_framework.response import Response
# ==============product model===============#
from products.models import Product, Wishlist, ProductChatMessage
# ==============community model===============#
from community.models import Community, CommunityMembership, CommunityMessage
# ==============event model===============#
from events.models import CommunityEvent
# ==============post model===============#
from posts.models import Post

from apps.common.cloudinary_utils import generate_secure_image_url

from django.db.models.functions import TruncYear, TruncMonth, TruncWeek, TruncDay
from django.utils import timezone
from django.db.models import Count,Q

# Create your views here.

User = get_user_model()


class GetDashBoardDataView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        # Get the card datas
        total_users = User.objects.count()
        total_products = Product.objects.count()
        total_communities = Community.objects.count()
        total_events = CommunityEvent.objects.count()
        total_posts = Post.objects.count()

        # Get data for the user details chart
        profile_completed = User.objects.filter(profile_completed=True).count()
        aadhaar_verified = User.objects.filter(is_aadhar_verified=True).count()
        email_verified = User.objects.filter(is_verified=True).count()
        active_users = User.objects.filter(is_active=True).count()

        # Get the data for the poduct metric
        available_products = Product.objects.filter(
            is_available=True, is_deleted=False).count()
        wishlist_items = Wishlist.objects.filter(is_active=True).count()
        chat_messages = ProductChatMessage.objects.count()
        # Units counts
        units_piece = Product.objects.filter(
            unit="piece", is_deleted=False).count()
        units_kg = Product.objects.filter(unit="kg", is_deleted=False).count()
        units_litre = Product.objects.filter(
            unit="litre", is_deleted=False).count()

        # Get the community details to shwo them in the chart
        group_by = request.query_params.get("group_by", "month").lower()

        # Determine truncate function
        if group_by == "year":
            trunc_func = TruncYear
        elif group_by == "week":
            trunc_func = TruncWeek
        elif group_by == "day":
            trunc_func = TruncDay
        else:
            trunc_func = TruncMonth

        # Time window (last 6 months for month/week/day, last 3 years if yearly)
        today = timezone.now().date()
        if group_by == "year":
            since = today - timezone.timedelta(days=365 * 3)
        elif group_by == "day":
            since = today - timezone.timedelta(days=29)  # Last 30 days including today
        else:
            since = today - timezone.timedelta(days=180)
            
        # Commuinities created
        community_created = (Community.objects.filter(created_at__gte=since).annotate(
            period=trunc_func("created_at")).values("period").annotate(count=Count("id")).order_by("period"))
        # Memberships joined
        membership_joined = (CommunityMembership.objects.filter(joined_at__gte=since, status="approved").annotate(
            period=trunc_func("joined_at")).values("period").annotate(count=Count("id")).order_by("period"))
        # Messages_send
        messages_send = (CommunityMessage.objects.filter(timestamp__gte=since).annotate(
            period=trunc_func("timestamp")).values("period").annotate(count=Count("id")).order_by("period"))

        # Helper to format output
        def format_data(qs):
            formatted = {}
            for entry in qs:
                period = entry["period"]
                if group_by == "year":
                    label = period.strftime("%Y")
                elif group_by == "month":
                    label = period.strftime("%B %Y")   # e.g., January 2024
                elif group_by == "week":
                    week_in_month = ((period.day - 1) // 7) + 1
                    month = period.strftime("%B")
                    year = period.strftime("%Y")
                    label = f"Week {week_in_month} of {month} {year}"
                else:
                    label = period.strftime("%d/%m/%Y")
                formatted[label] = entry["count"]
            return formatted

        # Get top engaged communities
        top_engaged_communities_qs = (
            Community.objects.annotate(
                message_count=Count("messages")
            )
            .filter(message_count__gt=0)
            .order_by("-message_count")[:5]
        )

        # Convert queryset to list of dicts with secure URLs
        top_engaged_communities = [
            {
                "id": c.id,
                "name": c.name,
                "community_logo": generate_secure_image_url(c.community_logo),
                "message_count": c.message_count,
            }
            for c in top_engaged_communities_qs
        ]

        # Get top participant communities
        top_participant_communities_qs = (
            Community.objects.annotate(
                participant_count=Count(
                    "memberships",
                    filter=Q(memberships__status="approved")
                )
            )
            .filter(participant_count__gt=0)
            .order_by("-participant_count")[:5]
        )

        # Convert queryset to list of dicts with secure URLs
        top_participant_communities = [
            {
                "id": c.id,
                "name": c.name,
                "community_logo": generate_secure_image_url(c.community_logo),
                "participant_count": c.participant_count,
            }
            for c in top_participant_communities_qs
        ]



        
            
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
            },
            "product_metrics": {
                "total_products": total_products,
                "available_products": available_products,
                "wishlist_items": wishlist_items,
                "chat_messages": chat_messages,
                "units_piece": units_piece,
                "units_kg": units_kg,
                "units_litre": units_litre,
            },
            "community_graph": {
                "created": format_data(community_created),
                "joined": format_data(membership_joined),
                "messages": format_data(messages_send),
            },
            "community_highlights": {
            "most_engaged": list(top_engaged_communities),
            "most_participants": list(top_participant_communities),
            }
        })
