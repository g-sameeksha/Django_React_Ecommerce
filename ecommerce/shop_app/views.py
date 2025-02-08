from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from .models import Product,Cart,CartItem,Transaction
from .serializers import ProductSerializer,DetailedProductSerializer,CartItemSerializer,CartSerializer,SimpleCartSerializer,UserSerializer,RegisterSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
import uuid
from django.conf import settings
# import paypalrestsdk
# Create your views here.

BASE_URL ="http://localhost:3000"

# paypalrestsdk.configure({
#     "mode":settings.PAYPAL_MODE,
#     "client_id":settings.PAYPAL_CLIENT_ID,
#     "client_secret":settings.PAYPAL_SECRET_ID
# })

@api_view(["GET"])
def products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products,many=True)
    return Response(serializer.data)

@api_view(["GET"])
def product_detail(request,slug):
    product = Product.objects.get(slug=slug)
    serializer = DetailedProductSerializer(product)
    return Response(serializer.data)
 

@api_view(["POST"])
def add_item_to_cart(request):
    try:
        cart_code = request.data.get("cart_code")
        product_id = request.data.get("product_id")

        user = request.user if request.user.is_authenticated else None

        cart, created = Cart.objects.get_or_create(
            cart_code=cart_code,
            defaults={'user': user})        
        product = Product.objects.get(id=product_id)

        cartitem,created = CartItem.objects.get_or_create(cart=cart,product=product)
        cartitem.quantity =1
        cartitem.save()

        serializer = CartItemSerializer(cartitem)
        return Response({"data":serializer.data,"message":"Cartitem created successfully"},status=201)
    except Exception as  e:
        return Response({"error":str(e)},status =400) 


@api_view(["GET"])
def product_in_cart(request):
    cart_code = request.query_params.get("cart_code")
    product_id = request.query_params.get("product_id")

    cart = Cart.objects.get(cart_code=cart_code)        
    product = Product.objects.get(id=product_id)

    product_exists_in_cart = CartItem.objects.filter(cart=cart,product=product).exists()

    return Response({"product_in_cart":product_exists_in_cart})


@api_view(["GET"])
def get_cart_stat(request):
    cart_code = request.query_params.get("cart_code")
    cart = Cart.objects.get(cart_code=cart_code)   
    serializer = SimpleCartSerializer(cart)
    return Response(serializer.data)


@api_view(["GET"])
def get_cart(request):
    cart_code = request.query_params.get("cart_code")
    cart = Cart.objects.get(cart_code=cart_code)   
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(["PATCH"])
def update_item_quantity(request):
    try:
        cartitem_id = request.data.get("item_id")
        quantity = request.data.get("quantity")
        quantity = int(quantity)

        cartitem = CartItem.objects.get(id=cartitem_id)
        cartitem.quantity = quantity
        cartitem.save()
        serializer = CartItemSerializer(cartitem)
        return Response({"data":serializer.data,"message":"cartitem updated Successfully"})
    except Exception as  e:
        return Response({"error":str(e)},status =400) 


@api_view(["POST"]) 
def delete_cartitem(request):
    cartitem_id = request.data.get("cartitem_id")
    cartitem = CartItem.objects.get(id=cartitem_id)
    cartitem.delete()
    return Response({"message":"cartitem deleted successfully"},status = status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    return Response({"username":user.username})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_userprofile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(["POST"])
def register_user(request):
    """
    Function-based view to handle user registration.
    """
    if request.method == "POST":
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def reset_password(request):
    user = request.user
    if request.method == "POST":
        new_password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")
        if confirm_password!= new_password:
            return Response({"message":"Passwords should be same"})
        user.password = new_password
        user.save()
        return Response(status=200)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_paypal_payment(request):
    if request.method == "POST":
        # Generate a transaction reference
        tx_ref = str(uuid.uuid4())
        cart_code = request.data.get("cart_code")
        cart = Cart.objects.get(cart_code=cart_code)
        user = request.user

        # Calculate the total amount
        amount = sum([item.quantity * item.product.price for item in cart.items.all()])
        tax = Decimal("4.00")
        total_amount = amount + tax
        currency = "USD"

        # Dummy redirect URLs
        redirect_url = f"{BASE_URL}/payment-status/"
        approval_url = f"{BASE_URL}/payment-status?paymentStatus=success&ref={tx_ref}"

        # Simulate creating a transaction
        transaction, created = Transaction.objects.get_or_create(
            ref=tx_ref,
            cart=cart,
            amount=total_amount,
            currency=currency,
            user=user,
            status="pending",
        )

        # Return a dummy approval URL
        return Response({"approval_url": approval_url})

@api_view(["POST"])
def paypal_payment_callback(request):
    payment_status = request.query_params.get("paymentStatus")  # Dummy parameter
    ref = request.query_params.get("ref")

    if not ref:
        return Response({"message": "Transaction reference is missing"}, status=400)

    try:
        transaction = Transaction.objects.get(ref=ref)
    except Transaction.DoesNotExist:
        return Response({"message": "Invalid transaction reference"}, status=400)

    if payment_status == "success":
        # Mark transaction as completed
        transaction.status = "completed"
        transaction.save()

        # Mark the cart as paid
        cart = transaction.cart
        cart.paid = True
        cart.user = request.user
        cart.save()

        return Response(
            {
                "message": "Payment Successful",
                "subMessage": "You have successfully made payment for the purchased items",
            }
        )
    elif payment_status == "cancel":
        # Simulate payment cancellation
        transaction.status = "cancelled"
        transaction.save()
        return Response({"message": "Payment was cancelled"}, status=400)
    else:
        return Response({"message": "Invalid payment details"}, status=400)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def initiate_paypal_payment(request):
#     if request.method== "POST" :
        
#             tx_ref = str(uuid.uuid4())
#             cart_code = request.data.get("cart_code")
#             cart = Cart.objects.get(cart_code=cart_code)
#             user = request.user

#             amount =  sum([item.quantity*item.product.price for item in cart.items.all()])
#             tax = Decimal("4.00")
#             total_amount = amount+tax
#             currency ="USD"
#             redirect_url = f"{BASE_URL}/payment-status/"

#             payment  = paypalrestsdk.Payment({
#                 "intent":"sale",
#                 "payer":{
#                     "payment_method":"paypal"
#                 },
#                 "redirect_urls":{
#                     "return_url":f"{BASE_URL}/payment-status?paymentStatus=success&ref={tx_ref}",
#                     "cancel_url":f"{BASE_URL}/payment-status?paymentStatus=cancel",
#                 },
#                 "transactions":[{
#                     "item_list" :{
#                         "items":[{
#                             "name":"Cart Items",
#                             "sku":"cart",
#                             "price":str(total_amount),
#                             "currency":currency,
#                             "quantity":1,
#                         }]
#                     },
#                     "amount":{
#                         "total":str(total_amount),
#                         "currency":currency
#                     },
#                     "description":"Payment for cart items"
#                 }]
#             })
#             print("pay_id",payment)

#             transaction,created = Transaction.objects.get_or_create(
#                 ref =tx_ref,
#                 cart=cart,
#                 amount=total_amount,
#                 currency=currency,
#                 user=user,
#                 status="pending"
#             )

#             if payment.create():
#                 for link in payment.links:
#                     if link.rel == "approval_url":
#                         approval_url = str(link.href)
#                         return Response({"approval_url":approval_url})
#             else:
#                 return Response({"error":payment.error},status=400)
            

# @api_view(["POST"])
# def paypal_payment_callback(request):

#     payment_id = request.query_params.get("paymentId")
#     payer_id = request.query_params.get("PayerID")
#     ref = request.query_params.get("ref")

#     user = request.user
#     print("ref :",ref)

#     transaction = Transaction.objects.get(ref=ref)

#     if payment_id and payer_id:
#         payment = paypalrestsdk.Payment.find(payment_id)
#         transaction.status ="completed"
#         transaction.save()

#         cart = transaction.cart
#         cart.paid=True
#         cart.user = user
#         cart.save()

#         return Response({"message":"Payment SuccessFull","subMessage":"you have successfully made payment for the purcahsed items"})
#     else:
#         return Response({"message":"Invalid payment details"},status=400)










           
# @api_view(['POST'])
# def initiate_payment(request):
#     if request.user:
#         try:
#             tx_ref = str(uuid.uuid4())
#             cart_code = request.data.get("cart_code")
#             cart = Cart.objects.get(cart_code=cart_code)
#             user = request.user

#             amount =  sum([item.quantity*item.product.price for item in cart.items.all()])
#             tax = Decimal("4.00")
#             total_amount = amount+tax
#             currency ="USD"
#             redirect_url = f"{BASE_URL}/payment-status/"

#             transaction = Transaction.objects.create(
#                 ref =tx_ref,
#                 cart=cart,
#                 amount=total_amount,
#                 currency=currency,
#                 user=user,
#                 status="pending"
#             )

#             flutterwave_payload ={
#                 "tx_ref" :tx_ref,
#                 "amount":str(total_amount),
#                 "currency":currency,
#                 "redirect_url":redirect_url,
#                 "customer":{
#                     "email": user.email,
#                     "name": user.username,
#                     "phonenumber": user.phone
#                 },
#                 "customizations":{
#                     "title" :"Ecommerce Payment"
#                 }
#             }


#         except Exception as e:
#             print(e)

