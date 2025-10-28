from django.urls import path
from api.views import RotuloNutricionalView,  RotuloPdfView


urlpatterns = [
    path('rotulos/<int:receita_id>/rotulo-nutricional/', RotuloNutricionalView.as_view(), name='rotulo-nutricional'),
    path('rotulos/<int:documento_id>/pdf/', RotuloPdfView.as_view(), name='rotulo-pdf'),
]