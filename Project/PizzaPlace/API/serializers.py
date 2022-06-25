from dataclasses import fields
from ipaddress import collapse_addresses
from pyexpat import model
from rest_framework.serializers import ModelSerializer
from .models import CustomUser, OrderItem, Pizza


#custom user serializer
class CustomUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

#pizza model serializer
class PizzaSerializer(ModelSerializer):
    class Meta:
        model = Pizza
        fields = '__all__'

#orderitem serializer
class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
