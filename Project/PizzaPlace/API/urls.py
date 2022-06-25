from django.urls import path
from . import views

urlpatterns = [
    path('getRoutes',views.getRoutes,name='getRoutes'),
    path('signup',views.signUp,name='signUp'),
    path('login',views.LoginUser,name='LoginUser'),
    path('getPizzas',views.getPizzas,name='getPizzas'),
    path('addToCart',views.addToCart,name='addToCart'),
    path('getCartDetails',views.getCartDetails,name='getCartDetails'),
    path('removeFromCart',views.removeFromCart,name='removeFromCart'),
    path('getCount',views.getCount,name='getCount')
]