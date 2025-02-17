from django.db import models
from django.utils.text import slugify
# Create your models here.
from django.conf import settings


# class Vendor(models.Model):
#     user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
#     image = models.ImageField(upload_to="Vendor_images",blank=True)
#     store_name = models.CharField(max_length=50,null=True)
#     description = models.TextField(max_length=200)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.user.username
    
# class Customer(models.Model):
#     user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
#     profile_image =  models.ImageField(upload_to="Customer_images",blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.user.username




    
class Product(models.Model):
    CATEGORY =(
        ("ELECTRONICS","Electronics"),
        ("GROCERIES","Groceries"),
        ("CLOTHINGS","Clothings"),
        ("FURNITURE","Furniture"),
        ("FOOD","Food")
    )

    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="products", on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField(blank=True,null=True)
    image = models.ImageField(upload_to="products_image")
    description = models.TextField(blank=True,null=True)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    category = models.CharField(max_length=20,choices=CATEGORY,blank=True,null=True)
    stock = models.PositiveIntegerField(default=0) 
    total_sales = models.PositiveIntegerField(default=0)  
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.00) 

   
    def __str__(self):
        return f"{self.category}:{self.name}"
    
    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            unique_slug =self.slug
            counter =1
            if Product.objects.filter(slug = unique_slug).exists:
                unique_slug =f'{self.slug}-{counter}'
                counter+=1
            self.slug = unique_slug
        super().save(*args,**kwargs)

class Cart(models.Model):
    cart_code = models.CharField(max_length=11,unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,null=True,blank=True)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    modified_at = models.DateTimeField(auto_now=True,blank=True,null=True)

    def __str__(self):
        return self.cart_code
    

class Transaction(models.Model):
    ref =models.CharField(max_length=255,unique=True)
    cart = models.ForeignKey(Cart,related_name='transactions',on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    currency =models.CharField(max_length=10,default="USD")
    status = models.CharField(max_length=10,default="pending")
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Transaction {self.ref}-{self.status}'
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart,related_name='items',on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    transaction = models.ForeignKey(Transaction, related_name='items', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} -> {self.product.name} in cart {self.cart.id}"
    






from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Transaction)
def update_product_sales(sender, instance, created, **kwargs):
    if created and instance.status == "completed":  # Only update on completed transactions
        cart_items = instance.items.all()  # Get all cart items in this transaction
        for cart_item in cart_items:
            product = cart_item.product
            product.total_sales += cart_item.quantity
            product.revenue += product.price * cart_item.quantity
            product.stock -= cart_item.quantity
            product.save()
