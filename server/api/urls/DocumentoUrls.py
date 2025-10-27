from django.urls import path
from api.views import DocumentoCreateView

urlpatterns = [
    # Outras URLs da sua app...
    path('criar-documento/', DocumentoCreateView.as_view(), name='documento-create'),
]