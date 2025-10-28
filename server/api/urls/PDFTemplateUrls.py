from django.urls import path
from api.views import PdfTemplateView

urlpatterns = [
    path('pdf-template/', PdfTemplateView.as_view(), name='pdf-template'),
]