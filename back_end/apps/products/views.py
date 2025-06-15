from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
import json
from products.models import Product,ProductLocation,ProductChatMessage
from .serializers import ProductSerializer,ProductChatMessageSerializer
from apps.common.cloudinary_utils import upload_image_and_get_url
from rest_framework.permissions import IsAuthenticated 
from django.db.models import Q 
from apps.common.pagination import CustomProductPagination

##############################  Create Products #####################
class CreateProductToSell(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            location_data = json.loads(request.data.get('location', '{}'))

            # Upload images to Cloudinary and get secure URLs
            image1_url = upload_image_and_get_url(request.FILES.get('image1'), "products") if request.FILES.get('image1') else None
            image2_url = upload_image_and_get_url(request.FILES.get('image2'), "products") if request.FILES.get('image2') else None
            image3_url = upload_image_and_get_url(request.FILES.get('image3'), "products") if request.FILES.get('image3') else None

            # Create or get ProductLocation
            location, _ = ProductLocation.objects.get_or_create(**location_data)
            print("Early debugger ::",request.data.get('is_available'))
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
            print("Debugger ::",product.is_available)
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("Error creating product:", e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

################################## Get al products ########################

class GetAllProductsAddedByCurrentUser(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        current_user=request.user
        search_query=request.query_params.get('search','')
        products = Product.objects.filter(seller = current_user,is_deleted=False)

        if search_query:
            products = products.filter(
                Q(title__icontains = search_query) | Q(description__icontains=search_query) | Q(location__location_name__icontains = search_query)
            )
        paginator = CustomProductPagination()
        paginated_products = paginator.paginate_queryset(products,request)
        serializer = ProductSerializer(paginated_products,many = True)
        return paginator.get_paginated_response(serializer.data)
    

######################## Update teh product by teh user who create the product ####################3

class UpdateProductAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        try:
            product = Product.objects.get(pk=pk, seller=request.user)

            # Load and handle location JSON
            location_data = json.loads(request.data.get('location', '{}'))
            location, _ = ProductLocation.objects.get_or_create(**location_data)

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
            product.description = request.data.get('description', product.description)
            product.price = request.data.get('price', product.price)
            product.quantity = request.data.get('quantity', product.quantity)
            product.unit = request.data.get('unit', product.unit)
            product.closing_date = request.data.get('closingTime', product.closing_date)
            product.location = location

            product.save()
            return Response(ProductSerializer(product).data, status=status.HTTP_200_OK)

        except Product.DoesNotExist:
            return Response({'error': 'Product not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print("Error updating product:", e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

################################ Soft Delete prodcut view ###############################

class SoftDeleteProductView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self,request,pk):
        product = get_object_or_404(Product,pk=pk,seller=request.user)
        product.is_deleted=True 
        product.save()
        return Response({'message':'Product soft deleted successfylly!'},status=status.HTTP_200_OK)

############################## Get all the available products ############################################# 

class GetAllAvailableProducts(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get('search', '')
        products = Product.objects.filter(is_available=True, is_deleted=False).exclude(seller=request.user)

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
    
##########################  Get saved product messages by seller and buyyer ############################

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
    
################################## Get the selected product details  ########################3

class GetSingleProductDetailsView(APIView):
    def get(self, request, product_id):
        try:
            product = Product.objects.select_related('location', 'seller').get(id=product_id, is_deleted=False)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
