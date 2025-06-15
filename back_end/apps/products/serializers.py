from rest_framework import serializers
from products.models import Product, ProductLocation,ProductChatMessage
from django.contrib.auth import get_user_model
from apps.common.cloudinary_utils import generate_secure_image_url
User = get_user_model()

##########################  Add  or Create product in the table serializer ########################## 

class SellerSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id','username', 'email', 'phone_number', 'profile_picture']

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

########################### Get saved messages for the product chat serializer ######################################

class ProductChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username')
    sender_id = serializers.IntegerField(source='sender.id')
    product_id = serializers.IntegerField(source='product.id')
    product_name = serializers.CharField(source='product.title')
    product_image = serializers.SerializerMethodField()
    sender_image = serializers.SerializerMethodField()
   
    class Meta:
        model = ProductChatMessage
        fields = [
            'id',
            'message',
            'sender_name',
            'sender_id',
            'timestamp',
            'product_id',
            'product_name',
            'product_image',
            'sender_image',
        ]

    def get_product_image(self, obj):
        return obj.product.image1 if obj.product else None
    
    def get_sender_image(self, obj):
        return generate_secure_image_url(obj.sender.profile_picture)

