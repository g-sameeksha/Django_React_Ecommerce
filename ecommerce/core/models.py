from django.db import models
from django.contrib.auth.models import AbstractUser


USER_TYPES = {
    "customer":"customer",
    "vendor":"vendor"

}

# Create your models here.
class CustomUser(AbstractUser):
    city = models.CharField(max_length=100,blank=True,null=True)
    state = models.CharField(max_length=100,blank=True,null=True)
    address =  models.CharField(max_length=100,blank=True,null=True)
    phone =  models.CharField(max_length=15,blank=True,null=True)
    user_type = models.CharField(choices=USER_TYPES,max_length=12,default="customer")


    def __str__(self):
        return self.username
    
