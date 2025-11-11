from django.urls import path
from api.views import RegistroView, LoginView

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='usuario-registro'),
    path('login/', LoginView.as_view(), name='usuario-login'),
]
