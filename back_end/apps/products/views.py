from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
import json
from products.models import Product,ProductLocation
from .serializers import ProductSerializer
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
                is_available=str(request.data.get('is_available', 'true')).lower() == 'true',
                closing_date=request.data.get('closingTime'),
            )

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
        products = Product.objects.filter(seller = current_user)

        if search_query:
            products = products.filter(
                Q(title__icontains = search_query) | Q(description__icontains=search_query) | Q(location__location_name__icontains = search_query)
            )
        paginator = CustomProductPagination()
        paginated_products = paginator.paginate_queryset(products,request)
        serializer = ProductSerializer(paginated_products,many = True)
        return paginator.get_paginated_response(serializer.data)