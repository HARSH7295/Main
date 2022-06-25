import imp
from django.shortcuts import render
from requests import request
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import CustomUserSerializer, OrderItemSerializer, PizzaSerializer
from django.contrib.auth import authenticate,login,logout
# Create your views here.

from .models import CustomUser, Order, OrderItem, Pizza

# getRoutes function : gives list of routes for api
@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'Index'     :   '0',
            'Endpoint'  :   '/getRoutes',
            'Method'    :   'GET',
            'Body'      :   'None',
            'Description':  'Gives list of routes for API'
        },
        {
            'Index'     :   '1',
            'Endpoint'  :   '/signup',
            'Method'    :   'POST',
            'Body'      :   'EMAIL, PASSWORD',
            'Description':  'Registers user'
        },
        {
            'Index'     :   '2',
            'Endpoint'  :   '/login',
            'Method'    :   'POST',
            'Body'      :   'EMAIL, PASSWORD',
            'Description':  'Authenticates user'
        },
        {
            'Index'     :   '3',
            'Endpoint'  :   '/getPizzas',
            'Method'    :   'GET',
            'Body'      :   'NONE',
            'Description':  'Gives list of pizzas'
        },
        {
            'Index'     :   '4',
            'Endpoint'  :   '/addToCart',
            'Method'    :   'POST',
            'Body'      :   'user, orderid, item',
            'Description':  'Adds item to cart'
        },
        {
            'Index'     :   '5',
            'Endpoint'  :   '/getCartDetails',
            'Method'    :   'POST',
            'Body'      :   'user, orderid',
            'Description':  'gives details of cart'
        },
        
        {
            'Index'     :   '6',
            'Endpoint'  :   '/removeFromCart',
            'Method'    :   'POST',
            'Body'      :   'user, orderid, item',
            'Description':  'Removes item from cart'
        },
        {
            'Index'     :   '7',
            'Endpoint'  :   '/getCount',
            'Method'    :   'POST',
            'Body'      :   'user, orderid',
            'Description':  'gives number of items of cart'
        },
    ]

    return Response(routes)

@api_view(['POST'])
def signUp(request):
    data = request.data

    email_id = data['email_id']
    password = data['password']

    try:
        user = CustomUser.objects.get(email = email_id)
        return Response({'Msg':'Email already exists, Try different one'},status=status.HTTP_226_IM_USED)
    except:
        user = CustomUser.objects.create(email = email_id,password = password)
        userSerializer = CustomUserSerializer(user,many=False)
        return Response({'User':userSerializer.data},status=status.HTTP_200_OK)

@api_view(['POST'])
def LoginUser(request):
    data = request.data

    email_id = data['email_id']
    password = data['password']

    try:
        userobj = CustomUser.objects.get(email = email_id,password=password)
        order = Order.objects.create(user=userobj,complete=False)

        userSerializer = CustomUserSerializer(userobj, many=False)
        return Response({'user':userSerializer.data,'orderid':order.transaction_id},status=status.HTTP_200_OK)
    except:
        return Response({'msg':'Invalid Credentials'},status=status.HTTP_401_UNAUTHORIZED)

#getPizza 
@api_view(['GET'])
def getPizzas(request):
    try:
        list = Pizza.objects.all()
        listSerializer = PizzaSerializer(list,many=True)
        return Response({'list':listSerializer.data},status=status.HTTP_200_OK)
    except:
        return Response({'msg':'Some Error Occured When Retrieving Pizzas list'})
        

#add to cart
@api_view(['POST'])
def addToCart(request):
    data = request.data

    email_id = data['user']
    orderid = data['orderid']
    item = data['item']

    try:
        userobj = CustomUser.objects.get(email = email_id)
        pizzaobj = Pizza.objects.get(name = item)

        orderobj = Order.objects.get(user = userobj,transaction_id = orderid, complete = False)
       
        orderitem,created = OrderItem.objects.get_or_create(order = orderobj,pizza = pizzaobj)
        orderitem.quantity = (orderitem.quantity + 1)
        orderitem.save()
        orderitemserializer = OrderItemSerializer(orderitem,many=False)
        return Response({'obj':orderitemserializer.data},status=status.HTTP_200_OK)
    except:
        return Response({'msg':'Error occured'},status=status.HTTP_400_BAD_REQUEST) 


#get cart details
@api_view(['POST'])
def getCartDetails(request):
    data = request.data

    email_id = data['user']
    orderid = data['orderid']

    try:
        userobj = CustomUser.objects.get(email =email_id)
        orderobj = Order.objects.get(user = userobj,transaction_id = orderid, complete = False)
              
        orderItemsList = orderobj.orderitem_set.all()

        pizzaList = Pizza.objects.all()
        pizzaListSerializer = PizzaSerializer(pizzaList,many=True)

        num_of_items = orderobj.get_order_total_items
        total_amount = orderobj.get_order_total_amount
        orderitemsListSerializer = OrderItemSerializer(orderItemsList,many=True)

        return Response({
            'list':orderitemsListSerializer.data,
            'pizzas':pizzaListSerializer.data,
            'num_of_items':num_of_items,
            'total_amount':total_amount
        },
        status=status.HTTP_200_OK)
    except:
        return Response({'msg':'Getting Error on Loading Cart Details, Contact Developer'},status=status.HTTP_403_FORBIDDEN)

#remove from cart

@api_view(['POST'])
def removeFromCart(request):
    data = request.data

    email_id = data['user']
    orderid = data['orderid']
    item = data['item']

    try:
        userobj = CustomUser.objects.get(email = email_id)
        pizzaobj = Pizza.objects.get(name = item)

        orderobj = Order.objects.get(user = userobj,transaction_id = orderid, complete = False)
       
        orderitem,created = OrderItem.objects.get_or_create(order = orderobj,pizza = pizzaobj)
        orderitem.quantity = (orderitem.quantity - 1)
        orderitem.save()

        if orderitem.quantity <= 0:
            orderitem.delete()

        orderitemserializer = OrderItemSerializer(orderitem,many=False)
        return Response({'obj':orderitemserializer.data},status=status.HTTP_200_OK)
    except:
        return Response({'msg':'Error occured'},status=status.HTTP_400_BAD_REQUEST) 


#get count

@api_view(['POST'])
def getCount(request):
    data = request.data

    email_id = data['user']
    orderid = data['orderid']
    
    try:
        userobj = CustomUser.objects.get(email = email_id)
        try:
            orderobj = Order.objects.get(user = userobj,transaction_id = orderid, complete = False)
       
            count = orderobj.get_order_total_items
            return Response({'count':count},status=status.HTTP_200_OK)
        except:
            count = 0
            return Response({'count':count},status=status.HTTP_200_OK)
    except:
        return Response({'msg':'Error occured while finding count'},status=status.HTTP_403_FORBIDDEN)