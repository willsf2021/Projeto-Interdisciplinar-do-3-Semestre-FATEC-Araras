from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import Cliente
from api.serializers import ClienteSerializer

class ReceitaBaseMixin:
    permission_classes = [IsAuthenticated]

class ClienteListView(ReceitaBaseMixin, generics.ListAPIView):
    serializer_class = ClienteSerializer

    def get_queryset(self):
        return Cliente.objects.filter(usuario=self.request.user)

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