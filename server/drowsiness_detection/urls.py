# drowsiness_detection/urls.py
from django.urls import path
from .views import DrowsinessDetectionView

urlpatterns = [
    path('detect/', DrowsinessDetectionView.as_view(), name='detect_drowsiness'),
]