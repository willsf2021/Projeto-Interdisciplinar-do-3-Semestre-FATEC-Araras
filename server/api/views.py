# api/views.py
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from .models import Perfil, Cliente, Documento, IngredienteReceita
from .serializers import (
    SignupSerializer, UserSerializer,
    ClienteSerializer, DocumentoSerializer, IngredienteSerializer
)

# --- AUTH endpoints ---
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_csrf(request):
    token = get_token(request)
    return Response({'csrfToken': token})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)  # loga automaticamente
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'detail': 'Login successful', 'user': UserSerializer(user).data})
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'detail': 'Logged out'})

# --- VIEWSETSpara recursos necessários ---
# ---------- CRUD ----------
class NutricionistaViewSet(viewsets.ReadOnlyModelViewSet):
    # GET list, GET detail (read-only for users); create via signup
    queryset = Perfil.objects.select_related('user').all()
    permission_classes = [permissions.IsAuthenticated]
    def list(self, request, *args, **kwargs):
        # return users with profile
        data = []
        for p in self.queryset:
            u = p.user
            data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'first_name': u.first_name,
                'last_name': u.last_name,
                'tipo_usuario': p.tipo_usuario,
                'ativo': p.ativo,
            })
        return Response(data)

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReceitaViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer
    permission_classes = [permissions.IsAuthenticated]

class IngredienteViewSet(viewsets.ModelViewSet):
    queryset = IngredienteReceita.objects.all()
    serializer_class = IngredienteSerializer
    permission_classes = [permissions.IsAuthenticated]