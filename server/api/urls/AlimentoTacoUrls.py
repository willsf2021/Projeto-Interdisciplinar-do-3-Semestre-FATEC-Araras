
from django.urls import path
from api.views import AlimentoTacoView

urlpatterns = [
    path('alimento/', AlimentoTacoView.as_view(), name='alimentos-list'),
]