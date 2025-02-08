from django.urls import path
from . import views

urlpatterns =[
    path('products/',views.products,name="get_products"),
    path('product_detail/<slug:slug>',views.product_detail,name="product_detail"),
    path('add_cart',views.add_item_to_cart,name="add_cart"),
    path('product_in_cart',views.product_in_cart,name="product_in_cart"),
    path('get_cart_stat',views.get_cart_stat,name="get_cart_stat"),
    path('get_cart',views.get_cart,name="get_cart"),
    path('update_item_quantity',views.update_item_quantity,name="update_item_quantity"),
    path('delete_cartitem',views.delete_cartitem,name="delete_cartitem"),
    path('get_username',views.get_username,name='get_username'),
    path('get_userprofile',views.get_userprofile,name="get_userprofile"),
    path('initiate_paypal_payment/',views.initiate_paypal_payment,name="initiate_paypal_payment"),
    path('paypal_payment_callback/',views.paypal_payment_callback,name="paypal_payment_callback"),
    path('register/', views.register_user, name='register_user'),



]