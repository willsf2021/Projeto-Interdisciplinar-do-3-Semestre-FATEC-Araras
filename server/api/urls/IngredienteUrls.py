from django.urls import path
from api.views import (
    IngredienteCreateView,
    IngredienteUpdateView,
    IngredienteDeleteView,
    IngredienteListByReceitaView,
    IngredienteDetailView,
)

urlpatterns = [
    path('criar-ingrediente/<int:receita_id>/', IngredienteCreateView.as_view(), name='ingrediente-create'),
    path('listar-ingredientes/<int:receita_id>/', IngredienteListByReceitaView.as_view(), name='ingrediente-list'),
    
    path('atualizar-ingrediente/<int:ingrediente_id>/', IngredienteUpdateView.as_view(), name='ingrediente-update'),
    path('excluir-ingrediente/<int:ingrediente_id>/', IngredienteDeleteView.as_view(), name='ingrediente-delete'),
    path('detalhes-ingrediente/<int:ingrediente_id>/', IngredienteDetailView.as_view(), name='ingrediente-detail'),
]
