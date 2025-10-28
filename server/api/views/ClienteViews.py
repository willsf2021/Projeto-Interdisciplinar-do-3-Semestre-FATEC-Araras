from rest_framework import generics, permissions
from api.models import Cliente
from api.serializers import ClienteSerializer

class ClienteBaseView():
    serializer_class = ClienteSerializer
    permission_classes = [permissions.IsAuthenticated]

class ClienteListView(generics.ListAPIView, ClienteBaseView):
    def get_queryset(self):
        return Cliente.objects.filter(usuario=self.request.user)
    
class ClienteCreateView(generics.CreateAPIView, ClienteBaseView):
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ClienteDetailView(generics.RetrieveAPIView, ClienteBaseView):
    def get_queryset(self):
        return Cliente.objects.filter(usuario=self.request.user)

class ClienteUpdateView(generics.UpdateAPIView, ClienteBaseView):
    def get_queryset(self):
        return Cliente.objects.filter(usuario=self.request.user)

class ClienteDeleteView(generics.DestroyAPIView, ClienteBaseView):
    def get_queryset(self):
        return Cliente.objects.filter(usuario=self.request.user)