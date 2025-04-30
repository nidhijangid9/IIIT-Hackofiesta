"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include

# from rest_framework.authtoken.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from mentors.views import MentorViewSet
from blog.views import BlogViewSet
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import routers
from stu_profile.views import AuthenticatedSampleRecommendationView , LectureDetailView


route = routers.DefaultRouter()
route.register(r"blogs",BlogViewSet,basename="blogview")



urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    path('user/', include('user.urls')),
    path('mentors/', MentorViewSet.as_view({'get': 'list', 'post':'create'}), name='mentors-list'),
    path('mentors/<int:pk>/', MentorViewSet.as_view({'get':'retrieve'}), name='mentors-detail'),
    path('blog/', BlogViewSet.as_view({'get': 'list', 'post': 'create'}), name='Blogs'),
    path('blog/<int:pk>/', BlogViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'}), name='Blog-detail'),
    path('mcq/',include('mcq.urls')),
    path('bot/',include('bot.urls')),
    path('reports/',include('reports.urls')),
    path('quiz/',include('quiz.urls')),
    path('',include('lectures.urls')),
    path('profile/',include('stu_profile.urls')),
    path('my-recommendation/', AuthenticatedSampleRecommendationView.as_view(), name='my-recommendations'),
    path('', include(route.urls)),
    #new
    path('lectures/<str:lecture_id>/', LectureDetailView.as_view(), name='lecture-detail'),
    path('api/drowsiness/', include('drowsiness_detection.urls')),

]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
