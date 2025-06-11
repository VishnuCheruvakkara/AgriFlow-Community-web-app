from rest_framework import serializers
from products.models import Product, ProductLocation

##########################  Add  or Create product in the table serializer ########################## 


class ProductLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLocation
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    location = ProductLocationSerializer()

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['seller']

