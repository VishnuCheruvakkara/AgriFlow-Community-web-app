from rest_framework import serializers
from products.models import Product, ProductLocation
from django.contrib.auth import get_user_model
from apps.common.cloudinary_utils import generate_secure_image_url
User = get_user_model()

##########################  Add  or Create product in the table serializer ########################## 

class SellerSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'profile_picture']

    def get_profile_picture(self, obj):
        return generate_secure_image_url(obj.profile_picture)

class ProductLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLocation
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    location = ProductLocationSerializer()
    seller=SellerSerializer()

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['seller']

