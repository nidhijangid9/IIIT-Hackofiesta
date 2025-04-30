from .views import SignupView,UserListView,UserDetailView
from django.urls  import path



urlpatterns = [
    path('signup/', SignupView, name='signup'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('all/', UserListView.as_view(), name='all-user-detail')
]