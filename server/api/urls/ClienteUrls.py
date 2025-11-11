from django.urls import path
from api.views import (
    ClienteListView,
    ClienteCreateView,
    ClienteDetailView,
    ClienteUpdateView,
    ClienteDeleteView
)

urlpatterns = [
    path('listar-clientes/', ClienteListView.as_view(), name='clientes-list'),
    path('detalhes-cliente/<int:pk>/', ClienteDetailView.as_view(), name='clientes-detail'),
    
    path('criar-cliente/', ClienteCreateView.as_view(), name='clientes-create'),
    path('excluir-cliente/<int:pk>/', ClienteDeleteView.as_view(), name='clientes-delete'),
    path('atualizar-cliente/<int:pk>/', ClienteUpdateView.as_view(), name='clientes-update'),
]