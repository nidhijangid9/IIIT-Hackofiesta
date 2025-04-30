# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResourceViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'resources', ResourceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]