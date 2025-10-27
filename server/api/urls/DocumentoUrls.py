from django.urls import path
from api.views import DocumentoCreateView

urlpatterns = [

    path('criar-documento/', DocumentoCreateView.as_view(), name='documento-create'),
]