from django.urls import path
from api.views import (
    DocumentoCreateView, 
    DocumentoPdfView, 
    DocumentoListView,
    RotuloPdfView
)

urlpatterns = [
    # ... suas URLs existentes ...
    
    # Documentos
    path('documentos/', DocumentoCreateView.as_view(), name='documento-create'),
    path('documentos/list/', DocumentoListView.as_view(), name='documento-list'),
    path('documentos/<int:documento_id>/pdf/', DocumentoPdfView.as_view(), name='documento-pdf'),
]