from django.shortcuts import render
from .models import Mentor
from .serializers import MentorSerializer
from rest_framework import viewsets

# Create your views here.
class MentorViewSet(viewsets.ModelViewSet):
    queryset=Mentor.objects.all()
    serializer_class=MentorSerializer
    






