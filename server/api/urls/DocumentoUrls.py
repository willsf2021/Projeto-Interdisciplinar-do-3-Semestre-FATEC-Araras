from django.urls import path
from api.views import (
    DocumentoCreateView, 
    DocumentoPdfView, 
    DocumentoListView,
    DocumentoDetailView,
    DocumentoUpdateView
)

urlpatterns = [
    # ... suas URLs existentes ...
    
    # Documentos
     path('documentos/<int:documento_id>/detalhes/', DocumentoDetailView.as_view(), name='documento-detail'),
      path('documentos/<int:documento_id>/', DocumentoUpdateView.as_view(), name='documento-update'),
    path('documentos/', DocumentoCreateView.as_view(), name='documento-create'),
    path('listar-documentos/', DocumentoListView.as_view(), name='documento-list-all'),
    path('documentos/<int:documento_id>/pdf/', DocumentoPdfView.as_view(), name='documento-pdf'),
]