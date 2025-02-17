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
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.db.models import Sum


User = get_user_model()

# from django.contrib.auth.models import User


# from .models import Vendor

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
def get_userprofile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)




@api_view(["POST"])
def register_user(request):
 
    if request.method == "POST":
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



@api_view(['POST'])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user_type = request.data.get("userType")  # Ensure userType is coming in request

    if not username or not password or not user_type:
        return Response(
            {"detail": "Username, password, and userType are required."}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if the user exists with the given userType
    try:
        user = User.objects.get(username=username, user_type=user_type)  # Use your custom user model if needed
    except User.DoesNotExist:
        return Response(
            {"detail": "No user found with the specified username and user type."}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Authenticate using the password
    user = authenticate(request, username=username, password=password)

    if user is not None:
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response(
            {
                "access": access_token,
                "refresh": str(refresh),
                "userType": user_type,
            },
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"detail": "Invalid credentials."}, 
            status=status.HTTP_400_BAD_REQUEST
        )



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




from django.db.models import Sum, Count, F
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from .models import Product, Transaction, CartItem




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request):
    if request.user.user_type != 'vendor':  # Ensure that the user is a vendor
        return Response({"detail": "You are not authorized to add products."}, status=status.HTTP_403_FORBIDDEN)

    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        product = serializer.save(vendor=request.user)  # Save product with vendor info
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_dashboard(request):
    vendor = request.user  

    # Get products for the vendor
    products = Product.objects.filter(vendor=vendor)
    total_products = products.count()

    # Calculate sales & revenue from transactions
    transactions = Transaction.objects.filter(cart__items__product__vendor=vendor, status="completed")
    
    total_sales = transactions.count()
    total_revenue = transactions.aggregate(total_revenue=Sum('amount'))['total_revenue'] or 0

    # Top-selling products
    top_selling_products = (
        CartItem.objects.filter(cart__transactions__status="completed", product__vendor=vendor)
        .values(name=F('product__name'))
        .annotate(total_sold=Sum('quantity'))
        .order_by('-total_sold')[:5]
    )

    # Stock status
    stock_status = products.values('name', 'stock')

    # Monthly sales trends (last 6 months)
    six_months_ago = datetime.now() - timedelta(days=180)
    monthly_sales = (
        transactions.filter(created_at__gte=six_months_ago)
        .annotate(month=F('created_at__month'))
        .values('month')
        .annotate(total_revenue=Sum('amount'))
        .order_by('month')
    )

    return Response({
        "total_products": total_products,
        "total_sales": total_sales,
        "total_revenue": total_revenue,
        "top_selling_products": list(top_selling_products),
        "stock_status": list(stock_status),
        "monthly_sales": list(monthly_sales),
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_vendor_products(request):
    vendor = request.user

    vendor_products = Product.objects.filter(vendor=vendor)

    serializer = ProductSerializer(vendor_products, many=True)

    return Response(serializer.data, status=200)




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

