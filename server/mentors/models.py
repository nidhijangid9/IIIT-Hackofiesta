from django.db import models

# Create your models here.
class Mentor(models.Model):
    name = models.CharField(max_length=100,unique=True)
    email = models.EmailField(max_length=255, unique=True)
    bio=models.CharField(max_length=300)
    # image = models.ImageField(upload_to='mentor_images/')
    expertise=models.CharField(max_length=100)