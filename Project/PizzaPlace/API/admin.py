from django.contrib import admin
from .models import CustomUser, Order, OrderItem, Pizza
# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Pizza)
admin.site.register(Order)
admin.site.register(OrderItem)