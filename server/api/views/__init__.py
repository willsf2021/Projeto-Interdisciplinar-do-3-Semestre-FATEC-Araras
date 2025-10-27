from .UsuarioViews import RegistroView, LoginView
from .AlimentoTacoViews import AlimentoTacoView
from django.urls import include, path

urlpatterns = [
    path("auth/", include("api.urls.GoogleAuthUrls")),
]
