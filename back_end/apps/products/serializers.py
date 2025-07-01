from rest_framework import serializers
from products.models import Product, ProductLocation, ProductChatMessage,Wishlist
from django.contrib.auth import get_user_model
from apps.common.cloudinary_utils import generate_secure_image_url
User = get_user_model()

##########################  Add  or Create product in the table serializer ##########################


class SellerSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'profile_picture']

    def get_profile_picture(self, obj):
        return generate_secure_image_url(obj.profile_picture)


class ProductLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLocation
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    location = ProductLocationSerializer()
    seller = SellerSerializer()

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

# Serializer for get the product selling by the user ########################33


class BuyerMessageSerializer(serializers.ModelSerializer):
    sender = SellerSerializer(read_only=True)  # Reusing your existing one
    message = serializers.CharField()
    timestamp = serializers.DateTimeField()

    class Meta:
        model = ProductChatMessage
        fields = ['id', 'sender', 'message', 'timestamp']


class ProductWithBuyersSerializer(serializers.ModelSerializer):
    location = ProductLocationSerializer()
    seller = SellerSerializer()
    buyers = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'image1', 'location', 'seller', 'buyers']

    def get_buyers(self, obj):
        request_user = self.context['request'].user

        # All messages except from seller (only buyers)
        messages = ProductChatMessage.objects.filter(product=obj).exclude(
            sender=request_user).order_by('sender', '-timestamp')

        # Keep latest message from each buyer
        latest_messages = {}
        for msg in messages:
            if msg.sender_id not in latest_messages:
                latest_messages[msg.sender_id] = msg

        return BuyerMessageSerializer(latest_messages.values(), many=True).data


############################## Get the product deals where the current user is the buyer  ######################

class BuyingDealSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(
        source='product.title', read_only=True)
    product_image = serializers.SerializerMethodField()
    other_user = serializers.CharField(
        source='receiver.username', read_only=True)
    other_user_image = serializers.SerializerMethodField()
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    receiver_id = serializers.IntegerField(
        source='receiver.id', read_only=True)
    product_is_deleted = serializers.BooleanField(
        source='product.is_deleted', read_only=True)
    product_is_available = serializers.BooleanField(
    source='product.is_available',
    read_only=True
    )

    class Meta:
        model = ProductChatMessage
        fields = [
            'id',
            'product_id',
            'product_title',
            'product_image',
            'receiver_id',
            'other_user',
            'other_user_image',
            'message',
            'timestamp',
            'product_is_deleted',
            'product_is_available',
        ]

    def get_product_image(self, obj):
        return obj.product.image1 if obj.product and obj.product.image1 else None

    def get_other_user_image(self, obj):
        if obj.receiver and obj.receiver.profile_picture:
            return generate_secure_image_url(obj.receiver.profile_picture)
        return None


##############################  Toggle wishlist (Add or remove product fromt eh wish list ) Serializer ##############################

class ToggleWishlistSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()

    def validate_product_id(self, value):
        if not Product.objects.filter(id=value, is_deleted=False).exists():
            raise serializers.ValidationError(
                "This product does not exist.")
        return value

#============================== Get the prodcuts from the model  ###########################
class WishlistSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    title = serializers.CharField(source='product.title', read_only=True)
    image1 = serializers.CharField(source='product.image1', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    unit = serializers.CharField(source='product.unit', read_only=True)
    closing_date = serializers.DateTimeField(source='product.closing_date', read_only=True)
    is_available = serializers.BooleanField(source='product.is_available', read_only=True)
    location = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'product_id', 'title', 'image1', 'price', 'unit', 'closing_date', 'location','is_available']

    def get_location(self, obj):
        if obj.product.location:
            return {
                "location_name": obj.product.location.location_name,
                "country": obj.product.location.country
            }
        return {}
