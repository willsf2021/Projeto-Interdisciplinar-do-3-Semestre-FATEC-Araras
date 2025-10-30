from django.urls import path
from api.views import (
    DocumentoCreateView, 
    DocumentoPdfView, 
    DocumentoListView,
)

urlpatterns = [
    # ... suas URLs existentes ...
    
    # Documentos
    path('documentos/', DocumentoCreateView.as_view(), name='documento-create'),
    path('listar-documentos/', DocumentoListView.as_view(), name='documento-list-all'),
    path('documentos/<int:documento_id>/pdf/', DocumentoPdfView.as_view(), name='documento-pdf'),
]