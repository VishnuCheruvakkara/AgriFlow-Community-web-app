from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
import json
from products.models import Product, ProductLocation, ProductChatMessage, Wishlist
from .serializers import ProductSerializer, ProductChatMessageSerializer, ProductWithBuyersSerializer, BuyingDealSerializer, ToggleWishlistSerializer, WishlistSerializer
from apps.common.cloudinary_utils import generate_secure_image_url, upload_image_and_get_url
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from apps.common.pagination import CustomAdminProductPagination, CustomProductPagination
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.notifications.utils import create_and_send_notification
from common.blocked_users import get_blocked_user_ids
User = get_user_model()


# Create Products
class CreateProductToSell(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            location_data = json.loads(request.data.get('location', '{}'))

            # Upload images to Cloudinary and get secure URLs
            image1_url = upload_image_and_get_url(request.FILES.get(
                'image1'), "products") if request.FILES.get('image1') else None
            image2_url = upload_image_and_get_url(request.FILES.get(
                'image2'), "products") if request.FILES.get('image2') else None
            image3_url = upload_image_and_get_url(request.FILES.get(
                'image3'), "products") if request.FILES.get('image3') else None

            # Create or get ProductLocation
            location, _ = ProductLocation.objects.get_or_create(
                **location_data)
            # Create the product
            product = Product.objects.create(
                seller=request.user,
                title=request.data.get('title'),
                description=request.data.get('description'),
                price=request.data.get('price'),
                quantity=request.data.get('quantity'),
                unit=request.data.get('unit'),
                location=location,
                image1=image1_url,
                image2=image2_url,
                image3=image3_url,
                closing_date=request.data.get('closingTime'),
            )
          
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Get al products
class GetAllProductsAddedByCurrentUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        search_query = request.query_params.get('search', '')
        products = Product.objects.filter(
            seller=current_user, is_deleted=False)

        if search_query:
            products = products.filter(
                Q(title__icontains=search_query) | Q(description__icontains=search_query) | Q(
                    location__location_name__icontains=search_query)
            )
        paginator = CustomProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(paginated_products, many=True)
        return paginator.get_paginated_response(serializer.data)


# Update the product by the user who create the product
class UpdateProductAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        try:
            product = Product.objects.get(pk=pk, seller=request.user)

            # Load and handle location JSON
            location_data = json.loads(request.data.get('location', '{}'))
            location, _ = ProductLocation.objects.get_or_create(
                **location_data)

            # Upload new images if provided
            image1 = request.FILES.get('image1')
            image2 = request.FILES.get('image2')
            image3 = request.FILES.get('image3')

            if image1:
                product.image1 = upload_image_and_get_url(image1, "products")
            if image2:
                product.image2 = upload_image_and_get_url(image2, "products")
            if image3:
                product.image3 = upload_image_and_get_url(image3, "products")

            # Update other product fields
            product.title = request.data.get('title', product.title)
            product.description = request.data.get(
                'description', product.description)
            product.price = request.data.get('price', product.price)
            product.quantity = request.data.get('quantity', product.quantity)
            product.unit = request.data.get('unit', product.unit)
            product.closing_date = request.data.get(
                'closingTime', product.closing_date)
            product.location = location

            product.save()
            return Response(ProductSerializer(product).data, status=status.HTTP_200_OK)

        except Product.DoesNotExist:
            return Response({'error': 'Product not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Soft Delete prodcut view 
class SoftDeleteProductView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk, seller=request.user)
        product.is_deleted = True
        product.save()

        # Notification set up for all the buyer those who messaged to by the product
        # Get all users who messaged about this product
        messages = ProductChatMessage.objects.filter(product=product)

        # Collect all unique user id's
        participant_ids = set()
        for msg in messages:
            if msg.sender_id != request.user.id:
                participant_ids.add(msg.sender_id)
            if msg.receiver_id != request.user.id:
                participant_ids.add(msg.receiver_id)

        # Load the user instances
        recipients = User.objects.filter(id__in=participant_ids)

        # Send notification to each buyers
        for recipient in recipients:
            create_and_send_notification(
                recipient=recipient,
                sender=request.user,
                type="product_deleted",
                message=f"The Product `{product.title}` has been removed by the seller.",
                image_url=product.image1,
                product=product
            )

        return Response({'message': 'Product soft deleted successfylly and notification sent!'}, status=status.HTTP_200_OK)

# Get all the available products 
class GetAllAvailableProducts(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get('search', '')

        blocked_user_ids = get_blocked_user_ids(request.user)
        
        products = Product.objects.filter(
            is_deleted=False).exclude(Q(seller=request.user) | Q(seller__id__in=blocked_user_ids))

        if search_query:
            products = products.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(location__location_name__icontains=search_query)
            )

        paginator = CustomProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(paginated_products, many=True)
        return paginator.get_paginated_response(serializer.data)

# Get saved product messages by seller and buyyer 
class ProductDealMessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        product_id = request.query_params.get("product_id")
        receiver_id = request.query_params.get("receiver_id")

        if not product_id or not receiver_id:
            return Response({"error": "product_id and receiver_id are required."}, status=400)

        messages = ProductChatMessage.objects.filter(
            product__id=product_id,
        ).filter(
            sender=request.user, receiver_id=receiver_id
        ) | ProductChatMessage.objects.filter(
            product__id=product_id,
        ).filter(
            sender_id=receiver_id, receiver=request.user
        )

        messages = messages.order_by("timestamp")
        serializer = ProductChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

# Get the selected product details
class GetSingleProductDetailsView(APIView):
    def get(self, request, product_id):
        try:
            product = Product.objects.select_related(
                'location', 'seller').get(id=product_id, is_deleted=False)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


# Get the Selling product deals view by the current user
class SellingProductDealsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_products = Product.objects.filter(seller=user, is_deleted=False)
        serializer = ProductWithBuyersSerializer(
            user_products, many=True, context={'request': request})
        return Response(serializer.data)

# Get the Buying product deals view by the current/logged in user 
class BuyingDealsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get last message per product the user has sent messages for
        latest_messages = (
            ProductChatMessage.objects
            .filter(sender=user)
            .exclude(product__seller=user)
            .order_by('product_id', '-timestamp')
            .distinct('product_id')
        )

        serializer = BuyingDealSerializer(
            latest_messages, many=True, context={'request': request})
        return Response(serializer.data)

# Toggle the product status view
class ToggleProductAvailabilityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk, seller=request.user)

        is_available = request.data.get("is_available")

        if is_available is None:
            return Response(
                {"error": "is_available field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(is_available, bool):
            return Response(
                {"error": "is_available must be a boolean value."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product.is_available = is_available
        product.save()

        return Response(
            {"message": "Product availability updated successfully.",
                "is_available": product.is_available},
            status=status.HTTP_200_OK,
        )

# Wish list
# Toggle wishlist (Add or remove product fromt eh wish list ) 
class ToggleWishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ToggleWishlistSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        product = Product.objects.get(id=product_id)
        user = request.user

        wishlist_item, created = Wishlist.objects.get_or_create(
            user=user, product=product,
            defaults={'is_active': True}
        )

        if not created:
            if wishlist_item.is_active:
                wishlist_item.is_active = False
                wishlist_item.removed_at = timezone.now()
                wishlist_item.save()
                return Response({"message": "Removed from wishlist", "status": "removed"}, status=status.HTTP_200_OK)
            else:
                wishlist_item.is_active = True
                wishlist_item.removed_at = None
                wishlist_item.save()
                return Response({"message": "Added back to wishlist", "status": "added"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Added to wishlist", "status": "added"}, status=status.HTTP_201_CREATED)

# Fetch all active wishlist products of the user 
class WishlistListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist_items = Wishlist.objects.filter(
            user=request.user, is_active=True).select_related('product')
        serializer = WishlistSerializer(wishlist_items, many=True)
        return Response(serializer.data)

# Get the prodcuts from the model 
class GetMyWishlistProductsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get('search', '')

        wishlist_qs = Wishlist.objects.filter(
            user=request.user,
            is_active=True,

            product__is_deleted=False
        ).select_related('product')

        if search_query:
            wishlist_qs = wishlist_qs.filter(
                Q(product__title__icontains=search_query) |
                Q(product__description__icontains=search_query) |
                Q(product__location__location_name__icontains=search_query)
            )

        paginator = CustomProductPagination()
        paginated_qs = paginator.paginate_queryset(wishlist_qs, request)

        serializer = WishlistSerializer(paginated_qs, many=True)
        return paginator.get_paginated_response(serializer.data)

# Admin side Product handling View 
# Get all the products in the admin side 
class GetAllProductsAdminSideView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):

        queryset = Product.objects.all()

        # Search set up
        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(seller__username__icontains=search) |
                Q(seller__email__icontains=search)
            )

        # Status filter
        status = request.query_params.get("status")
        if status == "available":
            queryset = queryset.filter(is_available=True)
        elif status == "unavailable":
            queryset = queryset.filter(is_available=False)
        elif status == "deleted":
            queryset = queryset.filter(is_deleted=True)

        # Pagination
        paginator = CustomAdminProductPagination()
        page = paginator.paginate_queryset(queryset, request)

        serializer = ProductSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
# Get single product details admin side
class GetSingleProductAdminSideView(APIView):
    permission_classes = [permissions.IsAdminUser] 

    def get(self,request,product_id):
        product = get_object_or_404(Product,id=product_id)
        serializer = ProductSerializer(product) 
        return Response(serializer.data,status = status.HTTP_200_OK)

# Product delete status toggling view
class ToggleProductDeleteStatusView(APIView):
    """
    Toggle the is_deleted status of a Product.
    Only accessible by admin users.
    """
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        product.is_deleted = not product.is_deleted
        product.save()

        return Response(
            {
                "message": f"Product marked as {'deleted' if product.is_deleted else 'available'}.",
                "is_deleted": product.is_deleted,
            },
            status=status.HTTP_200_OK,
        )