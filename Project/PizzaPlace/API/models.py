from statistics import mode
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
import uuid
from .managers import CustomUserManager

# Create your models here.


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_('email address'),unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

class Pizza(models.Model):
    name = models.CharField(max_length=100,unique=True,null=True)
    pizza_type = models.CharField(max_length=100,null=True)
    price = models.FloatField()
    desc = models.CharField(max_length=500)
    img = models.ImageField(null=True,blank=True)

class Order(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,null=True)
    date = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False)
    transaction_id = models.UUIDField(default=uuid.uuid4,editable=False,unique=True)
    
    @property
    def get_order_total_amount(self):
        try:
            orderitems = self.orderitem_set.all()
            total = sum([item.get_total for item in orderitems])
            return total
        except:
            return 0

    @property
    def get_order_total_items(self):
        try:  
            orderitems = self.orderitem_set.all()
            total = sum([item.quantity for item in orderitems])
            return total
        except:
            return 0

class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,null=True)
    pizza = models.ForeignKey(Pizza,on_delete=models.CASCADE,null=True)
    quantity = models.IntegerField(default=0)

    @property
    def get_total(self):
        total = ((self.pizza.price)*(self.quantity))
        return total

