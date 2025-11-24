from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import Cliente
from api.serializers import ClienteSerializer

class ReceitaBaseMixin:
    permission_classes = [IsAuthenticated]
    # Adicionado a linha abaixo para garantir a autenticação JWT no arquivo de test test_cliente_views.py
    # e o test possa ser executado com sucesso.
    # authentication_classes = [JWTAuthentication]

class ClienteListView(ReceitaBaseMixin, generics.ListAPIView):
    serializer_class = ClienteSerializer

    def get_queryset(self):
        queryset = Cliente.objects.filter(usuario=self.request.user)
        
        nome = self.request.GET.get('search')
        if nome:
            queryset = queryset.filter(nome_completo__icontains=nome)
            
        queryset = queryset[:10]
        return queryset

class ClienteCreateView(ReceitaBaseMixin, generics.CreateAPIView):
    serializer_class = ClienteSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ClienteDetailView(ReceitaBaseMixin, generics.RetrieveAPIView):
    serializer_class = ClienteSerializer

    def get_queryset(self):
        return Cliente.objects.filter(usuario=self.request.user)

class ClienteUpdateView(ReceitaBaseMixin, generics.UpdateAPIView):
    serializer_class = ClienteSerializer

    def get_queryset(self):
        return Cliente.objects.filter(usuario=self.request.user)

class ClienteDeleteView(ReceitaBaseMixin, generics.DestroyAPIView):
    serializer_class = ClienteSerializer

    def get_queryset(self):
        return Cliente.objects.filter(usuario=self.request.user)