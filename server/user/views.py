from django.views.decorators.csrf import csrf_protect,csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from .serializers import UserSerializer

User = get_user_model()


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def SignupView(request):
    data = request.data

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    password2 = data.get('password2')

    if not name or not email or not password or not password2:
        return Response({'error': 'All fields are required'}, status=400)

    if password == password2:
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)
        else:
            if len(password) < 3:
                return Response({'error': 'Password must be at least 6 characters'}, status=400)
            else:
                user = User.objects.create_user(email=email, password=password,name=name)
                user.save()
                return Response({'success': 'User created successfully'}, status=201)
    else:
        return Response({'error': 'Passwords do not match'}, status=400)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None, email=None):
        if pk:
            try:
                user = User.objects.get(id=pk)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        elif email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        else:
            return Response({'error': 'User ID or Email must be provided'}, status=400)

        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    

    