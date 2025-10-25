from .UsuarioUrls import urlpatterns as usuario_urls
from .AlimentoTacoUrls import urlpatterns as alimento_taco_urls

urlpatterns = usuario_urls + alimento_taco_urls