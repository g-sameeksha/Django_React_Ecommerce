from rest_framework import serializers
from .models import Product,Cart,CartItem
from django.contrib.auth import get_user_model

User =get_user_model()

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id","name","slug","image","description","category","price"]

class UserSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = ["id","username","first_name","last_name","email","city","state","address","phone","date_joined","items","user_type"]
    
    def get_items(self,user):
        if user.user_type == "customer":
            cartitems = CartItem.objects.filter(cart__user=user,cart__paid = True)[:15]
            serializer = NewCartItemSerializer(cartitems,many=True)
            return serializer.data
        else:
            return None


class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()
    vendor_details = serializers.SerializerMethodField()

    class Meta:
        model =Product
        fields = ["id","name","slug","image","description","category","price","similar_products","vendor_details"]

    def get_vendor_details(self, product):
        if product.vendor.user_type == "vendor":  # Check if the user is a vendor
            return UserSerializer(product.vendor).data  # Return vendor details
        return None  #

    def get_similar_products(self,product):
        products  =Product.objects.filter(category =product.category).exclude(id=product.id)
        serializers = ProductSerializer(products,many=True)
        return serializers.data
    

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields =['id','quantity','product',"total_price"]
    
    def get_total_price(self,cartitem):
        price = cartitem.product.price *cartitem.quantity
        return price



class CartSerializer(serializers.ModelSerializer):
    items= CartItemSerializer(read_only=True,many=True)
    sum_total = serializers.SerializerMethodField()
    num_of_items = serializers.SerializerMethodField()
    class Meta:
        model =Cart
        fields =["id","cart_code","items","sum_total","num_of_items","created_at","modified_at"]

    def get_sum_total(self,cart):
        items = cart.items.all()
        total  =  sum([item.product.price*item.quantity for item in items])
        return total
    
    def get_num_of_items(self,cart):
        items = cart.items.all()
        num_of_items = sum([item.quantity for item in items])
        return num_of_items




class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()
    class Meta:
        model =Cart
        fields =["id","cart_code","num_of_items"]
    def get_num_of_items(self,cart):
        num_of_items = sum([item.quantity for item in cart.items.all()])
        return num_of_items

class NewCartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    order_id = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id','quantity','product',"order_id","order_date"]
    
    def get_order_id(self,cartitem):
        order_id = cartitem.cart.cart_code
        return order_id
    
    def get_order_date(self,cartitem):
        order_date = cartitem.cart.modified_at
        return order_date




        



User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=[("customer", "Customer"), ("vendor", "Vendor")], write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    

    class Meta:
        model = User
        fields = [
            "username", "email", "first_name", "last_name",
            "password", "confirm_password", "user_type", "phone", "city", "state", "address"
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
      
     
        
        # Create the user first
        user = User.objects.create_user(**validated_data)

        # Create Vendor instance if user type is "vendor"
        # if user_type == "vendor":
        #     # Create the Vendor object associated with the user
        #     Vendor.objects.create(user=user, store_name=store_name, description=description, image=image)
        
        return user

    

