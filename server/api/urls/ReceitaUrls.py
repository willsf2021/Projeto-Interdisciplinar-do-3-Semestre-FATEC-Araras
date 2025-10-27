from django.urls import path
from api.views import ReceitaCreateView, ReceitaUpdateView, ReceitaDeleteView, ReceitaListView

urlpatterns = [
    path('criar-receita/', ReceitaCreateView.as_view(), name='receita-create'),
    path('atualizar-receita/<int:receita_id>', ReceitaUpdateView.as_view(), name='receita-update'),
    path('excluir-receita/<int:receita_id>', ReceitaDeleteView.as_view(), name='receita-delete'),
    path('listar-receita/', ReceitaListView.as_view(), name='receita-list'), 
]